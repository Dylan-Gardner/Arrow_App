// Imports: Dependencies
import {combineReducers} from 'redux';
// Imports: Reducers
import musicReducer from './musicReducer';
import mapReducer from './mapReducer';
import bluetoothReducer from './bluetoothReducer';
import trackingReducer from './trackingReducer';

// Redux: Root Reducer
const rootReducer = combineReducers({
  musicReducer: musicReducer,
  mapReducer: mapReducer,
  bluetoothReducer: bluetoothReducer,
  trackingReducer: trackingReducer,
});
// Exports
export default rootReducer;
