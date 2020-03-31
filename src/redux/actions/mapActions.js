export const currUpdate = (latitude, longitude) => ({
  type: 'CURR_POS',
  latitude: latitude,
  longitude: longitude,
});

export const destUpdate = (latitude, longitude, address) => ({
  type: 'DEST_POS',
  latitude: latitude,
  longitude: longitude,
  address: address,
});

export const viewUpdate = (
  latitude,
  longitude,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
) => ({
  type: 'VIEW_UPDATE',
  latitude: latitude,
  longitude: longitude,
  LATITUDE_DELTA: LATITUDE_DELTA,
  LONGITUDE_DELTA: LONGITUDE_DELTA,
});
