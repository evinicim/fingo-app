import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Dimensions 
} from 'react-native';
// CORREÇÃO AQUI: Importação da biblioteca correta
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { salvarDadosPerfil } from '../services/userService';
import { auth } from '../services/firebaseConfig';

const { width, height } = Dimensions.get('window');

const ProfileSetupScreen = () => {
  const navigation = useNavigation();
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

  const handleContinuar = async () => {
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

    // Dados do perfil
    const dadosPerfil = {
      avatar: selectedAvatar,
      idade: idadeNum,
      nivelConhecimento: nivelConhecimento,
      dataConfiguracao: new Date().toISOString(),
    };

    try {
      // Salvar dados no Firebase
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        return;
      }

      const resultado = await salvarDadosPerfil(userId, dadosPerfil);
      
      if (resultado.success) {
        Alert.alert(
          'Sucesso!', 
          'Perfil configurado com sucesso! Bem-vindo ao FinGo!',
          [
            {
              text: 'Continuar',
              onPress: () => navigation.navigate('Main', { screen: 'Home' })
            }
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível salvar os dados do perfil. Tente novamente.');
      }
      
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  if (!fontsLoaded) {
    return null;
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
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Configure seu Perfil</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>Passo 1 de 1</Text>
        </View>

        {/* Avatar Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escolha seu Avatar</Text>
          <Text style={styles.sectionSubtitle}>Selecione como você quer aparecer no app</Text>
          
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
          <Text style={styles.sectionTitle}>Qual sua idade?</Text>
          <Text style={styles.sectionSubtitle}>Isso nos ajuda a personalizar sua experiência</Text>
          
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
          <Text style={styles.sectionTitle}>Qual seu nível de conhecimento financeiro?</Text>
          <Text style={styles.sectionSubtitle}>Escolha a opção que melhor te descreve</Text>
          
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

        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinuar}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
          <AntDesign name="arrowright" size={20} color="#FFF" />
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
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    width: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#666',
    textAlign: 'center',
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
    borderColor: '#4CAF50',
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
    color: '#4CAF50',
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
    borderColor: '#4CAF50',
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
    color: '#4CAF50',
  },
  knowledgeDescription: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#666',
  },
  knowledgeDescriptionSelected: {
    color: '#4CAF50',
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
    borderColor: '#4CAF50',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#FFF',
  },
});

export default ProfileSetupScreen;