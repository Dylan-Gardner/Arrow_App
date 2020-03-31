import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';

class RideTracking extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var measuredTime = new Date(null);
    measuredTime.setSeconds(this.props.tracking.duration);
    var MHSTime = measuredTime.toISOString().substr(11, 8);
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.boxText}>
              {this.props.tracking.distance.toFixed(1)}
            </Text>
            <Text style={styles.boxText}>DISTANCE(MI)</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.boxText}>{MHSTime}</Text>
            <Text style={styles.boxText}>DURATION</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxText}>
              {this.props.tracking.speed.toFixed(1)}
            </Text>
            <Text style={styles.boxText}>SPEED(MPH)</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.boxText}>
              {this.props.tracking.avgSpeed.toFixed(1)}
            </Text>
            <Text style={styles.boxText}>AVG SPEED(MPH)</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxText}>Cal or delta alt</Text>
          </View>
        </View>
        <View style={styles.buttonBox}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 2,
    flexDirection: 'row',
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '35%',
    backgroundColor: 'green',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => {
  // Redux Store --> Component
  return {
    tracking: state.trackingReducer,
  };
};
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)

export default connect(mapStateToProps)(RideTracking);
