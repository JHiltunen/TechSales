import {useState} from 'react';
import {useUser} from './ApiHooks';
import {validator} from '../utils/validator.js';

const constraints = {
  username: {
    presence: true,
    length: {
      minimum: 3,
      message: 'must be at least 3 chars',
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: 'must be at least 6 characters',
    },
  },
  confirmPassword: {
    equality: {
      attribute: 'password',
      message: '^ passwords do not match',
    },
  },
  email: {
    presence: true,
    email: {
      message: 'must be a valid email address',
    },
  },
  full_name: {
    length: {
      minimum: 3,
      message: 'must be at least 3 chars',
    },
  },
};

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
    console.log(name, text);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };

  const handleOnEndEditing = (name, text) => {
    let error;
    if (name === 'confirmPassword') {
      error = validator(
        name,
        {password: inputs.password, confirmPassword: text},
        constraints
      );
    } else {
      error = validator(name, text, constraints);
    }
    setErrors((errors) => {
      return {
        ...errors,
        [name]: error,
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
      }
    } catch (error) {
      console.log('username check failed', error);
    }
  };

  return {
    handleInputChange,
    handleOnEndEditing,
    inputs,
    errors,
    checkUsername,
  };
};

export default useSignUpForm;
