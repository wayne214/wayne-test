/**
 * Created by xizhixin on 2017/9/21.
 */
import * as ActionTypes from '../constants/actionType';
// 定位信息
export const locationAction = (data) => {
    return {
        type: ActionTypes.ACTION_GET_LOCATION,
        payload: data,
    };
};
// 获取首页状态数量
export const getHomePageCountAction = (data) => {
    return {
        type: ActionTypes.ACTION_GET_HOME_PAGE_COUNT,
        payload: data,
    };
};
// 获取首页状态数量
export const getCarrierHomoPageCountAction = (data) => {
    return {
        type: ActionTypes.ACTION_GET_CARRIER_HOME_PAGE_COUNT,
        payload: data,
    };
};
export const mainPressAction = (orderTab) => {
    return {
        type: ActionTypes.ACTION_MAIN_PRESS,
        payload: {orderTab},
    };

};
// 版本升级
export const updateVersionAction = (versionUrl) => {
    return {
        type: ActionTypes.UPDATE_VERSION,
        payload: versionUrl,
    };
};

// 语音播报
export const voiceSpeechAction = (value) => {
    return {
        type: ActionTypes.ACTION_VOICE_SWITCH,
        payload: value,
    };
};
// 添加视频
export const addVideoAction = (value) => {
    return {
        type: ActionTypes.ACTION_ADD_VIDEO,
        payload: value,
    };
};
// 删除视频
export const deleteVideoAction = (value) => {
    return {
        type: ActionTypes.ACTION_DELETE_VIDEO,
        payload: value,
    };
};
// 清空视频
export const clearVideoAction = (value) => {
    return {
        type: ActionTypes.ACTION_CLEAR_VIDEO,
        payload: value,
    };
};
