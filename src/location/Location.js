import React, {Component} from 'react';
import {connect} from 'react-redux';
import RNLocation from 'react-native-location';
import {currUpdate} from '../redux/actions/mapActions';
import {initUpdate} from '../redux/actions/initActions';
import {gpsUpdate, calcGain, resetReset} from '../redux/actions/workoutActions';
import TabHeader from '../TabHeader.js';
import {NativeModules, NativeEventEmitter} from 'react-native';
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
    RNLocation.getLatestLocation(
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
            locations[0].timestamp / 1000.0,
          );
          //Workout info update
          if (this.props.workout.started) {
            if (this.props.workout.reset) {
              this.reset();
              this.props.resetReset();
            }
            const altitude = locations[0].altitude / 0.3048;
            const start = {
              latitude: this.props.current.prev_lat,
              longitude: this.props.current.prev_long,
            };
            const end = {
              latitude: this.props.current.latitude,
              longitude: this.props.current.longitude,
            };
            var dist = haversine(start, end, {unit: 'mile'}) || 0;
            var distance = this.props.workout.distance + dist; //calc distance with haversine formula to account for curve in earth

            if (start.latitude == null && start.longitude == null) {
              distance = this.props.workout.distance;
            }
            var speed =
              dist /
              ((this.props.current.timestamp -
                this.props.current.prev_timestamp) /
                36000);
            if (this.props.current.prev_timestamp == null) {
              speed = 0;
            }
            this.props.gpsUpdate(
              speed,
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
    )

    NativeModules.KalmanFilter.init();
    /*RNLocation.requestPermission({
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
                locations[0].timestamp / 1000.0,
              );
              //Workout info update
              if (this.props.workout.started) {
                if (this.props.workout.reset) {
                  this.reset();
                  this.props.resetReset();
                }
                const altitude = locations[0].altitude / 0.3048;
                const start = {
                  latitude: this.props.current.prev_lat,
                  longitude: this.props.current.prev_long,
                };
                const end = {
                  latitude: this.props.current.latitude,
                  longitude: this.props.current.longitude,
                };
                var dist = haversine(start, end, {unit: 'mile'}) || 0;
                var distance = this.props.workout.distance + dist; //calc distance with haversine formula to account for curve in earth

                if (start.latitude == null && start.longitude == null) {
                  distance = this.props.workout.distance;
                }
                var speed =
                  dist /
                  ((this.props.current.timestamp -
                    this.props.current.prev_timestamp) /
                    36000);
                if (this.props.current.prev_timestamp == null) {
                  speed = 0;
                }
                this.props.gpsUpdate(
                  speed,
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
    });*/
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
    currUpdate: (latitude, longitude, timestamp) => {
      dispatch(currUpdate(latitude, longitude, timestamp));
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
