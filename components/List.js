import React from 'react';
import PropTypes from 'prop-types';
import {FlatList} from 'react-native';
import ListItem from './ListItem';
import {useMedia} from '../hooks/ApiHooks';

const List = ({navigation}) => {
  const {mediaArray} = useMedia();

  return (
    <FlatList
      data={mediaArray.reverse}
      renderItem={({item}) => (
        <ListItem singleMedia={item} navigation={navigation} />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default List;
