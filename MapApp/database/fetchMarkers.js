export default function fetchMarkers(db, callbackFunction) {
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
      ( _,resultSet ) => callbackFunction(resultSet.rows._array)
    )
  );
}