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


var {height, width} = Dimensions.get('window');

class DirectionBar extends Component {
  constructor(props){
    super(props)
  }
  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        //console.log(place);
        this.props.destUpdate(
          place.location.latitude,
          place.location.longitude,
          place.address,
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
      <View style={styles.bar}>
        {!!this.props.destination.address &&
          <TouchableOpacity onPress={() => this.props.launchNavigation()}>
            <Text>
              Go
            </Text>
          </TouchableOpacity>
        }
        <TouchableOpacity
          style={styles.input}
          onPress={() => this.openSearchModal()}>
          {this.props.destination.address == null && <Text>Search</Text>}
          {this.props.destination.address != null && (
            <Text> {this.props.destination.address} </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.clearAddress()}>
          <Text>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bar: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    height: 60,
    width: width,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: width - 100,
    borderRadius: 8,
    borderColor: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
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
