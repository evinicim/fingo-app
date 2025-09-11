import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const TrilhaItem = ({ trilha, alignment }) => {
  let alignmentStyle;
  if (alignment === 0) {
    alignmentStyle = styles.alignLeft;
  } else if (alignment === 1) {
    alignmentStyle = styles.alignCenter;
  } else {
    alignmentStyle = styles.alignRight;
  }

  return (
    <View style={[styles.trilhaContainer, alignmentStyle]}>
      <Text style={styles.titulo}>{trilha.titulo}</Text>
      <TouchableOpacity
        style={[styles.circularButton, trilha.bloqueada && styles.itemBloqueado]}
        disabled={trilha.bloqueada}
      >
        <Image source={trilha.icone} style={styles.icone} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  trilhaContainer: {
    width: 250, // Demos uma largura fixa para que o alinhamento faça sentido
    marginBottom: 50,
    alignItems: 'center',
  },
  alignLeft: {
    alignSelf: 'flex-start',
  },
  alignCenter: {
    alignSelf: 'center',
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    width: 150,
    textAlign: 'center',
  },
  circularButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6ff',
  },
  itemBloqueado: {
    backgroundColor: '#d5d5d5ff',
  },
  icone: {
    width: 60,
    height: 60,
  },
});

export default TrilhaItem;