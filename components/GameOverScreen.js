import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Clipboard from 'expo-clipboard';
// import Toast from 'react-native-toast-message';
import Toast from 'react-native-root-toast';
import {
  AdMobBanner,
} from 'expo-ads-admob';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

class GameOverScreen extends React.Component {
  width = Dimensions.get('window').width;

  viewXPos1 = new Animated.Value(this.width);

  viewXPos2 = new Animated.Value(this.width);

  viewXPos3 = new Animated.Value(this.width);

  viewXPos4 = new Animated.Value(this.width);

  viewXPos5 = new Animated.Value(this.width);

  adUnitID = Platform.select({
    // https://developers.google.com/admob/ios/test-ads
    ios: Constants.manifest.extra.REACT_APP_AD_MOB_IOS_GAMEOVER,
    // https://developers.google.com/admob/android/test-ads
    android: Constants.manifest.extra.REACT_APP_AD_MOB_ANDROID_GAMEOVER,
  });

  constructor(props) {
    super(props);
    this.state = {
      showAds: true,
    };
  }

  async componentDidMount() {
    const { postScore } = this.props;
    if (postScore) {
      const { date, region, score } = this.props;
      const scoreKey = `${date}-${region}-score`;
      const todayScore = await AsyncStorage.getItem(scoreKey);
      if (!todayScore || todayScore === null) {
        try {
          await fetch(Constants.manifest.extra.REACT_APP_SCORE_URL, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              region,
              date,
              score,
              method: 'POST'
            })
          });
        } catch (error) {
          console.log(`Unable to post score due to: ${error}`);
        }
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(yesterday);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 1);
        const twoDaysAgoString = `${twoDaysAgo.getFullYear()}-${twoDaysAgo.getMonth() + 1}-${twoDaysAgo.getDate()}`;
        const streak = parseInt(await AsyncStorage.getItem(`${twoDaysAgoString}-${region}-streak`), 10);
        if (streak) {
          AsyncStorage.setItem(`${date}-${region}-streak`, JSON.stringify(streak + 1));
        } else {
          AsyncStorage.setItem(`${date}-${region}-streak`, JSON.stringify(1));
        }
        AsyncStorage.setItem(scoreKey, `${score}`);
      }
    } else {
      AsyncStorage.removeItem('currentSeed');
    }

    Animated.spring(this.viewXPos1, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true
    }).start(() => Animated.spring(this.viewXPos2, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => Animated.spring(this.viewXPos3, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => Animated.spring(this.viewXPos4, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => Animated.spring(this.viewXPos5, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start()))));
  }

  copyToClipboard = async () => {
    const { date, region, score } = this.props;
    const streak = await AsyncStorage.getItem(`${date}-${region}-streak`);

    Clipboard.setString(`Today I'm trending in the ${region} at ${score}.  I've been trending for ${streak} days!`);
    Toast.show('Score Copied!', {
      duration: 4500,
      position: 0,
    });
  };

  onAdFail = (error) => {
    console.log(error);
    this.setState({
      showAds: false
    });
  };

  render() {
    const {
      topics, score, navigation, postScore,
    } = this.props;
    const { showAds } = this.state;
    return (
      <LinearGradient
        colors={['#45CDE9', '#3B96B5']}
        style={styles.linearGradient}
      >
        <View style={styles.container}>
          <Text style={styles.textGameOver}>Game Over!</Text>
          <Text style={styles.text}>
            Final Score:
            {score}
          </Text>
          <Animated.View style={[
            styles.textContainer, {
              transform: [
                {
                  translateX: this.viewXPos1,
                }
              ]
            }]}
          >
            <Text style={styles.text}>
              1:
              {topics[0].title?.query || topics[0].suggestion?.at_data}
            </Text>
          </Animated.View>
          <Animated.View style={[
            styles.textContainer, {
              transform: [
                {
                  translateX: this.viewXPos2,
                }
              ]
            }]}
          >
            <Text style={styles.text}>
              2:
              {topics[1].title?.query || topics[1].suggestion?.at_data}
            </Text>
          </Animated.View>
          <Animated.View style={[
            styles.textContainer, {
              transform: [
                {
                  translateX: this.viewXPos3,
                }
              ]
            }]}
          >
            <Text style={styles.text}>
              3:
              {topics[2].title?.query || topics[2].suggestion?.at_data}
            </Text>
          </Animated.View>
          <Animated.View style={[
            styles.textContainer, {
              transform: [
                {
                  translateX: this.viewXPos4,
                }
              ]
            }]}
          >
            <Text style={styles.text}>
              4:
              {topics[3].title?.query || topics[3].suggestion?.at_data}
            </Text>
          </Animated.View>
          <Animated.View style={[
            styles.textContainer, {
              transform: [
                {
                  translateX: this.viewXPos5,
                }
              ]
            }]}
          >
            <Text style={styles.text}>
              5:
              {topics[4].title?.query || topics[4].suggestion?.at_data}
            </Text>
          </Animated.View>

          {postScore
          && (
          <Pressable
            style={styles.button}
            onPress={async () => this.copyToClipboard()}
          >
            <Text style={styles.buttonText}>Share!</Text>
          </Pressable>
          )}

          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Menu', { score })}
          >
            <Text style={styles.buttonText}>Home</Text>
          </Pressable>
        </View>

        {showAds === true
        && (
        <View style={styles.adContainer}>
          <AdMobBanner
            bannerSize="smartBannerPortrait"
            adUnitID={this.adUnitID}
            servePersonalizedAds={false}
            onDidFailToReceiveAdWithError={(e) => this.onAdFail(e)}
          />
        </View>
        )}

      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradient: {
  },
  adContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 100,
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
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  },
  text: {
    fontSize: RFValue(25),
  },
  textGameOver: {
    fontSize: RFValue(25),
    fontWeight: 'bold',
  }
});

GameOverScreen.defaultProps = {
  postScore: true,
};

GameOverScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  topics: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
  score: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  postScore: PropTypes.bool,
};

export default GameOverScreen;
