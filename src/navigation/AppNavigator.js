import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from '../screens/OnboardingScreen';
import WelcomeScreen from '../screens/WelcomeScreen'; // Assuming you'll create this
import LoginScreen from '../screens/LoginScreen'; // Assuming you'll create this
import RegisterScreen from '../screens/RegisterScreen'; // Assuming you'll create this
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen} // Use WelcomeScreen as the initial screen
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen} // Add Login Screen
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen} // Add Register Screen
        options={{ headerShown: false }} // Esconde o cabeçalho nesta tela
      />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;