import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import LoadingScreen from "./LoadingScreen";
import Button from "./Button";
import ImagesList from "./ImagesList";

import fetchImages from "../database/fetchImages";
import insertImages from "../database/insertImages";

export default function MarkerScreen({route}) {
  const {db, marker} = route.params;
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages(db, marker, setImages);
    setIsLoading(false);
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({quality: 1, allowsMultipleSelection: true});

    if (result.canceled) {
      alert('You did not select any image');
      return;
    }

    insertImages(db, result, marker, images, setImages);
  };

  if (isLoading) {
    return <LoadingScreen/>
  }

  return (
    <View style={styles.container}>
      <Button label="Add Image" onPress={pickImageAsync}/>
      <ImagesList images={images}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});