import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

const SecondLink = ({ titulo, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.link}>{titulo}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    fontSize: 14,
    color: '#18AD77', // A cor verde da marca
    textDecorationLine: 'underline',
  },
});

export default SecondLink;