/**
 * ============================================
 * COMPONENTE BOTTOM BAR - BottomBar.js
 * ============================================
 * 
 * Componente responsável por criar a barra de navegação inferior da aplicação.
 * Implementa área segura para diferentes dispositivos e fornece container
 * para os itens de navegação.
 * 
 * Funcionalidades:
 * - Área segura para diferentes dispositivos (iPhone X+, Android)
 * - Linha decorativa superior
 * - Container flexível para itens de navegação
 * - Posicionamento fixo na parte inferior
 * 
 * @author Equipe FinGo
 * @version 1.0.0
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Componente BottomBar para navegação inferior
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos (itens de navegação)
 * @returns {JSX.Element} Componente BottomBar renderizado
 */
const BottomBar = ({ children }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.topLine} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 93,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  topLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#17D689',
    position: 'absolute',
    top: 0,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    height: '100%',
    paddingTop: 16,
  },
});

export default BottomBar;