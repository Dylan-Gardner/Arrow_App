import React, {Component} from 'react';
import {connect} from 'react-redux';

import {connected, disconnected} from './redux/actions/bluetoothActions';

global.Buffer = global.Buffer || require('buffer').Buffer;

import {BleManager} from 'react-native-ble-plx';
import MusicHeader from './music/MusicHeader';

const baseUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const sendUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const recvUUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

var moment = require('moment');

class BluetoothHeader extends Component {
  constructor(props) {
    super(props);
    var now = moment();
    this.state = {
      device: null,
      date: now.format('MM/DD/YYYY'),
      time: now.format('hh:mm a'),
      timer: setInterval(this.tick, 1000),
    };
    this.manager = new BleManager(); //new BleManagerOptions(restoreStateIdentifier, restoreStateFunction));
    this.musicRef = React.createRef();
  }

  tick = () => {
    var now = moment();
    this.setState({
      date: now.format('MM/DD/YYYY'),
      time: now.format('hh:mm a'),
    });
    /*this.sendMessage({
      home: {
        date: this.state.date,
        time: this.state.time,
      },
    });*/
  };

  componentDidMount() {
    const subscription = this.manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        this.scanBluetooth();
        subscription.remove();
      }
    }, true);
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  connectBluetooth() {
    this.state.device
      .connect()
      .then(device => {
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        // Do work on device with services and characteristics
        this.props.deviceConnect();
        const sub = device.onDisconnected((error, device) => {
          this.props.deviceDisconected();
          console.log(error.message);
          sub.remove();
          this.connectBluetooth();
        });
        device.monitorCharacteristicForService(
          baseUUID,
          recvUUID,
          (error, characteristic) => {
            if (error) {
              console.log(error.message);
              return;
            }
            var recv = Base64.decode(characteristic.value);
            console.log('RECV', recv);
            if (recv === 'skip') {
              this.child.skip();
            } else if (recv === 'prev') {
              this.child.prev();
            } else if (recv === 'playpause') {
              this.child.playpause();
            }
          },
        );
      })
      .catch(error => {
        // Handle errors
        console.log(error);
      });
  }

  scanBluetooth() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }

      if (device.name === 'Adafruit Bluefruit LE') {
        this.manager.stopDeviceScan();
        // Proceed with connection.
        this.setState({device: device});
        this.connectBluetooth();
      }
    });
  }

  sendMessage = message => {
    console.log('MESSAGE SENT', JSON.stringify(message));
    if (this.state.device && this.props.deviceConnected) {
      //console.log(message);
      let objJsonStr = JSON.stringify(message);
      let objJsonB64 = Buffer.from(objJsonStr).toString('base64');
      var sendArray = objJsonB64.match(/.{1,20}/g);
      for (const seg of sendArray) {
        this.state.device
          .writeCharacteristicWithoutResponseForService(baseUUID, sendUUID, seg)
          .then(characteristic => {
            //console.log(Base64.decode(characteristic))
            return;
          });
      }
    } else {
      //console.log('Not Connected');
    }
  };

  render() {
    return (
      <MusicHeader
        childRef={ref => (this.child = ref)}
        sendMessageCallback={this.sendMessage}
      />
    );
  }
}

var Base64 = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  encode: function(input) {
    var output = '';

    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;

    var i = 0;

    input = Base64._utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output =
        output +
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4);
    }
    return output;
  },

  // public method for decoding

  decode: function(input) {
    var output = '';
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = Base64._utf8_decode(output);
    return output;
  },
  // private method for UTF-8 encoding
  _utf8_encode: function(string) {
    string = string.replace(/\r\n/g, '\n');
    var utftext = '';
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  },
  // private method for UTF-8 decoding

  _utf8_decode: function(utftext) {
    var string = '';
    var i = 0;
    var c = (c1 = c2 = 0);

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63),
        );
        i += 3;
      }
    }
    return string;
  },
};

const mapStateToProps = state => {
  // Redux Store --> Component
  return {
    deviceConnected: state.bluetoothReducer.deviceConnected,
  };
};
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = dispatch => {
  // Action
  return {
    deviceConnect: () => {
      dispatch(connected());
    },
    deviceDisconected: () => {
      dispatch(disconnected());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BluetoothHeader);
