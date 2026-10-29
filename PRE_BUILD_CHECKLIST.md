# Pre-Build Verification Checklist — Wargaja APK

## ✅ Configuration Verified

- [x] Package ID updated to: `com.wargaja.app`
- [x] build.gradle.kts namespace: `com.wargaja.app`
- [x] build.gradle.kts applicationId: `com.wargaja.app`
- [x] New Kotlin files at: `android/app/src/main/kotlin/com/wargaja/app/`
- [x] MainActivity.kt package: `package com.wargaja.app`
- [x] ActivityWidgetProvider.kt package: `package com.wargaja.app`
- [x] google-services.json present at: `android/app/google-services.json` (671 bytes)
- [x] google-services.json added to .gitignore
- [x] ONNX MethodChannel preserved: "onnx_runtime"
- [x] Firebase Gradle plugin: `com.google.gms.google-services`
- [x] All Firebase dependencies in pubspec.yaml

## 🔨 Ready to Build

**Commands to run in order:**

```bash
cd D:\Wargaja

# 1. Clean cache
flutter clean

# 2. Restore dependencies
flutter pub get

# 3. Run asset generators
flutter pub run flutter_launcher_icons

flutter pub run flutter_native_splash:create

# 4. Build APK
flutter build apk --release

# Output location:
# D:\Wargaja\build\app\outputs\flutter-apk\app-release.apk
```

## 📱 After Build

1. **Test on emulator/device:**
   ```bash
   adb install build/app/outputs/flutter-apk/app-release.apk
   ```

2. **Verify on app:**
   - App title shows "Wargaja"
   - Blue theme displays throughout
   - Firebase login works
   - ONNX model loads and inference runs
   - No crash on startup

3. **Deploy via Firebase Console:**
   - Go to Firebase → App Distribution
   - Upload APK
   - Distribute to testers

## ⚠️ Do NOT Commit

Before any git commit:
- ✅ `.gitignore` already includes `android/app/google-services.json`
- ✅ Old package files at `android/app/src/main/kotlin/com/squadronteam/rukunin/` can be left or deleted
- ✅ New package files at `android/app/src/main/kotlin/com/wargaja/app/` ready to commit

## Status

**Ready to build APK:** ✅ YES

Run the commands above to generate release APK for Firebase deployment.
