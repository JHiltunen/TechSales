import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import List from '../components/List';

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <List navigation={navigation} />
      </View>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="white"
        hidden={false}
      />
    </SafeAreaView>
  );
};

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
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

export default Home;
