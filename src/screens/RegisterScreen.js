import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import ImputText from '../components/ImputText';
import SecondLink from '../components/SecondLink';
import PrimaryNavButton from '../components/PrimaryNavButton';

const RegisterScreen = ({ navigation }) => {
  // Por enquanto, a lógica ficará vazia. Focaremos na UI.
  const handleRegister = () => {
    console.log('Botão de cadastro pressionado!');
    // A lógica de autenticação com Firebase virá aqui depois.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <Image
            source={require('../assets/images/FingoText.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>
            estudea organizar suas finanças de forma simples e rápida.
          </Text>

          {/* Container para os campos de formulário */}
          <View style={styles.formContainer}>
            <ImputText placeholder="Nome completo" />
            <ImputText
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <ImputText placeholder="Senha" secureTextEntry />
            <ImputText placeholder="Confirmar senha" secureTextEntry />

            <PrimaryNavButton titulo="Cadastrar" onPress={handleRegister} />
          </View>

          <View style={styles.loginLinkContainer}>
            <SecondLink
              titulo="Já tem uma conta? Faça login"
              onPress={() => navigation.navigate('Login')} // Navega de volta para o Login
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logo: {
    width: width * 0.4, // 40% da largura da tela
    height: width * 0.4, // Mantém a proporção quadrada
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    // Adiciona um espaçamento consistente entre os itens do formulário
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginLinkContainer: {
    marginTop: 25,
  },
});

export default RegisterScreen;
