import React from 'react';
import PropTypes from 'prop-types';
import {Image, SafeAreaView, StyleSheet, Text} from 'react-native';
import {uploadsUrl} from '../utils/variables';
import {format} from 'date-fns';

const Single = ({route}) => {
  const {params} = route;
  console.log('Single', route.params);
  return (
    <SafeAreaView style={styles.container}>
      <Text>{params.title}</Text>
      <Image
        style={{width: 200, height: 300}}
        source={{uri: uploadsUrl + params.filename}}
      />
      <Text>{params.description}</Text>
      <Text>{params.user_id}</Text>
      <Text>{format(new Date(params.time_added), 'dd.MMMM.yyyy')}</Text>
      <Text>{params.media_type}</Text>
    </SafeAreaView>
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
