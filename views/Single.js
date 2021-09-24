import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Card, Icon, ListItem} from 'react-native-elements';
import {Audio, Video} from 'expo-av';
import {formatDate} from '../utils/dateFunctions';

const Single = ({route}) => {
  const {params} = route;
  const {getUserInfo} = useUser();
  const [ownerInfo, setOwnerInfo] = useState({username: ''});
  const [likes, setLikes] = useState([]);
  const [mylikes, setMyLikes] = useState(false);
  const videoRef = useRef(null);
  const [disabled, setDisabled] = useState(false);

  console.log('Single', route.params);

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

  useEffect(() => {
    getOwnerInfo();
    getLikes();
  }, []);

  return (
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
            videoRef.current.playAsync();
            setDisabled(true); // disable touchableOpacity when video is started
          }}
        >
          <Video
            ref={videoRef}
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
