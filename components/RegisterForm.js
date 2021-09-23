import React from 'react';
import PropTypes from 'prop-types';
import {Button, Alert, View} from 'react-native';
import useSignUpForm from '../hooks/RegisterHooks';
import {useUser} from '../hooks/ApiHooks';
import {Input} from 'react-native-elements';

const RegisterForm = ({navigation}) => {
  const {inputs, errors, handleInputChange, checkUsername} = useSignUpForm();
  const {register} = useUser();

  const doRegister = async () => {
    try {
      const registerInfo = await register(inputs);
      if (registerInfo) {
        Alert.alert(registerInfo.message);
      }
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  return (
    <View>
      <Input
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        onEndEditing={(event) => {
          console.log('onEndEditing value', event.nativeEvent.text);
          checkUsername(event.nativeEvent.text);
        }}
        errorMessage={errors.username}
      />
      <Input
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
      />
      <Input
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
      />
      <Input
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
      />
      <Button title="Register!" onPress={doRegister} />
    </View>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default RegisterForm;
