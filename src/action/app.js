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
