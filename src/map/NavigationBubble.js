import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    position: 'absolute',
    top: 5,
    left: 20,
    right: 20,
    paddingVertical: 16,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

class NavigationBubble extends React.PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    children: PropTypes.any,
    style: PropTypes.any,
  };

  render() {
    let innerChildView = this.props.children;

    if (this.props.onPress) {
      innerChildView = (
        <TouchableOpacity onPress={this.props.onPress}>
          {this.props.children}
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.container, this.props.style]}>{innerChildView}</View>
    );
  }
}

export default NavigationBubble;