// screens/NotificationScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

// Importe o novo componente
import NotificationItem from '../components/NotificationItem';
import { buscarDadosPerfil, atualizarDadosPerfil } from '../services/userService';
import { auth } from '../services/firebaseConfig';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    desafiosDiarios: false,
    lembreteEstudos: false,
    novosModulos: false,
    badgesPremios: false,
    progressoSemanal: false,
  });
  
  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  // Carregar preferências ao montar o componente
  useEffect(() => {
    carregarPreferencias();
  }, []);

  const carregarPreferencias = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        Alert.alert('Erro', 'Usuário não autenticado');
        navigation.goBack();
        return;
      }

      const resultado = await buscarDadosPerfil(userId);
      
      if (resultado.success && resultado.data.notificationPreferences) {
        setPreferences(resultado.data.notificationPreferences);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };

    setPreferences(newPreferences);

    try {
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      await atualizarDadosPerfil(userId, {
        notificationPreferences: newPreferences,
      });
      
      console.log('✅ Preferências de notificação atualizadas');
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      Alert.alert('Erro', 'Não foi possível salvar as preferências');
      
      // Reverter mudança em caso de erro
      setPreferences(preferences);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0AD58B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificação</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContainer}>
          <NotificationItem 
            title="Desafios diários" 
            value={preferences.desafiosDiarios}
            onValueChange={() => handleToggle('desafiosDiarios')}
          />
          <NotificationItem 
            title="Lembrete de estudos" 
            value={preferences.lembreteEstudos}
            onValueChange={() => handleToggle('lembreteEstudos')}
          />
          <NotificationItem 
            title="Novos módulos liberados" 
            value={preferences.novosModulos}
            onValueChange={() => handleToggle('novosModulos')}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.listContainer}>
          <NotificationItem 
            title="Badges e prêmios" 
            value={preferences.badgesPremios}
            onValueChange={() => handleToggle('badgesPremios')}
          />
          <NotificationItem 
            title="Progresso semanal" 
            value={preferences.progressoSemanal}
            onValueChange={() => handleToggle('progressoSemanal')}
          />
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 24,
    lineHeight: 30,
    color: '#000000',
  },
  placeholder: {
    width: 40,
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