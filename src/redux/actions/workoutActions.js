export const speedUpdate = speed => ({
  type: 'speedUpdate',
  speed: speed,
});
export const workoutStarted = () => ({
  type: 'workoutStarted',
});

export const workoutEnded = () => ({
  type: 'workoutEnded',
});

export const incDuration = duration => ({
  type: 'incDuration',
  duration: duration + 1,
});

export const reset = () => ({
  type: 'resetWorkout',
});
