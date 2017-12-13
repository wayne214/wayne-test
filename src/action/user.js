import * as ActionTypes from '../constants/actionType';

/*用户登录成功，或者处于登录状态*/
export const loginSuccessAction = (data) => {
    return {
        type: ActionTypes.ACTION_LOGIN_SUCCESS,
        payload: data,
    };
};

/*用户的用户名发生改变*/
export const setUserNameAction = (data) => {
    return {
        type: ActionTypes.ACTION_USER_NAME,
        payload: data,
    };
};

/*用户绑定的车牌号发生改变*/
export const setUserCarAction = (data) => {
    return {
        type: ActionTypes.ACTION_USER_CAR,
        payload: data,
    };
};

/*clear user 信息*/
export const clearUser = (data) => {
    return {
        type: ActionTypes.ACTION_USER_CLEAR,
        payload: data,
    };
};
/*查询司机对应企业性质*/
export const queryEnterpriseNatureSuccessAction = (data) => {
    return {
        type: ActionTypes.ACTION_QUERY_ENTER_PRISE_NATURE,
        payload: data,
    };
};

// 保存用户车辆列表
export const saveUserCarList = (data) => {
    return {
        type: ActionTypes.ACTION_SAVE_USER_CAR_LIST,
        payload: data,
    };
};

/*账户-角色*/
export const setCharacterAction = (data) => {
    return {
        type: ActionTypes.ACTION_SET_CHARACTER,
        payload: data,
    };
};
