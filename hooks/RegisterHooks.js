import {useState} from 'react';
import {useUser} from './ApiHooks';

const useSignUpForm = (callback) => {
  const {checkUsernameAvailable} = useUser();
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (name, text) => {
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };

  const checkUsername = async (username) => {
    if (username.length < 3) {
      return;
    }
    try {
      const isAvailable = await checkUsernameAvailable(username);
      console.log('checkUsername available', isAvailable);
      if (!isAvailable) {
        setErrors((errors) => {
          return {...errors, username: 'Username already exists'};
        });
      } else {
        setErrors((errors) => {
          return {...errors, username: null};
        });
      }
    } catch (e) {
      console.log('username check failed', e);
    }
  };
  return {
    handleInputChange,
    inputs,
    errors,
    checkUsername,
  };
};

export default useSignUpForm;
