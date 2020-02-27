import React, {Component} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import {connect} from 'react-redux';
import {destUpdate} from '../redux/actions/mapActions';
import NavigationBubble from './NavigationBubble'
import DestinationBubble from './DestinationBubble';


var {height, width} = Dimensions.get('window');

class DirectionBar extends Component {
  constructor(props){
    super(props)
  }
  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        var pieces = place.address.split(",");
        pieces.length = pieces.length-1;
        var address = pieces.join(",");
        //console.log(place);
        this.props.destUpdate(
          place.location.latitude,
          place.location.longitude,
          address,
        );
        this.props.destCallback();
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  }

  clearAddress() {
    this.props.destUpdate(null, null, null);
    this.props.clearCallback();
  }
  render() {
    return (
      <NavigationBubble style={styles.bubble}>
        {!!this.props.destination.address &&
          <TouchableOpacity style={styles.buttons} onPress={() => this.props.launchNavigation()}>
            <Text>
              Go
            </Text>
          </TouchableOpacity>
        }
        <View style={styles.bar}>
          <TouchableOpacity
            style={styles.input}
            onPress={() => this.openSearchModal()}>
            {this.props.destination.address == null && <Text>Search</Text>}
            {this.props.destination.address != null && (
              <Text> {this.props.destination.address} </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={() => this.clearAddress()}>
            <Text>Clear</Text>
          </TouchableOpacity>
        </View>
      </NavigationBubble>
    );
  }
}

const styles = StyleSheet.create({
  bubble:{
    justifyContent: 'center',
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#4285F4'
  },
  bar: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth:1,
  },
  input: {
    height: 40,
    width: width - 110,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8
  },
  buttons: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius:8,
    borderTopRightRadius: 8
  }
});

const mapStateToProps = state => {
  // Redux Store --> Component
  return {
    destination: state.mapReducer.destination,
  };
};
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = dispatch => {
  // Action
  return {
    // Decrease Counter
    destUpdate: (latitude, longitude, address) => {
      dispatch(destUpdate(latitude, longitude, address));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DirectionBar);
