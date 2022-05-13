import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  Platform,
  Dimensions,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import { AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Tooltip from 'react-native-walkthrough-tooltip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AdMobBanner,
} from 'expo-ads-admob';
import PuzzleEntry from './PuzzleEntry';
import GameKeyboard from './GameKeyboard';
import GuessEntry from './GuessEntry';
import SolveEntry from './SolveEntry';

class GameView extends React.Component {
  // eslint-disable-next-line react/sort-comp
  getIos = () => {
    const { index } = this.props;
    switch (index) {
      case 0:
        return Constants.manifest.extra.REACT_APP_AD_MOB_IOS_1;
      case 1:
        return Constants.manifest.extra.REACT_APP_AD_MOB_IOS_2;
      case 2:
        return Constants.manifest.extra.REACT_APP_AD_MOB_IOS_3;
      case 3:
        return Constants.manifest.extra.REACT_APP_AD_MOB_IOS_4;
      case 4:
        return Constants.manifest.extra.REACT_APP_AD_MOB_IOS_5;
      default:
        return '';
    }
  };

  getAndroid = () => {
    const { index } = this.props;
    switch (index) {
      case 0:
        return Constants.manifest.extra.REACT_APP_AD_MOB_ANDROID_1;
      case 1:
        return Constants.manifest.extra.REACT_APP_AD_MOB_ANDROID_2;
      case 2:
        return Constants.manifest.extra.REACT_APP_AD_MOB_ANDROID_3;
      case 3:
        return Constants.manifest.extra.REACT_APP_AD_MOB_ANDROID_4;
      case 4:
        return Constants.manifest.extra.REACT_APP_AD_MOB_ANDROID_5;
      default:
        return '';
    }
  };

  // Production IDs
  adUnitID = Platform.select({
    // https://developers.google.com/admob/ios/test-ads
    ios: this.getIos(),
    // https://developers.google.com/admob/android/test-ads
    android: this.getAndroid(),
  });

  constructor(props) {
    super(props);
    this.state = {
      showAds: true,
      showTut1: true,
      showTut2: false,
      showTut3: false,
    };
  }

  onSolvePress = (letter) => {
    const { onSolvePress, index } = this.props;
    onSolvePress(letter, index);
  };

  onPress = (letter) => {
    const { onPress, index } = this.props;
    onPress(letter, index);
  };

  onGuess = (guess) => {
    const { onGuess, index } = this.props;
    onGuess(guess, index);
  };

  onSubmitGuess = () => {
    const { onSubmitGuess, index } = this.props;
    onSubmitGuess(index);
  };

  onAdFail = (error) => {
    console.log(error);
    this.setState({
      showAds: false
    });
  };

  render() {
    const {
      solveMode,
      image,
      lettersGuessed,
      newestLetter,
      wordGuessed,
      guessString,
      index,
      topic,
      onLeft,
      onRight,
      onBackspace,
      showTutorial,
      onTutorialFinish
    } = this.props;
    const {
      showAds, showTut1, showTut2, showTut3
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.puzzleContainer}>
          {!solveMode
            && (
            <PuzzleEntry
              wordGuessed={wordGuessed}
              topic={topic}
              lettersGuessed={lettersGuessed}
              newestLetter={newestLetter}
            />
            )}
          {solveMode && <SolveEntry guessString={guessString} />}
          {image
          && (
          <View style={styles.rowContainer}>
              {index > 0 && (
                <View style={styles.transparentView}>
                  <Pressable
                    disabled
                    onPress={() => onLeft()}
                  >
                    <AntDesign name="left" size={24} color="black" />
                  </Pressable>
                </View>
              )}
            <Tooltip
              isVisible={showTut2}
              content={
                (
                  <Text>
                    Use the image as a clue (It&apos;s blurry on purpose to not be too easy!)
                  </Text>
              )
            }
              placement="top"
              onClose={() => this.setState({ showTut2: false, showTut3: true })}
            >
              <View style={styles.imageContainer}>
                <Image
                  style={styles.logo}
                  source={{ uri: image }}
                />
              </View>
            </Tooltip>
              {index < 4 && (
                <Tooltip
                  isVisible={showTutorial && showTut1}
                  content={<Text>Swipe to navigate between trends</Text>}
                  placement="top"
                  onClose={() => this.setState({ showTut1: false, showTut2: true })}
                >
                  <View style={styles.transparentView}>
                    <Pressable
                      disabled
                      onPress={() => onRight()}
                    >
                      <AntDesign name="right" size={24} color="black" />
                    </Pressable>
                  </View>
                </Tooltip>
              )}

          </View>
          )}

        </View>
        <View style={styles.entryContainer}>
          <Tooltip
            isVisible={showTut3}
            content={
              (
                <Text>
                  Guess letters as hints, then hit solve to attempt to submit a final answer!
                </Text>
              )
            }
            placement="top"
            onClose={() => {
              this.setState({ showTut3: false });
              AsyncStorage.setItem('showTutorial', 'false');
              onTutorialFinish();
            }}
          >
            <GuessEntry
              solveMode={solveMode}
              topic={topic}
              onGuess={this.onGuess}
              wordGuessed={wordGuessed}
              onSubmitGuess={this.onSubmitGuess}
              onBackspace={onBackspace}
            />
          </Tooltip>
          {!solveMode
          && (
          <GameKeyboard
            index={index}
            solveMode={solveMode}
            wordGuessed={wordGuessed}
            lettersGuessed={lettersGuessed}
            onPress={this.onPress}
          />
          )}
          {solveMode
          && (
          <GameKeyboard
            index={index}
            solveMode={solveMode}
            wordGuessed={wordGuessed}
            lettersGuessed={lettersGuessed}
            onPress={this.onSolvePress}
          />
          )}
        </View>
        <View style={styles.adContainer}>
          {showAds === true
          && (

            <AdMobBanner
              bannerSize="smartBannerPortrait"
              adUnitID={this.adUnitID}
              servePersonalizedAds={false}
              onDidFailToReceiveAdWithError={(e) => this.onAdFail(e)}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  puzzleContainer: {
    flex: 3,
  },
  entryContainer: {
    flex: 3,
    justifyContent: 'flex-end',
  },
  adContainer: {
    flex: 1,
    marginBottom: 115
  },
  logo: {
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').width * 0.6,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  transparentView: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    textAlign: 'center',
    margin: 5,
  }
});

GameView.propTypes = {
  topic: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  lettersGuessed: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  // eslint-disable-next-line react/require-default-props
  newestLetter: PropTypes.string,
  onGuess: PropTypes.func.isRequired,
  wordGuessed: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/require-default-props
  image: PropTypes.string,
  solveMode: PropTypes.bool.isRequired,
  onSubmitGuess: PropTypes.func.isRequired,
  onBackspace: PropTypes.func.isRequired,
  onSolvePress: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  guessString: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  onLeft: PropTypes.func,
  // eslint-disable-next-line react/require-default-props
  onRight: PropTypes.func,
  showTutorial: PropTypes.bool.isRequired,
  onTutorialFinish: PropTypes.func.isRequired,
};

export default GameView;
