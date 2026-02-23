const {
  withXcodeProject,
  withDangerousMod,
} = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const NSE_TARGET_NAME = "NotificationServiceExtension";

/**
 * Swift source for the Notification Service Extension.
 * Downloads the image from the push payload and attaches it.
 */
const NSE_SWIFT_SOURCE = `import UserNotifications
import os.log

private let logger = Logger(subsystem: "com.mrdemonwolf.OfficialApp.NotificationServiceExtension", category: "NSE")

class NotificationService: UNNotificationServiceExtension {
    private var contentHandler: ((UNNotificationContent) -> Void)?
    private var bestAttemptContent: UNMutableNotificationContent?

    override func didReceive(
        _ request: UNNotificationRequest,
        withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void
    ) {
        self.contentHandler = contentHandler
        bestAttemptContent = request.content.mutableCopy() as? UNMutableNotificationContent

        guard let content = bestAttemptContent else {
            contentHandler(request.content)
            return
        }

        // Log the full userInfo payload for debugging.
        logger.info("NSE didReceive — userInfo keys: \\(request.content.userInfo.keys.map { String(describing: $0) }.joined(separator: ", "))")
        if let jsonData = try? JSONSerialization.data(withJSONObject: request.content.userInfo, options: .prettyPrinted),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            logger.info("NSE userInfo payload: \\(jsonString)")
        }

        // Check multiple payload locations for the image URL.
        // Expo's push service maps richContent.image to body._richContent.image in APNs.
        var imageURLString: String?

        // Check body._richContent.image (Expo push API official APNs mapping)
        if let body = request.content.userInfo["body"] as? [String: Any],
           let richContent = body["_richContent"] as? [String: Any],
           let image = richContent["image"] as? String {
            imageURLString = image
            logger.info("NSE found image in body._richContent: \\(image)")
        }
        // Check "richContent.image" at root level (fallback)
        else if let richContent = request.content.userInfo["richContent"] as? [String: Any],
                let image = richContent["image"] as? String {
            imageURLString = image
            logger.info("NSE found image in richContent: \\(image)")
        }
        // Check "image" at root level
        else if let image = request.content.userInfo["image"] as? String {
            imageURLString = image
            logger.info("NSE found image at root: \\(image)")
        }
        else {
            logger.warning("NSE could not find image URL in any payload location")
        }

        guard let urlString = imageURLString,
              let url = URL(string: urlString) else {
            logger.warning("NSE no valid image URL, delivering without image")
            contentHandler(content)
            return
        }

        logger.info("NSE downloading image from: \\(urlString)")
        downloadImage(from: url) { attachment in
            if let attachment = attachment {
                content.attachments = [attachment]
                logger.info("NSE image attached successfully")
            } else {
                logger.error("NSE image download/attach failed")
            }
            contentHandler(content)
        }
    }

    override func serviceExtensionTimeWillExpire() {
        if let contentHandler = contentHandler,
           let bestAttemptContent = bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }

    private func downloadImage(
        from url: URL,
        completion: @escaping (UNNotificationAttachment?) -> Void
    ) {
        let task = URLSession.shared.downloadTask(with: url) { location, response, error in
            guard let location = location, error == nil else {
                completion(nil)
                return
            }

            let tmpDir = FileManager.default.temporaryDirectory
            var fileExtension = ".jpg"

            if let mimeType = (response as? HTTPURLResponse)?.mimeType {
                switch mimeType {
                case "image/png": fileExtension = ".png"
                case "image/gif": fileExtension = ".gif"
                case "image/webp": fileExtension = ".webp"
                default: fileExtension = ".jpg"
                }
            }

            let tmpFile = tmpDir.appendingPathComponent(UUID().uuidString + fileExtension)

            do {
                try FileManager.default.moveItem(at: location, to: tmpFile)
                let attachment = try UNNotificationAttachment(
                    identifier: "image",
                    url: tmpFile,
                    options: nil
                )
                completion(attachment)
            } catch {
                completion(nil)
            }
        }
        task.resume()
    }
}
`;

