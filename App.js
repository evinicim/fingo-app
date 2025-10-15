/**
 * ============================================
 * ARQUIVO PRINCIPAL DA APLICAÇÃO - App.js
 * ============================================
 * 
 * Este é o ponto de entrada principal da aplicação FinGo.
 * Responsável por configurar a navegação global e inicializar
 * o sistema de roteamento da aplicação.
 * 
 * Funcionalidades:
 * - Configuração do NavigationContainer (React Navigation)
 * - Inicialização do AppNavigator (sistema de navegação)
 * - Ponto de entrada para toda a aplicação
 * 
 * @author Equipe FinGo
 * @version 1.0.0
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Componente principal da aplicação
 * 
 * @returns {JSX.Element} Componente principal com navegação configurada
 */
export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
