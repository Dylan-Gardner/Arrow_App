export const gpsUpdate = (speed, distance, altitude) => ({
  type: 'gpsUpdate',
  speed: speed,
  distance: distance,
  altitude: altitude,
});
export const workoutStarted = () => ({
  type: 'workoutStarted',
});

export const workoutEnded = () => ({
  type: 'workoutEnded',
});

export const incDuration = () => ({
  type: 'incDuration',
});
export const updateAlt = alt => ({
  type: 'updateAlt',
  alt: alt,
});
export const reset = () => ({
  type: 'resetWorkout',
});
export const clearAlts = () => ({
  type: 'clearAlts',
});
export const calcGain = () => ({
  type: 'calcGain',
});
