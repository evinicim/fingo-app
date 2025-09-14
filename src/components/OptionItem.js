import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

const OptionItem = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionContent}>
        {/* Você pode passar um ícone ou um placeholder */}
        {icon ? (
          icon
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
        <Text style={styles.optionText}>{title}</Text>
      </View>
      <Feather name="chevron-right" size={24} color="#0AD58B" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: '100%',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconPlaceholder: {
    width: 28,
    height: 28,
    backgroundColor: '#D9D9D9',
    borderRadius: 4,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    fontFamily: 'Outfit-Bold',
    color: '#000000',
  },
});

export default OptionItem;