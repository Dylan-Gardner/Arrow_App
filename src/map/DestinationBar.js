import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import DestinationBubble from './bubbles/DestinationBubble';
import Icon from 'react-native-vector-icons/MaterialIcons';

class DestinationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <DestinationBubble style={styles.container}>
        <Text style={styles.text}>{this.props.duration} min</Text>
        <Text style={styles.text}>{this.props.distance} mi</Text>
        <TouchableOpacity
          style={styles.navigation}
          onPress={this.props.launchNavigation}>
          <Text style={styles.text}>Go</Text>
          <Icon name={'directions'} size={30} color={'#4285F4'} />
        </TouchableOpacity>
      </DestinationBubble>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 0,
    margin: 0,
  },
  text: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 15,
  },
  navigation: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

const mapStateToProps = state => {
  // Redux Store --> Component
  return {
    destination: state.mapReducer.destination,
  };
};

export default connect(mapStateToProps)(DestinationBar);
