import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Text, ActivityIndicator, ScrollView} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar, Card, ListItem} from 'react-native-elements';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

const Profile = ({navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('https://placekitten.com/400/400');

  const {getFilesByTag} = useTag();

  useEffect(() => {
    (async () => {
      try {
        const file = await getFilesByTag('avatar_' + user.user_id);
        console.log('file', file);
        setAvatar(uploadsUrl + file.pop().filename);
      } catch (e) {
        console.log('useEffect', e.message);
      }
    })();
  }, [user]);

  const logout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
  };
  return (
    <ScrollView>
      <Card>
        <Card.Title>
          <Text h1>{user.username}</Text>
        </Card.Title>
        <Avatar
          containerStyle={{alignSelf: 'center', margin: 10}}
          size="xlarge"
          rounded
          source={{uri: avatar}}
          PlaceholderContent={<ActivityIndicator />}
        />
        <ListItem>
          <Avatar
            icon={{name: 'email', type: 'entypo', color: 'black', size: 20}}
          />
          <Text>{user.email}</Text>
        </ListItem>
        <ListItem
          onPress={() => {
            navigation.navigate('My Files');
          }}
        >
          <Avatar
            icon={{
              name: 'file-text-o',
              type: 'font-awesome',
              color: 'black',
              size: 20,
            }}
          />
          <ListItem.Content>
            <ListItem.Title>My Files</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color="black" />
        </ListItem>
        <ListItem onPress={logout}>
          <Avatar icon={{name: 'logout', color: 'black', size: 20}} />
          <ListItem.Content>
            <ListItem.Title>Logout</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color="black" />
        </ListItem>
      </Card>
    </ScrollView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
