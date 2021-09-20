import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {Button, SafeAreaView, StyleSheet, Text} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useContext(MainContext);
  console.log('profile', isLoggedIn);

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    props.navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <Button title={'Logout'} onPress={logout} />
    </SafeAreaView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

export default Profile;
