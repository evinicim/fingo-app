import React from 'react';
import { View } from 'react-native';
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
        tabBarActiveTintColor: '#FBBF24',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginBottom: 6,
        },
        tabBarStyle: {
          backgroundColor: '#0B1224',
          borderTopWidth: 0,
          paddingVertical: 8,
          height: 70,
          shadowColor: '#22D3EE',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarActiveTintColor: '#18AD77',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? 'rgba(251, 191, 36, 0.18)' : 'rgba(148, 163, 184, 0.12)',
                padding: 6,
                borderRadius: 14,
                borderWidth: focused ? 1 : 0,
                borderColor: focused ? 'rgba(251, 191, 36, 0.5)' : 'transparent',
              }}
            >
              <MaterialIcons name="home" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Desafios"
        component={DesafiosHubScreen}
        options={{
          tabBarLabel: 'Desafios',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? 'rgba(56, 189, 248, 0.18)' : 'rgba(148, 163, 184, 0.12)',
                padding: 6,
                borderRadius: 14,
                borderWidth: focused ? 1 : 0,
                borderColor: focused ? 'rgba(56, 189, 248, 0.5)' : 'transparent',
              }}
            >
              <MaterialCommunityIcons name="bullseye-arrow" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? 'rgba(52, 211, 153, 0.18)' : 'rgba(148, 163, 184, 0.12)',
                padding: 6,
                borderRadius: 14,
                borderWidth: focused ? 1 : 0,
                borderColor: focused ? 'rgba(52, 211, 153, 0.5)' : 'transparent',
              }}
            >
              <MaterialIcons name="person" size={size} color={color} />
            </View>
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