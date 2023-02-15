import {View, Text, Pressable, StyleSheet} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Button({label, onPress}) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.button} onPress={onPress}>
          <FontAwesome name='picture-o' size={18} color='#000'/>
          <Text style={styles.label}> {label} </Text>
        </Pressable>
      </View>
    );
};

const styles = new StyleSheet.create({
  container: {
    width: 310,
    height: 65,
    marginBottom: 3,
    padding: 3,
    borderWidth: 3,
    borderRadius: 18,
    borderColor: '#007AFF'
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF'
  },
  label: {
    fontSize: 16,
    color: '#000'
  }
});