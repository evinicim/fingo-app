import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImputText from "../components/ImputText";
import SecondLink from "../components/SecondLink";
import PrimaryNavButton from "../components/PrimaryNavButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { criarUsuarioInicial } from "../services/userService";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nome, setNome] = useState("");

  const handleRegister = async () => {
    // Validações
    if (!nome.trim()) {
      Alert.alert("Erro", "Por favor, informe seu nome.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, informe seu email.");
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Erro", "Por favor, informe um email válido.");
      return;
    }

    if (!password || password.trim().length === 0) {
      Alert.alert("Erro", "Por favor, informe uma senha.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      
      // ENDPOINT: Usuário cadastrado (teste de registro)
      // console.log("Usuário cadastrado:", user.email);
      
      // Criar documento inicial do usuário no Firestore
      const resultado = await criarUsuarioInicial(user.uid, email, nome.trim());
      
      if (resultado.success) {
        // Navegar para tela de aceite de termos (obrigatório para novos usuários)
        navigation.navigate("TermosAceite");
      } else {
        Alert.alert("Aviso", "Conta criada, mas houve um problema ao salvar os dados. Você pode continuar.");
        navigation.navigate("TermosAceite");
      }
      
    } catch (error) {
      console.error("Erro no cadastro:", error);
      
      // Mensagens de erro mais amigáveis
      let mensagemErro = "Ocorreu um erro ao criar sua conta. Tente novamente.";
      
      if (error.code === 'auth/email-already-in-use') {
        mensagemErro = "Este email já está cadastrado. Tente fazer login ou use outro email.";
      } else if (error.code === 'auth/invalid-email') {
        mensagemErro = "Email inválido. Por favor, verifique o email informado.";
      } else if (error.code === 'auth/weak-password') {
        mensagemErro = "A senha é muito fraca. Use pelo menos 6 caracteres.";
      } else if (error.code === 'auth/missing-password') {
        mensagemErro = "Por favor, informe uma senha.";
      } else if (error.message) {
        mensagemErro = error.message;
      }
      
      Alert.alert("Erro no cadastro", mensagemErro);
    }
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
            <ImputText 
              placeholder="Nome completo" 
              value={nome}
              onChangeText={setNome}
            />
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