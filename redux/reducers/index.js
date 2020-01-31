// Imports: Dependencies
import { combineReducers } from 'redux';
// Imports: Reducers
import musicReducer from './musicReducer';

// Redux: Root Reducer
const rootReducer = combineReducers({
  musicReducer: musicReducer,
});
// Exports
export default rootReducer;
