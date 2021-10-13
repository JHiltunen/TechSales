import React from 'react';
import PropTypes from 'prop-types';
import {Button, Input} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import {StyleSheet, Text} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import {ScrollView} from 'react-native-gesture-handler';

const UploadForm = ({
  title,
  handleSubmit,
  handleInputChange,
  loading,
  inputs,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <Text style={styles.price}>Price</Text>
      <CurrencyInput
        style={styles.price}
        value={inputs.price}
        onChangeValue={(price) => handleInputChange('price', price)}
        prefix="€"
        delimiter=","
        separator="."
        precision={2}
      />
      <Text style={styles.price}>Item condition:</Text>
      <Picker
        style={styles.price}
        prompt="Select item condition"
        selectedValue={inputs.condition}
        onValueChange={(itemValue, itemIndex) =>
          handleInputChange('condition', itemValue)
        }
      >
        <Picker.Item label="Select item condition..." value="0" />
        <Picker.Item label="Excellent" value="Excellent" />
        <Picker.Item label="Good" value="Good" />
        <Picker.Item label="Fair" value="Fair" />
        <Picker.Item label="Poor" value="Poor" />
      </Picker>

      <Button
        style={{marginTop: 10}}
        title={title}
        type="outline"
        onPress={handleSubmit}
        loading={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  price: {
    fontSize: 18,
    padding: 10,
  },
});

UploadForm.propTypes = {
  title: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  inputs: PropTypes.object.isRequired,
};

export default UploadForm;
