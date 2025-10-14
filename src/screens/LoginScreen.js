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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const secondaryButtonStyles = {
    backgroundColor: "transparent",
    borderColor: "#17D689",
    borderWidth: 1,
    marginTop: 20,
  };

  const secondaryButtonTextStyles = {
    color: "#17D689",
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Usuário logado:", user.email);
        
        // Pré-carregar dados essenciais em background (não bloqueia navegação)
        preloadEssentialData(user.uid).catch(err => {
          console.warn('Erro ao pré-carregar dados:', err);
        });
        
        navigation.navigate("Main", { screen: "Home" });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert("Erro no login", errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../assets/images/FingoText.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <ImputText
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <ImputText
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.forgotPasswordContainer}>
          <SecondLink
            titulo="Esqueci minha senha"
            onPress={() => {
              navigation.navigate("PasswordRecovery");
            }}
          />
        </View>

        <PrimaryNavButton
          titulo="Entrar"
          onPress={handleLogin}
        />

        <PrimaryNavButton
          titulo="Criar Conta"
          onPress={() => {
            navigation.navigate("Register");
          }}
          style={secondaryButtonStyles}
          textStyle={secondaryButtonTextStyles}
        />

        <View>
          <Text style={styles.separator}>ou</Text>
        </View>

        <View style={styles.socialButtonsContainer}>
          <SocialButton onPress={() => {}}>
            <Image
              source={require("../assets/images/googleLogo.png")}
              style={styles.socialIcon}
            />
          </SocialButton>
          <SocialButton onPress={() => {}}>
            <MaterialCommunityIcons name="apple" size={30} color="#000" />
          </SocialButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

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