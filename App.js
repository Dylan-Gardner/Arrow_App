/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {NativeEventEmitter, NativeModules } from 'react-native';


export default class App extends Component {

  componentDidMount(){
    NativeModules.MusicInfoLibrary.startTrackingMusic();
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    eventEmitter.addListener('SongUpdate', (event) => {
       console.log(event.artistName);
       console.log(event.trackName);
    });

    eventEmitter.addListener('MusicInfo', (event) => {
       console.log(event.isPlaying);
       console.log(event.playbackPosition);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>I'm the App component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
