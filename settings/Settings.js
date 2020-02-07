import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Spotify from './Spotify'


class Settings extends Component {
    state = {  }
    render() {
        return (
            <View>
                <Text>
                    Settings
                </Text>
                <Spotify />
            </View>
        );
    }
}

export default Settings;