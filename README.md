# 🚗 ClearQuote React Native Sample Project

This repository contains a **sample React Native application** demonstrating how to integrate the **ClearQuote SDK** into a React Native project.

The project serves as a **reference implementation** for third-party developers who want to integrate ClearQuote’s native SDKs into their React Native apps.

---

## 📱 Supported Platforms

- **iOS** — ClearQuote iOS SDK integrated via native bridge
- **Android** — ClearQuote Android SDK **3.1.0** integrated via native bridge
- React Native **0.76+** (New Architecture compatible)
- Tested on **iOS 16+**

---

## 🧰 Prerequisites

### Shared
- Node.js **22.11+**
- React Native **0.76+**
- React Native CLI
- Valid **ClearQuote SDK key**

### iOS
- macOS
- Xcode **16.1+**
- CocoaPods **1.15.2+**

### Android
- Android Studio with Android SDK
- **minSdk 26**, compile/target SDK **36**
- JDK **17**
- JitPack access (ClearQuote Android SDK is resolved from JitPack)

---

## 📦 Project Setup

### Clone the repository
```bash
git clone https://github.com/clearquotetech/react-native-sample-project.git
cd react-native-sample-project
```

### Install JS dependencies
```bash
npm install
# or
yarn install
```

---

## 🍎 iOS

### Install dependencies
```bash
cd ios
pod install
cd ..
open ios/MyApp.xcworkspace
```

### Required permissions
Add the following to `ios/MyApp/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>For capturing vehicle images</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>App needs your location while using the app to capture inspection locations and sync your inspections</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>App needs your location while using the app to capture inspection locations and sync your inspections</string>
```

### TensorFlowLite Info.plist run script

The ClearQuote iOS SDK depends on TensorFlow Lite (`kewlbear/TensorFlowLiteC` via SPM). Those binary frameworks omit App Store–required Info.plist keys, which can fail App Store validation (`ITMS-90057` / `ITMS-90530`).

This sample already includes an Xcode **Run Script** build phase named **Fix TensorFlowLite Info.plists**. It patches `CFBundleShortVersionString` and `MinimumOSVersion` on TensorFlowLiteC frameworks (SPM artifacts and copies embedded in the app) and re-signs them.

When integrating into your own app, add the same run script to the app target (Build Phases → + → New Run Script Phase). Keep it **after** Embed Frameworks so it can patch the embedded copies.

### Run the app
```bash
npm run ios
# or
npx react-native run-ios
```

### Native bridge
The iOS native bridge (`ClearQuoteModule`) exposes ClearQuote SDK methods to React Native:

| Method | Description |
|--------|-------------|
| `initSDK(key)` | Initialize the SDK with your key |
| `startInspection(clientAttrs, inputDetails, userFlowParams)` | Start a vehicle inspection |
| `logout()` | Log out and clear session |
| `getDealerCode()` | Return the current dealer code |
| `isSDKInitialized()` | Check whether the SDK is initialized |

---

## 🤖 Android

ClearQuote Android SDK **3.1.0** is integrated via a Kotlin native module (`ClearQuoteModule`) that matches the iOS bridge API used by [`src/ClearQuoteSDK.ts`](src/ClearQuoteSDK.ts).

### Gradle

The SDK is pulled from JitPack. [`android/settings.gradle`](android/settings.gradle) includes:

```gradle
maven { url = uri("https://jitpack.io") }
```

[`android/app/build.gradle`](android/app/build.gradle) declares:

```gradle
implementation("com.github.clearquotetech:cq-android-sdk:3.1.0")
implementation(platform("com.google.firebase:firebase-bom:33.16.0"))
implementation("com.google.firebase:firebase-analytics-ktx")
```

Firebase Analytics is a transitive SDK dependency. This sample applies the Google Services plugin and ships [`android/app/google-services.json`](android/app/google-services.json) for application ID `io.clearquote.clearquote_sdk_demo_app` (same as [ClearQuote-Android-SDK-Demo-app](https://github.com/clearquotetech/ClearQuote-Android-SDK-Demo-app)). Replace that file with your own Firebase Android app config before production use.

### Required permissions and FileProvider

The sample manifest includes camera, location, network, notifications, foreground-service, and storage permissions. It also registers a `FileProvider` with authority `${applicationId}.provider` and paths in `android/app/src/main/res/xml/file_paths.xml` (`ClearQuote/Images`, `ClearQuote/Videos`).

### Run the app
```bash
npm run android
# or
npx react-native run-android
```

### Native bridge

The Android native bridge (`ClearQuoteModule`) exposes the same methods as iOS:

| Method | Description |
|--------|-------------|
| `initSDK(key)` | Initialize the SDK with your key |
| `startInspection(clientAttrs, inputDetails, userFlowParams)` | Start a vehicle inspection |
| `logout()` | Log out and clear session |
| `manualOfflineSync()` | Trigger offline inspection sync |
| `getDealerCode()` | Return the current dealer code |
| `getSDKVersion()` | Return the native SDK version string |
| `isSDKInitialized()` | Check whether the SDK is initialized |

Inspection completion is emitted as the `inspectionCompletionStatus` event (listen via `ClearQuoteSDK.addInspectionCompletionListener`).

---

## 🧪 Sample Usage
```js
import { ClearQuoteSDK } from './src/ClearQuoteSDK';

await ClearQuoteSDK.initSDK('YOUR_SDK_KEY');
await ClearQuoteSDK.startInspection(clientAttrs, inputDetails, userFlowParams);
```

Additional ClearQuoteSDK APIs can be exposed through the native bridge as needed. See the [ClearQuote iOS SDK integration guide](https://docs.google.com/document/d/1eqHUg3L7mqA4E8vqslzpLoqoC_8qxv7wTUn_JneKQmY/edit?tab=t.0#heading=h.7jb0pjtyuhqy) AND [ClearQuote SDK Android integration doc](https://docs.google.com/document/d/1qaoIRasNhM7pLG6hKX2aLnKaZr35R-_8GSMnZpDO9Sw/edit?tab=t.0#heading=h.7jb0pjtyuhqy). for the full list of supported methods.

---

## 📬 Support

- https://github.com/clearquotetech/cq-ios-sdk/issues
- sharath@clearquote.io
- rajappa@clearquote.io
- akhila@clearquote.io

---

## 📜 License
For reference and integration purposes only.
