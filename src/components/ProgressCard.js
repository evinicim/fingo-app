// components/ProgressCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressCard = ({ title, text, number }) => {
  return (
    <View style={styles.progressModal}>
      <View style={styles.progressContent}>
        <Text style={styles.progressTitle}>{title}</Text>
        <Text style={styles.progressText}>{text}</Text>
        <Text style={styles.progressNumber}>{number}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressModal: {
    width: 249,
    height: 106,
    backgroundColor: '#F1F8FF',
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 60,
    elevation: 5,
  },
  progressContent: {
    gap: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: 'Outfit-Bold',
    color: '#000000',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    fontFamily: 'Outfit-Regular',
    color: '#000000',
  },
  progressNumber: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: 'Outfit-Bold',
    color: '#000000',
  },
});

export default ProgressCard;