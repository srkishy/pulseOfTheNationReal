/* eslint-disable max-len */
import React from 'react';
import {
  Text, StyleSheet, View, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AdMobBanner,
} from 'expo-ads-admob';
import { RFValue } from 'react-native-responsive-fontsize';

class HowToPlay extends React.Component {
  adUnitID = Platform.select({
    ios: process.env.REACT_APP_AD_MOB_IOS_HOWTO,
    android: process.env.REACT_APP_AD_MOB_ANDROID_HOWTO,
  });

  constructor(props) {
    super(props);
    this.state = {
      showAds: true,
    };
  }

  onAdFail = (error) => {
    console.log(error);
    this.setState({
      showAds: false
    });
  };

  render() {
    const { showAds } = this.state;
    return (
      <LinearGradient
        colors={['#45CDE9', '#3B96B5']}
        style={styles.linearGradient}
      >
        <View style={styles.container}>
          <Text style={styles.textContainer}>
            Trendsettr is a daily game that quizzes your knowledge of what people in your region are searching for.
          </Text>
          <Text style={styles.textContainer}>
            The goal of each game is to correctly guess the top 5 searched topics from Google in the previous day with as few hints and guesses as you can manage.
          </Text>
          <Text style={styles.textContainer}>
            To accomplish this, you can guess letters at the cost of 2 points per letter.
          </Text>
          <Text style={styles.textContainer}>
            When you are ready to solve, hit the solve button and enter your guess! An incorrect guess only adds 1 point.
          </Text>
          <Text style={styles.textContainer}>
            After all 5 topics have been guessed correctly, the final score screen will show and you can share your score with the world!
          </Text>
        </View>
        {showAds === true && (
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
  textContainer: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 5,
    fontSize: RFValue(20),
  },
  container: {
    display: 'flex',
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  }
});

export default HowToPlay;
