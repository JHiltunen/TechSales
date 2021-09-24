import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {
  Card,
  ListItem,
  Text,
  Button,
  Icon,
  Avatar,
} from 'react-native-elements';
import {Video, Audio} from 'expo-av';
import {useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {formatDate} from '../utils/dateFunctions';
import * as ScreenOrientation from 'expo-screen-orientation';

const Single = ({route}) => {
  const {params} = route;
  const {getUserInfo} = useUser();
  const [ownerInfo, setOwnerInfo] = useState({username: ''});
  const [likes, setLikes] = useState([]);
  const [mylikes, setMyLikes] = useState(false);
  const [videoRef, setVideoRef] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState('http://placekitten.com/100');

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

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);

  const getOwnerInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setOwnerInfo(await getUserInfo(params.user_id, token));
    } catch (e) {
      console.log('getUserInfo', e.message);
    }
  };

  const getLikes = async () => {
    // TODO: use api hooks to get favourites
    // setLikes()
    // set the value of iAmLikingIt
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
    getLikes();
    getAvatar();
  }, []);

  return (
    <ScrollView>
      <Card>
        <ListItem>
          {params.media_type === 'image' && (
            <Icon name="image-outline" type="ionicon" />
          )}
          {params.media_type === 'video' && (
            <Icon name="videocam-outline" type="ionicon" />
          )}
          <ListItem.Content>
            <ListItem.Title>{params.title}</ListItem.Title>
            <ListItem.Subtitle>
              {formatDate(new Date(params.time_added), 'eeee d. MMMM y')}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              klo {formatDate(new Date(params.time_added), 'HH.mm')}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <Card.Divider />
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
        <Card.Divider />
        <Text style={styles.description}>{params.description}</Text>
        <ListItem>
          <Avatar source={{uri: avatar}} />
          <Text>{ownerInfo.username}</Text>
        </ListItem>
        <ListItem>
          {/* TODO: show like or dislike button depending on the current like status,
        calculate like count for a file */}
          {mylikes ? (
            <Button
              title="Like"
              onPress={() => {
                // use api hooks to POST a favourite
              }}
            />
          ) : (
            <Button
              title="Unlike"
              onPress={() => {
                // use api hooks to DELETE a favourite
              }}
            />
          )}
          <Text>Total likes: {likes.length}</Text>
        </ListItem>
      </Card>
    </ScrollView>
  );
};

Single.propTypes = {
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

export default Single;
