import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { RFValue } from 'react-native-responsive-fontsize';

class SolveEntry extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  makeLetters = (word) => {
    const letterSpots = [];
    for (let i = 0; i < word.length; i += 1) {
      letterSpots.push(<Text key={i} style={styles.text}>{word.charAt(i)}</Text>);
    }
    return letterSpots;
  };

  makeLetterSpots = () => {
    const { guessString, topic } = this.props;
    const words = guessString.split(' ');
    const wordSpots = [];
    words.forEach((word, index) => {
      wordSpots.push(
        <View style={styles.wordContainer} key={`solveView ${word} ${topic}`}>
          {this.makeLetters(word)}
          {index !== words.length - 1 && this.makeLetters(' ')}
        </View>
      );
    });

    return wordSpots;
  };

  render() {
    return (

      <View style={styles.container}>
        {this.makeLetterSpots()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  wordContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    fontSize: RFValue(25),
    margin: 3,
    textAlign: 'center',
  }
});

SolveEntry.propTypes = {
  guessString: PropTypes.string.isRequired,
};

export default SolveEntry;
