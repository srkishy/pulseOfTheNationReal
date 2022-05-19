import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import {
  AdMobBanner,
} from 'expo-ads-admob';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

class Menu extends React.Component {
  adUnitID = Platform.select({
    // https://developers.google.com/admob/ios/test-ads
    ios: Constants.manifest.extra.REACT_APP_AD_MOB_IOS_MENU,
    // https://developers.google.com/admob/android/test-ads
    android: Constants.manifest.extra.REACT_APP_AD_MOB_ANDROID_MENU,
  });

  constructor(props) {
    super(props);
    const { score } = this.props;
    this.state = {
      todaysScore: score || '-',
      yesterdaysScore: '-',
      averageScore: 0,
      yesterdayAverageScore: 0,
      loading: true,
      showAds: true,
    };
  }

  async componentDidMount() {
    // this.viewStorage();
    // await setTestDeviceIDAsync('EMULATOR'); //  REMOVE FOR PROD
    await this.updateScore();
  }

  async componentDidUpdate() {
    await this.updateScore();
  }

  /*
  viewStorage = () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log({ [store[i][0]]: store[i][1] });
          return true;
        });
      });
    });
  }
  */

  onAdFail = (error) => {
    console.log(error);
    this.setState({
      showAds: false
    });
  };

  async updateRegion(region) {
    this.setState({
      region
    });
    await AsyncStorage.setItem('region', region);
    await this.updateScore();
  }

  async updateScore() {
    try {
      let region = await AsyncStorage.getItem('region');
      if (!region) {
        await AsyncStorage.setItem('region', 'US');
        region = 'US';
      }
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgoString = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
      const currentResponse = await fetch(Constants.manifest.extra.REACT_APP_SCORE_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          region,
          date: yesterdayString,
          twoDaysDate: twoDaysAgoString,
          method: 'GET'
        })
      });

      const todaysScore = await AsyncStorage.getItem(`${yesterdayString}-${region}-score`);
      const yesterdaysScore = await AsyncStorage.getItem(`${twoDaysAgoString}-${region}-score`);

      const json = await currentResponse.json();

      this.setState({
        averageScore: parseFloat(json.score).toFixed(1),
        yesterdayAverageScore: parseFloat(json.yesterdayScore).toFixed(1),
        todaysScore,
        yesterdaysScore,
        region,
        loading: false,
      });
    } catch (error) {
      this.setState({
        averageScore: -1,
        yesterdayAverageScore: -1,
        todaysScore: -1,
        yesterdaysScore: -1,
        region: 'US',
        loading: false,
      });
      console.log(`Unable to retrieve score due to: ${error}`);
    }
  }

  render() {
    const {
      region,
      loading,
      yesterdayAverageScore,
      yesterdaysScore,
      averageScore,
      todaysScore,
      showAds,
    } = this.state;
    const { navigation } = this.props;
    return (
      <LinearGradient
        colors={['#45CDE9', '#3B96B5']}
        style={styles.linearGradient}
      >
        <View style={styles.container}>
          <Text style={styles.header}>Trendsettr</Text>
          {region && !loading
          && (
            <View style={styles.mainContainer}>
              <View style={styles.rowContainer}>
                <View style={{ borderWidth: 1, borderRadius: 5 }}>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.textContainer}>Yesterday</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <View style={styles.scoreContainer}>
                      <Text>Avg</Text>
                      <Text style={styles.scoreText}>
                        {yesterdayAverageScore}
                      </Text>
                    </View>
                    <View style={styles.scoreContainer}>
                      <Text>You</Text>
                      {yesterdaysScore
                      && (
                        <Text style={styles.scoreText}>
                          {yesterdaysScore}
                        </Text>
                      )}
                      {!yesterdaysScore
                      && (
                        <Text style={styles.scoreText}>
                          -
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                <View style={{ borderWidth: 1, borderRadius: 5, marginLeft: 1 }}>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.textContainer}>Today</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <View style={styles.scoreContainer}>
                      <Text>Avg</Text>
                      <Text style={styles.scoreText}>
                        {averageScore}
                      </Text>
                    </View>
                    <View style={styles.scoreContainer}>
                      <Text>You</Text>
                      {todaysScore
                      && (
                        <Text style={styles.scoreText}>
                          {todaysScore}
                        </Text>
                      )}
                      {!todaysScore
                      && (
                        <Text style={styles.scoreText}>
                          -
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.rowContainer}>
                <Pressable
                  style={[
                    styles.button,
                    styles.enabled,
                  ]}
                  onPress={() => navigation.navigate('Daily')}
                >
                  <Text style={styles.buttonText}>Start game!</Text>
                </Pressable>
                <Pressable
                  style={{ justifyContent: 'center', paddingLeft: 10 }}
                  onPress={() => navigation.navigate('HowToPlay')}
                >
                  <Feather name="help-circle" size={24} color="black" />
                </Pressable>
              </View>
              <View style={styles.rowContainer}>
                <Pressable
                  style={[
                    styles.button,
                    styles.enabled,
                  ]}
                  onPress={() => navigation.navigate('AutoComplete')}
                >
                  <Text style={styles.buttonText}>Start Auto Complete Game!</Text>
                </Pressable>
                <Pressable
                  style={{ justifyContent: 'center', paddingLeft: 10 }}
                  onPress={() => navigation.navigate('HowToPlayAutoComplete')}
                >
                  <Feather name="help-circle" size={24} color="black" />
                </Pressable>
              </View>
            </View>
          )}
          {loading
          && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#75E6DA" />
            </View>
          )}
          <View style={styles.pickerContainer}>

            <Picker
              style={styles.picker}
              selectedValue={region}
              onValueChange={(itemValue) => this.updateRegion(itemValue)}
            >
              <Picker.Item label="US" value="US" />
              <Picker.Item label="CAN" value="CA" />
              <Picker.Item label="UK" value="GB" />
              <Picker.Item label="AU" value="AU" />
            </Picker>
          </View>
          <View style={styles.spaceContainer} />
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

        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flex: 1,
  },
  regionText: {
    fontSize: RFValue(15)
  },
  mainContainer: {
    flex: 4,
  },
  spaceContainer: {
    flex: 1,
  },
  linearGradient: {
    flex: 10,
  },
  picker: {
    height: Dimensions.get('window').height * 0.1,
    width: Dimensions.get('window').width * 0.4,
  },
  pickerContainer: {
    flex: 1,
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
  },
  scoreText: {
    fontSize: RFValue(28),
  },
  header: {
    fontSize: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    fontFamily: 'Righteous_400Regular',
  },
  scoreContainer: {
    padding: 10,
  },
  adContainer: {
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
});

Menu.propTypes = {
  // eslint-disable-next-line react/require-default-props
  score: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};

export default Menu;
