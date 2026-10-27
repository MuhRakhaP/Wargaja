# 🚀 QUICK START — Wargaja Deploy in 5 Steps

## Step 1: GitHub Secrets (5 min)

Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Click **New repository secret** 3x:

### Secret 1: FIREBASE_SERVICE_ACCOUNT_JSON
- Value: Open downloaded JSON from Firebase Console
- Copy ALL content (entire JSON object)
- Paste into secret value

### Secret 2: FIREBASE_APP_ID
- Value: `1:123456789:android:abcdef1234567890`
- (Get from Firebase Console → Your Android App)

### Secret 3: FIREBASE_TESTERS_EMAIL
- Value: `tester1@email.com,tester2@email.com`
- (Comma-separated, no spaces)

---

## Step 2: Push Code (1 min)

```bash
cd D:\Wargaja
git push origin dev/farrel
```

---

## Step 3: Watch Build (5-8 min)

1. Go to **GitHub Repo → Actions tab**
2. See workflow running: "Build & Deploy to Firebase"
3. Click to watch live logs
4. Wait for ✅ Success

---

## Step 4: Verify Deployment (1 min)

Check Firebase Console:
- **Firebase → App Distribution**
- See new APK uploaded
- See tester email list

---

## Step 5: Testers Download (instant)

Testers receive email:
- Subject: "New build of Wargaja available"
- Link: Click to download APK
- Install: Follow Firebase instructions

---

## ✅ Done! 

Your Wargaja app is live with:
- ✅ Blue branding theme
- ✅ Professional logo
- ✅ Firebase backend
- ✅ ONNX ML inference
- ✅ Auto CI/CD pipeline

---

## If Build Fails

1. Check GitHub Actions logs (full error message)
2. Likely cause: Missing/wrong GitHub Secret
3. Fix secret
4. Push again (workflow auto-retries)

---

## Troubleshooting Secrets

| Error | Fix |
|-------|-----|
| "Secrets not found" | Ensure exactly 3 secrets added |
| "Invalid JSON" | Copy entire google-services.json content |
| "App ID mismatch" | Verify FIREBASE_APP_ID is correct format |
| "Testers not emailed" | Check emails are comma-separated |

---

## Key Files

**Workflow:** `.github/workflows/build-and-deploy.yml`  
**Config:** `android/app/build.gradle.kts` (package ID)  
**Branding:** `lib/theme/app_colors.dart` (blue #2563EB)  
**Firebase:** `android/app/google-services.json` (in .gitignore)

---

## Reference Docs

- `README_DEPLOYMENT.md` — Full guide
- `GITHUB_ACTIONS_VISUAL_GUIDE.md` — Visual workflow
- `GITHUB_ACTIONS_SETUP.md` — Detailed setup
- `FIREBASE_PACKAGE_ID_SETUP.md` — Firebase guide

---

## Support

Questions? Check documentation files or GitHub Actions logs.

**Status:** ✅ Ready to deploy  
**Next:** Add GitHub Secrets → Push → Done! 🎉
