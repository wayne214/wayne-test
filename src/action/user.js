import * as ActionTypes from '../constants/actionType';

export const loginSuccessAction = (data) => {
    return {
        type: ActionTypes.ACTION_LOGIN_SUCCESS,
        payload: data,
    };
};
