import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {openDatabase} from "expo-sqlite";

import MapScreen from "./components/MapScreen";
import MarkerScreen from "./components/MarkerScreen";

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const Stack = createNativeStackNavigator();
const db = openDatabase('markers.db');

export default function App() {

  useEffect(()=> {
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS marker (marker_id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL, longitude REAL);'
        );

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS image (image_id INTEGER PRIMARY KEY AUTOINCREMENT, marker_id REFERENCES marker(marker_id),image_uri TEXT);'
        );
      });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Map" component={MapScreen} options={{headerShown: false}} initialParams={{db: db}}/>
        <Stack.Screen name="Marker" component={MarkerScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};