import React, { Component } from 'react';
import {NativeEventEmitter, NativeModules } from 'react-native';
import { connect } from 'react-redux';

import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import {songUpdate, playbackUpdate} from './redux/actions/musicActions'
import Map from './Map'
import RideTracking from './RideTracking'
import Settings from './settings/Settings'

const TabNavigator = createBottomTabNavigator({
  Map: Map,
  'Ride Tracking': RideTracking,
  Settings: Settings,
});

let Navigation = createAppContainer(TabNavigator);

class MusicHeader extends Component {

  componentDidMount(){
    NativeModules.SpotifyInfo.startService();
    const eventEmitter = new NativeEventEmitter(NativeModules.SpotifyInfo);
    eventEmitter.addListener('SongUpdate', (event) => {
      this.props.songUpdate(event.track_name, event.artist_name, event.track_length);
    });

    eventEmitter.addListener('PosUpdate', (event) => {
      this.props.playbackUpdate(!event.isPaused, event.position);
    });
  }

  render() {
    return (
      <Navigation/>
    );
  }
}

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
    songUpdate: (trackName, artistName, trackLength) => {dispatch(songUpdate(trackName, artistName, trackLength))},
    // Decrease Counter
    playbackUpdate: (isPlaying, playbackPosition) => {dispatch(playbackUpdate(isPlaying, playbackPosition))},

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MusicHeader);
