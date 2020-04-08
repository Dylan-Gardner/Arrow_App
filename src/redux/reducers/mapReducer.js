const initialState = {
  current: {
    latitude: null,
    longitude: null,
  },
  destination: {
    latitude: null,
    longitude: null,
    address: null,
  },
  view: {
    latitude: null,
    longitude: null,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  navigation: false,
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CURR_POS': {
      return {
        ...state,
        current: {
          latitude: action.latitude,
          longitude: action.longitude,
        },
      };
    }
    case 'DEST_POS': {
      return {
        ...state,
        destination: {
          latitude: action.latitude,
          longitude: action.longitude,
          address: action.address,
        },
      };
    }
    case 'VIEW_UPDATE': {
      return {
        ...state,
        view: {
          latitude: action.latitude,
          longitude: action.longitude,
          latitudeDelta: action.LATITUDE_DELTA,
          longitudeDelta: action.LONGITUDE_DELTA,
        },
      };
    }
    case 'NAV_START': {
      return {
        ...state,
        navigation: true,
      };
    }
    case 'NAV_STOP': {
      return {
        ...state,
        navigation: false,
      };
    }
    default:
      return state;
  }
};

export default mapReducer;
