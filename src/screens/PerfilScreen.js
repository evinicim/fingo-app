import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Feather } from '@expo/vector-icons';

// Importe o novo componente
import OptionItem from '../components/OptionItem';

const PerfilScreen = () => {
  const navigation = useNavigation();

  // Carregamento da fonte e dos ícones. Este é o passo crucial.
  // Adapte os nomes das fontes para o seu projeto, se precisar.
  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    ...Feather.font,
    ...AntDesign.font,
  });

  // Dados de exemplo para o perfil
  const user = {
    name: "Fulano",
    avatar: "https://via.placeholder.com/100",
    lessonsCompleted: 8,
  };

  // Se as fontes ainda não foram carregadas, exibe um carregador
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0AD58B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          {/* Seção de Perfil */}
          <View style={styles.profileSection}>
            <Text style={styles.profileTitle}>Perfil</Text>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{user.name}</Text>
          </View>

          {/* Modal de Progresso */}
          <View style={styles.progressModal}>
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>Progresso</Text>
              <Text style={styles.progressText}>Aulas concluídas</Text>
              <Text style={styles.progressNumber}>{user.lessonsCompleted}</Text>
            </View>
          </View>

          {/* Lista de Opções */}
          <View style={styles.optionsList}>
            <OptionItem
              title="Notificações"
              onPress={() => Alert.alert("Navegar para Notificações")}
            />
            <OptionItem
              title="Privacidade"
              onPress={() => Alert.alert("Navegar para Privacidade")}
            />
            <OptionItem
              title="Sobre o App"
              onPress={() => Alert.alert("Navegar para Sobre o App")}
            />
            <OptionItem
              title="Ajuda"
              onPress={() => Alert.alert("Navegar para Ajuda")}
            />
            <OptionItem
              title="Sair"
              onPress={() => Alert.alert("Navegar para Sair")}
            />
          </View>
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
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  profileTitle: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    color: '#000000',
    fontFamily: 'Outfit-Bold',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D9D9D9',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    color: '#000000',
    fontFamily: 'Outfit-Bold',
  },
  progressModal: {
    width: 249,
    height: 106,
    backgroundColor: '#F1F8FF',
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 60,
    elevation: 5,
  },
  progressContent: {
    gap: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: 'Outfit-Bold',
    color: '#000000',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    fontFamily: 'Outfit-Regular',
    color: '#000000',
  },
  progressNumber: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: 'Outfit-Bold',
    color: '#000000',
  },
  optionsList: {
    width: '100%',
    gap: 16,
    marginTop: 24,
  },
});

export default PerfilScreen;