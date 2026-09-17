# ClearQuote React Native Sample Project

Sample React Native app showing ClearQuote SDK integration via native bridges on iOS and Android.

SDK installation guide available at this [link](https://docs.google.com/document/d/1pnm9G5rGu3A4N90RWYN44I0O5YGiaO8V8V-7zp39GKg/edit?tab=t.0)

## Requirements

### Shared
- Node.js **22.11+**
- npm or yarn
- A valid **ClearQuote SDK key**

### iOS
- macOS
- Xcode **16.1+**
- CocoaPods **1.15.2+**
- iOS **16+** simulator or device

### Android
- Android Studio with Android SDK
- JDK **17**
- **minSdk 26**, compile/target SDK **36**
- Android emulator or a connected device
- JitPack access (ClearQuote Android SDK is resolved from JitPack)

## Setup

Clone the repository and install JavaScript dependencies:

```bash
git clone https://github.com/clearquotetech/react-native-sample-project.git
cd react-native-sample-project
npm install
```

For iOS, install CocoaPods:

```bash
cd ios
pod install
cd ..
```

## Run on iOS

From the repo root:

```bash
npm run ios
```

Or:

```bash
npx react-native run-ios
```

You can also open `ios/MyApp.xcworkspace` in Xcode and run the **MyApp** scheme on a simulator or device.

## Run on Android

From the repo root, with an emulator running or a device connected:

```bash
npm run android
```

Or:

```bash
npx react-native run-android
```
