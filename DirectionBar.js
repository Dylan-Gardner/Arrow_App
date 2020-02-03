import React , {Component}from 'react';
import { TextInput, View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import { connect } from 'react-redux';
import {destUpdate} from './redux/actions/mapActions'

var {height, width} = Dimensions.get('window');

class DirectionBar extends Component {
    state = {
        dest: null
      }
    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal()
        .then((place) => {
            //console.log(place);
            this.setState({dest: place.address});
            this.props.destUpdate(place.location.latitude, place.location.longitude);
            // place represents user's selection from the
            // suggestions and it is a simplified Google Place object.
        })
        .catch(error => console.log(error.message));  // error is a Javascript Error object
    }
    render() {
        return (
                <View style={styles.bar}>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => this.openSearchModal()}
                    >
                        {this.state.dest == null && 
                        <Text>Search</Text>
                        }
                        {this.state.dest != null && 
                        <Text> {this.state.dest} </Text>
                        }
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
        alignItems : 'center'
    },
    input: {
        height: 40,
        width: width-70,
        borderRadius: 8,
        borderColor: 'black',
        backgroundColor:'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    }
});

const mapStateToProps = (state) => {
    // Redux Store --> Component
    return {
      destination: state.mapReducer.destination
    };
  };
  // Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
  const mapDispatchToProps = (dispatch) => {
    // Action
    return {
      // Decrease Counter
      destUpdate: (latitude, longitude) => {dispatch(destUpdate(latitude, longitude))},
  
    };
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(DirectionBar);
