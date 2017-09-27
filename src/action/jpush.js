/**
 * Created by wangl on 2017/6/5.
 */
import * as ActionTypes from '../constants/actionType';

export const setMessageListIconAction = (data) => {
    return {
        type: ActionTypes.ACTION_SET_MESSAGE_LIST_ICON,
        payload: data,
    };
};

//实名
export const setVerifiedAction = (data) => {
    return {
        type: ActionTypes.ACTION_SET_VERIFIED_STATE,
        payload: data,
    };
};

//资质
export const setCertificationAction = (data) => {
    return {
        type: ActionTypes.ACTION_SET_CERTIFICATION_STATE,
        payload: data,
    };
};

//车牌号
export const setCarNumAction = (data) => {
    return {
        type: ActionTypes.ACTION_SET_CAR_NUM,
        payload: data,
    };
};
