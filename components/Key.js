import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { RFValue } from 'react-native-responsive-fontsize';

const Key = function ({ disabled, letter, onPress }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          disabled ? styles.disabled : styles.enabled,
          {
            backgroundColor: pressed || disabled ? '#6b7380' : '#ccc'
          }
        ]}
        onPress={() => onPress(letter)}
        disabled={disabled}
      >
        <Text style={styles.text}>{letter}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#50565e',
    width: Dimensions.get('window').width * 0.075,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  enabled: {

  },
  text: {
    fontSize: RFValue(13)
  }
});

Key.propTypes = {
  disabled: PropTypes.bool.isRequired,
  letter: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default Key;
