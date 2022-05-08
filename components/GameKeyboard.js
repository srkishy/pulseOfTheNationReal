import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import defaultKeyboard1 from '../data/englishKeyboard1.json';
import defaultKeyboard2 from '../data/englishKeyboard2.json';
import defaultKeyboard3 from '../data/englishKeyboard3.json';
import Key from './Key';

class GameKeyboard extends React.Component {
  firstRow = defaultKeyboard1;

  secondRow = defaultKeyboard2;

  thirdRow = defaultKeyboard3;

  renderKey = ({ item }) => {
    const {
      wordGuessed, lettersGuessed, onPress, solveMode
    } = this.props;
    return (
      <Key
        letter={item.key}
        disabled={wordGuessed || lettersGuessed.includes(item.key)}
        onPress={onPress}
        solveMode={solveMode}
      />
    );
  };

  render() {
    const {
      solveMode, lettersGuessed, index
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <FlatList
            horizontal
            key={solveMode + lettersGuessed.length}
            data={this.firstRow}
            renderItem={this.renderKey}
            extraData={lettersGuessed.length + solveMode + index}
          />
        </View>
        <View style={styles.row}>
          <FlatList
            horizontal
            key={solveMode + lettersGuessed.length}
            data={this.secondRow}
            renderItem={this.renderKey}
            extraData={lettersGuessed.length + solveMode + index}
            contentContainerStyle={styles.row}
          />
        </View>
        <View style={styles.row}>
          <FlatList
            horizontal
            key={solveMode + lettersGuessed.length}
            data={this.thirdRow}
            renderItem={this.renderKey}
            extraData={lettersGuessed.length + solveMode + index}
            contentContainerStyle={styles.row}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

GameKeyboard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  lettersGuessed: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  wordGuessed: PropTypes.bool.isRequired,
  solveMode: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

export default GameKeyboard;
