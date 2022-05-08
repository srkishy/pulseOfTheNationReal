import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import { RFValue } from 'react-native-responsive-fontsize';

class PuzzleEntry extends React.Component {
  fadeAnim = new Animated.Value(0);

  movingLetters = [];

  constructor(props) {
    super(props);
    this.state = {
      animated: false,
    };
  }

  componentDidUpdate() {
    this.fadeAnim = new Animated.Value(0);
  }

  animateLetters = () => {
    let counter = 1;
    this.movingLetters.forEach((animatedValue) => {
      Animated.timing(animatedValue, {
        toValue: -10,
        duration: 250,
        delay: counter * 75,
        useNativeDriver: true,
      }).start(() => Animated.timing(animatedValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start());
      counter += 2;
    });
  };

  fadeIn = () => {
    Animated.timing(this.fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  makeLetters = (word, index) => {
    const letterSpots = [];
    const { wordGuessed, newestLetter, lettersGuessed } = this.props;
    const { animated } = this.state;
    for (let i = 0; i < word.length; i += 1) {
      if (wordGuessed) {
        if (word.charAt(i) === ' ') {
          letterSpots.push(<View key={`${i} puzzle ${word} ${index}`} style={styles.spaceContainer}><Text key={`${i} puzzle ${word} ${index}`} style={styles.text}> </Text></View>);
        } else if (!animated) {
          const animatedPosition = new Animated.Value(0);
          this.movingLetters.push(animatedPosition);
          letterSpots.push(
            <Animated.View key={`${i} puzzle ${word} ${index}`} style={[styles.textContainer, { transform: [{ translateY: animatedPosition }] }]}>
              <Text key={`${i} puzzle ${word} ${index}`} style={styles.text}>{word.charAt(i)}</Text>
            </Animated.View>
          );
        } else {
          letterSpots.push(<View key={`${i} puzzle ${word} ${index}`} style={styles.textContainer}><Text key={`${i} puzzle ${word} ${index}`} style={styles.text}>{word.charAt(i)}</Text></View>);
        }
      } else if (newestLetter === word.charAt(i)) {
        letterSpots.push(
          <View key={`${i} puzzle ${word} ${index}`} style={styles.textContainer}>
            <Animated.Text
              key={`${i} puzzle ${word} ${index}`}
              style={[{ opacity: this.fadeAnim }, styles.text]}

            >
              {word.charAt(i)}
            </Animated.Text>
          </View>
        );
      } else if (word.charAt(i) === ' ') {
        letterSpots.push(<View key={`${i} puzzle ${word} ${index}`} style={styles.spaceContainer}><Text key={`${i} puzzle ${word} ${index}`} style={styles.text}> </Text></View>);
      } else if (!isLetter(word.charAt(i))) {
        letterSpots.push(<View key={`${i} puzzle ${word} ${index}`} style={styles.textContainer}><Text key={`${i} puzzle ${word} ${index}`} style={styles.text}>{word.charAt(i)}</Text></View>);
      } else {
        letterSpots.push(
          <View key={`${i} puzzle ${word} ${index}`} style={styles.textContainer}>
            <Text key={`${i} puzzle ${word} ${index}`} style={styles.text}>
              {lettersGuessed.includes(word.charAt(i)) ? word.charAt(i) : ' '}
            </Text>
          </View>
        );
      }
    }
    return letterSpots;
  };

  makeLetterSpots = () => {
    const { topic } = this.props;

    const words = topic.split(' ');
    const wordSpots = [];
    words.forEach((word, index) => {
      wordSpots.push(
        <View style={styles.wordContainer} key={`view ${word} ${topic}`}>
          {this.makeLetters(word, index)}
          {index !== words.length - 1 && this.makeLetters(' ')}
        </View>
      );
    });

    this.fadeIn();
    this.animateLetters();
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
    fontSize: RFValue(12),
    margin: 3,
    textAlign: 'center',
  },
  textContainer: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#565758',
    marginBottom: 5,
    marginRight: 3,
    minWidth: Dimensions.get('window').width * 0.06
  },
  spaceContainer: {
    minWidth: Dimensions.get('window').width * 0.06,
    borderWidth: 0,
  }
});

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

PuzzleEntry.propTypes = {
  topic: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  lettersGuessed: PropTypes.array.isRequired,
  // eslint-disable-next-line react/require-default-props
  newestLetter: PropTypes.string,
  wordGuessed: PropTypes.bool.isRequired,
};

export default PuzzleEntry;
