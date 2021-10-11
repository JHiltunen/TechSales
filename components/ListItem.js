import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {Image, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import {Button, ListItem as RNEListItem} from 'react-native-elements';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeSince} from '../utils/dateFunctions';

const ListItem = ({singleMedia, navigation, showButtons}) => {
  const {update, setUpdate} = useContext(MainContext);
  const {deleteMedia} = useMedia();
  const allData = JSON.parse(singleMedia.description);
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          navigation.navigate('Single', singleMedia);
        }}
      >
        <Image
          style={styles.image}
          source={{uri: uploadsUrl + singleMedia.thumbnails?.w640}}
        ></Image>

        <RNEListItem.Content style={styles.container}>
          <RNEListItem.Content style={styles.details}>
            <RNEListItem.Title numberOfLines={1} h4>
              {singleMedia.title}
            </RNEListItem.Title>
            <RNEListItem.Subtitle numberOfLines={1}>
              {allData.description}
            </RNEListItem.Subtitle>
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
          <RNEListItem.Content style={styles.info}>
            <RNEListItem.Subtitle style={styles.condition}>
              {allData.condition}
            </RNEListItem.Subtitle>
            <RNEListItem.Subtitle style={styles.price}>
              {allData.price} €
            </RNEListItem.Subtitle>
          </RNEListItem.Content>
          <RNEListItem.Chevron color="black" />
        </RNEListItem.Content>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    padding: 15,
    marginBottom: 2,
    backgroundColor: '#DADAD9',
    height: 330,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: {
    marginLeft: 20,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
  },
  condition: {
    fontSize: 15,
    padding: 5,
  },
  price: {
    fontSize: 15,
    padding: 5,
  },
  image: {
    flex: 2,
    width: '100%',
    borderRadius: 5,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  showButtons: PropTypes.bool.isRequired,
};

export default ListItem;
