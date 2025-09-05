import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const TrilhaItem = ({ trilha, alignRight }) => {
  return (
    <View style={[styles.trilhaContainer, alignRight ? styles.itemRight : styles.itemLeft]}>
      <View style={[styles.itemContent, trilha.bloqueada && styles.itemBloqueado]}>
        <Image source={trilha.icone} style={styles.icone} />
        <Text style={styles.titulo}>{trilha.titulo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trilhaContainer: {
    width: '100%',
    marginBottom: 50,
  },
  itemLeft: {
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  itemRight: {
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#f6f6f6ff',
    width: 250,
    height: 100,
    borderWidth: 0,
  },
  itemBloqueado: {
    borderColor: '#999',
    backgroundColor: '#d5d5d5ff',
  },
  icone: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  titulo: {
    // O alinhamento agora é feito pelo itemContent
    flex: 1, // Faz com que o texto ocupe o espaço restante
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default TrilhaItem;