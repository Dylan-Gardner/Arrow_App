export const currUpdate = (latitude, longitude, LATITUDE_DELTA, LONGITUDE_DELTA) => ({
    type: 'CURR_POS',
    latitude: latitude,
    longitude: longitude,
    LATITUDE_DELTA: LATITUDE_DELTA,
    LONGITUDE_DELTA: LONGITUDE_DELTA
  });

  export const destUpdate = (latitude, longitude, address) => ({
    type: 'DEST_POS',
    latitude: latitude,
    longitude: longitude,
    address: address,
  });