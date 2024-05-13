import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../src/screens/LoginScreen';
import SignUpScreen from '../../src/screens/SignUpScreen';
import TaskScreen from '../../src/screens/TaskScreen';
import Splash from '../../components/SplashScreen.jsx';
import AboutScreen from '../../src/screens/AboutScreen';
import SettingsScreen from '../../src/screens/SettingsScreen';
import { FontSizeProvider } from '../../src/contexts/FontSizeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      // Simulate a splash screen delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      setIsReady(true);
    };

    prepare();
  }, []);

  if (!isReady) {
    return <Splash />;
  }

  return (
    <FontSizeProvider>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Tasks" component={TaskScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
    </FontSizeProvider>
  );
}
