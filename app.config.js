module.exports = {
  expo: {
    name: "fingo-app",
    slug: "fingo-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./src/assets/images/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/images/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./src/assets/images/icon.png"
    },
    // Configurações de performance e offline
    experiments: {
      turboModules: true
    },
    plugins: [],
    extra: {
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};


