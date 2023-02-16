import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import LoadingScreen from "./LoadingScreen";
import Button from "./Button";
import ImagesList from "./ImagesList";

export default function MarkerScreen({route}) {
  const {db, marker} = route.params;
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.transaction(tx =>
      tx.executeSql(
        'SELECT image_uri FROM image WHERE marker_id = ?',
        [marker.marker_id],
        (_, resultSet) => setImages(resultSet.rows._array)
      )
    );

    setIsLoading(false);
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({quality: 1, allowsMultipleSelection: true});

    if (result.canceled) {
      alert('You did not select any image');
      return;
    }

    result.assets.map(asset => {
      db.transaction(tx =>
        tx.executeSql(
          'INSERT INTO image (marker_id, image_uri) VALUES (?, ?)',
          [marker.marker_id, asset.uri],
          () => {
            images.push({image_uri: asset.uri});
            setImages([...images, {image_uri: asset.uri}]);
          }
        )
      );
    });
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});