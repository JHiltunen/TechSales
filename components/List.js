import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {FlatList, View} from 'react-native';
import ListItem from './ListItem';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SearchBar} from 'react-native-elements';

const List = ({navigation}) => {
  const {mediaArray} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState('');
  const [testiTaulukko, setTestiTaulukko] = useState([]);
  const refreshList = () => {
    setIsFetching(true);
    setUpdate(update + 1);
  };
  useEffect(() => {
    setIsFetching(false);
    setTestiTaulukko(mediaArray);
  }, [mediaArray]);
  console.log('List: mediaArray', update);

  return (
    <View>
      <SearchBar
        platform="android"
        placeholder="Search Here..."
        inputStyle
        onChangeText={async (text) => {
          setSearch(text);
          setTestiTaulukko(
            mediaArray.filter((file) => {
              const allData = JSON.parse(file.description);
              return (
                file.title.toUpperCase().includes(text.toUpperCase()) ||
                allData.description.toUpperCase().includes(text.toUpperCase())
              );
            })
          );
        }}
        value={search}
      />
      <FlatList
        data={testiTaulukko}
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
