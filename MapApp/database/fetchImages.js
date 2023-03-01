export default function fetchImages(db, marker, callbackFunction) {
  db.transaction(tx =>
    tx.executeSql(
      'SELECT image_uri FROM image WHERE marker_id = ?',
      [marker.marker_id],
      (_, resultSet) => callbackFunction(resultSet.rows._array)
    )
  );
}