import UserNotifications

class NotificationService: UNNotificationServiceExtension {
    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?

    override func didReceive(
        _ request: UNNotificationRequest,
        withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void
    ) {
        self.contentHandler = contentHandler
        bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)

        if let bestAttemptContent = bestAttemptContent {
            // Extract image URL from Expo's APNs payload mapping:
            // richContent.image → body._richContent.image
            if let body = request.content.userInfo["body"] as? [String: Any],
               let richContent = body["_richContent"] as? [String: Any],
               let imageUrlString = richContent["image"] as? String,
               let imageUrl = URL(string: imageUrlString)
            {
                downloadAndAttachImage(url: imageUrl, to: bestAttemptContent) { content in
                    contentHandler(content)
                }
            } else {
                contentHandler(bestAttemptContent)
            }
        }
    }

    private func downloadAndAttachImage(
        url: URL,
        to content: UNMutableNotificationContent,
        completion: @escaping (UNNotificationContent) -> Void
    ) {
        let task = URLSession.shared.downloadTask(with: url) { temporaryFileLocation, _, error in
            guard let temporaryFileLocation = temporaryFileLocation else {
                completion(content)
                return
            }

            let fileManager = FileManager.default
            let tempDirectory = URL(fileURLWithPath: NSTemporaryDirectory())
            let targetFileName = temporaryFileLocation.lastPathComponent + ".jpg"
            let targetUrl = tempDirectory.appendingPathComponent(targetFileName)

            try? fileManager.removeItem(at: targetUrl)

            do {
                try fileManager.moveItem(at: temporaryFileLocation, to: targetUrl)
                let attachment = try UNNotificationAttachment(
                    identifier: "image",
                    url: targetUrl,
                    options: nil
                )
                content.attachments = [attachment]
            } catch {
                // Fall through — deliver without image
            }

            completion(content)
        }
        task.resume()
    }

    override func serviceExtensionTimeWillExpire() {
        if let contentHandler = contentHandler,
           let bestAttemptContent = bestAttemptContent
        {
            contentHandler(bestAttemptContent)
        }
    }
}
