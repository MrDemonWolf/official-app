# App Store Compliance Report

**App:** MrDemonWolf
**Version:** 1.0.0
**Date:** February 13, 2026
**Last Rejection:** November 4, 2025 (Submission ID: `2b82afa3-8759-45c6-abeb-47ace80993ef`)

---

## Apple Rejection Summary (November 4, 2025)

The following guidelines were cited in the rejection. Each is addressed in detail below.

| # | Guideline | Summary |
|---|-----------|---------|
| 1 | **4.2.2** — Minimum Functionality | App is primarily marketing material with limited interactive features |
| 2 | **4.2** — Minimum Functionality | App experience is too similar to a web browser; lacks native functionality |
| 3 | **5.1.2** — Data Use and Sharing | App Store Connect privacy labels indicate tracking, but no ATT framework is used |
| 4 | **2.5.4** — Software Requirements | `UIBackgroundModes` declares `audio` but app has no audio features |
| 5 | **2.3.3** — Accurate Metadata | Screenshots do not show the actual app in use |

---

## Rejection Issue #1 — Guideline 4.2.2: Marketing App (CRITICAL)

**Status:** Not Compliant
**Severity:** Blocker — Apple will reject again if this is not resolved

### What Apple Said

> Your app's main functionality is to market your service, with limited or no user-facing interactive features. Apps that are primarily marketing materials or advertisements are not appropriate for the App Store.

### Why It Was Rejected

The app in its current form is a personal portfolio/blog viewer:

- **About tab**: Displays author bio from WordPress (read-only)
- **Blog tab**: Displays blog posts from WordPress (read-only)
- **Portfolio tab**: "Coming Soon" placeholder — no functionality
- **Contact tab**: "Coming Soon" placeholder — no functionality
- **Settings tab**: Theme, font size, haptics toggle, clear cache

2 of 5 tabs are empty placeholders. The remaining tabs display content fetched from a WordPress REST API with no user interaction beyond scrolling and reading. Apple considers this a marketing/promotional app, not a functional app.

### Action Required

The app must provide **meaningful interactive functionality** that goes beyond what a user could get by visiting the website in a mobile browser. Options include:

1. **Complete the Contact form** — Enable the Gravity Forms integration so users can submit messages natively (the backend hooks and React Query mutation are already built)
2. **Complete the Portfolio section** — Display actual portfolio projects with filtering, categories, or detail views
3. ~~**Add push notifications**~~ **DONE** — TailSignal push notifications integrated with device registration, unregistration, and deep linking to posts
4. **Add bookmarks/favorites** — Let users save blog posts locally for offline reading
5. **Add sharing** — Native share sheet for blog posts and portfolio items
6. **Add search** — Full-text search across blog posts
7. **Add offline reading** — Cache blog content for offline access using the existing `expo-sqlite` dependency
8. **Add commenting** — Allow users to comment on blog posts (WordPress supports this via REST API)

