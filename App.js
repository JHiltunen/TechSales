import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import List from './components/List';

const App = () => {
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.container}>
        <List />
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },

  droidSafeArea: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

export default App;
