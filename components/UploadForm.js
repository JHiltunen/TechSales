import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Input} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import {Text} from 'react-native';

const UploadForm = ({
  title,
  handleSubmit,
  handleInputChange,
  loading,
  inputs,
}) => {
  const [selectedCondition, setSelectedCondition] = useState();

  const handleValueChange = (itemValue, itemIndex) => {
    if (itemIndex !== 0) {
      setSelectedCondition(itemValue);
    }
  };

  return (
    <>
      <Input
        autoCapitalize="none"
        placeholder="title"
        onChangeText={(txt) => handleInputChange('title', txt)}
        value={inputs.title}
      />
      <Input
        autoCapitalize="none"
        placeholder="description"
        multiline={true}
        onChangeText={(txt) => handleInputChange('description', txt)}
        value={inputs.description}
      />
      <Picker
        prompt="Select item condition"
        selectedValue={selectedCondition}
        onValueChange={(itemValue, itemIndex) =>
          handleValueChange(itemValue, itemIndex)
        }
      >
        <Picker.Item label="Select item condition..." value="0" />
        <Picker.Item label="Excellent" value="Excellent" />
        <Picker.Item label="Good" value="Good" />
        <Picker.Item label="Fair" value="Fair" />
        <Picker.Item label="Poor" value="Poor" />
      </Picker>
      <Button
        title={title}
        type="clear"
        onPress={handleSubmit}
        loading={loading}
      />
    </>
  );
};

UploadForm.propTypes = {
  title: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  inputs: PropTypes.object.isRequired,
};

export default UploadForm;
