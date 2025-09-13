import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
// Importamos os ícones que precisamos
import Ionicons from 'react-native-vector-icons/Ionicons';

const ImputText = ({ placeholder, secureTextEntry, value, onChangeText, keyboardType, autoCapitalize }) => {
  // Criamos um estado para controlar se a senha é visível ou não
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Se o campo for de senha, adicionamos o ícone de olho
  const isPasswordField = secureTextEntry;

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        // A propriedade secureTextEntry agora depende do nosso estado
        secureTextEntry={isPasswordField && !isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      
      {isPasswordField && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
});

export default ImputText;