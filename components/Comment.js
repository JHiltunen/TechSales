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
import {Avatar} from 'react-native-elements';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeSince} from '../utils/dateFunctions';
import AntIcon from 'react-native-vector-icons/AntDesign';

const Comment = ({comment}) => {
  console.log('comment user', comment.user_id, comment.comment);
  const [avatar, setAvatar] = useState('https://via.placeholder.com/150');
  const [currentUser, setCurrentUser] = useState([]);
  const [user, setUser] = useState([]);
  const {getFilesByTag} = useTag();
  const {getUserInfo, getCurrentUserInfo} = useUser();
  const {deleteComment} = useMedia();

  const getUsername = async () => {
    console.log('getUsername', comment.user_id, comment.comment);
    const token = await AsyncStorage.getItem('userToken');
    const userInfo = await getUserInfo(comment.user_id, token);
    console.log('username', userInfo.username, userInfo.user_id);
    setUser(userInfo);
  };

  const getCurrentUserUserInformation = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const currentUseruserInfo = await getCurrentUserInfo(token);
    setCurrentUser(currentUseruserInfo);
    console.log('current user', currentUser);
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
    getCurrentUserUserInformation();
    getUsername();
    getAvatar();
  }, []);

  return (
    <View style={styles.container}>
      <Avatar source={{uri: avatar}} rounded />
      <View style={styles.commentDetail}>
        <Text style={styles.username}>{user.username}</Text>
        <Text> {comment.comment}</Text>
        <Text style={styles.timeSince}>{timeSince(comment.time_added)}</Text>
        {currentUser.user_id === comment.user_id ? (
          <AntIcon
            name="delete"
            size={20}
            onPress={async () => {
              try {
                const token = await AsyncStorage.getItem('userToken');
                const result = await deleteComment(comment.comment_id, token);
                console.log('Result:', result);
                if (result) {
                  alert('Comment deleted');
                }
              } catch (e) {
                console.log('error on comment delete', e.message);
              }
            }}
          />
        ) : undefined}
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
