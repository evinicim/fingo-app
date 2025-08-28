import React from 'react';
import { View, StyleSheet } from 'react-native';

const BottomBar = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 93,
    backgroundColor: 'white',
    borderTopWidth: 2,
    borderTopColor: '#17D689',
    position: 'absolute',
    bottom: 0,
    // Corrigido: o container agora é uma linha e distribui o espaço
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export default BottomBar;