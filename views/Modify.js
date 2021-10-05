import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {View, ActivityIndicator, Alert} from 'react-native';
import UploadForm from '../components/UploadForm';
import useUploadForm from '../hooks/UploadHooks';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const Modify = ({route}) => {
  const navigation = route.params.navigation;
  // const [image, setImage] = useState(require('../assets/icon.png'));
  const {inputs, handleInputChange, setInputs} = useUploadForm();
  const {modifyMedia, loading} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const allData = JSON.parse(route.params.singleMedia.description);
  useEffect(() => {
    (() => {
      setInputs({
        title: route.params.singleMedia.title,
        description: allData.description,
        price: allData.price,
        condition: allData.condition,
      });
    })();
  }, []);

  const doModify = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      const moreData = {
        description: inputs.description,
        condition: inputs.condition,
        price: inputs.price,
      };
      const data = {
        title: inputs.title,
        description: JSON.stringify(moreData),
      };

      const result = await modifyMedia(
        data,
        userToken,
        route.params.singleMedia.file_id
      );
      if (result.message) {
        Alert.alert(
          'Modify',
          result.message,
          [
            {
              text: 'Ok',
              onPress: () => {
                navigation.navigate('My Files');
                setUpdate(update + 1);
              },
            },
          ],
          {cancelable: false}
        );
      }
    } catch (e) {
      console.log('doModify error', e.message);
    }
  };
  return (
    <View>
      <UploadForm
        title="Upload"
        handleSubmit={doModify}
        handleInputChange={handleInputChange}
        loading={loading}
        inputs={inputs}
      />
      {loading && <ActivityIndicator />}
    </View>
  );
};

Modify.propTypes = {
  route: PropTypes.object.isRequired,
};

export default Modify;
