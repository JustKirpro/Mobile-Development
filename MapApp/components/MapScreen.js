import {useState, useEffect} from "react";
import {View, StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import LoadingScreen from "./LoadingScreen";

const initialRegion = {latitude: -15.96, longitude: -5.71, latitudeDelta: 0.15, longitudeDelta: 0.15};

export default function MapScreen({route, navigation}) {
  const db = route.params.db;
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS marker (marker_id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL, longitude REAL);'
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS image (image_id INTEGER PRIMARY KEY AUTOINCREMENT, marker_id REFERENCES marker(marker_id),image_uri TEXT);'
      );
    });

    db.transaction(tx =>
      tx.executeSql(
        'SELECT * FROM marker;',
        [],
        ( _,resultSet ) => setMarkers(resultSet.rows._array)
      )
    );

    setIsLoading(false);
  })

  const onMapPress = (e) => {
    const coordinates = e.nativeEvent.coordinate;
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;

    db.transaction(tx =>
      tx.executeSql(
        'INSERT INTO marker (latitude, longitude) VALUES (?, ?)',
        [latitude, longitude],
        (_, resultSet) => {
          const marker = {marker_id: resultSet.insertId, latitude: latitude, longitude: longitude};
          setMarkers([...markers, marker]);
        }
      )
    );
  };

  const onMarkerPress = (e, marker) => navigation.navigate("Marker", {db: db, marker: marker});

  if (isLoading) {
    return <LoadingScreen/>
  }

  const markersToDisplay = markers.map((marker, index) =>
    <Marker key={index} coordinate={marker} onPress={e => onMarkerPress(e, marker)} stopPropagation={true}/>
  );

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion} onPress={onMapPress} provider={PROVIDER_GOOGLE}>
        {markersToDisplay}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  }
});