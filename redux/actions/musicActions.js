// Login
export const songUpdate = (trackName, artistName, trackLength) => ({
  type: 'SongUpdate',
  track: trackName,
  artist: artistName,
  track_length: trackLength
});

export const playbackUpdate = (isPlaying, playbackPosition) => ({
  type: 'PlaybackUpdate',
  isPlaying: isPlaying,
  playbackPosition: playbackPosition

})
