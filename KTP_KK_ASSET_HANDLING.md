# KTP/KK Asset Exclusion for Release Builds

## Current Status

**Assets are currently declared in `pubspec.yaml`:**
```yaml
assets:
  - assets/
  - assets/kk/
  - assets/ktp/
```

**Risk:** KTP/KK demo files (containing personal ID imagery) **WILL be bundled into release APK** if no exclusion is configured.

---

## Solution 1: Remove from pubspec.yaml (if demo data not needed)

Edit `pubspec.yaml` lines 69–70 and delete:
```yaml
- assets/kk/
- assets/ktp/
```

**Consequence:** Demo resident data will fail to load KTP/KK images. Code references to `ktpUrl` and `kkUrl` will receive empty strings.

**When to use:** If demo data is not needed in production, or if images should be loaded from Firestore/network only.

---

## Solution 2: Move to separate assets/ directory and exclude from release build

1. Create `assets/demo/kk/` and `assets/demo/ktp/` directories
2. Move KTP/KK files there
3. Update `resident.dart` to reference `assets/demo/ktp/ktp_$i.png`
4. Remove `assets/kk/` and `assets/ktp/` from pubspec.yaml
5. Add to `android/app/build.gradle.kts`:

```kotlin
android {
    // ... existing config ...
    
    packagingOptions {
        resources {
            excludes += ['assets/demo/**']
        }
    }
}
```

**Consequence:** Demo assets excluded from APK but still in repository for testing.

---

## Solution 3: Keep in repo but exclude via .gitignore-style packaging

Use Android resource exclusion in release build variant (requires more complex Gradle setup).

---

## Current Implementation

**Safe placeholders created:** KTP/KK files replaced with synthetic, non-personal placeholder PNGs.
- `assets/ktp/ktp_*.png`: 877 bytes each (generic placeholder)
- `assets/kk/kk_*.png`: 681 bytes each (generic placeholder)

**Risk Reduced:** Images no longer contain real personal data, but file sizes still indicate they are demo/placeholder assets.

---

## Recommendation

**Option 1 is simplest:** Remove KTP/KK entries from pubspec.yaml if production app loads documents from Firestore/Firebase Storage (actual resident data, not demo files).

**Track as separate task** post-branding to finalize asset handling based on production requirements.
