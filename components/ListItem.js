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
            <RNEListItem.Subtitle numberOfLines={1} style={styles.margin}>
              {timeSince(singleMedia.time_added)}
            </RNEListItem.Subtitle>
            {showButtons && (
              <>
                <Button
                  style={styles.buttons}
                  title="Modify"
                  onPress={() => {
                    navigation.navigate('Modify', {singleMedia, navigation});
                  }}
                />
                <Button
                  style={styles.buttons}
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
    padding: 20,
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
    marginTop: 10,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
  },
  condition: {
    fontSize: 15,
    padding: 5,
    marginLeft: 20,
    marginTop: 10,
  },
  price: {
    fontSize: 15,
    padding: 5,
    marginLeft: 20,
  },
  image: {
    flex: 2,
    width: '100%',
    borderRadius: 5,
  },
  margin: {
    display: 'flex',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  buttons: {},
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  showButtons: PropTypes.bool.isRequired,
};

export default ListItem;
