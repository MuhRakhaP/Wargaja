# Wargaja Android Package ID Migration & Firebase Setup — Summary

## ✅ Completed: Package ID Migration

### Changes Made

**Old Package ID:** `com.squadronteam.rukunin`  
**New Package ID:** `com.wargaja.app`

### Files Modified

#### 1. Build Configuration
- `android/app/build.gradle.kts`
  - Line 12: `namespace = "com.squadronteam.rukunin"` → `namespace = "com.wargaja.app"`
  - Line 28: `applicationId = "com.squadronteam.rukunin"` → `applicationId = "com.wargaja.app"`

#### 2. Kotlin Source Files (New Package)
**Created in new directory:** `android/app/src/main/kotlin/com/wargaja/app/`

- `MainActivity.kt` ✅
  - Package declaration: `package com.wargaja.app`
  - ONNX Runtime channel preserved: `const val CHANNEL = "onnx_runtime"`
  - All inference logic unchanged
  - Widget provider reference unchanged

- `ActivityWidgetProvider.kt` ✅
  - Package declaration: `package com.wargaja.app`
  - Widget functionality unchanged
  - MainActivity reference still works (same class name)

#### 3. Old Package Directory
- `android/app/src/main/kotlin/com/squadronteam/rukunin/` — **Kept for reference**
  - Contains original files (safe to delete after build verification)

### Preserved (Unchanged)

✅ **ONNX Integration**
- MethodChannel name: "onnx_runtime" (unchanged)
- Model loading logic (unchanged)
- Inference execution (unchanged)
- build.gradle.kts ONNX dependency (unchanged)

✅ **AndroidManifest.xml**
- Permissions unchanged
- Intent filters unchanged
- Widget provider configuration unchanged
- No package references (auto-resolved by build system)

✅ **Firebase Integration**
- gradle plugin: `com.google.gms.google-services` (unchanged)
- All Firebase dependencies in pubspec.yaml (unchanged)
- Dart code (unchanged — Firebase setup is configuration-driven)

---

## ⏳ Next Steps: Firebase Console Setup

### Step 1: Register App in Firebase

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Create or select "Wargaja" project
3. **Add Android App**
   - **Package name:** `com.wargaja.app` ← **Use new package ID**
   - **App nickname:** Wargaja
   - **SHA-1 certificate:** [Get from Step 2 below]

### Step 2: Get Debug SHA-1

Run on your machine:
```bash
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Copy the **SHA1** line and paste into Firebase Console.

### Step 3: Download google-services.json

1. After registering app, Firebase will offer **Download google-services.json**
2. **Save to:** `D:\Wargaja\android\app\google-services.json`
   - Exact path required for build system to find it

### Step 4: Enable Firebase Services

In Firebase Console, enable for this Android app:
- ✅ Authentication (Email/Password)
- ✅ Firestore Database
- ✅ Realtime Database (if used)
- ✅ Cloud Storage
- ✅ Cloud Functions

---

## 🔨 Build & Deploy

### Before Building

```bash
cd D:\Wargaja

# 1. Place google-services.json in android/app/
# (Download from Firebase Console)

# 2. Clean and restore
flutter clean
flutter pub get

# 3. Run asset generators
flutter pub run flutter_launcher_icons
flutter pub run flutter_native_splash:create

# 4. Verify new package structure
# Check that android/app/src/main/kotlin/com/wargaja/app/ exists
```

### Build APK

```bash
# Debug (testing)
flutter build apk --debug

# Release (production)
flutter build apk --release
```

### Deploy Options

**A. Firebase Console (Easiest)**
- Firebase → App Distribution → Upload APK
- Set tester groups, add release notes
- Testers get link to download

**B. Google Play Store**
- Play Console → Upload APK
- Configure store listing
- Submit for review (~1-3 hours)

**C. Direct Install (Local Testing)**
```bash
adb install build/app/outputs/flutter-apk/app-release.apk
```

---

## ⚠️ Important Notes

### Google Services JSON
- **Must be downloaded for `com.wargaja.app` package**
- Different package ID = different JSON
- Place at: `android/app/google-services.json` (exact path)
- Add to `.gitignore` before committing (contains API keys)

### Old Package Directory
- `android/app/src/main/kotlin/com/squadronteam/rukunin/` can be **safely deleted** after:
  - New build succeeds
  - App runs on device without errors
  - ONNX inference still works

### ONNX Still Works
- MethodChannel unchanged: "onnx_runtime"
- Model reference unchanged: "assets/models/image_classifier_linreg.onnx"
- MainActivity ONNX code identical, only package moved
- **No changes to Dart code needed**

### Firebase Initialization
- `lib/main.dart` calls: `Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform)`
- build.gradle.kts plugin: `com.google.gms.google-services` applies google-services.json automatically
- **No manual code changes needed** — package ID change handles everything

---

## Git Status

**Files modified:** 2
- `android/app/build.gradle.kts` (namespace + applicationId)

**Files created (new package):** 2
- `android/app/src/main/kotlin/com/wargaja/app/MainActivity.kt`
- `android/app/src/main/kotlin/com/wargaja/app/ActivityWidgetProvider.kt`

**Files unchanged (old package, safe to delete):** 2
- `android/app/src/main/kotlin/com/squadronteam/rukunin/MainActivity.kt`
- `android/app/src/main/kotlin/com/squadronteam/rukunin/ActivityWidgetProvider.kt`

**Documentation created:**
- `FIREBASE_PACKAGE_ID_SETUP.md` — Detailed guide (this file)

---

## Verification Checklist Before Build

- [ ] Package ID changed in build.gradle.kts to "com.wargaja.app"
- [ ] New Kotlin files created at: `android/app/src/main/kotlin/com/wargaja/app/`
- [ ] firebase plugin applied in build.gradle.kts: `id("com.google.gms.google-services")`
- [ ] Ready to download google-services.json from Firebase Console
- [ ] Plan to place google-services.json at: `android/app/google-services.json`
- [ ] Dart Firebase code unchanged (auto-configures from google-services.json)
- [ ] ONNX logic preserved (MainActivity MethodChannel unchanged)
- [ ] pubspec.yaml Firebase dependencies intact
- [ ] Asset generators ready to run (flutter_launcher_icons, flutter_native_splash)

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| "Package name mismatch" | google-services.json from old package | Re-download for com.wargaja.app |
| "Unable to find MainActivity" | Old package directory still in use | Check classpath in build.gradle, clean build |
| "Gradle build failed" | build.gradle.kts syntax error | Run `flutter clean && flutter pub get` |
| "Firebase not initializing" | google-services.json not found | Verify at `android/app/google-services.json` |
| "ONNX inference fails" | Unlikely, but verify channel name | Check MainActivity.kt line 16: `const val CHANNEL = "onnx_runtime"` |

---

## Summary

✅ **Package ID migration complete:** com.squadronteam.rukunin → com.wargaja.app  
✅ **New Kotlin files created** with correct package declaration  
✅ **ONNX and Firebase preserved** — no logic changes  
✅ **Ready for Firebase setup** — download google-services.json next  
✅ **Ready for APK build** — after google-services.json placed  

**Status:** Waiting on Firebase Console setup and google-services.json download.

**Next action:** Go to Firebase Console, register app, download google-services.json, place at `android/app/google-services.json`, then build.
