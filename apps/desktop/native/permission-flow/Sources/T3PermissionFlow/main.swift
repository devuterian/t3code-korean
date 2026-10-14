import AppKit
import PermissionFlow
import PermissionFlowScreenRecordingStatus

// Usage:
//   t3-permission-flow status
//     Prints {"screen-recording":bool,"accessibility":bool,"full-disk-access":bool}.
//   t3-permission-flow authorize --pane <id> --app <path/to/T3 Code.app> [--locale ko]
//     Opens the pane and shows PermissionFlow's drag panel for the given app.
//     Exits 0 once granted, 1 when System Settings closes, 2 on bad input.
//     The parent keeps stdin open; EOF means the parent is gone, so we exit.
//
// Launched as a child of the app, TCC attributes these checks to the app
// (its responsible process), so the statuses describe T3 Code itself.

let panes: [String: PermissionFlowPane] = [
    "screen-recording": .screenRecording,
    "accessibility": .accessibility,
    "full-disk-access": .fullDiskAccess,
]

func option(_ name: String) -> String? {
    let arguments = CommandLine.arguments
    guard let index = arguments.firstIndex(of: name), index + 1 < arguments.count else { return nil }
    return arguments[index + 1]
}

@MainActor
func isGranted(_ pane: PermissionFlowPane) -> Bool {
    PermissionStatusRegistry.provider(for: pane).authorizationState() == .granted
}

@MainActor
func run() -> Never {
    PermissionStatusRegistry.register(provider: ScreenRecordingPermissionStatusProvider(), for: .screenRecording)
    let command = CommandLine.arguments.dropFirst().first

    if command == "status" {
        let statuses = panes.keys.sorted().map { "\"\($0)\":\(isGranted(panes[$0]!))" }
        print("{\(statuses.joined(separator: ","))}")
        exit(0)
    }

    guard command == "authorize",
          let pane = option("--pane").flatMap({ panes[$0] }),
          let appPath = option("--app"), appPath.hasSuffix(".app")
    else {
        FileHandle.standardError.write(Data("usage: t3-permission-flow status | authorize --pane <id> --app <bundle.app>\n".utf8))
        exit(2)
    }

    let app = NSApplication.shared
    app.setActivationPolicy(.accessory)

    if isGranted(pane) { exit(0) }

    let controller = PermissionFlow.makeController(
        configuration: .init(
            requiredAppURLs: [URL(fileURLWithPath: appPath)],
            localeIdentifier: option("--locale")
        )
    )
    controller.authorize(pane: pane)

    // Parent exit closes our stdin; never outlive the app that launched us.
    FileHandle.standardInput.readabilityHandler = { handle in
        if handle.availableData.isEmpty { exit(0) }
    }

    var sawSettings = false
    let startedAt = Date()
    Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
        MainActor.assumeIsolated {
            if isGranted(pane) {
                controller.closePanel()
                exit(0)
            }
            let settingsRunning = !NSRunningApplication
                .runningApplications(withBundleIdentifier: "com.apple.systempreferences").isEmpty
            if settingsRunning { sawSettings = true }
            if (sawSettings && !settingsRunning) || Date().timeIntervalSince(startedAt) > 15 * 60 {
                controller.closePanel()
                exit(1)
            }
        }
    }

    app.run()
    exit(0)
}

MainActor.assumeIsolated { run() }
