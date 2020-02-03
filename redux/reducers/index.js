// Imports: Dependencies
import { combineReducers } from 'redux';
// Imports: Reducers
import musicReducer from './musicReducer';
import mapReducer from './mapReducer';

// Redux: Root Reducer
const rootReducer = combineReducers({
  musicReducer: musicReducer,
  mapReducer: mapReducer
});
// Exports
export default rootReducer;
