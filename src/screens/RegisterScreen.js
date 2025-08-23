import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Vamos importar a função signUp depois de construir a UI básica
// import { signUp } from '../services/auth';
import logoFinGo from '../assets/images/logoFinGo.png';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    // Adicione aqui a lógica de validação de senha e email
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    console.log('Dados de Cadastro:', { email, password });

    // Chamar a função signUp do auth.js aqui
    // try { 
    //   await signUp(email, password, name); // Assumindo que signUp aceita email, password e name
    //   Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
    //   // Navegar para a próxima tela (por exemplo, ProfileSetup)
    // } catch (error) {
    //   Alert.alert("Erro no Cadastro", error.message);
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar sua conta FinGo!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <View style={styles.loginLinkContainer}>
        <Text style={styles.loginText}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <Image source={logoFinGo} style={styles.logo} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Isso fará com que o container ocupe todo o espaço disponível
    alignItems: 'center',
    justifyContent: 'flex-start', // Alinha os itens ao topo para seguir o design
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50, // Altura fixa para os inputs
    borderColor: '#E0E0E0', // Cor da borda mais clara conforme o design
    borderWidth: 1, // Borda fina
    borderRadius: 8, // Cantos arredondados
    paddingHorizontal: 15, // Padding interno
    fontSize: 16, // Tamanho da fonte
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 50, // Altura fixa para o botão
    borderRadius: 8, // Cantos arredondados
    justifyContent: 'center', // Centraliza texto verticalmente
    alignItems: 'center',
    marginTop: 10, // Espaço acima do botão
  },
  registerButton: {
    backgroundColor: '#00C897', // Verde vibrante conforme o design
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20, // Espaço antes da logo
  },
  loginText: {
    fontSize: 14,
    marginRight: 5,
  },
  loginLink: {
    fontSize: 14,
    color: '#00C897', // Cor do link igual ao botão
  },
});

export default RegisterScreen; // Certifique-se de que o export default está correto