# GitHub Actions Workflow — Visual Guide

## How It Works: Step-by-Step

```
┌─────────────────────────────────────────────────────────────────┐
│ YOU: Push code to GitHub                                        │
│ $ git push origin dev/farrel                                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ GITHUB: Detects push to dev/farrel                              │
│ → Triggers: build-and-deploy.yml workflow                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ GITHUB ACTIONS: Spins up Ubuntu runner (cloud machine)          │
│ → Installs: Java 17, Flutter SDK, Android SDK                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ BUILD: Compiles APK                                             │
│ → flutter pub get                                               │
│ → flutter pub run flutter_launcher_icons                        │
│ → flutter pub run flutter_native_splash:create                  │
│ → flutter build apk --debug                                     │
│ → flutter build apk --release                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ DEPLOY: Upload to Firebase App Distribution                     │
│ → Firebase Service Account authenticates                        │
│ → APK uploaded: app-release.apk                                 │
│ → Release notes attached                                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ NOTIFY: Send emails to testers                                  │
│ → Each tester receives: Download link + release notes           │
│ → Testers click link → Download APK from Firebase               │
│ → Install on device                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Timeline: Push to Deployment

| Step | Action | Time | Status |
|------|--------|------|--------|
| 1 | You push code | 0 sec | 🟢 You do this |
| 2 | GitHub detects push | +5 sec | 🟡 Automatic |
| 3 | Workflow starts | +10 sec | 🟡 Setup environment |
| 4 | Install dependencies | +30 sec | 🟡 Java, Flutter |
| 5 | Build debug APK | +2 min | 🟡 Compile |
| 6 | Build release APK | +3 min | 🟡 Compile optimized |
| 7 | Upload to Firebase | +1 min | 🟡 Deploy |
| 8 | Notify testers | +1 min | 🟢 Testers get email |
| **Total** | **Complete** | **~7-8 min** | ✅ Live |

---

## Monitoring the Build

### Option 1: GitHub Actions UI (Recommended)

1. Go to your GitHub repo
2. Click **Actions** tab
3. See list of workflow runs
4. Click latest run to view logs

**Log sections:**
- ✅ Set up job
- ✅ Checkout code
- ✅ Set up Java
- ✅ Set up Flutter
- ✅ Get dependencies
- ✅ Run asset generators
- ✅ Build APK (Debug)
- ✅ Build APK (Release)
- ✅ Upload APK artifacts
- ✅ Deploy to Firebase App Distribution
- ✅ Complete job

### Option 2: Email Notification

GitHub sends you email when workflow:
- ✅ Starts
- ✅ Completes (success or failure)

---

## What Testers See

### Email Notification
```
Subject: New build of Wargaja available in Firebase App Distribution

Hi Testers,

A new version of Wargaja is ready to test.

🔗 DOWNLOAD: [Link to Firebase App Distribution]

Release Notes:
Wargaja build from GitHub Actions

Device Requirements:
- Android 5.0+ (API 21+)
- ~50 MB storage

Questions? Contact the team.
```

### Firebase App Distribution Link
- One-click download
- No Google Play account needed
- Easy install instructions
- App updates automatically via Firebase

---

## Troubleshooting: Build Failed

### Scenario 1: "Missing GitHub Secrets"

**Error in logs:** `FIREBASE_SERVICE_ACCOUNT_JSON is not set`

**Fix:**
1. Go to GitHub repo → Settings → Secrets
2. Add missing secret
3. Retry workflow (or push new code)

### Scenario 2: "Invalid Firebase App ID"

**Error in logs:** `App not found in Firebase project`

**Fix:**
1. Verify `FIREBASE_APP_ID` matches Firebase Console
2. Ensure app is registered for `com.wargaja.app` package
3. Update secret in GitHub
4. Retry workflow

### Scenario 3: "Build fails in Flutter"

**Error in logs:** `Failed to build APK`

**Common causes:**
- Missing google-services.json
- Package ID mismatch
- Asset generator failure
- Dart syntax error

**Fix:**
1. Check full error message in logs
2. Run locally to debug: `flutter build apk --release`
3. Fix issue in code
4. Push to GitHub (workflow retries)

---

## Manual Retry

If build fails and you want to retry without new code:

1. GitHub Actions → Latest run
2. Click **Re-run all jobs**
3. Workflow runs again with same code

---

## Viewing Build Artifacts

After build completes (success or failure):

1. GitHub Actions → Latest run
2. Scroll to **Artifacts** section
3. Download APK files:
   - app-debug.apk (for testing)
   - app-release.apk (for production)

**Retention:** 30 days (then auto-deleted)

---

## Disabling Auto-Deploy (Optional)

If you want to build but NOT deploy to Firebase:

Edit `.github/workflows/build-and-deploy.yml`:

```yaml
# Comment out this section:
# - name: Deploy to Firebase App Distribution
#   uses: wzieba/Firebase-Distribution-Github-Action@v1
#   ...
```

Then APK will only be available as artifact, not sent to Firebase.

---

## Advanced: Trigger Manually

Go to GitHub Actions tab:

1. Click **Build & Deploy to Firebase**
2. Click **Run workflow**
3. Select branch (dev/farrel or main)
4. Click **Run workflow**

This triggers build without pushing code (useful for rebuilding same version).

---

## Checklist Before First Push

- [ ] Commit created: `git commit -m "..."`
- [ ] GitHub Secrets added (3 secrets)
- [ ] Workflow file: `.github/workflows/build-and-deploy.yml` exists
- [ ] google-services.json in `.gitignore`
- [ ] google-services.json in `android/app/`
- [ ] Ready to push: `git push origin dev/farrel`

---

## Key Takeaway

**You code locally → Push to GitHub → GitHub Actions builds cloud → Firebase deploys → Testers get email**

No Android Studio needed. No local SDK needed. Everything automated.

🎉 **Enjoy CI/CD!**
