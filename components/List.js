import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {FlatList} from 'react-native';
import ListItem from './ListItem';
import {baseUrl} from '../utils/variables';

const List = (props) => {
  const [mediaArray, setMediaArray] = useState([]);
  const url = baseUrl + 'media';

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setMediaArray(json);
      } catch (e) {
        console.log(e.message);
      }
    };
    loadMedia();
  }, []);
  console.log('List row 15 ', mediaArray);

  return (
    <FlatList
      data={mediaArray}
      renderItem={({item}) => <ListItem singleMedia={item} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

List.propTypes = {};

export default List;
