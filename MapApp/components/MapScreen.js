import React, {useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import * as Location from "expo-location"
import * as Notifications from "expo-notifications";

import LoadingScreen from "./LoadingScreen";

import fetchMarkers from "../database/fetchMarkers";
import insertMarker from "../database/insertMarker";
import arePointsCloseEnough from "../utils/arePointsCloseEnough";
import showNotification from "../utils/showNotification";

const INITIAL_REGION = {latitude: 37.332158, longitude: -122.030749, latitudeDelta: 0.025, longitudeDelta: 0.025};
const DISTANCE_IN_METERS = 100;

export default function MapScreen({route, navigation}) {
  const {db} = route.params;
  const [position, setPosition] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [notifications, setNotifications] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMarkers(db, setMarkers);

    const requestNotificationsPermission = async () => {
      const status = await Notifications.requestPermissionsAsync();

      if (!status.granted) {
        alert('Permission to send notifications was denied');
      }
    };

    const requestLocationPermission = async () => {
      const foregroundStatus = await Location.requestForegroundPermissionsAsync();

      if (!foregroundStatus.granted) {
        alert('Permission to access location in foreground was denied');
        return;
      }

      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();

      if (!backgroundStatus.granted) {
        alert('Permission to access location in background was denied');
      }

      await Location.watchPositionAsync({
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 10
      }, currentPosition => setPosition(currentPosition.coords));
    };

    requestNotificationsPermission().catch(console.error);
    requestLocationPermission().catch(console.error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (position === null || markers.length === 0) {
      return;
    }

    const processMarkers = async () => {
      for (const marker of markers) {
        const isClose = arePointsCloseEnough(marker, position, DISTANCE_IN_METERS);
        const id = marker.marker_id;

        if (isClose && notifications[id] === undefined) {
          notifications[id] = await showNotification(marker);
          setNotifications(notifications);
        } else if (!isClose && notifications[id] !== undefined) {
          await Notifications.dismissNotificationAsync(notifications[id]);
          delete notifications[id];
          setNotifications(notifications);
        }
      }
    };

    processMarkers().catch(console.error);
  }, [position, markers]);

  const onMapPress = (e) => {
    const coordinates = e.nativeEvent.coordinate;
    insertMarker(db, coordinates, markers, setMarkers);
  };

  const onMarkerPress = (e, marker) => navigation.navigate("Marker", {db: db, marker: marker});

  if (isLoading) {
    return <LoadingScreen/>
  }

  const markersToDisplay = markers.map((marker, index) =>
      <Marker key={index} coordinate={marker} title={marker.marker_id.toString()} onPress={e => onMarkerPress(e, marker)} stopPropagation={true}/>
  );

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={INITIAL_REGION} showsUserLocation={true} onPress={onMapPress} provider={PROVIDER_GOOGLE}>
        {markersToDisplay}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  }
});