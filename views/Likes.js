import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Text,
  View,
} from 'react-native';
import {useFavourites, useMedia} from '../hooks/ApiHooks';
import ListItem from '../components/ListItem';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/core';
import AnimatedLottieView from 'lottie-react-native';

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
    <KeyboardAvoidingView>
      {mediaArray.length > 0 ? (
        <FlatList
          data={mediaArray}
          renderItem={({item}) => (
            <ListItem
              singleMedia={item}
              navigation={navigation}
              showButtons={false}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.container}>
          <AnimatedLottieView
            style={styles.animations}
            source={require('../assets/45599-like.json')}
            autoPlay
            loop
          />
          <Text>You haven't liked any posts yet</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
  },
  animations: {
    alignSelf: 'center',
    height: 400,
  },
});

Likes.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Likes;
