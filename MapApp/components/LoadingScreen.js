import {Text, View, StyleSheet} from "react-native";

export default function LoadingScreen()
{
  return (
    <View style={styles.loadingScreen}>
      <Text>Loading data...</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center'
  }
});