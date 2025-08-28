import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import ImputText from '../components/ImputText';
import PrimaryNavButton from '../components/PrimaryNavButton';
import BottomBar from '../components/BottomBar';
import TabItem from '../components/TabItem';

const PasswordRecoveryScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>Digite seu e-mail abaixo e enviaremos instruções para redefinir sua senha.</Text>
        <ImputText placeholder="E-mail" />
        <PrimaryNavButton
          titulo="Enviar"
          onPress={() => { /* Lógica de envio */ }}
          style={styles.sendButton}
          textStyle={styles.sendButtonText}
        />
        <Image
          source={require('../assets/images/logoFinGo.png')}
          style={styles.mascote}
          resizeMode="contain"
        />
        <Text style={styles.successMessage}>Você recebera um e-mail com os próximos passos.</Text>
      </View>

      <BottomBar>
        <TabItem titulo="Home" iconName="home" onPress={() => navigation.navigate('Home')} />
        <TabItem titulo="História" iconName="book" onPress={() => {}} />
        <TabItem titulo="Conquistas" iconName="trophy" onPress={() => {}} />
        <TabItem titulo="Perfil" iconName="user" onPress={() => {}} />
      </BottomBar>
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
    marginBottom: 93,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    textAlign: 'center',
    color: '#000000',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
    textAlign: 'center',
    color: '#000000',
    marginBottom: 20,
  },
  sendButton: {
    width: '30%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#17D689',
    marginTop: 20,
  },
  sendButtonText: {
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
  },
  mascote: {
    width: 160,
    height: 142,
    marginTop: 40,
  },
  successMessage: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
    textAlign: 'center',
    color: '#000000',
    marginTop: 20,
  },
});

export default PasswordRecoveryScreen;