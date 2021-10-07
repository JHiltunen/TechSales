import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Platform,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import UploadForm from '../components/UploadForm';
import {Button, Card, Image} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appID} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';

const Upload = ({navigation}) => {
  // eslint-disable-next-line no-undef
  const [image, setImage] = useState(require('../assets/icon.png'));
  const {inputs, handleInputChange, reset, setInputs} = useUploadForm();
  const {uploadMedia, loading} = useMedia();
  const {addTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);
  const [filetype, setFiletype] = useState('');

  const resetForm = () => {
    setInputs({
      title: '',
      description: '',
      condition: '',
      price: '0.00',
    });
    // eslint-disable-next-line no-undef
    setImage(require('../assets/icon.png'));
  };

  const doUpload = async () => {
    try {
      const filename = image.uri.split('/').pop();
      // Infer the type of the image
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `${filetype}/${match[1]}` : filetype;
      if (type === 'image/jpg') type = 'image/jpeg';
      console.log('doUpload mimetype:', type);

      const moreData = {
        description: inputs.description,
        condition: inputs.condition,
        price: inputs.price,
      };

      const formData = new FormData();
      formData.append('file', {uri: image.uri, name: filename, type});
      formData.append('title', inputs.title);
      formData.append('description', JSON.stringify(moreData));

      const userToken = await AsyncStorage.getItem('userToken');
      const result = await uploadMedia(formData, userToken);
      console.log('doUpload', result);
      const tagResult = await addTag(result.file_id, appID, userToken);
      console.log('doUpload addTag', tagResult);
      if (tagResult.message) {
        Alert.alert(
          'Upload',
          result.message,
          [
            {
              text: 'Ok',
              onPress: () => {
                setUpdate(update + 1);
                doReset();
                resetForm();
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
      setFiletype(result.type);
    }
  };

  const doReset = () => {
    setImage(null);
    reset();
  };

  return (
    <ScrollView>
      <Card style={styles.card}>
        <View>
          <TouchableOpacity>
            <Image
              source={image}
              style={{width: '100%', height: 200}}
              onPress={pickImage}
            />
            <Button
              style={{margin: 20}}
              title="Select media"
              type="clear"
              onPress={pickImage}
            />
          </TouchableOpacity>
          <UploadForm
            title="Upload"
            handleSubmit={doUpload}
            handleInputChange={handleInputChange}
            loading={loading}
            inputs={inputs}
          />
          <Button
            style={{margin: 10}}
            title="Reset form"
            type="clear"
            onPress={resetForm}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    // backgroundColor: '',
  },
});

Upload.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Upload;
