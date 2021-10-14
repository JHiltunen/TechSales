import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import {Button, ListItem as RNEListItem} from 'react-native-elements';
import {useFavourites, useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeSince} from '../utils/dateFunctions';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useIsFocused} from '@react-navigation/core';

const ListItem = ({singleMedia, navigation, showButtons}) => {
  const {update, setUpdate} = useContext(MainContext);
  const {deleteMedia} = useMedia();
  const allData = JSON.parse(singleMedia.description);
  const isFocused = useIsFocused();

  const {
    addFavourite,
    deleteFavourite,
    getFavouritesByFileId,
    getMyFavourites,
  } = useFavourites();
  const [likes, setLikes] = useState([]);
  const [iAmLikingIt, setIAmLikingIt] = useState(false);

  const getLikes = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const likesByFileId = await getFavouritesByFileId(singleMedia.file_id);
      setLikes(likesByFileId);

      const myLikes = await getMyFavourites(token);
      console.log('myLikes', myLikes);
      const currentLikes = myLikes.filter((like) => {
        if (like.file_id === singleMedia.file_id) {
          return like;
        }
      });
      console.log('currentLikes', currentLikes);
      setIAmLikingIt(currentLikes.length > 0 ? true : false);
    } catch (e) {
      console.log('Error', e.message);
    }
  };
  useEffect(() => {
    getLikes();
  }, [isFocused]);

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
            {/*             <RNEListItem.Subtitle numberOfLines={1}>
              {allData.description}
            </RNEListItem.Subtitle> */}
            <RNEListItem.Subtitle numberOfLines={1} style={styles.date}>
              {timeSince(singleMedia.time_added)}
            </RNEListItem.Subtitle>
            <View style={styles.container}>
              {showButtons && (
                <>
                  <Button
                    containerStyle={styles.buttons}
                    title="Modify"
                    type="outline"
                    titleStyle={{color: 'green'}}
                    onPress={() => {
                      navigation.navigate('Modify', {singleMedia, navigation});
                    }}
                  />
                  <Button
                    containerStyle={styles.buttons}
                    title="Delete"
                    type="outline"
                    titleStyle={{color: 'red'}}
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
            </View>
          </RNEListItem.Content>
          <RNEListItem.Content style={styles.info}>
            <RNEListItem.Subtitle style={styles.condition}>
              {allData.condition}
            </RNEListItem.Subtitle>
            <RNEListItem.Subtitle style={styles.price}>
              {allData.price} €
            </RNEListItem.Subtitle>
          </RNEListItem.Content>
          {!iAmLikingIt ? (
            <AntIcon
              name="hearto"
              color="black"
              size={25}
              onPress={async () => {
                const token = await AsyncStorage.getItem('userToken');
                const likePost = await addFavourite(singleMedia.file_id, token);
                if (likePost) {
                  getLikes();
                }
                console.log('Like post:', likePost);
              }}
            />
          ) : (
            <AntIcon
              name="heart"
              color="red"
              size={25}
              onPress={async () => {
                const token = await AsyncStorage.getItem('userToken');
                const dontLikePost = await deleteFavourite(
                  singleMedia.file_id,
                  token
                );
                if (dontLikePost) {
                  getLikes();
                }
                console.log('dont like post:', dontLikePost);
              }}
            />
          )}
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
    fontSize: 16,
    padding: 13,
  },
  price: {
    fontSize: 16,
  },
  image: {
    flex: 2,
    width: '100%',
    borderRadius: 5,
  },
  date: {
    display: 'flex',
    marginTop: 10,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  showButtons: PropTypes.bool.isRequired,
};

export default ListItem;
