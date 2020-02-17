import React, { Component } from 'react';
import {View,Dimensions, StyleSheet, Image, Text } from 'react-native';

import { connect } from 'react-redux';
import RNLocation from 'react-native-location';


import {currUpdate, destUpdate, viewUpdate} from './redux/actions/mapActions';
import DirectionBar from './DirectionBar';

import MapboxGL from "@react-native-mapbox-gl/maps";



var {height, width} = Dimensions.get('window');

const BAR_HEIGHT = 60;
const ASPECT_RATIO = width / (height - BAR_HEIGHT);
const LATITUDE_DELTA = 0.0622
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class Map extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        MapboxGL.setAccessToken("pk.eyJ1IjoiZHlsYW5nYXJkbmVyOTgiLCJhIjoiY2s2cHBkcjJ2MWlqaTNtczhzOHRmYmFqOSJ9.GyoVm5F5fYPsURVkpLeOdw");
        //MapboxGL.setConneced(true);
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
            RNLocation.getLatestLocation({ timeout: 60000 }).then(location => {
              this.props.viewUpdate(location.latitude, location.longitude, 0.0922,0.0421,)
            })
          }
        })

        MapboxGL.locationManager.start();
    }

    newDestination = () => {
        /*animationTimeout = setTimeout(() => {
          this.focusMap(['Location', 'Destination'],true);
        }, timeout);*/
      }

      componentWillUnmount(){
        MapboxGL.locationManager.dispose();
      }

    render() {
        return (
            <View>
                <DirectionBar destCallback={this.newDestination}/>
                <MapboxGL.MapView style={styles.map}>
                    <MapboxGL.UserLocation visible={true}/>
                    {this.props.destination.longitude!=null &&
                        <MapboxGL.PointAnnotation
                        id="asd"
                        
                        coordinate={[this.props.destination.latitude, this.props.destination.longitude]}>
                            <Text>
                                Yo
                            </Text>
                            
                        </MapboxGL.PointAnnotation>
                    }
                </MapboxGL.MapView>
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
      height: height - BAR_HEIGHT-50,
      width: width,
      marginBottom: 50
    }
   });

   // Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    current: state.mapReducer.current,
    destination: state.mapReducer.destination,
    view: state.mapReducer.view
  };
};
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
  // Action
  return {
    // Increase Counter
    currUpdate: (latitude, longitude) => {dispatch(currUpdate(latitude, longitude))},
    // Decrease Counter
    destUpdate: (latitude, longitude) => {dispatch(destUpdate(latitude, longitude))},

    viewUpdate: (latitude, longitude, LATITUDE_DELTA, LONGITUDE_DELTA) => {dispatch(viewUpdate(latitude, longitude, LATITUDE_DELTA, LONGITUDE_DELTA))}

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);