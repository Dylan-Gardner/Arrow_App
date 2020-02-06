import React, {Component} from 'react';
import { View, Text, DeviceEventEmitter } from 'react-native';
import {magnetometer, setUpdateIntervalForType, SensorTypes} from "react-native-sensors";

class RideTracking extends Component {

    componentDidMount() {
        setUpdateIntervalForType(SensorTypes.magnetometer, 100);
        this._subscription = magnetometer.subscribe((sensorData) =>{
            this.setState({magnetometer: this._angle(sensorData)});
            //console.log(this.state.magnetometer);
            //console.log(this._direction(this._degree(this.state.magnetometer)));
        });
    }

    componentWillUnmount(){
        this._unsubscribe();
    }
    
    _unsubscribe = () => {
        this._subscription && this._subscription.unsubscribe();
        this._subscription = null;
    };
    
    _angle = (magnetometer) => {
        if (magnetometer) {
          let {x, y, z} = magnetometer;
    
          if (Math.atan2(y, x) >= 0) {
            angle = Math.atan2(y, x) * (180 / Math.PI);
          }
          else {
            angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
          }
        }
    
        return Math.round(angle);
    };
    
    _direction = (degree) => {
        if (degree >= 22.5 && degree < 67.5) {
          return 'NE';
        }
        else if (degree >= 67.5 && degree < 112.5) {
          return 'E';
        }
        else if (degree >= 112.5 && degree < 157.5) {
          return 'SE';
        }
        else if (degree >= 157.5 && degree < 202.5) {
          return 'S';
        }
        else if (degree >= 202.5 && degree < 247.5) {
          return 'SW';
        }
        else if (degree >= 247.5 && degree < 292.5) {
          return 'W';
        }
        else if (degree >= 292.5 && degree < 337.5) {
          return 'NW';
        }
        else {
          return 'N';
        }
    };
    
      // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
    _degree = (magnetometer) => {
        return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
    };

    componentWillUnmount() {
        this.state.subscription.unsubscribe();
        this.setState({ subscription: null });
    }
    
    state = {  }
    render() {
        return (
            <View>
                <Text>
                    Yeet
                </Text>
            </View>
        );
    }
}

export default RideTracking;