import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Button, ListItem as RNEListItem} from 'react-native-elements';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeSince} from '../utils/dateFunctions';

const Comment = ({comment}) => {
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [username, setUsername] = useState('');
  const {getFilesByTag} = useTag();
  const {getUserInfo} = useUser();

  const getUsername = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userInfo = await getUserInfo(comment.user_id, token);
    console.log('username', userInfo.username);
    setUsername(userInfo.username);
  };

  const getAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + comment.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getUsername();
    getAvatar();
  }, []);

  return (
    <View style={styles.container}>
      <Avatar source={{uri: avatar}} rounded />
      <View style={styles.commentDetail}>
        <Text style={styles.username}>{username}</Text>
        <Text> {comment.comment}</Text>
        <Text style={styles.timeSince}>{timeSince(comment.time_added)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    margin: 5,
  },
  commentDetail: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },
  timeSince: {
    alignSelf: 'flex-end',
    flexBasis: '100%',
  },
  username: {
    fontWeight: 'bold',
  },
});

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default Comment;
