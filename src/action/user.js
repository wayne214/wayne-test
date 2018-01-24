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

/*车主的用户名发生改变*/
export const setOwnerNameAction = (data) => {
    return {
        type: ActionTypes.ACTION_OWNER_NAME,
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

/*账户-司机角色*/
export const setDriverCharacterAction = (data) => {
    return {
        type: ActionTypes.ACTION_SET_DRIVER_CHARACTER,
        payload: data,
    };
};

/*账户-车主角色*/
export const setOwnerCharacterAction = (data) => {
    return {
        type: ActionTypes.ACTION_SET_OWNER_CHARACTER,
        payload: data,
    };
};

/*账户-设置当前角色*/
export const setCurrentCharacterAction = (data) => {
    return {
        type: ActionTypes.ACTION_SET_CURRENT_CHARACTER,
        payload: data,
    };
};

/*账户-获取承运商编码*/
export const setCompanyCodeAction = (data) => {
    return {
        type: ActionTypes.ACTION_SET_COMPANY_CODE,
        payload: data,
    };
};
