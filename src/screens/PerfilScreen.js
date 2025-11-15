import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';

import OptionItem from '../components/OptionItem';
import ProgressCard from '../components/ProgressCard';
import { buscarDadosPerfil } from '../services/userService';
import { auth } from '../services/firebaseConfig';
import { getTrilhasWithUnlockStatus, getUserStats } from '../services/progressService';

const PerfilScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    trilhasConcluidas: 0,
    totalTrilhas: 0,
    questoesCompletadas: 0,
    progressoTotal: 0,
  });

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    ...Feather.font,
  });

  // Função para carregar dados do usuário
  const carregarDadosUsuario = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        Alert.alert('Erro', 'Usuário não autenticado');
        navigation.navigate('Login');
        return;
      }

      // Buscar dados do perfil
      const resultado = await buscarDadosPerfil(userId);
      
      if (resultado.success) {
        setUserData(resultado.data);
        
        // Estatísticas dinâmicas
        const stats = await getUserStats();
        const trilhasComStatus = await getTrilhasWithUnlockStatus();
        const progressoTotal = trilhasComStatus.length
          ? Math.round(trilhasComStatus.reduce((acc, t) => acc + t.progresso, 0) / trilhasComStatus.length)
          : 0;

        setProgressData({
          trilhasConcluidas: stats.trilhasConcluidas,
          totalTrilhas: stats.totalTrilhas,
          questoesCompletadas: stats.questoesRespondidas,
          progressoTotal,
        });
        // Atualiza campos exibidos
        setUserData((prev) => ({ ...(prev || {}), xp: stats.xp, nivel: stats.level }));
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar seus dados');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  // Recarregar dados quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      carregarDadosUsuario();
    }, [])
  );

  // Função de logout
  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  // Obter avatar do usuário
  const getAvatarDisplay = () => {
    if (!userData?.avatar) {
      return '👤'; // Avatar padrão
    }
    
    // Se for um objeto com ícone
    if (typeof userData.avatar === 'object' && userData.avatar.icon) {
      return userData.avatar.icon;
    }
    
    // Se for uma string (emoji)
    return userData.avatar;
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
      <ScrollView>
        <View style={styles.contentContainer}>
          {/* Seção do Perfil */}
          <View style={styles.profileSection}>
            <Text style={styles.profileTitle}>Perfil</Text>
            
            {/* Avatar - Emoji ou Ícone */}
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>{getAvatarDisplay()}</Text>
            </View>
            
            {/* Nome do Usuário */}
            <Text style={styles.userName}>{userData?.primeiroNome || userData?.nome || 'Usuário'}</Text>
            
            {/* Email */}
            <Text style={styles.userEmail}>{userData?.email || ''}</Text>
            
            {/* Botão Editar Perfil */}
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('ProfileEdit')}
            >
              <Feather name="edit-2" size={16} color="#18AD77" />
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>

          {/* Cards de Progresso */}
          <View style={styles.progressSection}>
            <ProgressCard 
              title="Trilhas Concluídas"
              text={`${progressData.trilhasConcluidas} de ${Math.max(1, progressData.totalTrilhas)} trilhas`}
              number={`${progressData.progressoTotal}%`}
            />
            
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{progressData.questoesCompletadas}</Text>
                <Text style={styles.statLabel}>Questões</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{userData?.nivel || 1}</Text>
                <Text style={styles.statLabel}>Nível</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{userData?.xp || 0}</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
            </View>
          </View>

          {/* Lista de Opções */}
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
              onPress={handleLogout}
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
    gap: 12,
    marginBottom: 24,
    paddingTop: 20,
  },
  profileTitle: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    color: '#000000',
    fontFamily: 'Outfit-Bold',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F9F0',
    borderWidth: 3,
    borderColor: '#18AD77',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    color: '#000000',
    fontFamily: 'Outfit-Bold',
    marginTop: 8,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#666',
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F9F0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#18AD77',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#18AD77',
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: '#18AD77',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#666',
  },
  optionsList: {
    width: '100%',
    gap: 16,
    marginTop: 24,
  },
});

export default PerfilScreen;