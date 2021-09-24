import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Button} from 'react-native-elements';

const ListItem = ({singleMedia, navigation, showButtons}) => {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        navigation.navigate('Single', singleMedia);
      }}
    >
      <Avatar
        style={styles.image}
        size="large"
        square
        source={{uri: uploadsUrl + singleMedia.thumbnails?.w160}}
      ></Avatar>

      <View style={styles.textbox}>
        <Text style={styles.listTitle}>{singleMedia.title}</Text>
        <Text>{singleMedia.description}</Text>
        {showButtons && (
          <>
            <Button title="Modify" />
            <Button title="Delete" />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 5,
    backgroundColor: '#eee',
    borderRadius: 6,
    flex: 1,
  },

  imagebox: {
    flex: 1,
  },

  image: {
    flex: 1,
    borderRadius: 6,
  },

  textbox: {
    flex: 2,
    padding: 10,
  },

  listTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 15,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  showButtons: PropTypes.bool.isRequired,
};

export default ListItem;
