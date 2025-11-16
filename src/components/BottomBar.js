import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomBar = ({ children }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.topLine} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 93,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  topLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#18AD77',
    position: 'absolute',
    top: 0,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    height: '100%',
    paddingTop: 16,
  },
});

export default BottomBar;