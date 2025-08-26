import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

const SocialButton = ({ onPress, iconSource }) => {
  return (
    <TouchableOpacity
      style={styles.socialButton}
      onPress={onPress}
    >
      <Image source={iconSource} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    width: 150, // Ajuste conforme a imagem real
    height: 50,
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 30, // Exemplo de tamanho de ícone
    height: 30,
  }
});

export default SocialButton;