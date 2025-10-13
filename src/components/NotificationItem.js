// components/NotificationItem.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const NotificationItem = ({ title }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Switch
        trackColor={{ false: "#DEE2E6", true: "#17D689" }}
        thumbColor={isEnabled ? "#FFFFFF" : "#FFFFFF"}
        ios_backgroundColor="#DEE2E6"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    height: 50,
  },
  title: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
  },
});

export default NotificationItem;