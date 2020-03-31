const initialState = {
  distance: 0.0,
  duration: 0,
  speed: 0.0,
  avgSpeed: 0.0,
  altMin: null,
  altMax: null,
  altDelta: 0,
  totalSpeed: 0,
};
// Reducers (Modifies The State And Returns A New State)
const trackingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PosUpdate': {
      return {
        // State
        ...state,
        // Redux Store
        speed: action.speed,
      };
    }
    // Default
    default: {
      return state;
    }
  }
};
// Exports
export default trackingReducer;
