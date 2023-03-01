import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {openDatabase} from 'expo-sqlite';
import * as Notifications from "expo-notifications";

import MapScreen from './components/MapScreen';
import MarkerScreen from './components/MarkerScreen';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state', 'Possible Unhandled Promise Rejection']);

const Stack = createNativeStackNavigator();
const db = openDatabase('lab.db');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  })
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Map" component={MapScreen} options={{headerShown: false}} initialParams={{db: db}}/>
        <Stack.Screen name="Marker" component={MarkerScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};