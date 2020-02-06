import React, { Component } from 'react';
import { 
    View,
    Text,
    StyleSheet,
    Dimensions,
    StatusBar
} from 'react-native';
import MapView ,{PROVIDER_GOOGLE}from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { connect } from 'react-redux';
import RNLocation from 'react-native-location';


import {currUpdate, destUpdate} from './redux/actions/mapActions';
import DirectionBar from './DirectionBar';


var {height, width} = Dimensions.get('window');

const BAR_HEIGHT = 60;
const ASPECT_RATIO = width / (height - BAR_HEIGHT);
const LATITUDE_DELTA = 0.0622
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const timeout = 4000;
const GOOGLE_MAPS_APIKEY = 'AIzaSyBYBKU8sSjEzxGu7IqJfUYWxh2DEPNCX-w';
let animationTimeout;



class Map extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
      RNLocation.configure({
        distanceFilter: 5.0,
        interval: 5000, // Milliseconds
        fastestInterval: 1000, // Milliseconds
        maxWaitTime: 5000, // Milliseconds
      })

      RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "fine"
        }
      }).then(granted => {
          if (granted) {
            this.locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
              console.log(locations[0])
              var lat = parseFloat(locations[0].latitude)
              var long = parseFloat(locations[0].longitude)
              this.props.currUpdate(lat, long, LATITUDE_DELTA, LONGITUDE_DELTA);
              /* Example location returned
              {
                speed: -1,
                longitude: -0.1337,
                latitude: 51.50998,
                accuracy: 5,
                heading: -1,
                altitude: 0,
                altitudeAccuracy: -1
                floor: 0
                timestamp: 1446007304457.029,
                fromMockProvider: false
              }
              */
            })
          }
        })
    }
    
    componentWillUnmount() {
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
    }

    focusMap(markers) {
      console.log(`Markers received to populate map: ${markers}`);
      this.map.fitToSuppliedMarkers(markers, {edgePadding: 
        {
          top: 150,
          bottom: 150,
          left: 150,
          right: 150
        },
        animated: true});
    }

    newDestination = () => {
      animationTimeout = setTimeout(() => {
        this.focusMap(['Location', 'Destination'],true);
      }, timeout);
    }

    
    render() {
        return (
            <View style={styles.container}>
              <StatusBar hidden={true} />
              <DirectionBar destCallback={this.newDestination}/>
              <MapView
                  ref={map => {
                    this.map = map;
                  }}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={this.props.current}
                  showsUserLocation={true}
              >
                {!!this.props.current.latitude && !!this.props.current.longitude && <MapView.Marker 
                  coordinate={{"latitude":this.props.current.latitude,"longitude":this.props.current.longitude}}
                  opacity={0}
                  identifier={'Location'}
                />}

                {!!this.props.destination.latitude && !!this.props.destination.longitude && <MapView.Marker 
                  coordinate={{"latitude":this.props.destination.latitude,"longitude":this.props.destination.longitude}}
                  identifier={'Destination'}
                />}

                
                {!!this.props.destination.latitude && !!this.props.destination.longitude && this.props.current.latitude && this.props.current.longitude && <MapViewDirections
                  origin={this.props.current}
                  destination={this.props.destination}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={2}
                />}
              </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      height: height,
      width: width,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      height: height - BAR_HEIGHT,
      width: width
    }
   });

   // Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    current: state.mapReducer.current,
    destination: state.mapReducer.destination
  };
};
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
  // Action
  return {
    // Increase Counter
    currUpdate: (latitude, longitude, LATITUDE_DELTA, LONGITUDE_DELTA) => {dispatch(currUpdate(latitude, longitude, LATITUDE_DELTA, LONGITUDE_DELTA))},
    // Decrease Counter
    destUpdate: (latitude, longitude) => {dispatch(destUpdate(latitude, longitude))},

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);