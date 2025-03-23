
// This is a guide for deploying the app to iOS and Android using Capacitor

export const mobileDeploymentGuide = {
  setupInstructions: `
    # Mobile App Deployment Guide
    
    This app can be deployed to iOS and Android using Capacitor, a cross-platform native runtime.
    
    ## Prerequisites
    
    - Node.js installed on your development machine
    - For iOS: Mac with Xcode installed
    - For Android: Android Studio installed
    
    ## Step 1: Install Capacitor
    
    \`\`\`bash
    npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
    \`\`\`
    
    ## Step 2: Initialize Capacitor
    
    \`\`\`bash
    npx cap init "CILS B2 Cittadinanza" "com.cilsb2.app" --web-dir build
    \`\`\`
    
    ## Step 3: Build the web app
    
    \`\`\`bash
    npm run build
    \`\`\`
    
    ## Step 4: Add platforms
    
    \`\`\`bash
    npx cap add ios
    npx cap add android
    \`\`\`
    
    ## Step 5: Sync the web code to the native projects
    
    \`\`\`bash
    npx cap sync
    \`\`\`
    
    ## Step 6: Open the native IDEs
    
    \`\`\`bash
    npx cap open ios     # Opens Xcode for iOS
    npx cap open android # Opens Android Studio for Android
    \`\`\`
    
    ## Step 7: Publishing to App Stores
    
    ### iOS
    1. Configure app signing in Xcode
    2. Set up app metadata in App Store Connect
    3. Archive and upload build from Xcode
    
    ### Android
    1. Generate signed APK/App Bundle in Android Studio
    2. Set up app metadata in Google Play Console
    3. Upload build to Google Play Console
    
    ## Monetization
    
    ### In-App Purchases
    - Configure products in App Store Connect and Google Play Console
    - Implement IAP using a library like capacitor-store or RevenueCat
    
    ### Subscriptions
    - Set up subscription products in the app stores
    - Use a subscription management service like RevenueCat
    
    ### Advertisements
    - Integrate an ad network like AdMob, Facebook Audience Network, or Unity Ads
    - Use capacitor plugins like @capacitor-community/admob
  `,
  
  capacitorConfig: {
    appId: "com.cilsb2.app",
    appName: "CILS B2 Cittadinanza",
    webDir: "build",
    bundledWebRuntime: false,
    plugins: {
      SplashScreen: {
        launchShowDuration: 3000
      }
    }
  },
  
  adImplementationGuide: `
    # Implementing Ads in Your Mobile App
    
    ## Step 1: Choose an Ad Network
    
    Popular options include:
    - Google AdMob
    - Facebook Audience Network
    - Unity Ads
    
    ## Step 2: Install Required Plugins
    
    For AdMob:
    \`\`\`bash
    npm install @capacitor-community/admob
    \`\`\`
    
    ## Step 3: Initialize the Ad SDK
    
    \`\`\`typescript
    import { AdMob } from '@capacitor-community/admob';
    
    // Initialize AdMob
    AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['DEVICE_ID'],
      initializeForTesting: true,
    });
    \`\`\`
    
    ## Step 4: Create Ad Components
    
    Create components for different ad formats:
    - Banner ads
    - Interstitial ads
    - Rewarded ads
    
    ## Step 5: Implement Ad Display Logic
    
    Display ads at appropriate times:
    - Banner ads: Continuous display
    - Interstitial ads: Between screens or activities
    - Rewarded ads: After completing tasks
    
    ## Step 6: Set Up Ad Revenue Tracking
    
    Integrate analytics to track ad performance and revenue.
  `
};

export default mobileDeploymentGuide;
