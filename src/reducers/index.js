import { combineReducers } from 'redux';
import userInfo from './userInfo';
import update from './updatecomponent';

export default combineReducers({
    userInfo,
    update
})