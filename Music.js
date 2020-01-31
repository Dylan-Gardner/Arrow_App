/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {NativeEventEmitter, NativeModules } from 'react-native';
import { connect } from 'react-redux';

export default class Music extends Component {

  componentDidMount(){
    NativeModules.MusicInfoLibrary.startTrackingMusic();
    const eventEmitter = new NativeEventEmitter(NativeModules.MusicInfoLibrary);
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
        <Text>I'm the Music component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    trackName: state.musicReducer.trackName,
    artistName: state.musicReducer.artistName,
    trackLength: state.musicReducer.trackLength,
    isPlaying: state.musicReducer.isPlaying,
    playbackPosition: state.musicReducer.playbackPosition
  };
};
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
  // Action
  return {
    // Increase Counter
    songUpdate: (trackName, artistName, trackLength) => dispatch(songUpdate(trackName, artistName, trackLength)),
    // Decrease Counter
    playbackUpdate: (isPlaying, playbackPosition) => dispatch(playbackUpdate(isPlaying, playbackPosition)),

  };
};
