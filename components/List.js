import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {FlatList, View} from 'react-native';
import ListItem from './ListItem';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SearchBar} from 'react-native-elements';

const List = ({navigation}) => {
  let {mediaArray} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState('');
  const {searchMedia} = useMedia();
  const [filterMediaArray, setfilterMediaArray] = useState([]);

  const refreshList = () => {
    setIsFetching(true);
    setUpdate(update + 1);
  };
  useEffect(() => {
    setIsFetching(false);
  }, [mediaArray]);
  console.log('List: mediaArray', update);

  return (
    <View>
      <SearchBar
        placeholder="Search Here..."
        onChangeText={async (text) => {
          setSearch(text);

          try {
            const token = await AsyncStorage.getItem('userToken');
            const data = {
              title: search,
            };
            setfilterMediaArray(await searchMedia(token, data));
            mediaArray = filterMediaArray;
            console.log('Search result', filterMediaArray);
          } catch (e) {
            console.log('Seppo' + e.message);
          }
        }}
        value={search}
      />
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
        onRefresh={refreshList}
        refreshing={isFetching}
      />
    </View>
  );
};

List.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default List;
