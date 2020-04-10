const initialState = {
  distance: 0.0,
  duration: 0,
  speed: 0.0,
  avgSpeed: 0.0,
  gain: 0.0,
  loss: 0.0,
  alt: 0,
  alts: [],
  altMin: 99999999,
  altMax: -99999,
  prev_alt: 0,
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
        alts: state.alts.concat(action.altitude),
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
    case 'clearAlts': {
      return {
        ...state,
        alts: [],
      };
    }
    case 'incDuration': {
      return {
        ...state,
        avgSpeed: state.distance / ((state.duration + 1) / 3600),
        duration: state.duration + 1,
      };
    }
    case 'updateAlt': {
      return {
        ...state,
        alt: action.alt,
        prev_alt: state.alt,
      };
    }
    case 'calcGain': {
      var options = {};
      if (state.altMax < state.alt) {
        options = {
          ...options,
          altMax: state.alt,
        };
      }
      if (state.altMin > state.alt) {
        options = {
          ...options,
          altMin: state.alt,
        };
      }
      var calc = state.alt - state.prev_alt;
      if (calc > 0) {
        options = {
          ...options,
          gain: state.gain + calc,
        };
      } else {
        options = {
          ...options,
          loss: state.loss + calc,
        };
      }
      options = {
        ...state,
        ...options,
      };
      console.log(options);
      return {
        options,
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
        alt: 0,
        alts: [],
        altMin: 99999999,
        altMax: -9999,
        prev_alt: 0,
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
