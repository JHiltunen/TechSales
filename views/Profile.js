import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {Button, SafeAreaView, StyleSheet, Text} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = (props) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  console.log('Profile isLoggedIn', isLoggedIn);
  console.log('user on profile page', user);
  const logout = async () => {
    setIsLoggedIn(false);
    AsyncStorage.clear();
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      props.navigation.navigate('Login');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <Text>Username: {user.username}</Text>
      <Text>Full name: {user.full_name}</Text>
      <Text>Email: {user.email}</Text>
      <Button title={'Logout'} onPress={logout} />
    </SafeAreaView>
  );
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

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
