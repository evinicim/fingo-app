import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DesafiosScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Tela de Desafios</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DesafiosScreen;