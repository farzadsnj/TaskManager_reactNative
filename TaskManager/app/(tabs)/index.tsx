import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../src/screens/LoginScreen";
import SignUpScreen from "../../src/screens/SignUpScreen";
import TaskScreen from "../../src/screens/TaskScreen";
import SplashScreen from "../../components/SplashScreen";
import AboutScreen from "../../src/screens/AboutScreen";
import SettingsScreen from "../../src/screens/SettingsScreen";
import ForgetPasswordScreen from "../../src/screens/ForgetPasswordScreen";
import ResetPasswordScreen from "../../src/screens/ResetPasswordScreen";
import { FontSizeProvider } from "../../src/contexts/FontSizeContext";
import ErrorBoundary from "../../src/contexts/ErrorBoundary";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsReady(true);
    };

    prepare();
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <ErrorBoundary>
      <FontSizeProvider>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Tasks" component={TaskScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="ForgetPassword"
            component={ForgetPasswordScreen}
          />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Navigator>
      </FontSizeProvider>
    </ErrorBoundary>
  );
}
