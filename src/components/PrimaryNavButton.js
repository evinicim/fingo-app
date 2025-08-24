import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

// O componente agora pode receber um "estilo" customizado via props
// As props 'style' e 'textStyle' são o que permitem isso
const PrimaryNavButton = ({ titulo, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity
      // Usamos um array para aplicar os estilos padrão (styles.button)
      // e os estilos extras que a gente passar (style)
      style={[styles.button, style]} 
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{titulo}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 336,
    height: 53,
    backgroundColor: '#17D689',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 29,
  },
});

export default PrimaryNavButton;