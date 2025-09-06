import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const TrilhaItem = ({ trilha, alignRight }) => {
  return (
    <View
      style={[
        styles.trilhaContainer,
        alignRight ? styles.itemRight : styles.itemLeft,
      ]}
    >
      <TouchableOpacity
        style={[styles.itemContent, trilha.bloqueada && styles.itemBloqueado]}
        disabled={trilha.bloqueada}
      >
        <Image source={trilha.icone} style={styles.icone} />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.titulo}>{trilha.titulo}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  trilhaContainer: {
    width: "100%",
    marginBottom: 50,
  },
  itemLeft: {
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  itemRight: {
    alignItems: "flex-end",
    paddingRight: 20,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#f6f6f6ff",
    width: 250,
    height: 100,
    borderWidth: 0,
  },
  itemBloqueado: {
    borderColor: "#999",
    backgroundColor: "#d5d5d5ff",
  },
  icone: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  titulo: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
});

export default TrilhaItem;
