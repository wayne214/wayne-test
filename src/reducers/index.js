/**
 * Created by xizhixin on 2017/9/20.
 */
import {combineReducers} from 'redux';
// import user from './user';
import app from './app';
// import mine from './mine';
// import goods from './goods';
// import order from './order';
// import jpush from './jpush';
// import income from './income';

const rootReducer = combineReducers({
    app,
    // user,
    // mine,
    // goods,
    // order,
    // jpush,
    // income,
});

export default rootReducer;
