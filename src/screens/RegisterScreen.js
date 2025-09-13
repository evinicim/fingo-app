import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import ImputText from "../components/ImputText";
import SecondLink from "../components/SecondLink";
import PrimaryNavButton from "../components/PrimaryNavButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Usuário cadastrado:", user.email);
        navigation.navigate("Main", { screen: "Home" });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert("Erro no cadastro", errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../assets/images/FingoText.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>
            estudar e organizar suas finanças de forma simples e rápida.
          </Text>

          {/* Container para os campos de formulário */}
          <View style={styles.formContainer}>
            <ImputText placeholder="Nome completo" />
            <ImputText
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <ImputText
              placeholder="Senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <ImputText
              placeholder="Confirmar senha"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <PrimaryNavButton titulo="Cadastrar" onPress={handleRegister} />
          </View>

          <View style={styles.loginLinkContainer}>
            <SecondLink
              titulo="Já tem uma conta? Faça login"
              onPress={() => navigation.navigate("Login")} // Navega de volta para o Login
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logo: {
    width: width * 0.4, // 40% da largura da tela
    height: width * 0.4, // Mantém a proporção quadrada
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    // Adiciona um espaçamento consistente entre os itens do formulário
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  loginLinkContainer: {
    marginTop: 25,
  },
});

export default RegisterScreen;
