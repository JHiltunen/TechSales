import React from 'react';
import PropTypes from 'prop-types';
import {Platform, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import List from '../components/List';

const Home = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <List />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

Home.propTypes = {};

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

export default Home;
