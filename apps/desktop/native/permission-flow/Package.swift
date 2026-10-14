// swift-tools-version: 6.1
import PackageDescription

// Tiny helper the packaged macOS app launches to show PermissionFlow's
// "drag T3 Code into the list" panel over System Settings. It ships in
// Contents/Resources/permission-flow/ and is signed with the app bundle.
let package = Package(
    name: "T3PermissionFlow",
    platforms: [.macOS(.v13)],
    dependencies: [
        .package(url: "https://github.com/jaywcjlove/PermissionFlow.git", exact: "2.11.3"),
    ],
    targets: [
        .executableTarget(
            name: "T3PermissionFlow",
            dependencies: [
                .product(name: "PermissionFlow", package: "PermissionFlow"),
                .product(name: "PermissionFlowScreenRecordingStatus", package: "PermissionFlow"),
            ]
        ),
    ]
)
