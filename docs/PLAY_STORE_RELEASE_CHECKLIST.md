# 📱 FitSync — Google Play Store Release Checklist

This document details all technical, legal, store listing, and security requirements to release FitSync on the Google Play Store.

---

## 1. ⚙️ Technical & Build Configuration

| Task | Status | Requirement | Action Required |
| :--- | :---: | :--- | :--- |
| **Application ID** | `AUTOMATED` | `com.fitsync.app` | Configured in `capacitor.config.json` and `build.gradle` |
| **Target SDK Version** | `AUTOMATED` | Target SDK $\ge 35/36$ | Configured as `targetSdkVersion = 36` in `variables.gradle` |
| **Minimum SDK Version**| `AUTOMATED` | Min SDK $\ge 24$ | Configured as `minSdkVersion = 24` (Android 7.0+) |
| **Version Code & Name**| `AUTOMATED` | `versionCode 1`, `versionName "1.0"` | Increment `versionCode` for each Play Store upload |
| **App Bundle Generation**| `AUTOMATED` | Generate `.aab` | Run `npm run build && npx cap sync android && cd android && ./gradlew bundleRelease` |
| **Release Signing Key** | `MANUAL` | Private Release Keystore (`.keystore` / `.jks`) | Follow Section 2 below (Do NOT commit keystore to Git) |

---

## 2. 🔑 Release Signing Key Generation (MANUAL)

To generate a private release key locally:

```bash
keytool -genkey -v -keystore fitsync-release-key.keystore -alias fitsync-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Secure Gradle Configuration (`android/app/build.gradle`)
Store secrets in `~/.gradle/gradle.properties` or environment variables:

```properties
FITSYNC_RELEASE_STORE_FILE=/path/to/fitsync-release-key.keystore
FITSYNC_RELEASE_KEY_ALIAS=fitsync-key-alias
FITSYNC_RELEASE_STORE_PASSWORD=your_store_password
FITSYNC_RELEASE_KEY_PASSWORD=your_key_password
```

In `android/app/build.gradle`:
```groovy
signingConfigs {
    release {
        storeFile file(System.getenv("FITSYNC_RELEASE_STORE_FILE") ?: "fitsync-release-key.keystore")
        storePassword System.getenv("FITSYNC_RELEASE_STORE_PASSWORD")
        keyAlias System.getenv("FITSYNC_RELEASE_KEY_ALIAS")
        keyPassword System.getenv("FITSYNC_RELEASE_KEY_PASSWORD")
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

---

## 3. 📜 Legal & Compliance Requirements (MANUAL)

- [ ] **Privacy Policy URL:** Mandatory for all apps. Must disclose:
  - Local device storage of fitness/body metrics.
  - Analytics and camera permissions (if photos enabled).
  - Data retention and user deletion policies.
- [ ] **Data Safety Form (Google Play Console):**
  - **Data Collected:** Health & Fitness metrics (Weight, Body Measurements), Photos (if uploaded), App interactions.
  - **Data Shared:** None (currently client-only offline app).
  - **Security Practices:** Encrypted in transit (HTTPS), User deletion supported via Profile settings.
- [ ] **Account Deletion Requirement:**
  - Google Play policy requires a clear in-app mechanism for users to delete their account and stored data (Supported via Profile -> Clear Data / Logout).

---

## 4. 🎨 Store Listing & Marketing Assets (MANUAL)

- [ ] **High-Res App Icon:** `512 x 512 px` (32-bit PNG with alpha).
- [ ] **Feature Graphic:** `1024 x 500 px` (JPEG or 24-bit PNG, no alpha).
- [ ] **Phone Screenshots:** Minimum 4 screenshots, `16:9` or `9:16` aspect ratio (e.g., `1080 x 1920 px`).
  - Screen 1: AI Coach & Daily Dashboard
  - Screen 2: Dynamic Workout Tracker & Set-by-Set Logging
  - Screen 3: AI Macro Diet & Hydration Tracker
  - Screen 4: Body Analytics & Transformation Timeline
- [ ] **Short Description:** Up to 80 characters (e.g. *FitSync — AI-Powered Workouts, Diet Plans & Fitness Tracking.*)
- [ ] **Full Description:** Up to 4000 characters detailing core features, macro calculations, and offline capabilities.

---

## 5. 🚀 Testing Tracks & Rollout Plan

1. **Internal Testing Track:** Upload initial `.aab` for internal team testing without Play Store review delays.
2. **Closed Testing (20 Testers / 14 Days):** Mandatory for new personal Google Play Developer accounts.
3. **Production Rollout:** Staged rollout (20% $\rightarrow$ 50% $\rightarrow$ 100%) with Sentry crash monitoring.
