import React from 'react';
import {View} from 'react-native';
import UploadForm from '../components/UploadForm';
import {Button, Image} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';

const Upload = (props) => {
  const {inputs, handleInputChange} = useUploadForm();

  const doUpload = () => {
    console.log('doUpload', inputs);
  };

  return (
    <View>
      <Image
        source={require('../assets/icon.png')}
        style={{width: '100%', height: 200}}
      />
      <Button title="Select media" />
      <UploadForm
        title="Upload"
        handleSubmit={doUpload}
        handleInputChange={handleInputChange}
      />
    </View>
  );
};

Upload.propTypes = {};

export default Upload;
