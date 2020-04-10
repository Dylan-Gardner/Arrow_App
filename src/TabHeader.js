import React, {Component} from 'react';

import Map from './map/Map';
import RideTracking from './tracking/RideTracking';
import Settings from './settings/Settings';

import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

const TabNavigator = createBottomTabNavigator(
  {
    Navigation: Map,
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

class TabHeader extends Component {
  render() {
    return <Navigation />;
  }
}

export default TabHeader;