import { combineReducers } from 'redux'
import viewerReducer from './viewerReducer';
import {reducer as fetchReducer} from 'react-redux-fetch';

const rootReducers = combineReducers({
    viewer:viewerReducer,
    repository:fetchReducer,
})
export default rootReducers;
