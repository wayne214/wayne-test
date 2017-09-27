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
}
export const mainPressAction = (orderTab) => {
    return {
        type: ActionTypes.ACTION_MAIN_PRESS,
        payload: {orderTab},
    };
};
