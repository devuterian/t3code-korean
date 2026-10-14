package expo.modules.t3appinstaller

import androidx.core.content.FileProvider

/** Own subclass so the manifest merger never collides with another library's FileProvider. */
class T3AppInstallerFileProvider : FileProvider()
