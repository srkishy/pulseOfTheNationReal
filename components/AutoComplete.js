import React from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  PanResponder,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import * as Haptics from 'expo-haptics';
import PropTypes from 'prop-types';
import { XMLParser } from 'fast-xml-parser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';
import GameView from './GameView';
import GameOverScreen from './GameOverScreen';
import autoCompleteSeeds from '../data/autoComplete.json';

class AutoComplete extends React.Component {
  viewXPos = new Animated.Value(0);

  viewYPos = new Animated.Value(0);

  gamePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      const { solveMode } = this.state;
      if (!solveMode) {
        this.viewXPos.setValue(gs.dx);
      }
    },
    onPanResponderRelease: (evt, gs) => {
      const { solveMode } = this.state;
      if (!solveMode) {
        this.width = Dimensions.get('window').width;
        if (Math.abs(gs.dx) > this.width * 0.4) {
          const direction = Math.sign(gs.dx);
          // -1 for left, 1 for right
          Animated.timing(this.viewXPos, {
            toValue: direction * this.width,
            duration: 250,
            useNativeDriver: true
          }).start(() => this.handleSwipe(-1 * direction));
        } else {
          Animated.spring(this.viewXPos, {
            toValue: 0,
            useNativeDriver: true
          }).start();
        }
      }
    },
  });

  animatedStyle = {
    transform: [
      {
        translateX: this.viewXPos,
      },
      {
        translateY: this.viewYPos
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      gameIndex: 0,
      score: 0,
      lettersGuessed: [[], [], [], [], []],
      wordGuessed: [false, false, false, false, false],
      gameOver: false,
      newestLetter: ['', '', '', '', ''],
      isLoading: true,
      solveMode: false,
      guessString: '',
      currentEntryIndex: [],
      date: new Date(),
    };
  }

  async componentDidMount() {
    const seed = await AsyncStorage.getItem('currentSeed');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (seed) {
      await AsyncStorage.getItem(`${seed}-${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`).then((value) => {
        this.setState(JSON.parse(value));
      });
      this.setState({ isLoading: false });
      return;
    }
    await this.getTopics(yesterday, seed);
  }

  async getTopics(yesterday) {
    try {
      const { topics } = autoCompleteSeeds;
      const index = Math.floor(Math.random() * ((topics.length - 1) - 0 + 1));
      const seed = topics[index];
      await AsyncStorage.setItem('currentSeed', seed);
      fetch(`https://clients1.google.com/complete/search?hl=en&output=toolbar&q=${encodeURIComponent(seed)}`, {
        method: 'GET',
      })
        .then((response) => response.text())
        .then((textResponse) => {
          const options = {
            ignoreAttributes: false,
            attributeNamePrefix: 'at_'
          };
          const parser = new XMLParser(options);
          const obj = parser.parse(textResponse);
          console.log(obj);
          this.setState({
            seed,
            topics: obj.toplevel.CompleteSuggestion,
            date: `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`,
          });
          this.saveData();
        });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  onLeft = () => {
    this.handleSwipe(-1);
  };

  onRight = () => {
    console.log(this.viewXPos);
    this.handleSwipe(1);
  };

  updateScore = (additionToScore) => {
    const { score } = this.state;
    this.setState({ score: score + additionToScore }, () => {
      this.saveData();
    });
  };

  onSolvePress = (letter) => {
    const { guessString, currentEntryIndex } = this.state;
    if (guessString.includes('_')) {
      Haptics.selectionAsync();
      let newGuessString;
      let newEntryIndex;
      for (let i = 0; i < guessString.length; i += 1) {
        if (guessString.charAt(i) === '_') {
          newGuessString = guessString.substring(0, i) + letter + guessString.substring(i + 1);
          newEntryIndex = [...currentEntryIndex, i];
          break;
        }
      }
      this.setState({
        guessString: newGuessString,
        currentEntryIndex: newEntryIndex,
      }, () => {
        this.saveData();
      });
    }
  };

  onBackspace = () => {
    const { currentEntryIndex, guessString } = this.state;
    if (currentEntryIndex.length > 0) {
      Haptics.selectionAsync();
      const i = currentEntryIndex[currentEntryIndex.length - 1];
      const newGuessString = `${guessString.substring(0, i)}_${guessString.substring(i + 1)}`;
      currentEntryIndex.pop();
      this.setState({
        guessString: newGuessString,
        currentEntryIndex: [...currentEntryIndex],
      }, () => {
        this.saveData();
      });
    }
  };

  onSubmitGuess = (index) => {
    Haptics.selectionAsync();
    const {
      guessString, topics, gameIndex, wordGuessed, score
    } = this.state;
    if (guessString === topics[gameIndex].suggestion.at_data.toUpperCase()) {
      const newWordGuessed = [...wordGuessed];
      newWordGuessed[index] = true;
      this.setState({
        guessString: '',
        currentEntryIndex: [],
        wordGuessed: newWordGuessed,
        gameOver: !newWordGuessed.includes(false),
        solveMode: false,
      }, () => {
        this.saveData();
      });
    } else {
      this.animateIncorrect(20, 5);
      this.setState({
        score: score + 1,
        guessString: '',
        currentEntryIndex: [],
        solveMode: false,
      }, () => {
        this.saveData();
      });
    }
  };

  animateIncorrect = (val, count) => {
    if (count > 0) {
      Animated.timing(this.viewXPos, {
        toValue: val,
        duration: 100,
        useNativeDriver: true
      }).start(() => this.animateIncorrect(-val, count - 1));
    } else {
      Animated.timing(this.viewXPos, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      }).start();
    }
  };

  onPress = (letter, index) => {
    Haptics.selectionAsync();
    const {
      lettersGuessed, newestLetter, topics, wordGuessed, score
    } = this.state;
    const newLettersGuessed = [...lettersGuessed];
    newLettersGuessed[index].push(letter);

    const newNewestLetter = [...newestLetter];
    newNewestLetter[index] = letter;

    const topic = topics[index].suggestion.at_data.toUpperCase();
    let tempWordGuessed = true;
    for (let i = 0; i < topic.length; i += 1) {
      if (topic.charAt(i) !== ' ' && !newLettersGuessed[index].includes(topic.charAt(i))) {
        tempWordGuessed = false;
      }
    }

    const newWordGuessed = [...wordGuessed];
    if (tempWordGuessed) {
      newWordGuessed[index] = true;
    }

    this.setState({
      lettersGuessed: newLettersGuessed,
      score: score + 2,
      newestLetter: newNewestLetter,
      wordGuessed: newWordGuessed,
      gameOver: !newWordGuessed.includes(false),
    }, () => {
      this.saveData();
    });
  };

  onGuess = (guess, index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const {
      solveMode, topics, lettersGuessed
    } = this.state;
    const newMode = !solveMode;
    let currentGuessString = '';
    if (newMode) {
      const currentTopic = topics[index].suggestion.at_data.toUpperCase();
      const currentLettersGuessed = lettersGuessed[index];

      for (let i = 0; i < currentTopic.length; i += 1) {
        if (currentTopic.charAt(i) === ' ') {
          currentGuessString += ' ';
        } else if (!isLetter(currentTopic.charAt(i))
        || currentLettersGuessed.includes(currentTopic.charAt(i))) {
          currentGuessString += currentTopic.charAt(i).toUpperCase();
        } else {
          currentGuessString += '_';
        }
      }
      this.setState({
        solveMode: newMode,
        guessString: currentGuessString,
      }, () => {
        this.saveData();
      });
    } else {
      this.setState({
        solveMode: newMode,
        guessString: '',
      }, () => {
        this.saveData();
      });
    }
  };

  handleSwipe = (indexDirection) => {
    const { gameIndex, solveMode } = this.state;
    if (gameIndex + indexDirection < 0 || gameIndex + indexDirection > 4) {
      Animated.spring(this.viewXPos, {
        toValue: 0,
        useNativeDriver: true
      }).start();
      return;
    }
    if (!solveMode) {
      this.setState((prevState) => ({
        gameIndex: prevState.gameIndex + indexDirection
      }), () => {
        this.viewXPos.setValue(indexDirection * this.width);
        Animated.spring(this.viewXPos, {
          toValue: 0,
          useNativeDriver: true
        }).start();
      });
    }
  };

  onTutorialFinish = () => {
    this.setState({
      showTutorial: false,
    }, () => {
      this.saveData();
    });
  };

  makeGameView = (
    {
      topics,
      gameIndex,
      lettersGuessed,
      wordGuessed, newestLetter,
      solveMode,
      guessString,
      showTutorial,
      seed
    }
  ) => (
    <GameView
      topic={topics[gameIndex].suggestion.at_data.toUpperCase()}
      updateScore={this.updateScore}
      lettersGuessed={lettersGuessed[gameIndex]}
      wordGuessed={wordGuessed[gameIndex]}
      newestLetter={newestLetter[gameIndex]}
      onPress={this.onPress}
      onGuess={this.onGuess}
      onSubmitGuess={this.onSubmitGuess}
      onBackspace={this.onBackspace}
      onSolvePress={this.onSolvePress}
      solveMode={solveMode}
      guessString={guessString}
      onLeft={this.onLeft}
      onRight={this.onRight}
      index={gameIndex}
      showTutorial={showTutorial}
      onTutorialFinish={this.onTutorialFinish}
      seed={seed}
    />
  );

  saveData() {
    const { date, seed } = this.state;
    AsyncStorage.setItem(`${seed}-${date}`, JSON.stringify(this.state));
  }

  render() {
    const {
      gameOver,
      isLoading,
      score,
      gameIndex,
      topics,
      solveMode,
      date,
      region,
    } = this.state;
    const { navigation } = this.props;

    return (
      <LinearGradient
        colors={['#45CDE9', '#3B96B5']}
        style={styles.linearGradient}
      >
        <View style={styles.container}>
          {!gameOver && !isLoading && (
          <View style={styles.headerContainer}>
            <Text style={styles.score}>
              Score:
              {score}
            </Text>
            <Text style={styles.topicLabel}>
              Daily Trend
              {` ${gameIndex + 1}`}
            </Text>
          </View>
          )}
          {!gameOver && !isLoading && (!topics || topics.length <= 0)
           && (
           <View>
             <Text>
               There was an error retrieving the topics, please try again later.
             </Text>
           </View>
           )}
          {!gameOver && !isLoading && topics.length > 0
            && (
            <Animated.View
              style={[!solveMode && this.animatedStyle, styles.animatedContainer]}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...this.gamePanResponder.panHandlers}
            >
              {this.makeGameView(this.state)}
            </Animated.View>
            )}
          {gameOver && !isLoading
            && (
            <View style={styles.gameOverScreenView}>
              <GameOverScreen
                region={region}
                navigation={navigation}
                topics={topics}
                score={score}
                date={date}
                postScore={false}
              />
            </View>
            )}
          {isLoading
            && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#75E6DA" />
            </View>
            )}
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: Dimensions.get('window').height,
  },
  headerContainer: {
    height: Dimensions.get('window').height * 0.1,
  },
  animatedContainer: {
    height: Dimensions.get('window').height * 0.95,
  },
  score: {
    fontSize: RFValue(25),
    textAlign: 'center',
  },
  topicLabel: {
    fontSize: RFValue(25),
    textAlign: 'center',
  },
  gameView: {

  },
  gameOverScreenView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  linearGradient: {
  },
});

AutoComplete.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

export default AutoComplete;
