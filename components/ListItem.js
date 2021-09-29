import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import {
  Avatar,
  Button,
  Card,
  ListItem as RNEListItem,
} from 'react-native-elements';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeSince} from '../utils/dateFunctions';

const ListItem = ({singleMedia, navigation, showButtons}) => {
  const {update, setUpdate} = useContext(MainContext);
  const {deleteMedia} = useMedia();
  const allData = JSON.parse(singleMedia.description);
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        navigation.navigate('Single', singleMedia);
      }}
    >
      <Avatar
        size="large"
        square
        source={{uri: uploadsUrl + singleMedia.thumbnails?.w160}}
      ></Avatar>

      <RNEListItem.Content style={styles.Content}>
        <RNEListItem.Title numberOfLines={1} h4>
          {singleMedia.title}
        </RNEListItem.Title>
        <RNEListItem.Subtitle numberOfLines={1}>
          {allData.description}
        </RNEListItem.Subtitle>
        <Card.Divider />
        <RNEListItem.Subtitle numberOfLines={1}>
          {timeSince(singleMedia.time_added)}
        </RNEListItem.Subtitle>
        {showButtons && (
          <>
            <Button
              title="Modify"
              onPress={() => {
                navigation.navigate('Modify', {singleMedia, navigation});
              }}
            />
            <Button
              title="Delete"
              onPress={async () => {
                try {
                  const token = await AsyncStorage.getItem('userToken');
                  const response = await deleteMedia(
                    singleMedia.file_id,
                    token
                  );
                  console.log('Delete', response);
                  if (response.message) {
                    setUpdate(update + 1);
                  }
                } catch (e) {
                  console.log('ListItem, delete: ', e.message);
                }
              }}
            />
          </>
        )}
      </RNEListItem.Content>
      <RNEListItem.Chevron />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 2,
    backgroundColor: '#EFD5C3',
  },
  Content: {
    marginLeft: 20,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  showButtons: PropTypes.bool.isRequired,
};

export default ListItem;
