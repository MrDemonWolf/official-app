# App Store Compliance Report

**App:** MrDemonWolf
**Version:** 1.0.0
**Date:** February 7, 2026

---

## iOS (Apple App Store)

### Compliant

| Item | Status | Details |
|------|--------|---------|
| Bundle Identifier | Compliant | `com.mrdemonwolf.OfficialApp` (prod) / `com.mrdemonwolf.OfficialApp.dev` (dev) |
| Version & Build Number | Compliant | Version `1.0.0`, build number `1` configured in `app.config.ts` |
| Encryption Declaration | Compliant | `usesNonExemptEncryption: false` — app does not use custom encryption beyond standard HTTPS |
| App Icon | Compliant | 1024x1024 PNG at `src/assets/images/icon.png` |
| Splash Screen | Compliant | Configured with light/dark variants |
| Permissions | Compliant | `NSMotionUsageDescription` declared for expo-haptics; no other sensitive APIs used (no camera, location, contacts, etc.) |
| HTTPS Only | Compliant | All API requests use HTTPS (`mrdemonwolf.com`) |
| No Hardcoded Secrets | Compliant | All API URLs use `EXPO_PUBLIC_` environment variables; no secret keys in client code |
| No Tracking SDKs | Compliant | No analytics or advertising SDKs included — simplifies App Tracking Transparency requirements |
| Tablet Support | Compliant | `supportsTablet: true` in iOS config |
| EAS Build Config | Compliant | Production profile configured with `distribution: store` and auto-increment |

### Not Compliant

| Item | Status | Why It's Not Compliant | Action Required |
|------|--------|----------------------|-----------------|
| Privacy Policy | Not Compliant | Apple requires a privacy policy URL for all apps on the App Store. No privacy policy URL is configured in the app or store listing. | Create and host a privacy policy at a public URL (e.g., `https://mrdemonwolf.com/privacy-policy`). Add it to App Store Connect. |
| App Store Metadata | Not Compliant | App Store Connect requires a description, keywords, screenshots for required device sizes (6.7", 6.1", 5.5" iPhone + iPad if supporting tablet), and a support URL. These are not in the codebase — they must be set in App Store Connect. | Prepare marketing copy, screenshots, and a support URL before submission. |
| App Store Data Collection Questionnaire | Not Compliant | Apple requires you to answer data collection questions in App Store Connect. The app collects: local settings via AsyncStorage (not sent to server), form submissions via Gravity Forms (name, email, phone, message). | Complete the questionnaire in App Store Connect. Declare that contact form data is collected and sent to your server. |

---

## Android (Google Play Store)

### Compliant

| Item | Status | Details |
|------|--------|---------|
| Package Name | Compliant | `com.mrdemonwolf.OfficialApp` (prod) / `com.mrdemonwolf.OfficialApp.dev` (dev) |
| Version & Version Code | Compliant | Version `1.0.0`, versionCode `1` configured in `app.config.ts` |
| Adaptive Icon | Compliant | Foreground (512x512), background (512x512), and monochrome (432x432) images configured |
| Edge-to-Edge | Compliant | `edgeToEdgeEnabled: true` |
| HTTPS Only | Compliant | All network requests use HTTPS |
| No Hardcoded Secrets | Compliant | All configuration uses environment variables |
| No Tracking SDKs | Compliant | No analytics, advertising, or tracking libraries |
| EAS Build Config | Compliant | Production profile with `distribution: store` |

### Not Compliant

| Item | Status | Why It's Not Compliant | Action Required |
|------|--------|----------------------|-----------------|
| Privacy Policy | Not Compliant | Google Play requires a privacy policy URL for all apps, especially those that handle personal data (the contact form collects name, email, phone). | Create and host a privacy policy. Add the URL in the Google Play Console under "App content > Privacy policy". |
| Data Safety Section | Not Compliant | Google Play requires a Data Safety declaration. The app collects personal info via the contact form (name, email, phone, message) and stores local preferences via AsyncStorage. | Complete the Data Safety form in Google Play Console. Declare: (1) contact info collected and sent to server, (2) app settings stored locally only, (3) no data shared with third parties. |
| Content Rating | Not Compliant | Google Play requires a content rating questionnaire to be completed before publishing. | Complete the IARC content rating questionnaire in Google Play Console. |
| Play Store Metadata | Not Compliant | Play Store requires a short description, full description, screenshots, and a feature graphic (1024x500). | Prepare marketing copy, screenshots, and feature graphic before submission. |

---

## Both Platforms — Summary

### What's Ready

- App configuration (bundle IDs, versions, build numbers)
- App icons and splash screens at correct sizes
- Encryption compliance declaration (iOS)
- All permissions properly declared with usage descriptions
- No security issues (HTTPS only, no hardcoded secrets, sensitive files in .gitignore)
- EAS Build configured for store distribution
- No third-party tracking or analytics to disclose

### What Needs Attention Before Submission

1. **Privacy Policy** (Required for both stores) — Create and host at a public URL
2. **Store Metadata** (Required for both stores) — Descriptions, screenshots, support URL
3. **Data Collection Disclosures** (Required for both stores) — Complete the questionnaires in App Store Connect and Google Play Console
4. **Content Rating** (Android only) — Complete IARC questionnaire in Play Console

### Notes

- The contact form is currently disabled (showing "Coming Soon") which means no personal data is actively collected through the app at this time. However, the privacy policy should still account for the form since it will be re-enabled.
- The portfolio section is also showing "Coming Soon" — no compliance issues with placeholder screens.
- The blog content is fetched from a public WordPress REST API and displayed read-only. No user data is collected from the blog section.
