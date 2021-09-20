import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {Button, SafeAreaView, StyleSheet, Text} from 'react-native';
import {MainContext} from '../contexts/MainContext';

const Profile = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useContext(MainContext);
  console.log('profile', isLoggedIn);
  const logout = () => {
    setIsLoggedIn(false);
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      props.navigation.navigate('Login');
    }
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
