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
  TouchableOpacity,
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
  const [aceiteTermos, setAceiteTermos] = useState(false);

  const handleRegister = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "Por favor, informe seu nome.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (!aceiteTermos) {
      Alert.alert("Erro", "Você deve aceitar os Termos de Uso para continuar.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Usuário cadastrado:", user.email);
      
      // Criar documento inicial do usuário no Firestore
      const resultado = await criarUsuarioInicial(user.uid, email, nome.trim());
      
      if (resultado.success) {
        navigation.navigate("ProfileSetup");
      } else {
        Alert.alert("Aviso", "Conta criada, mas houve um problema ao salvar os dados. Você pode continuar.");
        navigation.navigate("ProfileSetup");
      }
      
    } catch (error) {
      console.error("Erro no cadastro:", error);
      Alert.alert("Erro no cadastro", error.message);
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

            {/* Checkbox para aceite dos termos */}
            <View style={styles.termsContainer}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setAceiteTermos(!aceiteTermos)}
              >
                <View style={[styles.checkbox, aceiteTermos && styles.checkboxChecked]}>
                  {aceiteTermos && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  Eu aceito os{" "}
                  <Text style={styles.termsLink} onPress={() => Alert.alert("Termos de Uso", "Termos de Uso do FinGo:\n\n1. Uso responsável do aplicativo\n2. Proteção de dados pessoais\n3. Conteúdo educacional de qualidade\n4. Suporte ao usuário\n\nAo continuar, você concorda com estes termos.")}>
                    Termos de Uso
                  </Text>
                  {" "}e{" "}
                  <Text style={styles.termsLink} onPress={() => Alert.alert("Política de Privacidade", "Política de Privacidade do FinGo:\n\n1. Seus dados são protegidos\n2. Não compartilhamos informações pessoais\n3. Dados usados apenas para melhorar o app\n4. Você pode excluir sua conta a qualquer momento")}>
                    Política de Privacidade
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            <PrimaryNavButton 
              titulo="Cadastrar" 
              onPress={handleRegister}
              disabled={!aceiteTermos}
            />
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
  termsContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;