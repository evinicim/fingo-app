import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import { TRILHAS_MOCADAS } from '../data/mockdata';
import TrilhaItem from '../components/TrilhaItem';

const HomeScreen = ({ navigation }) => {
  const trilhasInvertidas = [...TRILHAS_MOCADAS].reverse();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.trilhasContainer}>
        <View style={styles.linhaCentral} />
        {trilhasInvertidas.map((trilha, index) => (
          <TrilhaItem
            key={trilha.id}
            trilha={trilha}
            alignRight={index % 2 !== 0}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  trilhasContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  linhaCentral: {
    position: 'absolute',
    width: 4,
    backgroundColor: '#FFD700',
    height: '100%',
    top: 0,
    zIndex: -1,
  },
});

export default HomeScreen;