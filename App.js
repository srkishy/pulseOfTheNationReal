/* eslint-disable camelcase */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Righteous_400Regular,
} from '@expo-google-fonts/righteous';
import { RootSiblingParent } from 'react-native-root-siblings';
import Daily from './components/Daily';
import Menu from './components/Menu';
import HowToPlay from './components/HowToPlay';

const { Navigator, Screen } = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

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