**Minimum recommended:** Complete the Contact form (#1), complete the Portfolio section (#2), add native sharing (#5), and add at least one more interactive feature. Removing the "Coming Soon" placeholders is essential — Apple interprets these as an incomplete app.

---

## Rejection Issue #2 — Guideline 4.2: Web Wrapper Experience (CRITICAL)

**Status:** Not Compliant
**Severity:** Blocker — closely related to 4.2.2

### What Apple Said

> Your app provides a limited user experience as it is not sufficiently different from a web browsing experience. Including features such as push notifications, Core Location, or sharing do not provide a robust enough experience.

### Why It Was Rejected

The app fetches content from a WordPress REST API and displays it in a scrollable list. This is functionally identical to visiting the website in Safari. The existing native features (haptics, animated parallax, theme toggle) are UX polish — not differentiating functionality.

### Action Required

The app must offer functionality that is **not possible or practical** via the website. Examples:

- ~~**Push notifications** for new content (not available on mobile web)~~ **DONE** — TailSignal integration implemented
- **Offline reading** with local storage (expo-sqlite is already a dependency)
- **Native sharing** via the iOS share sheet
- **Widgets** (iOS 17+ WidgetKit) showing latest blog post
- **Spotlight search integration** so blog posts appear in iOS search
- **Haptic-enhanced interactions** beyond basic feedback (e.g., pull-to-refresh with haptic steps, long-press actions)
- **Biometric lock** for the contact form or settings

Apple explicitly warns that push notifications and sharing alone are not enough. The app needs a combination of multiple native features that create a meaningfully different experience from the website.

---

## Rejection Issue #3 — Guideline 5.1.2: App Tracking Transparency (HIGH)

**Status:** Not Compliant
**Severity:** High — will cause re-rejection if not fixed

### What Apple Said

> The app privacy information provided in App Store Connect indicates the app collects data in order to track the user. However, the app does not use App Tracking Transparency to request the user's permission before tracking their activity.

### Root Cause

The app does **not** contain any tracking SDKs, analytics, or advertising libraries. The `package.json` confirms: no Firebase Analytics, Segment, Amplitude, Facebook SDK, or any ad network.

The issue is that the **App Store Connect privacy labels were filled out incorrectly** — someone marked that the app tracks users when it does not.

### Action Required

**Option A (Recommended):** Fix the App Store Connect privacy labels:

1. Go to App Store Connect > App Privacy
2. Update the data collection answers to accurately reflect what the app does:
   - **Data NOT collected for tracking**: The app has zero tracking SDKs
   - **Data collected**: Only if/when the contact form is active — name, email, phone, message (sent to your server via Gravity Forms)
   - **Data stored locally only**: Theme preference, font size, haptics toggle, last active tab (via AsyncStorage — never sent to a server)
3. Do NOT mark any data as "used for tracking"

**Option B:** If you plan to add analytics later, integrate `expo-tracking-transparency` and the AppTrackingTransparency framework before collecting any tracking data.

**Important:** Since the app currently has NO tracking whatsoever, Option A is correct. Do not add ATT prompts for tracking that doesn't exist — Apple will also reject for unnecessary permission prompts.

---

## Rejection Issue #4 — Guideline 2.5.4: Audio Background Mode (HIGH)

**Status:** Not Compliant
**Severity:** High — will cause re-rejection if not fixed

### What Apple Said

> The app declares support for audio in the UIBackgroundModes key in your Info.plist but we are unable to locate any features that require persistent audio.

### Root Cause

The `app.config.ts` does **not** explicitly declare `UIBackgroundModes`. This background mode is likely being injected during the Expo prebuild process by a plugin or a dependency. The app has:

- No audio playback code
- No `expo-av` or `expo-audio` dependency
- No music, podcast, or streaming functionality

### Action Required

1. **Run `expo prebuild --clean`** and inspect the generated `ios/<AppName>/Info.plist` for `UIBackgroundModes`
2. **Identify the source** — check if any Expo plugin or autolinking step adds the `audio` background mode
3. **Explicitly remove it** by adding to `app.config.ts`:

```typescript
ios: {
  // ... existing config
  infoPlist: {
    NSMotionUsageDescription: "This app uses haptic feedback to enhance your experience.",
    UIBackgroundModes: [], // Explicitly clear background modes
  },
}
```

4. **Verify the fix** by running prebuild again and confirming `UIBackgroundModes` is either absent or empty in the generated Info.plist

---

## Rejection Issue #5 — Guideline 2.3.3: Screenshots (HIGH)

**Status:** Not Compliant
**Severity:** High — will cause re-rejection if not fixed

### What Apple Said

> The screenshots do not show the actual app in use in the majority of the screenshots. Screenshots should highlight the app's core concept.

### Action Required

1. **Capture real in-app screenshots** on these required device sizes:
   - 6.7" iPhone (iPhone 15 Pro Max / 16 Pro Max) — **required**
   - 6.5" iPhone (iPhone 11 Pro Max / XS Max) — required if supporting older devices
   - 5.5" iPhone (iPhone 8 Plus) — required if supporting older devices
   - iPad Pro 12.9" (6th gen) — **required** since `supportsTablet: true`
   - iPad Pro 12.9" (2nd gen) — required if supporting older iPads
2. **Show the app in actual use**: blog list scrolling, blog post reading, about page, settings. Do NOT use marketing mockups, splash screens, or login screens as the majority of screenshots
3. **At least 3-5 screenshots** per device size showing different screens/features
4. **Ensure screenshots match** what the app actually looks like — same content, same theme, same layout
5. Upload via App Store Connect > Previews and Screenshots > "View All Sizes in Media Manager"

---

## Previously Identified Issues (Still Not Compliant)

### Privacy Policy — Both Platforms

**Status:** Not Compliant
**Severity:** Blocker

Apple and Google both require a privacy policy URL for all published apps.

**Action Required:**
- Create and host a privacy policy at a public URL (e.g., `https://mrdemonwolf.com/privacy-policy`)
- Add to App Store Connect under App Information > Privacy Policy URL
- Add to Google Play Console under App content > Privacy policy
- The policy should cover: what data is collected (contact form fields when enabled, local preferences), how it's used, that no data is shared with third parties, and how users can request data deletion

### App Store Metadata — Both Platforms

**Status:** Not Compliant
**Severity:** Blocker

**Action Required for iOS (App Store Connect):**
- App description (compelling, accurate)
- Keywords (relevant search terms)
- Screenshots for all required device sizes (see Issue #5 above)
- Support URL
- Marketing URL (optional but recommended)

**Action Required for Android (Google Play Console):**
- Short description (up to 80 characters)
- Full description (up to 4000 characters)
- Screenshots (minimum 2, recommended 8 per device type)
- Feature graphic (1024x500 PNG or JPEG)
- High-res icon (512x512 — already have this)

### Data Collection Questionnaires — Both Platforms

**Status:** Not Compliant
**Severity:** Blocker

**iOS (App Store Connect):**
- Complete the App Privacy questionnaire
- Since the contact form is currently disabled ("Coming Soon"), declare that the app does NOT currently collect data
- When the contact form is enabled, update the privacy labels to declare: Contact Info (name, email, phone) collected for App Functionality, not linked to identity, not used for tracking

**Android (Google Play Console):**
- Complete the Data Safety form
- Declare: (1) no data currently collected while contact form is disabled, (2) app settings stored locally only via AsyncStorage, (3) no data shared with third parties, (4) no data used for tracking or advertising

### Content Rating — Android Only

**Status:** Not Compliant
**Severity:** Blocker for Google Play

**Action Required:** Complete the IARC content rating questionnaire in Google Play Console. The app contains no violence, sexual content, gambling, or other sensitive material — it should receive an "Everyone" rating.

---

## Items Currently Compliant

### iOS (Apple App Store)

| Item | Status | Details |
|------|--------|---------|
| Bundle Identifier | Compliant | `com.mrdemonwolf.OfficialApp` (prod) / `com.mrdemonwolf.OfficialApp.dev` (dev) |
| Version & Build Number | Compliant | Version `1.0.0`, build number `1` configured in `app.config.ts` |
| Encryption Declaration | Compliant | `usesNonExemptEncryption: false` — no custom encryption beyond HTTPS |
| App Icon | Compliant | 1024x1024 PNG at `src/assets/images/icon.png` |
| Splash Screen | Compliant | Configured with light/dark variants |
| Permissions | Compliant | `NSMotionUsageDescription` declared for expo-haptics; no other sensitive APIs used |
| HTTPS Only | Compliant | All API requests use HTTPS |
| No Hardcoded Secrets | Compliant | All API URLs use `EXPO_PUBLIC_` environment variables |
| Tablet Support | Compliant | `supportsTablet: true` in iOS config |
| EAS Build Config | Compliant | Production profile with `distribution: store` and auto-increment |

### Android (Google Play Store)

| Item | Status | Details |
|------|--------|---------|
| Package Name | Compliant | `com.mrdemonwolf.OfficialApp` (prod) / `com.mrdemonwolf.OfficialApp.dev` (dev) |
| Version & Version Code | Compliant | Version `1.0.0`, versionCode `1` configured in `app.config.ts` |
| Adaptive Icon | Compliant | Foreground, background, and monochrome images configured |
| Edge-to-Edge | Compliant | `edgeToEdgeEnabled: true` |
| HTTPS Only | Compliant | All network requests use HTTPS |
| No Hardcoded Secrets | Compliant | All configuration uses environment variables |
| No Tracking SDKs | Compliant | No analytics, advertising, or tracking libraries |
| EAS Build Config | Compliant | Production profile with `distribution: store` |

---

## Additional Code-Level Observations

| Item | Status | Notes |
|------|--------|-------|
| `expo-sqlite` dependency | Unused | Listed in `package.json` but not imported anywhere. Remove it or use it for offline caching/bookmarks. |
| Contact form backend | Ready but disabled | `useContactForm()` hook and `gravity-forms.ts` service are fully implemented. Only the UI screen shows "Coming Soon". |
| `expo-symbols` (SF Symbols) | iOS only | The `ComingSoon` component uses `SymbolView` which only renders on iOS. Android has a platform-specific contact screen file but portfolio does not. Verify Android renders correctly for all screens. |
| Deep linking scheme | Partially used | `scheme: "mrdemonwolf"` is set in config. Push notification taps deep link to blog/portfolio posts via Expo Router. |
| Push notifications | Implemented | TailSignal device registration via `expo-notifications` and `expo-device`. Toggle in Settings registers/unregisters the device. |

---

## Prioritized Action Plan for Resubmission

### Phase 1 — Fix Rejection Blockers (Must Do)

| Priority | Task | Addresses |
|----------|------|-----------|
| P0 | Remove `UIBackgroundModes` audio from the build (add `UIBackgroundModes: []` to infoPlist) | Guideline 2.5.4 |
| P0 | Fix App Store Connect privacy labels — mark that the app does NOT track users | Guideline 5.1.2 |
| P0 | Take real in-app screenshots for all required device sizes | Guideline 2.3.3 |
| P0 | Create and host a privacy policy | Both platforms |
| P0 | Complete the Portfolio tab with real content (remove "Coming Soon") | Guideline 4.2.2 |
| P0 | Complete the Contact form UI (backend is already built) | Guideline 4.2.2 |

### Phase 2 — Add Native Functionality (Must Do)

| Priority | Task | Addresses |
|----------|------|-----------|
| P1 | Add native share sheet for blog posts and portfolio items | Guideline 4.2 |
| P1 | Add blog post bookmarks/favorites with local storage | Guideline 4.2 |
| P1 | Add offline reading capability (leverage `expo-sqlite`) | Guideline 4.2 |
| P1 | Add blog search functionality | Guideline 4.2 |
| ~~P1~~ | ~~Add push notifications for new blog posts (`expo-notifications`)~~ **DONE** — TailSignal integration with device registration/unregistration | Guideline 4.2 |

### Phase 3 — Store Metadata (Must Do Before Submission)

| Priority | Task | Addresses |
|----------|------|-----------|
| P2 | Write App Store description, keywords, and support URL | Both platforms |
| P2 | Complete App Privacy questionnaire in App Store Connect | iOS |
| P2 | Complete Data Safety form in Google Play Console | Android |
| P2 | Complete IARC content rating questionnaire | Android |
| P2 | Prepare feature graphic (1024x500) for Google Play | Android |

---

## Notes

- The minimum functionality rejection (4.2.2 + 4.2) is the hardest to fix because it requires actual feature development, not just configuration changes. Plan for meaningful development time.
- Apple explicitly stated that adding push notifications, Core Location, or sharing alone is NOT enough. The app needs a **combination** of native features that create a meaningfully better experience than the website.
- Removing all "Coming Soon" placeholders is critical — they signal to reviewers that the app is incomplete.
- The blog content from WordPress is fine as a feature, but it cannot be the **only** feature.
- Consider whether `supportsTablet: true` is worth keeping — it requires iPad-specific screenshots and Apple expects a good iPad experience. If the app doesn't have an iPad-optimized layout, either add one or set `supportsTablet: false` to reduce screenshot requirements and avoid iPad UX rejection.