const NSE_INFO_PLIST = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSExtension</key>
  <dict>
    <key>NSExtensionPointIdentifier</key>
    <string>com.apple.usernotifications.service</string>
    <key>NSExtensionPrincipalClass</key>
    <string>$(PRODUCT_MODULE_NAME).NotificationService</string>
  </dict>
  <key>MinimumOSVersion</key>
  <string>16.0</string>
</dict>
</plist>
`;

/**
 * Adds a Notification Service Extension target to the Xcode project.
 * This is required for iOS to download and display images in push notifications.
 */
function withNotificationServiceExtension(config) {
  // Step 1: Write the NSE source files to the ios directory during prebuild.
  config = withDangerousMod(config, [
    "ios",
    (cfg) => {
      const projectRoot = cfg.modRequest.platformProjectRoot;
      const nseDir = path.join(projectRoot, NSE_TARGET_NAME);

      if (!fs.existsSync(nseDir)) {
        fs.mkdirSync(nseDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(nseDir, "NotificationService.swift"),
        NSE_SWIFT_SOURCE
      );
      fs.writeFileSync(path.join(nseDir, "Info.plist"), NSE_INFO_PLIST);

      return cfg;
    },
  ]);

  // Step 2: Add the NSE target to the Xcode project.
  config = withXcodeProject(config, (cfg) => {
    const xcodeProject = cfg.modResults;
    const bundleId = cfg.ios?.bundleIdentifier;

    if (!bundleId) {
      throw new Error(
        "withNotificationServiceExtension: ios.bundleIdentifier is required"
      );
    }

    const nseBundleId = `${bundleId}.${NSE_TARGET_NAME}`;

    // Check if target already exists.
    const existingTarget = xcodeProject.pbxTargetByName(NSE_TARGET_NAME);
    if (existingTarget) {
      return cfg;
    }

    // Add the NSE target.
    const target = xcodeProject.addTarget(
      NSE_TARGET_NAME,
      "app_extension",
      NSE_TARGET_NAME,
      nseBundleId
    );

    // Add source file to the target's build phase.
    // Use the full relative path so Xcode finds the file in the subdirectory.
    xcodeProject.addBuildPhase(
      ["NotificationService.swift"],
      "PBXSourcesBuildPhase",
      "Sources",
      target.uuid
    );

    // Fix the file reference path to point to the NSE subdirectory.
    // addBuildPhase creates a PBXFileReference with just the filename,
    // but the file lives in NotificationServiceExtension/.
    const pbxFileRef = xcodeProject.pbxFileReferenceSection();
    for (const key in pbxFileRef) {
      const ref = pbxFileRef[key];
      if (
        typeof ref === "object" &&
        ref.name &&
        ref.name.includes("NotificationService.swift") &&
        ref.path &&
        !ref.path.includes(NSE_TARGET_NAME)
      ) {
        ref.path = `${NSE_TARGET_NAME}/NotificationService.swift`;
        break;
      }
    }

    // Set build settings for the NSE target.
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    for (const key in configurations) {
      const config = configurations[key];
      if (
        typeof config === "object" &&
        config.buildSettings &&
        config.name &&
        config.buildSettings.PRODUCT_NAME === `"${NSE_TARGET_NAME}"`
      ) {
        config.buildSettings.SWIFT_VERSION = "5.0";
        config.buildSettings.TARGETED_DEVICE_FAMILY = '"1,2"';
        config.buildSettings.IPHONEOS_DEPLOYMENT_TARGET = "16.0";
        config.buildSettings.PRODUCT_BUNDLE_IDENTIFIER = `"${nseBundleId}"`;
        config.buildSettings.CODE_SIGN_STYLE = "Automatic";
        config.buildSettings.GENERATE_INFOPLIST_FILE = "NO";
        config.buildSettings.INFOPLIST_FILE = `"${NSE_TARGET_NAME}/Info.plist"`;
      }
    }

    return cfg;
  });

  return config;
}

module.exports = withNotificationServiceExtension;
