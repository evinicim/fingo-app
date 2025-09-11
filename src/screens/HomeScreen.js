import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import { TRILHAS_MOCADAS } from '../data/mockdata';
import TrilhaItem from '../components/TrilhaItem';

const HomeScreen = ({ navigation }) => {
  const trilhasInvertidas = [...TRILHAS_MOCADAS];
  const alignmentPattern = [0, 1, 2, 1];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.trilhasContainer}>
        {trilhasInvertidas.map((trilha, index) => (
          <TrilhaItem
            key={trilha.id}
            trilha={trilha}
            alignment={alignmentPattern[index % alignmentPattern.length]}
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
    paddingBottom: 93,
    position: 'relative',
  },
});

export default HomeScreen;