import React, { Component } from 'react';
import { 
    View,
    Text,
    StyleSheet,
    Dimensions,
    PermissionsAndroid 
} from 'react-native';
import MapView ,{PROVIDER_GOOGLE}from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

var {height, width} = Dimensions.get('window');

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO


class Map extends Component {

    constructor(props){
        super(props);
        this.state = this.getInitialState();
        this.onRegionChange = this.onRegionChange.bind(this);
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
            
                this.setState({region: initialRegion})
                console.log(position.coords);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    getInitialState() {
        return {
          region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        };
    }
      
    onRegionChange(region){
        this.setState({ region });
    }

    
    render() {
        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={this.state.region}
                    showsUserLocation={true}
                >
                  {!!this.state.region.latitude && !!this.state.region.longitude && <MapView.Marker
                    coordinate={{"latitude":this.state.region.latitude,"longitude":this.state.region.longitude}}
                    title={"Your Location"}
                  />}
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: height,
      width: width,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
   });

export default Map;