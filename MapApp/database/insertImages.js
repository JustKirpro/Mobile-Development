export default function insertImages(db, pickedImages, marker, images, callbackFunction) {
  pickedImages.assets.map(asset => {
    db.transaction(tx =>
      tx.executeSql(
        'INSERT INTO image (marker_id, image_uri) VALUES (?, ?)',
        [marker.marker_id, asset.uri],
        () => {
          images.push({image_uri: asset.uri});
          callbackFunction([...images]);
        }
      )
    );
  });
}