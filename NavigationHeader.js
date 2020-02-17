import React, {Component} from 'react';

import Map from './map/Map';
import RideTracking from './RideTracking';
import Settings from './settings/Settings';

import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

const TabNavigator = createBottomTabNavigator(
  {
    Map: Map,
    'Ride Tracking': RideTracking,
    Settings: Settings,
  },
  {
    tabBarOptions: {
      style: {
        padding: 15,
        height: 50,
      },
    },
  },
);

let Navigation = createAppContainer(TabNavigator);

class NavigationHeader extends Component {
  render() {
    return <Navigation />;
  }
}

export default NavigationHeader;
