import React, {Component} from 'react';
import {connect} from 'react-redux';
import RNLocation from 'react-native-location';
import {currUpdate} from '../redux/actions/mapActions';
import {initUpdate} from '../redux/actions/initActions';
import {gpsUpdate, calcGain, resetReset} from '../redux/actions/workoutActions';
import TabHeader from '../TabHeader.js';
const haversine = require('haversine');
import KalmanFilter from 'kalmanjs';
var longkalman = new KalmanFilter({R: 0.01, Q: 3});
var latkalman = new KalmanFilter({R: 0.01, Q: 3});
var altkalman = new KalmanFilter({R: 0.01, Q: 3});

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
      distanceFilter: 1,
      interval: 1000, // Milliseconds
      fastestInterval: 500, // Milliseconds
      maxWaitTime: 2000, // Milliseconds
      desiredAccuracy: {
        ios: 'best',
        android: 'balancedPowerAccuracy',
      },
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
            if (
              !locations[0].fromMockProvider &&
              Object.keys(locations[0]).length !== 0
            ) {
              // TODO: CHANGE FOR PRODUCTION ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
              //
              //console.log(locations[0]);
              var lat = parseFloat(locations[0].latitude);
              var long = parseFloat(locations[0].longitude);

              this.props.currUpdate(
                latkalman.filter(lat),
                longkalman.filter(long),
              );
              //Workout info update
              if (this.props.workout.started) {
                if (this.props.workout.reset) {
                  this.reset();
                  this.props.resetReset();
                }
                const altitude = locations[0].altitude;
                const start = {
                  latitude: this.props.current.prev_lat,
                  longitude: this.props.current.prev_long,
                };
                const end = {
                  latitude: this.props.current.latitude,
                  longitude: this.props.current.longitude,
                };
                var distance = //calc distance with haversine formula to account for curve in earth
                  this.props.workout.distance +
                    haversine(start, end, {unit: 'mile'}) || 0;

                if (start.latitude == null && start.longitude == null) {
                  distance = this.props.workout.distance;
                }

                this.props.gpsUpdate(
                  locations[0].speed,
                  distance,
                  altkalman.filter(altitude),
                );
                console.log('#######', this.props.workout);
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
  reset() {
    longkalman = new KalmanFilter({R: 0.01, Q: 3});
    latkalman = new KalmanFilter({R: 0.01, Q: 3});
    altkalman = new KalmanFilter({R: 0.01, Q: 3});
  }

  render() {
    return <TabHeader reset={this.reset} />;
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
      dispatch(calcGain());
    },
    initUpdate: (latitude, longitude) => {
      dispatch(initUpdate(latitude, longitude));
    },
    resetReset: () => {
      dispatch(resetReset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Location);
