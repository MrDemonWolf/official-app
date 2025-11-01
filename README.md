# MrDemonWolf Official iOS App 🐺

![MrDemonWolf Banner](banner.jpg)

The official iOS Progressive Web App (PWA) for MrDemonWolf, Inc. Experience the full power of the MrDemonWolf ecosystem right from your iPhone or iPad! This native iOS app provides seamless access to all MrDemonWolf services, tools, and content in an optimized mobile experience.

Built with cutting-edge WebKit technology and Firebase integration, this app delivers native performance while maintaining the flexibility and features of the web platform. **Firebase Ready** - fully configured with push notifications and cloud messaging capabilities. Stay connected with the MrDemonWolf community, access your favorite tools, and enjoy a premium mobile experience.

Your gateway to the MrDemonWolf universe, now in your pocket! 📱✨

## Getting Started

### App Store Installation

The MrDemonWolf Official iOS App will be available on the App Store soon! 🎉

### TestFlight Beta

Join our beta testing program to get early access to new features and updates.

1. Download the TestFlight app from the App Store
2. Click the TestFlight invitation link (provided separately)
3. Install and enjoy the latest beta version!

## App Requirements

- **iOS Version**: iOS 15.0 or later
- **Device Compatibility**: iPhone, iPad, and iPod touch
- **Storage**: Minimal storage required (app acts as a web wrapper)
- **Network**: Internet connection required for full functionality

## Development

### Prerequisites

- Xcode 14.0 or later
- iOS 15.0+ deployment target
- CocoaPods for dependency management
- Apple Developer Account (for device testing and distribution)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/MrDemonWolf/official-app.git
   cd official-app
   ```

2. Install CocoaPods dependencies:

   ```bash
   pod install
   ```

3. Open the workspace in Xcode:

   ```bash
   open MrDemonWolf.xcworkspace
   ```

4. Configure Firebase:

   - Add your `GoogleService-Info.plist` to the project
   - Update Firebase configuration if needed

5. Update app configuration in `Settings.swift`:
   - Verify `rootUrl` points to your target website
   - Configure `allowedOrigins` for your domain
   - Customize UI options as needed

### Project Structure

```
MrDemonWolf/
├── AppDelegate.swift          # App lifecycle management
├── SceneDelegate.swift        # Scene-based lifecycle (iOS 13+)
├── ViewController.swift       # Main view controller
├── WebView.swift             # WebKit configuration and utilities
├── Settings.swift            # App configuration constants
├── PushNotifications.swift   # Firebase messaging integration
├── Printer.swift            # Print functionality
├── Info.plist              # App metadata and permissions
├── Assets.xcassets/         # App icons and launch images
├── Base.lproj/              # Storyboard files
└── Entitlements/            # App entitlements and capabilities
```

### Configuration

#### Core Settings (`Settings.swift`)

- `rootUrl`: The main website URL to load
- `allowedOrigins`: Domains allowed for navigation
- `authOrigins`: Domains for authentication flows
- `displayMode`: App display mode (standalone/fullscreen)
- `adaptiveUIStyle`: Dynamic theme switching
- `pullToRefresh`: Enable pull-to-refresh gesture

#### Firebase Setup

1. Download `GoogleService-Info.plist` from Firebase Console
2. Add it to your Xcode project
3. Update `gcmMessageIDKey` in Settings.swift if using custom messaging

### Building & Distribution

#### Development Build

1. Select your development team in Xcode
2. Choose your target device or simulator
3. Build and run (⌘+R)

#### App Store Distribution

1. Archive the project (Product → Archive)
2. Upload to App Store Connect
3. Submit for review following Apple's guidelines

### Testing

- Use iOS Simulator for basic testing
- Test on physical devices for full feature validation
- Verify push notifications work correctly
- Test universal links and deep linking
- Validate offline functionality

## Technical Details

### Dependencies

- **Firebase/Messaging**: Push notification support
- **WebKit**: Advanced web view functionality
- **AuthenticationServices**: Secure authentication flows
- **SafariServices**: Web authentication and browsing

### Permissions

- **Push Notifications**: For real-time updates and alerts
- **Camera**: For web-based camera functionality
- **Microphone**: For web-based audio features (if needed)
- **Background App Refresh**: For timely notification delivery

### App Transport Security

The app allows arbitrary loads for maximum web compatibility while maintaining security through domain restrictions.

## Version 1.0.0 - Coming Soon! 🎉

The MrDemonWolf Official iOS App is currently in development and will be available soon.

## License

![GitHub license](https://img.shields.io/github/license/MrDemonWolf/official-app.svg?style=for-the-badge&logo=github)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support & Contact

If you have any questions, suggestions, or need support, feel free to reach out:

- **Website**: [www.mrdemonwolf.com](https://www.mrdemonwolf.com)
- **Discord**: [Join our server](https://mrdwolf.com/discord)
- **Email**: [support@mrdemonwolf.com](mailto:support@mrdemonwolf.com)
- **GitHub Issues**: Report bugs and request features

## Contributing

We welcome contributions to improve the MrDemonWolf Official iOS App! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
   d
   For major changes, please open an issue first to discuss your ideas.

---

Made with ❤️ by [MrDemonWolf, Inc.](https://www.mrdemonwolf.com)

_Bringing the MrDemonWolf experience to iOS with native performance and web flexibility._
