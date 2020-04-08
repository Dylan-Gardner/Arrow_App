import React, {Component} from 'react';
import {connect} from 'react-redux';
import RNLocation from 'react-native-location';
import {currUpdate} from '../redux/actions/mapActions';
import {initUpdate} from '../redux/actions/initActions';
import {speedUpdate} from '../redux/actions/workoutActions';
import TabHeader from '../TabHeader.js';

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
            console.log(locations);
            var lat = parseFloat(locations[0].latitude);
            var long = parseFloat(locations[0].longitude);
            //console.log(this.props.navigation, ' ', this.props.init);
            if (!this.props.navigation) {
              this.props.currUpdate(lat, long);
            }
            this.props.speedUpdate(locations[0].speed);
            if (this.state.initalCords.lat == null) {
              this.setState({
                initalCords: {
                  lat: lat,
                  long: long,
                },
              });
              this.props.initUpdate(lat, long);
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
    speedUpdate: speed => {
      dispatch(speedUpdate(speed));
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
