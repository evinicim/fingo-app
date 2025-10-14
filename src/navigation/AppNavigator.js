import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// IMPORTAÇÕES CORRETAS DOS ÍCONES
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Importe todas as telas
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PasswordRecoveryScreen from '../screens/PasswordRecoveryScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';
import HomeScreen from '../screens/HomeScreen';
import DesafiosScreen from '../screens/DesafiosScreen';
import DesafiosHubScreen from '../screens/DesafiosHubScreen';
import HistoriaScreen from '../screens/HistoriaScreen';
import QuestaoScreen from '../screens/QuestaoScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import PerfilScreen from '../screens/PerfilScreen';
import NotificationScreen from '../screens/NotificationScreen';
import PrivacidadeScreen from '../screens/PrivacidadeScreen';
import SobreScreen from '../screens/SobreScreen';
import AjudaScreen from '../screens/AjudaScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Função para a navegação das abas inferiores
function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#17D689',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Desafios" 
        component={DesafiosHubScreen} 
        options={{
          tabBarLabel: 'Desafios',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bullseye-arrow" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen} />
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="Historia" component={HistoriaScreen} />
      <Stack.Screen name="Desafios" component={DesafiosScreen} />
      <Stack.Screen name="Questao" component={QuestaoScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="Privacidade" component={PrivacidadeScreen} />
      <Stack.Screen name="Sobre" component={SobreScreen} />
      <Stack.Screen name="Ajuda" component={AjudaScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;