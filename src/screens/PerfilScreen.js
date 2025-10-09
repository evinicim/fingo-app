import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Feather } from '@expo/vector-icons';

import OptionItem from '../components/OptionItem';
import ProgressCard from '../components/ProgressCard';

const PerfilScreen = () => {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    ...Feather.font,
    ...AntDesign.font,
  });

  const user = {
    name: "Fulano",
    avatar: "https://via.placeholder.com/100",
    lessonsCompleted: 8,
  };

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
          <View style={styles.profileSection}>
            <Text style={styles.profileTitle}>Perfil</Text>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{user.name}</Text>
          </View>

          <ProgressCard 
            title="Progresso"
            text="Aulas concluídas"
            number={user.lessonsCompleted} 
          />

          <View style={styles.optionsList}>
            <OptionItem
              title="Notificações"
              icon={<Feather name="bell" size={24} color="#000000" />}
              onPress={() => navigation.navigate("Notifications")}
            />
            <OptionItem
              title="Privacidade"
              icon={<Feather name="shield" size={24} color="#000000" />}
              onPress={() => navigation.navigate("Privacidade")}
            />
            <OptionItem
              title="Sobre o App"
              icon={<Feather name="info" size={24} color="#000000" />}
              onPress={() => navigation.navigate("Sobre")}
            />
            <OptionItem
              title="Ajuda"
              icon={<Feather name="help-circle" size={24} color="#000000" />}
              onPress={() => navigation.navigate("Ajuda")}
            />
            <OptionItem
              title="Sair"
              icon={<Feather name="log-out" size={24} color="#FF0000" />}
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
  optionsList: {
    width: '100%',
    gap: 16,
    marginTop: 24,
  },
});

export default PerfilScreen;