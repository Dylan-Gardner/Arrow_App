import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Image, Text, StatusBar} from 'react-native';

import {connect} from 'react-redux';
import RNLocation from 'react-native-location';
import exampleIcon from '../../images/marker.png';

import {currUpdate, destUpdate, viewUpdate} from '../redux/actions/mapActions';
import DirectionBar from './DirectionBar';

import MapboxGL from '@react-native-mapbox-gl/maps';
import {directionsClient} from '../../MapboxClient';
import {lineString as makeLineString} from '@turf/helpers';

var {height, width} = Dimensions.get('window');
import env from '../../env.json'

const BAR_HEIGHT = 60;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featureCollection: MapboxGL.geoUtils.makeFeatureCollection(),
      route: null,
    };
  }

  componentDidMount() {
    MapboxGL.setAccessToken(
      env['accessToken'],
    );
    RNLocation.configure({
      distanceFilter: 5.0,
      interval: 5000, // Milliseconds
      fastestInterval: 1000, // Milliseconds
      maxWaitTime: 5000, // Milliseconds
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
            console.log(locations[0]);
            var lat = parseFloat(locations[0].latitude);
            var long = parseFloat(locations[0].longitude);
            this.props.currUpdate(lat, long);
          },
        );
        RNLocation.getLatestLocation({timeout: 60000}).then(location => {
          this.props.viewUpdate(
            location.latitude,
            location.longitude,
            0.0922,
            0.0421,
          );
        });
      }
    });

    MapboxGL.locationManager.start();
  }

  newDestination = () => {
    const feature = MapboxGL.geoUtils.makeFeature({
      coordinates: [
        this.props.destination.longitude,
        this.props.destination.latitude,
      ],
      type: 'Point',
    });
    feature.id = `marker`;
    this.setState({
      featureCollection: MapboxGL.geoUtils.addToFeatureCollection(
        this.state.featureCollection,
        feature,
      ),
    });
    this.createLine()
  };

  async createLine(){
    const reqOptions = {
      waypoints: [
        {coordinates: [this.props.current.longitude, this.props.current.latitude]},
        {coordinates: [this.props.destination.longitude, this.props.destination.latitude]},
      ],
      profile: 'cycling',
      geometries: 'geojson',
    };

    const res = await directionsClient.getDirections(reqOptions).send();

    console.log(res)

    this.setState({
      route: makeLineString(res.body.routes[0].geometry.coordinates),
    });
  }

  clearDestination = () => {
    this.setState({
      featureCollection: MapboxGL.geoUtils.makeFeatureCollection(),
    });
  };

  componentWillUnmount() {
    MapboxGL.locationManager.dispose();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <DirectionBar
          destCallback={this.newDestination}
          clearCallback={this.clearDestination}
        />
        {!!this.props.view.latitude &&
        <MapboxGL.MapView style={styles.map} onPress={this.onPress}>
          <MapboxGL.UserLocation visible={true} />
          <MapboxGL.Camera
            zoomLevel={12}
            centerCoordinate={[
              this.props.view.longitude,
              this.props.view.latitude,
            ]}
          />
          <MapboxGL.ShapeSource
            id="symbolLocationSource"
            hitbox={{width: 20, height: 20}}
            shape={this.state.featureCollection}>
            <MapboxGL.SymbolLayer
              id="symbolLocationSymbols"
              minZoomLevel={1}
              style={style.icon}
            />
          </MapboxGL.ShapeSource>
          {!!this.state.route &&
          <MapboxGL.ShapeSource id="routeSource" shape={this.state.route}>
            <MapboxGL.LineLayer
              id="routeFill"
              style={layerStyles.route}
              belowLayerID="originInnerCircle"
            />
          </MapboxGL.ShapeSource>
  }
        </MapboxGL.MapView>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: height - 50,
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    height: height - BAR_HEIGHT - 50,
    width: width,
    marginBottom: 0,
  },
});
const style = {
  icon: {
    iconImage: exampleIcon,
    iconAllowOverlap: true,
    iconSize: 0.07,
  },
};
const layerStyles = {
  origin: {
    circleRadius: 5,
    circleColor: 'white',
  },
  destination: {
    circleRadius: 5,
    circleColor: 'white',
  },
  route: {
    lineColor: 'white',
    lineCap: MapboxGL.LineJoin.Round,
    lineWidth: 3,
    lineOpacity: 0.84,
  },
  progress: {
    lineColor: '#314ccd',
    lineWidth: 3,
  },
};

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = state => {
  // Redux Store --> Component
  return {
    current: state.mapReducer.current,
    destination: state.mapReducer.destination,
    view: state.mapReducer.view,
  };
};
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = dispatch => {
  // Action
  return {
    // Increase Counter
    currUpdate: (latitude, longitude) => {
      dispatch(currUpdate(latitude, longitude));
    },
    // Decrease Counter
    destUpdate: (latitude, longitude) => {
      dispatch(destUpdate(latitude, longitude));
    },

    viewUpdate: (latitude, longitude, LATITUDE_DELTA, LONGITUDE_DELTA) => {
      dispatch(
        viewUpdate(latitude, longitude, LATITUDE_DELTA, LONGITUDE_DELTA),
      );
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map);
