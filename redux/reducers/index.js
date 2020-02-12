// Imports: Dependencies
import { combineReducers } from 'redux';
// Imports: Reducers
import musicReducer from './musicReducer';
import mapReducer from './mapReducer';
import bluetoothReducer from './bluetoothReducer'

// Redux: Root Reducer
const rootReducer = combineReducers({
  musicReducer: musicReducer,
  mapReducer: mapReducer,
  bluetoothReducer: bluetoothReducer
});
// Exports
export default rootReducer;
