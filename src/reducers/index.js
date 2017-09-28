/**
 * Created by xizhixin on 2017/9/20.
 */
import {combineReducers} from 'redux';
import app from './app';
import user from './user';
import mine from './mine';
import goods from './goods';
import order from './order';
import jpush from './jpush';
import income from './income';
import nav from './navReducers';

const rootReducer = combineReducers({
    app,
    user,
    mine,
    goods,
    order,
    jpush,
    income,
    nav,
});

export default rootReducer;
