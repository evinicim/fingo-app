import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import ImputText from '../components/ImputText';
import SecondLink from '../components/SecondLink';
import PrimaryNavButton from '../components/PrimaryNavButton';
import SocialButton from '../components/SocialButton';

const LoginScreen = ({ navigation }) => {
  // AQUI VOCÊ DEFINE O ESTILO ESPECÍFICO DA VARIANTE.
  const secondaryButtonStyles = {
    backgroundColor: 'transparent',
    borderColor: '#17D689',
    borderWidth: 1,
    marginTop: 20,
  };
  const handleLogin = () => {
    console.log('Botão de Login pressionado!');

  };
  
  const secondaryButtonTextStyles = {
    color: '#17D689',
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require('../assets/images/FingoText.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <ImputText placeholder="Email" />
        <ImputText placeholder="Senha" secureTextEntry />

        <View style={styles.forgotPasswordContainer}>
          <SecondLink
            titulo="Esqueci minha senha"
            onPress={() => { /* Lógica de recuperação de senha */ }}
          />
        </View>

        <PrimaryNavButton
          titulo="Entrar"
          onPress={handleLogin}
        />

        {/* E AQUI VOCÊ PASSA ESSE ESTILO COMO UMA PROP PARA O COMPONENTE */}
        <PrimaryNavButton
          titulo="Criar Conta"
          onPress={() => { navigation.navigate('Register'); }}
          style={secondaryButtonStyles}
          textStyle={secondaryButtonTextStyles}
        />

        <Text style={styles.separator}>ou</Text>

        <View style={styles.socialButtonsContainer}>
          <SocialButton onPress={() => {}} iconSource={require('../assets/images/google.svg')} />
          <SocialButton onPress={() => {}} iconSource={require('../assets/images/apple.svg')} />
        </View>
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 15,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 40,
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingRight: 10,
  },
  separator: {
    fontSize: 16,
    color: '#999',
    marginVertical: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
});

export default LoginScreen;