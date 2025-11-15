/**
 * ============================================
 * TELA DE LOGIN - LoginScreen.js
 * ============================================
 * 
 * Tela responsável pela autenticação do usuário na aplicação FinGo.
 * Implementa login com email/senha e integração com Firebase Auth.
 * 
 * Funcionalidades:
 * - Login com email e senha via Firebase Auth
 * - Pré-carregamento de dados essenciais após login
 * - Navegação para recuperação de senha
 * - Navegação para tela de registro
 * - Botões sociais (Google e Apple) - em desenvolvimento
 * 
 * @author Equipe FinGo
 * @version 1.0.0
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, Alert } from "react-native";
import ImputText from "../components/ImputText";
import PrimaryNavButton from "../components/PrimaryNavButton";
import SecondLink from "../components/SecondLink";
import SocialButton from "../components/SocialButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { preloadEssentialData } from "../services/cacheService";

/**
 * Componente da tela de login
 * 
 * @param {Object} navigation - Objeto de navegação do React Navigation
 * @returns {JSX.Element} Componente da tela de login
 */
const LoginScreen = ({ navigation }) => {
  // Estados para os campos de entrada
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estilos para o botão secundário (Criar Conta)
  const secondaryButtonStyles = {
    backgroundColor: "transparent",
    borderColor: "#18AD77",
    borderWidth: 1,
    marginTop: 20,
  };

  const secondaryButtonTextStyles = {
    color: "#18AD77",
  };

  /**
   * Função para realizar o login do usuário
   * 
   * Utiliza Firebase Auth para autenticação e pré-carrega dados
   * essenciais em background para melhorar a performance.
   */
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Usuário autenticado com sucesso
        const user = userCredential.user;
        console.log("Usuário logado:", user.email);

        // Pré-carregar dados essenciais em background (não bloqueia navegação)
        preloadEssentialData(user.uid).catch(err => {
          console.warn('Erro ao pré-carregar dados:', err);
        });

        // Navegar para a tela principal
        navigation.navigate("Main", { screen: "Home" });
      })
      .catch((error) => {
        // Tratamento de erros de autenticação
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert("Erro no login", errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Logo da aplicação */}
        <Image
          source={require("../assets/images/FingoText.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Campo de entrada para email */}
        <ImputText
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        {/* Campo de entrada para senha */}
        <ImputText
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Link para recuperação de senha */}
        <View style={styles.forgotPasswordContainer}>
          <SecondLink
            titulo="Esqueci minha senha"
            onPress={() => {
              navigation.navigate("PasswordRecovery");
            }}
          />
        </View>

        {/* Botão principal de login */}
        <PrimaryNavButton
          titulo="Entrar"
          onPress={handleLogin}
        />

        {/* Botão para criar nova conta */}
        <PrimaryNavButton
          titulo="Criar Conta"
          onPress={() => {
            navigation.navigate("Register");
          }}
          style={secondaryButtonStyles}
          textStyle={secondaryButtonTextStyles}
        />

        {/* Separador visual */}
        <View>
          <Text style={styles.separator}>ou</Text>
        </View>

        {/* Botões de login social */}
        <View style={styles.socialButtonsContainer}>
          <SocialButton onPress={() => { }}>
            <Image
              source={require("../assets/images/googleLogo.png")}
              style={styles.socialIcon}
            />
          </SocialButton>
          <SocialButton onPress={() => { }}>
            <MaterialCommunityIcons name="apple" size={30} color="#000" />
          </SocialButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Estilos da tela de login
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 10,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 40,
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 20,
    paddingRight: 10,
  },
  separator: {
    fontSize: 16,
    color: "#999",
    marginVertical: 20,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    gap: 15,
  },
  socialIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});

export default LoginScreen;