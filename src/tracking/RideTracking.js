import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class RideTracking extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <View>
          <Text>Ride Tracking</Text>
        </View>
        <View>
          <Text>
            Distance
          </Text>
        </View>
        <View style={styles.dual}>
          <Text>
            Duration
          </Text>
          <Text>
            Speed
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dual: {
    flexDirection:'row'
  }
})

export default RideTracking;
