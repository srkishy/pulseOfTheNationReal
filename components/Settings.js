import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

class Settings extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <View>
        <Button
          style={styles.button}
          title="Start game!"
          disabled={this.disabled}
          onPress={this.startGame}
        />
        <Button
          style={styles.button}
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
        />

      </View>

    );
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    display: 'flex',
  },
});

Settings.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};

export default Settings;
