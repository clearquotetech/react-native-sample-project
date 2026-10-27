# ClearQuote React Native Sample Project

Sample React Native app for the ClearQuote SDK.

> **CQ-iOS-SDK Integration document:** [ClearQuoteSDK ReactNative Integration guide.pdf](./ClearQuoteSDK%20ReactNative%20Integration%20guide.pdf)

---

## 🧰 Prerequisites

### Shared
- Node.js **22.11+**
- React Native **0.76+**
- React Native CLI

### iOS
- macOS
- Xcode **27+**
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

### Resolve the ClearQuote iOS SDK
`cq-ios-sdk` is a Swift package. Open the workspace in Xcode so it can download and resolve the package:

```bash
open ios/MyApp.xcworkspace
```

Wait for Xcode to finish resolving packages before you build. If resolution does not start on its own, use **File → Packages → Resolve Package Versions**.

### Run the app
```bash
npm run ios
```

Or:

```bash
npx react-native run-ios
```

---

## 🤖 Android

> ⚠️ **Status: Implementation pending**
>
> ClearQuote Android SDK integration is **not implemented yet**. The React Native app shell can still be started with:
>
> ```bash
> npm run android
> # or
> npx react-native run-android
> ```
