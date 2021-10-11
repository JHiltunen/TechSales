import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Card, ListItem, Text, Icon, Avatar, Input} from 'react-native-elements';
import {Video, Audio} from 'expo-av';
import {useFavourites, useMedia, useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {formatDate} from '../utils/dateFunctions';
import * as ScreenOrientation from 'expo-screen-orientation';
import AntIcon from 'react-native-vector-icons/AntDesign';

const Single = ({route}) => {
  const {params} = route;
  const {getUserInfo} = useUser();
  const {
    addFavourite,
    deleteFavourite,
    getFavouritesByFileId,
    getMyFavourites,
  } = useFavourites();
  const {uploadComment} = useMedia();
  const [comment, setComment] = useState('');
  const [ownerInfo, setOwnerInfo] = useState({username: ''});
  const [likes, setLikes] = useState([]);
  const [iAmLikingIt, setIAmLikingIt] = useState(false);
  const [videoRef, setVideoRef] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const allData = JSON.parse(params.description);

  // screen orientation, show video in fullscreen when landscape
  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const showVideoInFullscreen = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer();
    } catch (error) {
      console.error('fullscreen', error.message);
    }
  };

  useEffect(() => {
    unlock();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        showVideoInFullscreen();
      }
    });
    // when leaving the component lock screen to portrait
    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);

  // end screen orientation

  const getOwnerInfo = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setOwnerInfo(await getUserInfo(params.user_id, token));
  };
  const getLikes = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const likesByFileId = await getFavouritesByFileId(params.file_id);
      setLikes(likesByFileId);

      const myLikes = await getMyFavourites(token);
      console.log('myLikes', myLikes);
      const currentLikes = myLikes.filter((like) => {
        if (like.file_id === params.file_id) {
          return like;
        }
      });
      console.log('currentLikes', currentLikes);
      setIAmLikingIt(currentLikes.length > 0 ? true : false);
    } catch (e) {
      console.log('Error', e.message);
    }
  };
  const getAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + params.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getOwnerInfo();
    getAvatar();
    getLikes();
  }, []);

  const postComment = async (fileId, txt) => {
    try {
      const token = AsyncStorage.getItem('userToken');
      const comment = {
        file_id: fileId,
        comment: txt,
      };
    } catch (e) {
      console.log('Single.js postComment error', e.message);
      return e.message;
    }
  };

  return (
    <ScrollView>
      <Card>
        <ListItem>
          <Avatar source={{uri: avatar}} />
          <Text>
            {ownerInfo.username} || {params.file_id}
          </Text>
        </ListItem>
        <Card.Divider />
        <Card.Title style={styles.title}>{params.title}</Card.Title>

        {params.media_type === 'image' && (
          <Card.Image
            source={{uri: uploadsUrl + params.filename}}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        )}
        {params.media_type === 'video' && (
          <TouchableOpacity // usePoster hides video so use this to start it
            disabled={disabled}
            onPress={() => {
              videoRef.playAsync();
              setDisabled(true); // disable touchableOpacity when video is started
            }}
          >
            <Video
              ref={handleVideoRef}
              style={styles.image}
              source={{uri: uploadsUrl + params.filename}}
              useNativeControls
              resizeMode="contain"
              usePoster
              posterSource={{uri: uploadsUrl + params.screenshot}}
            />
          </TouchableOpacity>
        )}
        {params.media_type === 'audio' && (
          <>
            <Text>Audio not supported YET.</Text>
            <Audio></Audio>
          </>
        )}
        <ListItem>
          {params.media_type === 'image' && (
            <Icon name="image-outline" type="ionicon" />
          )}
          {params.media_type === 'video' && (
            <Icon name="videocam-outline" type="ionicon" />
          )}
          <ListItem.Content>
            <ListItem.Subtitle style={styles.date}>
              {formatDate(new Date(params.time_added), 'eee d. MMM y')} klo.
              {formatDate(new Date(params.time_added), 'HH.mm')}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <ListItem style={styles.container}>
          <ListItem.Title style={styles.listItemTitle}>
            Description:
          </ListItem.Title>
          <ListItem.Content style={styles.listItemContent}>
            <Text style={styles.text}>{allData.description}</Text>
          </ListItem.Content>
        </ListItem>
        <ListItem style={styles.container}>
          <ListItem.Title style={styles.listItemTitle}>
            Condition:
          </ListItem.Title>
          <ListItem.Content style={styles.listItemContent}>
            <Text style={styles.text}>{allData.condition}</Text>
          </ListItem.Content>
        </ListItem>
        <ListItem style={styles.container}>
          <ListItem.Title style={styles.listItemTitle}>Price:</ListItem.Title>
          <ListItem.Content style={styles.listItemContent}>
            <Text style={styles.text}>{allData.price} €</Text>
          </ListItem.Content>
        </ListItem>
        <Card.Divider />

        <ListItem>
          {/* TODO: show like or dislike button depending on the current like status,
          calculate like count for a file */}
          {!iAmLikingIt ? (
            <AntIcon
              name="hearto"
              color="black"
              size={25}
              onPress={async () => {
                const token = await AsyncStorage.getItem('userToken');
                const likePost = await addFavourite(params.file_id, token);
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
                  params.file_id,
                  token
                );
                if (dontLikePost) {
                  getLikes();
                }
                console.log('dont like post:', dontLikePost);
              }}
            />
          )}
          <Text>Likes: {likes.length}</Text>
        </ListItem>
        <Card.Divider />
        <Input
          placeholder="Comment"
          onChangeText={(value) => {
            setComment(value);
          }}
          leftIcon={<Icon name="comment" size={24} color="black" />}
          rightIcon={
            <Icon
              name="send"
              size={24}
              color="black"
              onPress={async () => {
                try {
                  const token = await AsyncStorage.getItem('userToken');
                  const commentObject = {
                    file_id: params.file_id,
                    comment: comment,
                  };
                  console.log('comment:', commentObject);
                  const upload = await uploadComment(
                    JSON.stringify(commentObject),
                    token
                  );
                  if (upload) {
                    alert('Comment added');
                  }
                } catch (e) {
                  alert('Error: ', e.message);
                  console.log('Error', e.message);
                }
              }}
            />
          }
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    backgroundColor: 'red',
  },
  listItemTitle: {
    alignSelf: 'flex-start',
    flex: 1,
  },
  listItemContent: {
    flex: 2,
  },
  text: {
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.5,
  },
  title: {
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'left',
  },
  date: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Single.propTypes = {
  route: PropTypes.object.isRequired,
};

export default Single;
