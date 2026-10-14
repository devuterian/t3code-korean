package expo.modules.t3appinstaller

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.FileProvider
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.security.MessageDigest

/**
 * Installs APKs the app downloaded into `cacheDir/app-updates/` by handing them to the
 * system package installer. Android always shows its own confirmation; nothing installs silently.
 */
class T3AppInstallerModule : Module() {
  private val context
    get() = appContext.reactContext ?: throw CodedException("ERR_NO_CONTEXT", "React context is unavailable", null)

  /** Resolves `fileUri` and refuses anything outside `cacheDir/app-updates/`. */
  private fun downloadedUpdate(fileUri: String): File {
    val path = Uri.parse(fileUri).path ?: throw CodedException("ERR_BAD_PATH", "Invalid APK path", null)
    val file = File(path)
    val updatesDir = File(context.cacheDir, "app-updates").canonicalFile
    if (!file.exists() || file.canonicalFile.parentFile != updatesDir) {
      throw CodedException("ERR_BAD_PATH", "APK must be a downloaded update", null)
    }
    return file
  }

  override fun definition() = ModuleDefinition {
    Name("T3AppInstaller")

    Function("getAppVersion") {
      val info = context.packageManager.getPackageInfo(context.packageName, 0)
      val versionCode =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) info.longVersionCode else @Suppress("DEPRECATION") info.versionCode.toLong()
      mapOf("versionName" to (info.versionName ?: ""), "versionCode" to versionCode.toDouble())
    }

    Function("canRequestPackageInstalls") {
      Build.VERSION.SDK_INT < Build.VERSION_CODES.O || context.packageManager.canRequestPackageInstalls()
    }

    Function("openInstallPermissionSettings") {
      val intent =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:${context.packageName}"))
        } else {
          Intent(Settings.ACTION_SECURITY_SETTINGS)
        }
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
    }

    // Streams the file on the module's background queue; returns lowercase hex.
    AsyncFunction("sha256File") { fileUri: String ->
      val digest = MessageDigest.getInstance("SHA-256")
      downloadedUpdate(fileUri).inputStream().use { input ->
        val buffer = ByteArray(1 shl 16)
        while (true) {
          val read = input.read(buffer)
          if (read < 0) break
          digest.update(buffer, 0, read)
        }
      }
      digest.digest().joinToString("") { "%02x".format(it) }
    }

    Function("installApk") { fileUri: String ->
      val file = downloadedUpdate(fileUri)
      val uri = FileProvider.getUriForFile(context, "${context.packageName}.T3AppInstallerFileProvider", file)
      val intent = Intent(Intent.ACTION_VIEW).apply {
        setDataAndType(uri, "application/vnd.android.package-archive")
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      context.startActivity(intent)
    }
  }
}
