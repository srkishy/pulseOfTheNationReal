/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Righteous_400Regular,
} from '@expo-google-fonts/righteous';
import { RootSiblingParent } from 'react-native-root-siblings';
import { requestTrackingPermissionsAsync, getTrackingPermissionsAsync } from 'expo-tracking-transparency';
import Daily from './components/Daily';
import Menu from './components/Menu';
import HowToPlay from './components/HowToPlay';

const { Navigator, Screen } = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    const updateTrackingStatus = async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === 'granted') {
        console.log('tracking granted');
      }
    };

    // Ready to check the permission now
    if (AppState.currentState === 'active') {
      updateTrackingStatus(AppState.currentState);
    } else {
      // Need to wait until the app is ready before checking the permission
      const subscription = AppState.addEventListener('change', updateTrackingStatus);

      // eslint-disable-next-line consistent-return
      return () => {
        subscription.remove();
      };
    }
  }, [AppState.currentState]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Navigator>
          <Screen name="Menu" option={{ title: 'Home' }} component={Menu} />
          <Screen name="Daily" component={Daily} />
          <Screen name="HowToPlay" component={HowToPlay} options={{ title: 'How to play' }} />
        </Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
}
