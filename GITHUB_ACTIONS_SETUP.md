# GitHub Actions CI/CD — Wargaja Auto-Build & Firebase Deploy

## Overview

GitHub Actions akan otomatis:
1. Build APK saat push ke `main` atau `dev/farrel`
2. Deploy ke Firebase App Distribution
3. Notify testers
4. Simpan artifacts untuk download

**Keuntungan:**
- ✅ Tidak perlu Android Studio atau SDK lokal
- ✅ Build di cloud (GitHub servers)
- ✅ Otomatis trigger saat push
- ✅ Testers dapat link download otomatis
- ✅ Build history tersimpan

---

## Setup Steps

### Step 1: Generate Firebase Service Account Key

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click **Generate new private key**
3. Download JSON file (e.g., `wargaja-firebase-key.json`)
4. **Keep this file secure** — contains API keys

### Step 2: Get Firebase App ID

1. Firebase Console → Project Overview
2. Find Android app "com.wargaja.app"
3. Copy the **App ID** (format: `1:XXXX:android:YYYY`)

### Step 3: Add GitHub Secrets

1. Go to GitHub Repository → Settings → Secrets and variables → Actions
2. Add 3 new secrets:

| Secret Name | Value | Where to Get |
|------------|-------|-------------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Content of downloaded JSON file | Firebase Console (Step 1) |
| `FIREBASE_APP_ID` | App ID | Firebase Console (Step 2) |
| `FIREBASE_TESTERS_EMAIL` | Comma-separated emails | Your tester emails |

**Example:**
```
FIREBASE_TESTERS_EMAIL=tester1@email.com,tester2@email.com,tester3@email.com
```

### Step 4: Commit Workflow File

```bash
cd D:\Wargaja
git add .github/workflows/build-and-deploy.yml
git commit -m "ci: add github actions workflow for firebase deployment"
git push origin dev/farrel
```

---

## How It Works

### Trigger Build

Any of these will trigger build:

1. **Push to main:**
   ```bash
   git push origin main
   ```

2. **Push to dev/farrel:**
   ```bash
   git push origin dev/farrel
   ```

3. **Create release tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. **Manual trigger** (GitHub UI):
   - Go to Actions → Build & Deploy to Firebase
   - Click "Run workflow"

### Build Process (Automatic)

1. GitHub Actions checks out code
2. Installs Java, Flutter, dependencies
3. Runs asset generators (launcher icons, splash screen)
4. Builds debug APK
5. Builds release APK
6. Uploads APK to Firebase App Distribution
7. Notifies testers via email

### Check Build Status

1. Go to GitHub Repository → Actions
2. See workflow runs and logs
3. Download APK artifacts if needed

---

## Workflow File Explanation

**File location:** `.github/workflows/build-and-deploy.yml`

**Key sections:**

```yaml
on:
  push:
    branches:
      - main
      - dev/farrel
    tags:
      - 'v*'
  workflow_dispatch:
```
Triggers when: push to main/dev/farrel, tag created, or manual trigger

```yaml
- name: Set up Flutter
  uses: subosito/flutter-action@v2
```
Install Flutter automatically

```yaml
- name: Deploy to Firebase App Distribution
  uses: wzieba/Firebase-Distribution-Github-Action@v1
```
Deploy APK to Firebase using service account

---

## Troubleshooting

### Build Fails: "Missing google-services.json"
- Ensure `android/app/google-services.json` is committed to repo
- GitHub Actions uses this file automatically

### Build Fails: "Invalid service account"
- Check `FIREBASE_SERVICE_ACCOUNT_JSON` secret is valid JSON
- Re-download from Firebase Console if needed

### Testers Not Getting Emails
- Check `FIREBASE_TESTERS_EMAIL` secret is comma-separated
- Verify email addresses are correct

### APK Not Uploading to Firebase
- Check `FIREBASE_APP_ID` secret is correct (format: `1:XXXX:android:YYYY`)
- Verify Firebase App Distribution is enabled in Firebase Console

---

## Security Notes

⚠️ **IMPORTANT:**

1. **Service Account Key** — Contains API keys
   - Add to `.gitignore` (never commit)
   - Store as GitHub Secret only
   - Regenerate if exposed

2. **google-services.json** — Contains Firebase config
   - Already in `.gitignore`
   - Safe to be in repo (not secret data)
   - Needed for build

3. **GitHub Secrets** — Encrypted
   - Not visible in logs
   - Not visible in workflow files
   - Only used at runtime

---

## Manual Deployment (if GitHub Actions fails)

If workflow fails, fallback to manual build:

```bash
# On your machine (or any machine with Flutter)
cd D:\Wargaja

flutter clean
flutter pub get
flutter pub run flutter_launcher_icons
flutter pub run flutter_native_splash:create
flutter build apk --release

# Then upload manually to Firebase Console:
# Firebase → App Distribution → Upload APK
```

---

## Next Steps

1. ✅ Generate Firebase Service Account JSON (Firebase Console)
2. ✅ Get Firebase App ID (Firebase Console)
3. ✅ Add 3 GitHub Secrets (GitHub Settings)
4. ✅ Commit workflow file (`.github/workflows/build-and-deploy.yml`)
5. ✅ Push to GitHub
6. **Watch GitHub Actions build automatically**
7. **Check Firebase Console for deployed APK**
8. **Testers receive email with download link**

---

## Example: First Build

```bash
# After setup complete:
git push origin dev/farrel

# GitHub Actions automatically:
# 1. Detects push
# 2. Starts workflow
# 3. Builds APK
# 4. Deploys to Firebase
# 5. Notifies testers

# Check progress:
# Go to GitHub → Actions tab → See live build logs
```

---

## Status

✅ Workflow file created: `.github/workflows/build-and-deploy.yml`  
⏳ Next: Add GitHub Secrets and push to GitHub
