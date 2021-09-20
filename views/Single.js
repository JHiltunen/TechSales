import React from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

const Single = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Single</Text>
    </SafeAreaView>
  );
};

Single.propTypes = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

export default Single;
