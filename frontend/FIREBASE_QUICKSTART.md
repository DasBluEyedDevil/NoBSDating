# Firebase Quick Start for Developers

## TL;DR

Firebase is **optional for development** but **required for production**. The app will run without Firebase configuration.

## Quick Setup (5 minutes)

### Option 1: Using FlutterFire CLI (Recommended)

```bash
# Install FlutterFire CLI (one-time)
dart pub global activate flutterfire_cli

# Add to PATH if needed
# Windows: Add %APPDATA%\Pub\Cache\bin to PATH
# macOS/Linux: Add ~/.pub-cache/bin to PATH

# Configure Firebase
cd frontend
flutterfire configure

# Install dependencies
flutter pub get

# Run the app
flutter run
```

### Option 2: Skip Firebase (Development Only)

```bash
cd frontend
flutter pub get
flutter run
```

You'll see this message in console:
```
Firebase initialization failed: ...
App will continue without crash reporting.
To enable Firebase, follow instructions in FIREBASE_SETUP.md
```

**This is normal and expected** - the app will work fine without Firebase during development.

## What's Included

- **firebase_core**: Core Firebase SDK
- **firebase_crashlytics**: Crash reporting (disabled in debug mode)
- **firebase_analytics**: Analytics and event tracking

## Environment Behavior

### Debug Mode (Development)
- Firebase initialization is attempted but failures are gracefully handled
- Crashlytics does NOT send crash reports
- Console logging shows Firebase status
- App continues normally if Firebase is not configured

### Release Mode (Production)
- Firebase should be properly configured
- Crashlytics sends crash reports automatically
- Analytics tracks user behavior
- App still functions if Firebase initialization fails (with warnings)

## When Do I Need Firebase?

### You DON'T need Firebase if:
- Running app locally for development
- Testing features unrelated to crash reporting
- Making UI changes
- Running unit/widget tests

### You DO need Firebase if:
- Testing crash reporting
- Testing analytics
- Building release builds
- Deploying to TestFlight/App Store/Play Store

## Full Setup Instructions

See [FIREBASE_SETUP.md](../FIREBASE_SETUP.md) in the project root for complete configuration instructions.

## Troubleshooting

### "No Firebase App has been created"
This is expected if Firebase is not configured. The app will continue to work.

### Build errors on Android
If you get build errors related to Firebase, ensure:
1. You have run `flutter pub get` after adding dependencies
2. Your Android build.gradle files are up to date
3. Or skip Firebase configuration for now (app will work without it)

### Build errors on iOS
If you get build errors on iOS:
1. Run `cd ios && pod install && cd ..`
2. Or skip Firebase configuration for now

## Questions?

See full documentation in [FIREBASE_SETUP.md](../FIREBASE_SETUP.md) at project root.
