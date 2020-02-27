import React, { Component } from 'react';
import { View , Text, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import DestinationBubble from './bubbles/DestinationBubble';


class DestinationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <DestinationBubble style={styles.container}>
                <Text style={styles.text}>
                    {this.props.duration} min
                </Text>
                <Text style={styles.text}>
                    {this.props.distance} mi
                </Text>
                <TouchableOpacity onPress={this.props.launchNavigation}>
                    <Text style={styles.text}>
                        Go
                    </Text>
                </TouchableOpacity>
            </DestinationBubble>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row'
    },
    text: {
        paddingLeft:10,
        paddingRight:10,
        fontSize:15
    }
});

const mapStateToProps = state => {
    // Redux Store --> Component
    return {
      destination: state.mapReducer.destination,
    };
  };

export default connect(mapStateToProps)(DestinationBar);