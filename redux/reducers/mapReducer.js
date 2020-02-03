const initialState = {
    current: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    },
    destination: {
        latitude: null,
        longitude: null,
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
                    longitudeDelta: action.LONGITUDE_DELTA,
                    latitudeDelta: action.LATITUDE_DELTA,
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
                    longitude: action.longitude
                }
            }
        }
        default:
            return state;
    }
};

export default mapReducer;