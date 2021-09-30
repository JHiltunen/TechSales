import {useState} from 'react';

const useUploadForm = (callback) => {
  const [inputs, setInputs] = useState({
    title: '',
    description: '',
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
