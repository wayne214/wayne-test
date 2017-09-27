import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';

const initState = Immutable.fromJS({
    userInfo: {}, // 登录返回的用户信息
    userName: '', // 用户名
    plateNumber: '', // 用户绑定的车辆
});

export default (state = initState, action) => {
    console.log('initState:',state.get('userInfo'));

    let globalState = state;
    switch (action.type) {
        case ActionTypes.ACTION_LOGIN_SUCCESS:

            global.token = action.payload.token;
            global.userId = action.payload.userId;
            global.userName = action.payload.userName;
            global.photoRefNo = action.payload.photoRefNo;
            global.phone = action.payload.phone;

            globalState = globalState.set('userInfo', action.payload);
            return globalState;

        case ActionTypes.ACTION_USER_NAME:

            globalState = globalState.set('userName', action.payload);
            return globalState;

        case ActionTypes.ACTION_USER_CAR:
            globalState = globalState.set('plateNumber', action.payload);
            return globalState;
        default:
            return state;
    }
};
