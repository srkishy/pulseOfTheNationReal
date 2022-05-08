import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

class GuessEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: '',
    };
  }

  render() {
    const {
      solveMode,
      wordGuessed,
      onGuess,
      onBackspace,
      onSubmitGuess,
    } = this.props;
    const { guess } = this.state;
    return (
      <View style={styles.container}>
        {solveMode && (
        <Pressable
          style={styles.backspaceButton}
          onPress={() => onBackspace()}
        >
          <MaterialCommunityIcons name="backspace" size={24} color="white" />
        </Pressable>
        )}
        <Pressable
          style={[styles.button, wordGuessed ? styles.disabled : styles.enabled]}
          onPress={() => onGuess(guess)}
          disabled={wordGuessed}
        >
          {solveMode && (
          <Text style={[styles.text,
            {
              color: wordGuessed ? 'black' : 'white'
            }
          ]}
          >
            Cancel
          </Text>
          )}
          {!solveMode && (
          <Text style={[styles.text,
            {
              color: wordGuessed ? 'black' : 'white'
            }
          ]}
          >
            Solve
          </Text>
          )}
        </Pressable>
        {solveMode && (
        <Pressable
          style={styles.submitButton}
          onPress={() => onSubmitGuess()}
        >
          <AntDesign name="enter" size={24} color="white" />
        </Pressable>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  input: {
    borderColor: 'gray',
    width: '60%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    marginLeft: 5,
  },
  backspaceButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red',
    marginLeft: 5,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'green',
    marginLeft: 5,
  },
  text: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  disabled: {
    backgroundColor: '#6b7380',
    color: 'black',
  },
  enabled: {
    color: 'white',
  },
});

GuessEntry.propTypes = {
  onGuess: PropTypes.func.isRequired,
  wordGuessed: PropTypes.bool.isRequired,
  solveMode: PropTypes.bool.isRequired,
  onSubmitGuess: PropTypes.func.isRequired,
  onBackspace: PropTypes.func.isRequired,
};

export default GuessEntry;
