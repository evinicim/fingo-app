import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import ImputText from "../components/ImputText";
import PrimaryNavButton from "../components/PrimaryNavButton";
import SecondLink from "../components/SecondLink";
import SocialButton from "../components/SocialButton";
import AntDesign from "react-native-vector-icons/AntDesign";

const LoginScreen = ({ navigation }) => {
  const secondaryButtonStyles = {
    backgroundColor: "transparent",
    borderColor: "#17D689",
    borderWidth: 1,
    marginTop: 20,
  };

  const secondaryButtonTextStyles = {
    color: "#17D689",
  };

  const mockLogin = () => {
    return true;
  };

  const handleLogin = () => {
    if (mockLogin()) {
      navigation.navigate("Main", { screen: "Home" });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../assets/images/FingoText.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <ImputText placeholder="Email" />
        <ImputText placeholder="Senha" secureTextEntry />

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

        <Text style={styles.separator}>ou</Text>

        <View style={styles.socialButtonsContainer}>
          <SocialButton onPress={() => {}}>
            <Image
              source={require("../assets/images/googleLogo.png")}
              style={styles.socialIcon}
            />
          </SocialButton>
          <SocialButton onPress={() => {}}>
            <AntDesign name="apple1" size={30} color="#000" />
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