# Asset Generators — Pre-Build Checklist

This project uses two automated asset generators that must be run **before building the APK**.

## 1. flutter_launcher_icons (Dev Dependency)

**Purpose:** Generate Android launcher icons (mipmap/ resources) and iOS app icons from source image.

**Configuration:** `pubspec.yaml` lines 75–91
- Source: `assets/icons/app_icon.png` (256x256 PNG)
- Web source: `assets/icons/app_icon_r.png` (1024x1024 PNG)
- Android profile: "app_icon"
- Generates: `android/app/src/main/res/mipmap-*/app_icon.png` (multiple densities)

**Run before build:**
```bash
flutter pub run flutter_launcher_icons
```

**Status:** Configuration verified. Wargaja logo SVG source at `assets/icons/wargaja_logo.svg` and PNG resources updated.

---

## 2. flutter_native_splash (Dependency)

**Purpose:** Generate native splash screen images and configure Android 12+ splash screen.

**Configuration:** `pubspec.yaml` lines 93–101
- Source image: `assets/icons/app_icon.png`
- Background color: `#2563EB` (Wargaja primary blue)
- Generates: Android 12+ splash screen resources and native configuration

**Run before build:**
```bash
flutter pub run flutter_native_splash:create
```

**Status:** Configuration verified. Color updated to blue (#2563EB) per Wargaja branding.

---

## 3. Localization Generator (Built-in)

**Purpose:** Regenerate Dart localization files from `.arb` source files.

**Configuration:** `pubspec.yaml` line 65 (`generate: true`)
- Sources: `lib/l10n/app_*.arb` (English, Indonesian, Javanese)
- Generates: `lib/l10n/app_localizations*.dart` (auto-generated, do not edit)

**Run during build (automatic):**
```bash
flutter gen-l10n
```

**Status:** ARB files updated with Wargaja branding. Localization generation is automatic on build.

---

## Summary

✓ Logo assets (SVG + PNG) finalized and ready
✓ Splash screen config updated to Wargaja blue
✓ Launcher icon config ready to generate mipmap resources
✓ Localization strings ready for regeneration

**Before building APK, ensure:**
1. Run `flutter pub get` to restore dependencies
2. Run `flutter pub run flutter_launcher_icons` to generate launcher icons
3. Run `flutter pub run flutter_native_splash:create` to generate splash resources
4. Build will automatically regenerate localization files
5. Verify `android/app/src/main/res/mipmap-*/` directory contains generated icon files
