/* eslint-disable max-len */
import React from 'react';
import {
  Text, StyleSheet, View, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import {
  AdMobBanner,
} from 'expo-ads-admob';
import { RFValue } from 'react-native-responsive-fontsize';

class HowToPlayAutoComplete extends React.Component {
  adUnitID = Platform.select({
    ios: Constants.manifest.extra.REACT_APP_AD_MOB_IOS_HOWTO,
    android: Constants.manifest.extra.REACT_APP_AD_MOB_ANDROID_HOWTO,
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
            The auto complete game is based off of the auto complete suggestions that Google suggests when typing in the search box.
          </Text>
          <Text style={styles.textContainer}>
            Each game starts with an incomplete thought, and your goal is to guess the top 5 suggestions to complete it!
          </Text>
          <Text style={styles.textContainer}>
            To accomplish this, you can guess letters at the cost of 2 points per letter.
          </Text>
          <Text style={styles.textContainer}>
            When you are ready to solve, hit the solve button and enter your guess! An incorrect guess only adds 1 point.
          </Text>
          <Text style={styles.textContainer}>
            After all 5 suggestions have been guessed correctly, the final score screen will show!
          </Text>
          <Text style={styles.textContainer}>
            Keep playing and try out all the different options, and see how they change over time!
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

export default HowToPlayAutoComplete;
