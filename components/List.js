import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import ListItem from './ListItem';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {SearchBar} from 'react-native-elements';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomLabel from './CustomLabel';

const List = ({navigation}) => {
  const {mediaArray} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState('');
  const [testiTaulukko, setTestiTaulukko] = useState([]);

  const filterByPrice = () => {
    setTestiTaulukko(
      mediaArray.filter((file) => {
        const allData = JSON.parse(file.description);
        console.log('Price: ', allData.price);
        console.log('Slider1: ', multiSliderValue[0]);
        console.log('Slider2: ', multiSliderValue[1]);
        return (
          allData.price >= multiSliderValue[0] &&
          allData.price <= multiSliderValue[1]
        );
      })
    );
  };

  const refreshList = () => {
    setIsFetching(true);
    setUpdate(update + 1);
  };

  useEffect(() => {
    setIsFetching(false);
    setTestiTaulukko(mediaArray);
  }, [mediaArray]);
  console.log('List: mediaArray', update);
  const [multiSliderValue, setMultiSliderValue] = React.useState([0, 100]);
  const multiSliderValuesChange = (values) => setMultiSliderValue(values);

  return (
    <View>
      <View style={styles.haku}>
        <SearchBar
          // inputStyle={{backgroundColor: '#FFFCF2'}}
          containerStyle={{
            backgroundColor: '#FFFFFF',
          }}
          placeholder="Search Here..."
          platform="ios"
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
        <View style={styles.sliderContainer}>
          <Text>Filter price: </Text>
          <MultiSlider
            styles={styles.slider}
            values={[multiSliderValue[0], multiSliderValue[1]]}
            sliderLength={250}
            onValuesChange={(values) => {
              multiSliderValuesChange(values);
              filterByPrice();
            }}
            min={0}
            max={100}
            step={10}
            allowOverlap
            snapped={true}
            enableLabel={true}
            customLabel={CustomLabel}
          />
        </View>
      </View>
      <View style={styles.lista}>
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
    </View>
  );
};

List.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  haku: {
    height: '22%',
    backgroundColor: '#FFFFFF',
  },
  lista: {
    height: '78%',
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignSelf: 'center',
    paddingVertical: 20,
  },
});
export default List;
