# Wargaja Android Package ID & Firebase Setup Guide

## Phase 1: Package ID Migration (Completed)

### Changes Made

**Old Package ID:** `com.squadronteam.rukunin`  
**New Package ID:** `com.wargaja.app`

### Files Updated

#### 1. **build.gradle.kts**
- `namespace`: `com.squadronteam.rukunin` → `com.wargaja.app`
- `applicationId`: `com.squadronteam.rukunin` → `com.wargaja.app`

#### 2. **Kotlin Source Files**
- **Old path:** `android/app/src/main/kotlin/com/squadronteam/rukunin/`
- **New path:** `android/app/src/main/kotlin/com/wargaja/app/`
- **Files created (new package):**
  - `MainActivity.kt` (package: `com.wargaja.app`)
  - `ActivityWidgetProvider.kt` (package: `com.wargaja.app`)

#### 3. **Old Package Directory**
- `android/app/src/main/kotlin/com/squadronteam/rukunin/` — **Can be deleted after testing** (old files kept for now)

---

## Phase 2: Firebase Setup (Manual Steps)

### Step 1: Register App in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select or create a project named "Wargaja"
3. Click **Add app** → **Android**
4. Fill in:
   - **Package name:** `com.wargaja.app` ← **IMPORTANT: Use new package ID**
   - **App nickname:** Wargaja (optional)
   - **Debug signing certificate SHA-1:** [See Step 2 below]
5. Click **Register app**

### Step 2: Get Debug Signing Certificate SHA-1

**Option A: Using keytool (if you have local keystore)**
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Look for: `SHA1: XX:XX:XX:...`

**Option B: Get from Flutter (easiest)**
```bash
cd D:\Wargaja
flutter doctor --android-licenses  # Accept if prompted
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Copy the SHA1 value to Firebase Console.

### Step 3: Download google-services.json

1. After registering app in Firebase Console, click **Download google-services.json**
2. Place file in: `android/app/google-services.json`
3. **Verify path:** File should be at exactly: `D:\Wargaja\android\app\google-services.json`

### Step 4: Enable Firebase Services in Console

In Firebase Console → Your Project → Project Settings:

**Enable for Android app (com.wargaja.app):**
- ✅ Realtime Database
- ✅ Firestore Database
- ✅ Authentication (Email/Password)
- ✅ Storage
- ✅ Cloud Functions
- ✅ App Check (optional, currently commented in code)

---

## Phase 3: Flutter Configuration Update

**pubspec.yaml** — Already configured (no changes needed):
- `firebase_core: ^4.2.1`
- `firebase_auth: ^6.1.2`
- `cloud_firestore: ^6.1.0`
- `firebase_storage: ^13.0.4`
- `cloud_functions: ^6.0.4`
- All other Firebase packages present

---

## Phase 4: Build & Deploy Steps

### Before Building APK

1. **Place google-services.json**
   ```bash
   # Copy downloaded file to:
   D:\Wargaja\android\app\google-services.json
   ```

2. **Verify package ID in all files**
   ```bash
   cd D:\Wargaja
   # Check build.gradle.kts
   grep "com.wargaja.app" android/app/build.gradle.kts
   # Should show 2 matches: namespace and applicationId
   ```

3. **Clean Flutter cache**
   ```bash
   flutter clean
   flutter pub get
   ```

4. **Run asset generators**
   ```bash
   flutter pub run flutter_launcher_icons
   flutter pub run flutter_native_splash:create
   ```

5. **Verify Android structure**
   ```bash
   # Check new package directory exists
   ls -la android/app/src/main/kotlin/com/wargaja/app/
   # Should show: MainActivity.kt, ActivityWidgetProvider.kt
   ```

### Building APK

```bash
cd D:\Wargaja

# Debug APK (for testing)
flutter build apk --debug

# Release APK (for production/Firebase)
flutter build apk --release
```

**Output location:**
- Debug: `build/app/outputs/flutter-apk/app-debug.apk`
- Release: `build/app/outputs/flutter-apk/app-release.apk`

---

## Phase 5: Firebase Android Deployment

### Option A: Firebase Console Upload

1. Go to Firebase Console → Your Project → **App Distribution**
2. Click **Upload** → Select APK file
3. Set tester group or email list
4. Add release notes (optional)
5. Click **Distribute**

### Option B: Play Store Deployment

1. Create Google Play Developer account (one-time $25)
2. Create app in Play Console → com.wargaja.app
3. Upload signed APK to Play Store
4. Configure store listing, pricing, permissions
5. Submit for review (1-3 hours typical)

### Option C: Direct Installation (Testing)

```bash
# Connect Android device via USB
flutter devices  # Verify device shows

# Install from APK directly
adb install build/app/outputs/flutter-apk/app-release.apk

# Or use Flutter
flutter install -v
```

---

## Firebase Security Rules Setup

### Firestore Rules

After deployment, configure security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Community data (configure per app requirements)
    match /communities/{communityId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid in get(/databases/$(database)/documents/communities/$(communityId)).data.admins;
    }
    
    // Transactions and finances
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null;
    }
    
    // Default: deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**⚠️ IMPORTANT:** Deploy appropriate rules before releasing app. Default is "deny all" — ensure your app's Firestore access is explicitly allowed.

---

## Troubleshooting

### Error: "Package name mismatch"
- Ensure `google-services.json` is downloaded for `com.wargaja.app`
- Check Firebase Console shows "com.wargaja.app" as registered app

### Error: "Unable to find MainActivity"
- Verify file exists: `android/app/src/main/kotlin/com/wargaja/app/MainActivity.kt`
- Ensure package declaration is: `package com.wargaja.app`

### Error: "Gradle build failed"
- Run: `flutter clean && flutter pub get`
- Verify build.gradle.kts has correct namespace and applicationId

### Firebase auth not working
- Check Firebase Console → Authentication → Email/Password enabled
- Verify `google-services.json` placed in correct directory
- Run: `flutter pub get` to regenerate configs

### ONNX inference failing after package change
- MainActivity.kt ONNX channel code unchanged
- Verify MethodChannel still uses: `const val CHANNEL = "onnx_runtime"`
- No code changes needed — should work as before

---

## Verification Checklist

- [ ] New package directory created: `com/wargaja/app/`
- [ ] MainActivity.kt has package: `com.wargaja.app`
- [ ] ActivityWidgetProvider.kt has package: `com.wargaja.app`
- [ ] build.gradle.kts updated: namespace and applicationId = "com.wargaja.app"
- [ ] google-services.json downloaded from Firebase Console
- [ ] google-services.json placed at: `android/app/google-services.json`
- [ ] Ran `flutter clean && flutter pub get`
- [ ] Ran asset generators (flutter_launcher_icons, flutter_native_splash)
- [ ] Build successful: `flutter build apk --release`
- [ ] App installed on device/emulator
- [ ] App launches and shows "Wargaja" title
- [ ] Firebase auth login works
- [ ] ONNX model loads and inference runs
- [ ] Firestore data readable/writable (per configured rules)

---

## Next Steps

1. **Download google-services.json** from Firebase Console
2. **Place in `android/app/`**
3. **Run `flutter clean && flutter pub get`**
4. **Build APK:** `flutter build apk --release`
5. **Test on device**
6. **Deploy via Firebase Console or Play Store**
7. **Configure Firestore Security Rules**

---

## Support

If build fails:
1. Check error message for package name or file path issues
2. Run: `flutter pub get` and retry
3. Check that new package files exist in correct directory
4. Verify google-services.json is valid JSON in correct location
