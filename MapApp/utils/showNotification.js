import * as Notifications from "expo-notifications";

export default async function showNotification(marker) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Marked place',
      body: `There is a marked place ${marker.marker_id} nearby`,
    },
    trigger: null,
  });
};