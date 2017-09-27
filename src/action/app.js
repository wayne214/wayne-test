/**
 * Created by xizhixin on 2017/9/21.
 */
import * as ActionTypes from '../constants/actionType';
export const mainPressAction = (orderTab) => {
    return {
        type: ActionTypes.ACTION_MAIN_PRESS,
        payload: {orderTab},
    };
};
