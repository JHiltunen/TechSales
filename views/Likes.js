import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useFavourites, useMedia} from '../hooks/ApiHooks';
import ListItem from '../components/ListItem';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/core';

const Likes = ({navigation}) => {
  const isFocused = useIsFocused();
  const {getMyFavourites} = useFavourites();
  const [mediaArray, setMediaArray] = useState([]);
  const {loadMedia} = useMedia();
  const [likes, setLikes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const getLikes = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const myLikes = await getMyFavourites(token);
      setMediaArray(await loadMedia(myLikes));
      setLikes(myLikes);
    } catch (e) {
      console.log('Error', e.message);
    }
  };

  useEffect(() => {
    setIsFetching(false);
    getLikes();
  }, [isFocused]);

  return (
    <FlatList
      data={mediaArray}
      renderItem={({item}) => (
        <ListItem
          singleMedia={item}
          navigation={navigation}
          showButtons={true}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

Likes.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Likes;
