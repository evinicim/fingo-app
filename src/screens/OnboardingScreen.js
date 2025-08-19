import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Image } from 'react-native';

const OnboardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao FinGo!</Text>
      
      {/* 
        Quando você adicionar a imagem 'logoFinGo.png' na pasta 'src/assets/images',
        descomente o código abaixo para exibí-la.
      */}
      {<Image 
        source={require('../assets/images/logoFinGo.png')} 
        style={styles.image} 
        resizeMode="contain"
      />}

      <Text style={styles.subtitle}>Seu guia para o mundo financeiro.</Text>
      
      <Button
        title="Avançar"
        onPress={() => navigation.navigate('Home')} // Navega para a tela Home
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, color: 'gray', textAlign: 'center', marginBottom: 40 },
  image: { width: '100%', height: 300, marginBottom: 20 },
});

export default OnboardingScreen;