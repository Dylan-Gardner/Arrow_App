const initialState = {
  distance: 0.0,
  duration: 0,
  speed: 0.0,
  avgSpeed: 0.0,
  gain: 0.0,
  loss: 0.0,
  alts: [],
  altMin: null,
  altMax: null,
  started: false,
};
// Reducers (Modifies The State And Returns A New State)
const workoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'gpsUpdate': {
      return {
        // State
        ...state,
        distance: action.distance,
        speed: action.speed,
      };
    }

    case 'workoutStarted': {
      return {
        ...state,
        started: true,
      };
    }
    case 'workoutEnded': {
      return {
        ...state,
        started: false,
      };
    }
    case 'incDuration': {
      return {
        ...state,
        avgSpeed: state.distance / (action.duration / 3600),
        duration: state.duration + 1,
      };
    }
    case 'resetWorkout': {
      return {
        distance: 0.0,
        duration: 0,
        speed: 0.0,
        avgSpeed: 0.0,
        gain: 0.0,
        loss: 0.0,
        alts: [],
        altMin: null,
        altMax: null,
        started: false,
      };
    }
    // Default
    default: {
      return state;
    }
  }
};
// Exports
export default workoutReducer;