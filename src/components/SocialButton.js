import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// O componente agora espera que você passe o conteúdo dele (o ícone) como 'children'
const SocialButton = ({ onPress, children }) => {
  return (
    <TouchableOpacity
      style={styles.socialButton}
      onPress={onPress}
    >
      {/* O 'children' é onde o seu ícone será renderizado */}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    width: 150,
    height: 50,
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc', // Borda para a imagem do protótipo
    borderWidth: 1,
  },
});

export default SocialButton;