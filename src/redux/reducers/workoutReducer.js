const initialState = {
  distance: 0.0,
  duration: 0,
  speed: 0.0,
  avgSpeed: 0.0,
  altMin: null,
  altMax: null,
  altDelta: 0,
  totalSpeed: 0,
  started: false,
};
// Reducers (Modifies The State And Returns A New State)
const workoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'speedUpdate': {
      return {
        // State
        ...state,
        // Redux Store
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
        duration: action.duration,
      };
    }
    case 'resetWorkout': {
      return {
        distance: 0.0,
        duration: 0,
        speed: 0.0,
        avgSpeed: 0.0,
        altMin: null,
        altMax: null,
        altDelta: 0,
        totalSpeed: 0,
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
