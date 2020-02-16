const initialState = {
    current: {
        latitude: 37.78825,
        longitude: -122.4324,
    },
    destination: {
        latitude: null,
        longitude: null,
        address: null,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    },
    view: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }
  };

const mapReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CURR_POS': {
            return {
                ...state,
                current:{
                    latitude: action.latitude,
                    longitude: action.longitude
                }
            }

        }
        case 'DEST_POS': {
            return {
                ...state,
                destination: {
                    ...state.destination,
                    latitude: action.latitude,
                    longitude: action.longitude,
                    address: action.address
                }
            }
        }
        case 'VIEW_UPDATE': {
            return {
                ...state,
                view: {
                    latitude: action.latitude,
                    longitude: action.longitude,
                    latitudeDelta: action.LATITUDE_DELTA,
                    longitudeDelta: action.LONGITUDE_DELTA
                }

            }
        }
        default:
            return state;
    }
};

export default mapReducer;