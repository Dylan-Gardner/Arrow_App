import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, StatusBar} from 'react-native';

import {connect} from 'react-redux';
import RNLocation from 'react-native-location';
import exampleIcon from '../../images/marker.png';

import {currUpdate, destUpdate, viewUpdate} from '../redux/actions/mapActions';
import DirectionBar from './DirectionBar';

import MapboxGL from '@react-native-mapbox-gl/maps';
import {directionsClient} from '../../MapboxClient';
import {lineString as makeLineString} from '@turf/helpers';

import {NativeModules, NativeEventEmitter} from 'react-native';

var {height, width} = Dimensions.get('window');
import env from '../../env.json';
import NavigationUI from './NavigationUI';
import DestinationBar from './DestinationBar';
import CenterButton from './CenterButton';
import FitRouteButton from './FitRouteButton';

const BAR_HEIGHT = 50;
const {ModuleWithEmitter} = NativeModules;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featureCollection: MapboxGL.geoUtils.makeFeatureCollection(),
      route: null,
      navigation: false,
      initalCords: {
        lat: null,
        long: null,
      },
    };
    this.camera = React.createRef();
  }

  componentDidMount() {
    MapboxGL.setAccessToken(env.accessToken);
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
            var lat = parseFloat(locations[0].latitude);
            var long = parseFloat(locations[0].longitude);
            if (!this.state.navigation) {
              this.props.currUpdate(lat, long);
            }
            if (this.state.initalCords.lat == null) {
              this.setState({
                initalCords: {
                  lat: lat,
                  long: long,
                },
              });
            }
          },
        );
      }
    });
    MapboxGL.locationManager.start();

    const eventEmitter = new NativeEventEmitter(ModuleWithEmitter);
    eventEmitter.addListener('NavCancel', event => {
      this.setState({navigation: false});
    });
    eventEmitter.addListener('Navigation', event => {
      console.log(event);
    });
  }

  newDestination = () => {
    const feature = MapboxGL.geoUtils.makeFeature({
      coordinates: [
        this.props.destination.longitude,
        this.props.destination.latitude,
      ],
      type: 'Point',
    });
    feature.id = 'marker';
    this.setState({
      featureCollection: MapboxGL.geoUtils.addToFeatureCollection(
        this.state.featureCollection,
        feature,
      ),
    });
    this.createLine();
  };

  async createLine() {
    const reqOptions = {
      waypoints: [
        {
          coordinates: [
            this.props.current.longitude,
            this.props.current.latitude,
          ],
        },
        {
          coordinates: [
            this.props.destination.longitude,
            this.props.destination.latitude,
          ],
        },
      ],
      profile: 'cycling',
      geometries: 'geojson',
      overview: 'full',
    };

    const res = await directionsClient.getDirections(reqOptions).send();
    var duration = res.body.routes[0].duration / 60;
    var distance = res.body.routes[0].distance * 0.000621371;
    this.setState({
      duration: duration.toFixed(0),
      distance: distance.toFixed(1),
      route: makeLineString(res.body.routes[0].geometry.coordinates),
    });
    this.fitRoute();
  }

  fitRoute = () => {
    if (this.props.current.longitude < this.props.destination.longitude) {
      this.camera.current.fitBounds(
        [this.props.destination.longitude, this.props.destination.latitude],
        [this.props.current.longitude, this.props.current.latitude],
        30,
        1500,
      );
    } else {
      this.camera.current.fitBounds(
        [this.props.current.longitude, this.props.current.latitude],
        [this.props.destination.longitude, this.props.destination.latitude],
        30,
        1500,
      );
    }
  };

  clearDestination = () => {
    this.setState({
      featureCollection: MapboxGL.geoUtils.makeFeatureCollection(),
      route: null,
    });
  };

  centerMap = () => {
    this.camera.current.setCamera({
      centerCoordinate: [
        this.props.current.longitude,
        this.props.current.latitude,
      ],
      zoomLevel: 13,
      animationDuration: 1500,
    });
  };

  componentWillUnmount() {
    MapboxGL.locationManager.dispose();
  }

  renderRoute() {
    if (!this.state.route) {
      return null;
    }

    return (
      <MapboxGL.ShapeSource id="routeSource" shape={this.state.route}>
        <MapboxGL.LineLayer id="routeFill" style={layerStyles.route} />
      </MapboxGL.ShapeSource>
    );
  }

  launchNavigation = () => {
    this.setState({navigation: true});
  };

  renderView() {
    if (this.state.navigation) {
      return <NavigationUI />;
    } else {
      return (
        <View>
          {!!this.state.initalCords.lat && (
            <MapboxGL.MapView
              style={styles.map}
              onPress={this.onPress}
              compassViewMargins={{x: 20, y: 80}}>
              <MapboxGL.UserLocation visible={true} />
              <MapboxGL.Camera
                ref={this.camera}
                zoomLevel={14}
                animationMode={'flyTo'}
                animationDuration={2000}
                centerCoordinate={[
                  this.state.initalCords.long,
                  this.state.initalCords.lat,
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
              {this.renderRoute()}
            </MapboxGL.MapView>
          )}
          {!!this.props.destination.address && (
            <DestinationBar
              launchNavigation={this.launchNavigation}
              distance={this.state.distance}
              duration={this.state.duration}
            />
          )}
          {!!this.props.destination.address && (
            <FitRouteButton fitRoute={this.fitRoute} />
          )}
          <DirectionBar
            destCallback={this.newDestination}
            clearCallback={this.clearDestination}
          />
          <CenterButton centerCallback={this.centerMap} />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        {this.renderView()}
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
    height: height - BAR_HEIGHT,
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
  route: {
    lineColor: 'black',
    lineCap: MapboxGL.LineJoin.Round,
    lineWidth: 3,
    lineOpacity: 0.74,
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
  return {
    currUpdate: (latitude, longitude) => {
      dispatch(currUpdate(latitude, longitude));
    },
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
