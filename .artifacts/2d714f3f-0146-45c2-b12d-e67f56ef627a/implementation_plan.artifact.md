# Implementation Plan - Create Android APK for Edit Flow

This plan outlines the steps to package the current TanStack Start web application into a fully functional Android APK using Capacitor.

## User Review Required

> [!IMPORTANT]
> The current project uses **TanStack Start**, which is primarily a server-side rendering (SSR) framework. Android APKs typically require a static client-side build (SPA) to function offline.
> I will attempt to configure a static build. If the app requires a backend server to function, the APK will act as a "wrapper" pointing to a hosted version of your app.

> [!WARNING]
> Building an APK requires the Android SDK and Gradle. I have verified that the Android SDK is present on this system.

## Proposed Changes

### 1. Web Project Preparation
- **[MODIFY] [package.json](file:///C:/Users/reena/OneDrive/Desktop/Edit Flow/package.json)**: Add Capacitor dependencies.
- **[NEW] [capacitor.config.ts](file:///C:/Users/reena/OneDrive/Desktop/Edit Flow/capacitor.config.ts)**: Configure Capacitor to point to the build output.
- **[NEW] [android/](file:///C:/Users/reena/OneDrive/Desktop/Edit Flow/android/)**: Initialize the Android platform.

### 2. Build Process
- Build the web application using `npm run build`.
- Sync the built assets into the Android project using `npx cap sync`.
- Generate the APK using the Android Gradle wrapper.

### 3. Testing
- Verify the APK generation.
- Provide instructions for the user to install the APK on a physical device or emulator.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure the web project is healthy.
- Run `npx cap sync` to verify asset mapping.
- Run `./gradlew assembleDebug` to verify APK creation.

### Manual Verification
- The user can find the generated APK in `android/app/build/outputs/apk/debug/app-debug.apk`.
- I will use `adb` to list connected devices and potentially install the app if a device is available.
