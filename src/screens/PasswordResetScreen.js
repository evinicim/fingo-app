import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import ImputText from '../components/ImputText';
import PrimaryNavButton from '../components/PrimaryNavButton';

// Importe a imagem do mascote
import logoFinGo from '../assets/images/logoFinGo.png';

const PasswordResetScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Criar Nova Senha</Text>

        <ImputText placeholder="Nova Senha" secureTextEntry />
        <ImputText placeholder="Confirmar Senha" secureTextEntry />
        
        {/* Lista de exigências para a senha */}
        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementTitle}>Sua senha deve conter:</Text>
          <Text style={styles.requirementText}>• Pelo menos 6 caracteres</Text>
          <Text style={styles.requirementText}>• Pelo menos uma letra maiúscula</Text>
          <Text style={styles.requirementText}>• Pelo menos um número</Text>
          <Text style={styles.requirementText}>• Pelo menos um símbolo (ex: !, @, #, $)</Text>
        </View>

        <PrimaryNavButton
          titulo="Redefinir Senha"
          onPress={() => { /* Lógica para redefinir a senha */ }}
          style={styles.resetButton}
        />
        
        {/* Use a imagem importada */}
        <Image
          source={logoFinGo}
          style={styles.mascote}
          resizeMode="contain"
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    textAlign: 'center',
    color: '#000000',
    marginBottom: 20,
  },
  requirementsContainer: {
    width: '100%',
    alignSelf: 'center',
    padding: 15,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 20,
  },
  requirementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  requirementText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  resetButton: {
    marginTop: 20,
    width: '80%',
  },
  mascote: {
    width: 160,
    height: 142,
    marginTop: 40,
  },
});

export default PasswordResetScreen;