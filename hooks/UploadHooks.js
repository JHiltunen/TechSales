import {useState} from 'react';

const useUploadForm = (callback) => {
  const [inputs, setInputs] = useState({
    title: '',
    description: '',
    condition: '',
    price: '0.00',
  });

  const handleInputChange = (name, text) => {
    // console.log(name, text);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };
  const reset = () => {
    setInputs({
      title: '',
      description: '',
      condition: '',
      price: '0.00',
    });
  };
  return {
    handleInputChange,
    inputs,
    reset,
    setInputs,
  };
};

export default useUploadForm;
