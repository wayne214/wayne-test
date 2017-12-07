import Immutable from 'immutable';
import React from 'react';
import * as ActionTypes from '../constants/actionType';

const initState = Immutable.fromJS({
    locationData: '定位中', // 首页城市名称
    getHomePageCount: {}, // 首页状态数量
    plateNumber: '', // 车牌号
    plateNumberObj: {}, //车牌号对象
    versionUrl: '', // 版本地址
    speechSwitchStatus: true, // 语音播报开关
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

        case ActionTypes.UPDATE_VERSION:
            globalState = globalState.set('versionUrl', action.payload);
            return globalState;

        case ActionTypes.ACTION_MAIN_PRESS:
            globalState = globalState.set('mainPress', action.payload.orderTab);
            return globalState;

        case ActionTypes.ACTION_VOICE_SWITCH:
            globalState = globalState.set('speechSwitchStatus', action.payload);
            return globalState;

        default:
            return state;
    }
};
