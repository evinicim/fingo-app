/**
 * ============================================
 * COMPONENTE TAB ITEM - TabItem.js
 * ============================================
 * 
 * Componente responsável por renderizar um item individual da barra de navegação inferior.
 * Suporta diferentes conjuntos de ícones (MaterialIcons e MaterialCommunityIcons).
 * 
 * Funcionalidades:
 * - Renderização de ícones dinâmicos
 * - Suporte a diferentes conjuntos de ícones
 * - Design consistente para navegação
 * - Integração com sistema de navegação
 * 
 * @author Equipe FinGo
 * @version 1.0.0
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Importamos os conjuntos de ícones necessários
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Componente TabItem para navegação inferior
 * @param {Object} props - Propriedades do componente
 * @param {string} props.titulo - Texto exibido abaixo do ícone
 * @param {string} props.iconName - Nome do ícone a ser exibido
 * @param {Function} props.onPress - Função chamada ao pressionar o item
 * @returns {JSX.Element} Componente TabItem renderizado
 */
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