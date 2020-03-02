import React, { Component } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';

import {songUpdate} from '../redux/actions/musicActions'
import NavigationHeader from '../NavigationHeader';

class MusicHeader extends Component {
    constructor(props){
        super(props)
      }

    componentDidMount() {
        NativeModules.SpotifyInfo.startService();
        const eventEmitter = new NativeEventEmitter(NativeModules.SpotifyInfo);
        eventEmitter.addListener('SongUpdate', (event) => {
            this.props.songUpdate(event.track_name, event.artist_name, event.track_length, event.isPaused, event.position);
            this.props.sendMessageCallback({track:this.props.trackName, artist:this.props.artistName, track_length: this.props.trackLength, playing: this.props.isPlaying, position: this.props.playbackPosition});
            console.log(event);
        });
    }

    render() {
        return (
            <NavigationHeader />
        );
    }
}


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
      songUpdate: (trackName, artistName, trackLength, isPaused, playbackPosition) => {dispatch(songUpdate(trackName, artistName, trackLength, isPaused, playbackPosition))},  
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(MusicHeader);