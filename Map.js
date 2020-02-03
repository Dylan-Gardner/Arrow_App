import React, { Component } from 'react';
import { 
    View,
    Text,
    StyleSheet,
    Dimensions,
    PermissionsAndroid,
    StatusBar
} from 'react-native';
import MapView ,{PROVIDER_GOOGLE}from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import { connect } from 'react-redux';
import {currUpdate, destUpdate} from './redux/actions/mapActions';
import DirectionBar from './DirectionBar';


var {height, width} = Dimensions.get('window');

const BAR_HEIGHT = 60;
const ASPECT_RATIO = width / (height - BAR_HEIGHT);
const LATITUDE_DELTA = 0.0622
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyBYBKU8sSjEzxGu7IqJfUYWxh2DEPNCX-w';



class Map extends Component {

    constructor(props){
        super(props);
        this.getLocation = this.getLocation.bind(this);
    }

    componentDidMount() {
        this.requestLocationPermission();
        this.getLocation();
    }

    async requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Bike App Location Permission',
              message:
                'Bike App needs access to your location ' +
                'so you can use current location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use Location');
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }

    getLocation() {
        Geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude)
                var long = parseFloat(position.coords.longitude)
                var initialRegion= {
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }
            
                this.props.currUpdate(lat, long, LATITUDE_DELTA, LONGITUDE_DELTA);
                //console.log(position.coords);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    
    render() {
        return (
            <View style={styles.container}>
              <StatusBar hidden={true} />
              <DirectionBar />
              <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={this.props.current}
                  showsUserLocation={true}
              >
                {!!this.props.destination.latitude && !!this.props.destination.longitude && <MapView.Marker 
                  coordinate={{"latitude":this.props.destination.latitude,"longitude":this.props.destination.longitude}}
                  title={"Destination"}
                />}
                <MapViewDirections
                  origin={this.props.current}
                  destination={this.props.destination}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={2}
                />
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