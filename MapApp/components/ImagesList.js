import {Image, ScrollView, StyleSheet} from "react-native";

export default function ImagesList({images}) {
  const imagesToDisplay = images.map((image, index) =>
    <Image key={index} style={styles.image} source={{uri: image.image_uri}}/>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {imagesToDisplay}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 480,
    borderRadius: 20,
    marginBottom: 10
  }
});