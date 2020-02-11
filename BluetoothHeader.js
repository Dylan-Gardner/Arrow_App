import React, { Component } from 'react';
import { View } from 'react-native';

import { BleManager, BleManagerOptions } from 'react-native-ble-plx';
import MusicHeader from './MusicHeader';

class BluetoothHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
        this.manager = new BleManager();//new BleManagerOptions(restoreStateIdentifier, restoreStateFunction));
    }

    componentDidMount() {
        const subscription = this.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.scanAndConnect();
                subscription.remove();
            }
        }, true);
    }

    scanAndConnect() {
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                return
            }
    
            // Check if it is a device you are looking for based on advertisement data
            // or other criteria.
            if (device.name === 'Adafruit Bluefruit LE') {
                
                // Stop scanning as it's not necessary if you are scanning for one device.
                this.manager.stopDeviceScan();
    
                // Proceed with connection.
                device.connect()
                    .then((device) => {
                        return device.discoverAllServicesAndCharacteristics()
                    })
                    .then((device) => {
                    // Do work on device with services and characteristics
                    })
                    .catch((error) => {
                        // Handle errors
                    });
            }
        });
    }


    render() {
        return (
            <MusicHeader/>
        );
    }
}

export default BluetoothHeader;