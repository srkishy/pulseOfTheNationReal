import 'dotenv/config';

const {
  REACT_APP_TRENDS_URL,
  REACT_APP_SCORE_URL,
  REACT_APP_AD_MOB_IOS_1,
  REACT_APP_AD_MOB_IOS_2,
  REACT_APP_AD_MOB_IOS_3,
  REACT_APP_AD_MOB_IOS_4,
  REACT_APP_AD_MOB_IOS_5,
  REACT_APP_AD_MOB_ANDROID_1,
  REACT_APP_AD_MOB_ANDROID_2,
  REACT_APP_AD_MOB_ANDROID_3,
  REACT_APP_AD_MOB_ANDROID_4,
  REACT_APP_AD_MOB_ANDROID_5,
  REACT_APP_AD_MOB_IOS_HOWTO,
  REACT_APP_AD_MOB_ANDROID_HOWTO,
  REACT_APP_AD_MOB_IOS_MENU,
  REACT_APP_AD_MOB_ANDROID_MENU,
  REACT_APP_AD_MOB_IOS_GAMEOVER,
  REACT_APP_AD_MOB_ANDROID_GAMEOVER,
} = process.env;

export default {
  expo: {
    name: 'pulseOfTheNationReal',
    slug: 'pulseOfTheNationReal',
    version: '1.2.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    plugins: [
      [
        'expo-tracking-transparency',
        {
          userTrackingPermission: 'This identifier will be used to deliver personalized ads to you.',
        }
      ]
    ],
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      config: {
        googleMobileAdsAppId: 'ca-app-pub-1180387175519228~1781854911'
      },
      bundleIdentifier: 'com.srkishy.pulseOfTheNationReal',
      buildNumber: '1.2.0'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      config: {
        googleMobileAdsAppId: 'ca-app-pub-1180387175519228~5652833078'
      },
      package: 'com.srkishy.pulseOfTheNationReal',
      versionCode: 15
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      REACT_APP_TRENDS_URL,
      REACT_APP_SCORE_URL,
      REACT_APP_AD_MOB_IOS_1,
      REACT_APP_AD_MOB_IOS_2,
      REACT_APP_AD_MOB_IOS_3,
      REACT_APP_AD_MOB_IOS_4,
      REACT_APP_AD_MOB_IOS_5,
      REACT_APP_AD_MOB_ANDROID_1,
      REACT_APP_AD_MOB_ANDROID_2,
      REACT_APP_AD_MOB_ANDROID_3,
      REACT_APP_AD_MOB_ANDROID_4,
      REACT_APP_AD_MOB_ANDROID_5,
      REACT_APP_AD_MOB_IOS_HOWTO,
      REACT_APP_AD_MOB_ANDROID_HOWTO,
      REACT_APP_AD_MOB_IOS_MENU,
      REACT_APP_AD_MOB_ANDROID_MENU,
      REACT_APP_AD_MOB_IOS_GAMEOVER,
      REACT_APP_AD_MOB_ANDROID_GAMEOVER,
    }
  }
};
