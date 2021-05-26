import { combineReducers } from 'redux';
import userInfo from './userInfo';
import update from './updatecomponent';
import userId from './userId';

export default combineReducers({
    userInfo,
    update,
    userId
})