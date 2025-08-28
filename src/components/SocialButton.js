import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const SocialButton = ({ onPress, children }) => {
  return (
    <TouchableOpacity
      style={styles.socialButton}
      onPress={onPress}
    >
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
    borderColor: '#ccc', 
    borderWidth: 1,
  },
});

export default SocialButton;