import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { buscarDadosPerfil, atualizarDadosPerfil } from '../services/userService';
import { auth } from '../services/firebaseConfig';

const { width } = Dimensions.get('window');

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [idade, setIdade] = useState('');
  const [nivelConhecimento, setNivelConhecimento] = useState(null);

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium': require('../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  // Opções de avatares
  const avatares = [
    { id: 1, icon: '👦', name: 'João' },
    { id: 2, icon: '👧', name: 'Maria' },
    { id: 3, icon: '🧑', name: 'Alex' },
    { id: 4, icon: '👩', name: 'Ana' },
    { id: 5, icon: '👨', name: 'Carlos' },
    { id: 6, icon: '👩‍🦱', name: 'Sofia' },
  ];

  // Níveis de conhecimento financeiro
  const niveisConhecimento = [
    { id: 'iniciante', label: 'Iniciante', description: 'Estou começando a aprender sobre finanças', icon: '🌱' },
    { id: 'intermediario', label: 'Intermediário', description: 'Já tenho algumas noções básicas', icon: '📈' },
    { id: 'avancado', label: 'Avançado', description: 'Tenho conhecimento sólido em finanças', icon: '💎' },
  ];

  // Carregar dados atuais do perfil
  useEffect(() => {
    carregarDadosPerfil();
  }, []);

  const carregarDadosPerfil = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        Alert.alert('Erro', 'Usuário não autenticado');
        navigation.goBack();
        return;
      }

      const resultado = await buscarDadosPerfil(userId);
      
      if (resultado.success) {
        const { avatar, idade: idadeAtual, nivelConhecimento: nivelAtual } = resultado.data;
        
        // Configurar avatar
        if (typeof avatar === 'object' && avatar.id) {
          setSelectedAvatar(avatar);
        } else if (typeof avatar === 'string') {
          // Se for emoji string, encontrar o avatar correspondente
          const avatarEncontrado = avatares.find(a => a.icon === avatar);
          setSelectedAvatar(avatarEncontrado || avatares[0]);
        }
        
        setIdade(idadeAtual ? idadeAtual.toString() : '');
        setNivelConhecimento(nivelAtual || null);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    // Validações
    if (!selectedAvatar) {
      Alert.alert('Atenção', 'Por favor, selecione um avatar!');
      return;
    }

    if (!idade || idade === '') {
      Alert.alert('Atenção', 'Por favor, informe sua idade!');
      return;
    }

    const idadeNum = parseInt(idade);
    if (isNaN(idadeNum) || idadeNum < 13 || idadeNum > 100) {
      Alert.alert('Atenção', 'Por favor, informe uma idade válida (entre 13 e 100 anos)!');
      return;
    }

    if (!nivelConhecimento) {
      Alert.alert('Atenção', 'Por favor, selecione seu nível de conhecimento financeiro!');
      return;
    }

    // Dados atualizados
    const dadosAtualizados = {
      avatar: selectedAvatar,
      idade: idadeNum,
      nivelConhecimento: nivelConhecimento,
    };

    try {
      setSaving(true);
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      const resultado = await atualizarDadosPerfil(userId, dadosAtualizados);
      
      if (resultado.success) {
        Alert.alert(
          'Sucesso!', 
          'Perfil atualizado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
      }
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#18AD77" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Editar Perfil</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Avatar Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avatar</Text>
          <Text style={styles.sectionSubtitle}>Escolha como você quer aparecer</Text>
          
          <View style={styles.avatarGrid}>
            {avatares.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarOption,
                  selectedAvatar?.id === avatar.id && styles.avatarSelected
                ]}
                onPress={() => setSelectedAvatar(avatar)}
              >
                <Text style={styles.avatarIcon}>{avatar.icon}</Text>
                <Text style={[
                  styles.avatarName,
                  selectedAvatar?.id === avatar.id && styles.avatarNameSelected
                ]}>
                  {avatar.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Age Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Idade</Text>
          <Text style={styles.sectionSubtitle}>Atualize sua idade se necessário</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.ageInput}
              placeholder="Digite sua idade"
              value={idade}
              onChangeText={setIdade}
              keyboardType="numeric"
              maxLength={3}
            />
            <MaterialIcons name="cake" size={24} color="#666" style={styles.inputIcon} />
          </View>
        </View>

        {/* Knowledge Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nível de Conhecimento Financeiro</Text>
          <Text style={styles.sectionSubtitle}>Como você se sente em relação às finanças?</Text>
          
          <View style={styles.knowledgeContainer}>
            {niveisConhecimento.map((nivel) => (
              <TouchableOpacity
                key={nivel.id}
                style={[
                  styles.knowledgeOption,
                  nivelConhecimento === nivel.id && styles.knowledgeSelected
                ]}
                onPress={() => setNivelConhecimento(nivel.id)}
              >
                <Text style={styles.knowledgeIcon}>{nivel.icon}</Text>
                <View style={styles.knowledgeContent}>
                  <Text style={[
                    styles.knowledgeLabel,
                    nivelConhecimento === nivel.id && styles.knowledgeLabelSelected
                  ]}>
                    {nivel.label}
                  </Text>
                  <Text style={[
                    styles.knowledgeDescription,
                    nivelConhecimento === nivel.id && styles.knowledgeDescriptionSelected
                  ]}>
                    {nivel.description}
                  </Text>
                </View>
                <View style={[
                  styles.radioButton,
                  nivelConhecimento === nivel.id && styles.radioButtonSelected
                ]}>
                  {nivelConhecimento === nivel.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSalvar}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              <MaterialIcons name="check" size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
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
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#666',
    marginBottom: 20,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarOption: {
    width: (width - 60) / 3,
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  avatarSelected: {
    borderColor: '#18AD77',
    backgroundColor: '#F0F9F0',
  },
  avatarIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  avatarName: {
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
    color: '#666',
  },
  avatarNameSelected: {
    color: '#18AD77',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  ageInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#333',
  },
  inputIcon: {
    marginLeft: 10,
  },
  knowledgeContainer: {
    gap: 12,
  },
  knowledgeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  knowledgeSelected: {
    borderColor: '#18AD77',
    backgroundColor: '#F0F9F0',
  },
  knowledgeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  knowledgeContent: {
    flex: 1,
  },
  knowledgeLabel: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#333',
    marginBottom: 4,
  },
  knowledgeLabelSelected: {
    color: '#18AD77',
  },
  knowledgeDescription: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#666',
  },
  knowledgeDescriptionSelected: {
    color: '#18AD77',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#18AD77',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#18AD77',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18AD77',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#FFF',
  },
});

export default ProfileEditScreen;

