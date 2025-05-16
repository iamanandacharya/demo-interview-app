import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.demonotf.myapp',
  appName: 'demo-interview-app',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
  },
}

export default config;
