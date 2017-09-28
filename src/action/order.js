/**
 * Created by xizhixin on 2017/9/27.
 */
import * as ActionTypes from '../constants/actionType';
// 是否刷新出发城市更多（状态）
export const isReSetCity = (data) => {
    return {
        type: ActionTypes.ACTION_RESET_CITY_LIST,
        payload: data,
    };
};
