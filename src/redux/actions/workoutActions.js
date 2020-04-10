export const gpsUpdate = (speed, distance) => ({
  type: 'gpsUpdate',
  speed: speed,
  distance: distance,
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

export const reset = () => ({
  type: 'resetWorkout',
});
