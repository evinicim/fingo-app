import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import PrimaryNavButton from '../components/PrimaryNavButton'; 

const OnboardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require('../assets/images/FingoText.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Educação Financeira para os jovens</Text>
        <Image
          source={require('../assets/images/logoFinGo.png')}
          style={styles.piggyImage}
          resizeMode="contain"
        />
        <PrimaryNavButton
          titulo="Começar"
          onPress={() => navigation.navigate('Login')}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 45,
    paddingHorizontal: 12,
  },
  logo: {
    width: 336,
    height: 92.85,
  },
  subtitle: {
    width: 339,
    height: 60,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    color: '#000000',
  },
  piggyImage: {
    width: 160,
    height: 142,
  },
});

export default OnboardingScreen;