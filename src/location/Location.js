import React, {Component} from 'react';
import {connect} from 'react-redux';
import RNLocation from 'react-native-location';
import {currUpdate} from '../redux/actions/mapActions';
import {initUpdate} from '../redux/actions/initActions';
import {gpsUpdate} from '../redux/actions/workoutActions';
import TabHeader from '../TabHeader.js';
const haversine = require('haversine');

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initalCords: {
        lat: null,
        long: null,
      },
    };
  }
  componentDidMount() {
    RNLocation.configure({
      distanceFilter: 5.0,
      interval: 1000, // Milliseconds
      fastestInterval: 1000, // Milliseconds
      maxWaitTime: 2000, // Milliseconds
    });

    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    }).then(granted => {
      if (granted) {
        this.locationSubscription = RNLocation.subscribeToLocationUpdates(
          locations => {
            if (locations[0].fromMockProvider) {
              // TODO: CHANGE FOR PRODUCTION ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
              console.log(locations[0]);
              var lat = parseFloat(locations[0].latitude);
              var long = parseFloat(locations[0].longitude);
              this.props.currUpdate(lat, long);
              if (this.props.workout.started) {
                const altitude = locations[0].altitude;
                const start = {
                  latitude: this.props.current.prev_lat,
                  longitude: this.props.current.prev_long,
                };
                const end = {
                  latitude: this.props.current.latitude,
                  longitude: this.props.current.longitude,
                };
                const distance =
                  this.props.workout.distance +
                    haversine(start, end, {unit: 'mile'}) || 0;
                this.props.gpsUpdate(locations[0].speed, distance, altitude);
              }
              if (this.state.initalCords.lat == null) {
                this.setState({
                  initalCords: {
                    lat: lat,
                    long: long,
                  },
                });
                this.props.initUpdate(lat, long);
              }
            }
          },
        );
      }
    });
  }
  render() {
    return <TabHeader />;
  }
}

const mapStateToProps = state => {
  // Redux Store --> Component
  return {
    current: state.mapReducer.current,
    workout: state.workoutReducer,
    navigation: state.mapReducer.navigation,
    init: state.initReducer.init,
  };
};
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = dispatch => {
  return {
    currUpdate: (latitude, longitude) => {
      dispatch(currUpdate(latitude, longitude));
    },
    gpsUpdate: (speed, distance, altitude) => {
      dispatch(gpsUpdate(speed, distance, altitude));
    },
    initUpdate: (latitude, longitude) => {
      dispatch(initUpdate(latitude, longitude));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Location);
