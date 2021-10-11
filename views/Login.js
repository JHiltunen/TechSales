import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import {Card, ListItem, Text} from 'react-native-elements';
import LottieView from 'lottie-react-native';
import AnimatedLottieView from 'lottie-react-native';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {checkToken} = useUser();
  const [registerFormToggle, setRegisterFormToggle] = useState(false);

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('logIn asyncstorage token:', userToken);
    if (userToken) {
      try {
        const userInfo = await checkToken(userToken);
        if (userInfo.user_id) {
          setUser(userInfo);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log('getToken', e.message);
      }
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {registerFormToggle ? (
        <Card>
          <Card.Title h4>Register</Card.Title>
          <RegisterForm navigation={navigation} />
          <ListItem
            onPress={() => {
              setRegisterFormToggle(!registerFormToggle);
            }}
          >
            <ListItem.Content>
              <Text style={styles.text}>Already an account? Login here!</Text>
            </ListItem.Content>
            <ListItem.Chevron color="black" />
          </ListItem>
          <AnimatedLottieView
            style={styles.registerAnimations}
            source={require('../assets/42476-register.json')}
            autoPlay
            loop
          />
        </Card>
      ) : (
        <Card>
          <Card.Title h4>Login</Card.Title>
          <LoginForm navigation={navigation} />
          <ListItem
            onPress={() => {
              setRegisterFormToggle(!registerFormToggle);
            }}
          >
            <ListItem.Content>
              <Text style={styles.text}>No account ? Register Here!</Text>
            </ListItem.Content>
            <ListItem.Chevron color="black" />
          </ListItem>
          <AnimatedLottieView
            style={styles.animations}
            source={require('../assets/50124-user-profile.json')}
            autoPlay
            loop
          />
        </Card>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  animations: {
    alignSelf: 'center',
    height: 400,
  },
  registerAnimations: {
    alignSelf: 'center',
    height: 300,
  },
  text: {
    alignSelf: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
