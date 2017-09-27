// 是否刷新出发城市更多（状态）
import * as ActionTypes from '../constants/actionType';
export const isReSetCity = (data) => {
    return {
        type: ActionTypes.ACTION_RESET_CITY_LIST,
        payload: data,
    };
};
