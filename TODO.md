## iOS

Add https://docs.expo.dev/versions/latest/config/app/#privacymanifests

Add Info.plist
infoPlist iOS Custom keys for the iOS settings file. Should have. Use this to customize the "Permission Request" text (e.g., "This app needs camera access to scan your ID").

## Androuid

permissions Android A list of hardware features the app uses. Pro Tip: In enterprise apps, use this to strip out unused permissions (like Camera or Location) to make your app more secure and "lean."

softwareKeyboardLayoutMode Android Controls how the app shifts when the keyboard opens. Should have. Set to resize to ensure your text inputs aren't covered by the keyboard in complex forms.

## Both

userInterfaceStyle Both Forces "light", "dark", or "automatic". Should have. Even if you support both, setting it explicitly ensures your splash screen and system UI match your app's theme.

backgroundColor Both The color of the "root view" behind your app. Pro Tip: Set this to your app's primary background color to prevent a "white flash" when the app transitions from the splash screen to the first page.
