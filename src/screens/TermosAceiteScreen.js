import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../services/firebaseConfig';
import { atualizarDadosPerfil } from '../services/userService';

const TermosAceiteScreen = () => {
  const navigation = useNavigation();
  const [aceiteTermos, setAceiteTermos] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const scrollViewRef = useRef(null);

  // Desabilitar botão de voltar - termos são obrigatórios
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Prevenir navegação para trás
      e.preventDefault();
      
      Alert.alert(
        'Atenção',
        'Você precisa aceitar os termos de uso para continuar. Não é possível voltar sem aceitar.',
        [{ text: 'OK' }]
      );
    });

    return unsubscribe;
  }, [navigation]);

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium': require('../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  const handleAceitar = async () => {
    if (!aceiteTermos) {
      Alert.alert('Atenção', 'Você precisa aceitar os termos de uso para continuar.');
      return;
    }

    try {
      setSalvando(true);
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        navigation.navigate('Login');
        return;
      }

      // Salvar aceite dos termos no Firestore
      const resultado = await atualizarDadosPerfil(userId, {
        termosAceitos: true,
        dataAceiteTermos: new Date().toISOString(),
      });

      if (resultado.success) {
        // Navegar para ProfileSetup
        navigation.navigate('ProfileSetup');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar o aceite dos termos. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar aceite dos termos:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setSalvando(false);
    }
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
      <View style={styles.header}>
        <Text style={styles.title}>Termos de Uso</Text>
        <Text style={styles.subtitle}>Leia e aceite os termos para continuar</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.content}>
          <Text style={styles.lastUpdate}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</Text>

          <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
          <Text style={styles.paragraph}>
            Ao acessar e usar o aplicativo FinGo, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar o aplicativo.
          </Text>

          <Text style={styles.sectionTitle}>2. Descrição do Serviço</Text>
          <Text style={styles.paragraph}>
            O FinGo é um aplicativo educacional de educação financeira gamificada destinado a jovens. O aplicativo oferece trilhas de aprendizado, quizzes, desafios, vídeos educativos e outras funcionalidades relacionadas à educação financeira.
          </Text>

          <Text style={styles.sectionTitle}>3. Uso do Aplicativo</Text>
          <Text style={styles.paragraph}>
            Você concorda em usar o aplicativo apenas para fins legais e de acordo com estes Termos de Uso. Você não deve:
          </Text>
          <Text style={styles.listItem}>• Usar o aplicativo de forma que viole qualquer lei ou regulamento</Text>
          <Text style={styles.listItem}>• Tentar acessar áreas restritas do aplicativo sem autorização</Text>
          <Text style={styles.listItem}>• Interferir ou interromper o funcionamento do aplicativo</Text>
          <Text style={styles.listItem}>• Usar o aplicativo para transmitir qualquer conteúdo malicioso ou prejudicial</Text>

          <Text style={styles.sectionTitle}>4. Conta de Usuário</Text>
          <Text style={styles.paragraph}>
            Para usar certas funcionalidades do aplicativo, você precisará criar uma conta. Você é responsável por:
          </Text>
          <Text style={styles.listItem}>• Manter a confidencialidade de suas credenciais de login</Text>
          <Text style={styles.listItem}>• Todas as atividades que ocorrem em sua conta</Text>
          <Text style={styles.listItem}>• Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</Text>

          <Text style={styles.sectionTitle}>5. Conteúdo Educacional</Text>
          <Text style={styles.paragraph}>
            O conteúdo educacional fornecido no aplicativo é apenas para fins informativos e educacionais. Embora nos esforcemos para fornecer informações precisas, não garantimos a precisão, completude ou atualidade de todas as informações.
          </Text>

          <Text style={styles.sectionTitle}>6. Propriedade Intelectual</Text>
          <Text style={styles.paragraph}>
            Todo o conteúdo do aplicativo, incluindo textos, gráficos, logos, ícones, imagens e software, é propriedade do FinGo ou de seus fornecedores de conteúdo e está protegido por leis de direitos autorais e outras leis de propriedade intelectual.
          </Text>

          <Text style={styles.sectionTitle}>7. Privacidade</Text>
          <Text style={styles.paragraph}>
            Seu uso do aplicativo também é regido por nossa Política de Privacidade. Por favor, revise nossa Política de Privacidade para entender nossas práticas de coleta e uso de dados.
          </Text>

          <Text style={styles.sectionTitle}>8. Limitação de Responsabilidade</Text>
          <Text style={styles.paragraph}>
            O FinGo não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar o aplicativo.
          </Text>

          <Text style={styles.sectionTitle}>9. Modificações dos Termos</Text>
          <Text style={styles.paragraph}>
            Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação. Seu uso continuado do aplicativo após as alterações constitui sua aceitação dos novos termos.
          </Text>

          <Text style={styles.sectionTitle}>10. Rescisão</Text>
          <Text style={styles.paragraph}>
            Podemos encerrar ou suspender sua conta e acesso ao aplicativo imediatamente, sem aviso prévio, por qualquer motivo, incluindo se você violar estes Termos de Uso.
          </Text>

          <Text style={styles.sectionTitle}>11. Lei Aplicável</Text>
          <Text style={styles.paragraph}>
            Estes Termos de Uso são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes termos será resolvida nos tribunais competentes do Brasil.
          </Text>

          <Text style={styles.sectionTitle}>12. Contato</Text>
          <Text style={styles.paragraph}>
            Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através dos canais oficiais do aplicativo.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Ao usar o aplicativo FinGo, você reconhece que leu, entendeu e concorda em estar vinculado a estes Termos de Uso.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkbox e Botão de Aceite */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAceiteTermos(!aceiteTermos)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, aceiteTermos && styles.checkboxChecked]}>
            {aceiteTermos && (
              <MaterialIcons name="check" size={20} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            Li e aceito os Termos de Uso do FinGo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            (!aceiteTermos || salvando) && styles.buttonDisabled
          ]}
          onPress={handleAceitar}
          disabled={!aceiteTermos || salvando}
          activeOpacity={0.7}
        >
          {salvando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Aceitar e Continuar</Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 24,
    lineHeight: 30,
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100, // Espaço para o footer fixo
  },
  content: {
    paddingBottom: 20,
  },
  lastUpdate: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: '#666',
    marginBottom: 24,
    textAlign: 'right',
  },
  sectionTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
    color: '#000000',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 16,
    textAlign: 'justify',
  },
  listItem: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 8,
    marginLeft: 16,
  },
  footer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  footerText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    fontStyle: 'italic',
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxLabel: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default TermosAceiteScreen;

