// screens/NotificationScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

// Importe o novo componente
import NotificationItem from '../components/NotificationItem';
// Importe seu componente da barra de navegação, se existir
// import BottomBar from '../components/BottomBar'; 

const NotificationScreen = () => {
  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0AD58B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificação</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContainer}>
          <NotificationItem title="Desafios diários" />
          <NotificationItem title="Lembrete de estudos" />
          <NotificationItem title="Novos módulos liberados" />
        </View>
        <View style={styles.divider} />
        <View style={styles.listContainer}>
          <NotificationItem title="Badges e prêmios" />
          <NotificationItem title="Progresso semanal" />
        </View>
      </ScrollView>
      {/* <BottomBar /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 32,
    lineHeight: 40,
    color: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  listContainer: {
    gap: 16,
    marginTop: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 24,
    marginHorizontal: 16,
  },
});

export default NotificationScreen;