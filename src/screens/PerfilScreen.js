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

      // Limpar cache de progresso para garantir dados atualizados
      const { invalidateProgressCache } = require('../services/progressService');
      invalidateProgressCache();

      // Buscar dados do perfil
      const resultado = await buscarDadosPerfil(userId);
      
      if (resultado.success) {
        const dados = resultado.data;
        // ENDPOINT: Dados do perfil carregados (teste de carregamento)
        // console.log('📊 Dados do perfil carregados:', dados);
        // console.log('🖼️ Avatar nos dados:', dados.avatar, 'Tipo:', typeof dados.avatar);
        setUserData(dados);
        
        // Estatísticas dinâmicas (forçar recálculo sem cache)
        const stats = await getUserStats();
        // ENDPOINT: Stats recebidas (teste de dados)
        // console.log('📊 Stats recebidas na PerfilScreen:', stats);
        
        const trilhasComStatus = await getTrilhasWithUnlockStatus();
        const progressoTotal = trilhasComStatus.length
          ? Math.round(trilhasComStatus.reduce((acc, t) => acc + t.progresso, 0) / trilhasComStatus.length)
          : 0;

        // ENDPOINT: Progresso calculado (teste de cálculo)
        // console.log('📊 Progresso total calculado:', progressoTotal);
        // console.log('📊 Trilhas com status:', trilhasComStatus.map(t => ({ id: t.id, progresso: t.progresso })));

        setProgressData({
          trilhasConcluidas: stats.trilhasConcluidas || 0,
          totalTrilhas: stats.totalTrilhas || 0,
          questoesCompletadas: stats.questoesRespondidas || 0,
          progressoTotal: progressoTotal || 0,
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

  // Avatares disponíveis (mesma lista do ProfileSetupScreen)
  const avatares = [
    { id: 1, image: require('../assets/images/avatars/avatar1.png') },
    { id: 2, image: require('../assets/images/avatars/avatar2.png') },
    { id: 3, image: require('../assets/images/avatars/avatar3.png') },
    { id: 4, image: require('../assets/images/avatars/avatar4.png') },
  ];

  // Obter avatar do usuário
  const getAvatarImage = () => {
    // ENDPOINT: Verificação de avatar (teste de parsing)
    // console.log('🔍 Verificando avatar - userData?.avatar:', userData?.avatar, 'Tipo:', typeof userData?.avatar);
    
    // Verificar se avatar existe (incluindo 0 que é falsy mas válido)
    if (userData?.avatar === null || userData?.avatar === undefined) {
      // ENDPOINT: Avatar não encontrado
      // console.log('⚠️ Avatar não encontrado nos dados do usuário');
      return null;
    }
    
    // Extrair ID do avatar
    let avatarId = null;
    
    if (typeof userData.avatar === 'number') {
      avatarId = userData.avatar;
      // ENDPOINT: Avatar ID extraído (número)
      // console.log('✅ Avatar ID (número):', avatarId);
    } else if (typeof userData.avatar === 'string') {
      const parsed = parseInt(userData.avatar, 10);
      if (!isNaN(parsed)) {
        avatarId = parsed;
        // ENDPOINT: Avatar ID extraído (string convertida)
        // console.log('✅ Avatar ID (string convertida):', avatarId);
      } else {
        // Mantido para debug de avatares inválidos
        // console.log('⚠️ Avatar é string mas não é número:', userData.avatar);
        return null;
      }
    } else if (typeof userData.avatar === 'object' && userData.avatar.id) {
      avatarId = userData.avatar.id;
      // ENDPOINT: Avatar ID extraído (objeto)
      // console.log('✅ Avatar ID (objeto):', avatarId);
    }
    
    // Buscar avatar na lista
    if (avatarId !== null && avatarId !== undefined) {
      // ENDPOINT: Busca de avatar na lista (teste de match)
      // console.log('🔎 Buscando avatar com ID:', avatarId, 'na lista:', avatares.map(a => a.id));
      const avatar = avatares.find(a => a.id === avatarId);
      if (avatar && avatar.image) {
        // ENDPOINT: Avatar encontrado
        // console.log('✅ Avatar encontrado na lista! ID:', avatarId);
        return avatar.image;
      } else {
        // Mantido para debug de avatares não encontrados
        // console.log('❌ Avatar não encontrado na lista para ID:', avatarId);
      }
    }
    
    // ENDPOINT: Nenhum avatar válido
    // console.log('⚠️ Retornando null - nenhum avatar válido encontrado');
    return null;
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
            
            {/* Avatar - Imagem PNG */}
            <View style={styles.avatarContainer}>
              {(() => {
                const avatarImage = getAvatarImage();
                // ENDPOINT: Renderização de avatar (teste de render)
                // console.log('🖼️ Renderizando avatar - imagem encontrada:', !!avatarImage);
                
                if (avatarImage) {
                  return (
                    <Image 
                      source={avatarImage} 
                      style={styles.avatarImage} 
                      resizeMode="cover"
                      onError={(error) => {
                        // Mantido para debug de erros de carregamento de imagem
                        // console.error('❌ Erro ao carregar imagem do avatar:', error);
                      }}
                      onLoad={() => {
                        // ENDPOINT: Imagem carregada com sucesso
                        // console.log('✅ Imagem do avatar carregada com sucesso!');
                      }}
                    />
                  );
                }
                
                // Avatar padrão (ícone) se não houver imagem
                // ENDPOINT: Usando avatar padrão
                // console.log('⚠️ Usando avatar padrão (ícone)');
                return (
                  <View style={styles.avatarDefault}>
                    <Feather name="user" size={48} color="#4CAF50" />
                  </View>
                );
              })()}
            </View>
            
            {/* Nome do Usuário */}
            <Text style={styles.userName}>{userData?.nome || 'Usuário'}</Text>
            
            {/* Email */}
            <Text style={styles.userEmail}>{userData?.email || ''}</Text>
            
            {/* Botão Editar Perfil */}
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('ProfileEdit')}
            >
              <Feather name="edit-2" size={16} color="#4CAF50" />
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
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  avatarImage: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  avatarDefault: {
    width: 94,
    height: 94,
    borderRadius: 47,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
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
    borderColor: '#4CAF50',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#4CAF50',
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
    color: '#4CAF50',
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