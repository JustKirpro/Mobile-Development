export default function insertMarker(db, coordinates, markers, callbackFunction) {
  const latitude = coordinates.latitude;
  const longitude = coordinates.longitude;

  db.transaction(tx =>
    tx.executeSql(
      'INSERT INTO marker (latitude, longitude) VALUES (?, ?)',
      [latitude, longitude],
      (_, resultSet) => {
        const marker = {marker_id: resultSet.insertId, latitude: latitude, longitude: longitude};
        callbackFunction([...markers, marker]);
      }
    )
  );
}