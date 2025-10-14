import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Importamos os conjuntos de ícones necessários
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const TabItem = ({ titulo, iconName, onPress }) => {
  let IconComponent;
  // A lógica agora decide qual conjunto de ícones usar
  if (iconName === 'trophy') {
    IconComponent = MaterialCommunityIcons;
  } else {
    IconComponent = MaterialIcons;
  }

  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress}>
      <IconComponent name={iconName} size={24} color="#000" />
      <Text style={styles.tabText}>{titulo}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
    textAlign: 'center',
    color: '#000000',
    marginTop: 4,
  },
});

export default TabItem;