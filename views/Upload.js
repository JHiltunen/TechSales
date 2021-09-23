import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {View, Platform, Alert} from 'react-native';
import UploadForm from '../components/UploadForm';
import {Button, Image} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appID} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';

const Upload = ({navigation}) => {
  // eslint-disable-next-line no-undef
  const [image, setImage] = useState(require('../assets/icon.png'));
  const {inputs, handleInputChange} = useUploadForm();
  const [type, setType] = useState('');
  const {uploadMedia, loading} = useMedia();
  const {addTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const doUpload = async () => {
    console.log('doUpload', inputs);
    const filename = image.uri.split('/').pop();
    const formData = new FormData();
    formData.append('file', {uri: image.uri, name: filename, type});
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const result = await uploadMedia(formData, userToken);
      uploadMedia(formData, userToken);
      const tagResult = await addTag(result.file_id, appID, userToken);
      if (tagResult.message) {
        Alert.alert(
          'Upload',
          result.message,
          [
            {
              text: 'Ok',
              onPress: () => {
                setUpdate(update + 1);
                navigation.navigate('Home');
              },
            },
          ],
          {cancelable: false}
        );
      }
    } catch (e) {
      console.log('doUpload error', e.message);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage({uri: result.uri});
      setType(result.type);
    }
  };
  return (
    <View>
      <Image source={image} style={{width: '100%', height: 200}} />
      <Button title="Select media" onPress={pickImage} />
      <UploadForm
        title="Upload"
        handleSubmit={doUpload}
        handleInputChange={handleInputChange}
        loading={loading}
      />
    </View>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Upload;
