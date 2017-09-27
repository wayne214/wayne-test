import Immutable from 'immutable';
import React from 'react';
import * as ActionTypes from '../constants/actionType';

const initState = Immutable.fromJS({
    locationData: '定位中', // 首页城市名称
    getHomePageCount: {}, // 首页状态数量
    plateNumber: '', // 车牌号
    plateNumberObj: {}, //车牌号对象
});


export default (state = initState, action) => {
    let globalState = state;
    switch (action.type) {
        case ActionTypes.CHANGE_TAB:
            globalState = globalState.set('currentTab', action.payload.tab);
            return globalState;
            case ActionTypes.ACTION_GET_LOCATION:
            globalState = globalState.set('locationData', action.payload);
            return globalState;
        case ActionTypes.ACTION_GET_HOME_PAGE_COUNT:
            globalState = globalState.set('getHomePageCount', action.payload);
            return globalState;
        default:
            return state;
    }
};
