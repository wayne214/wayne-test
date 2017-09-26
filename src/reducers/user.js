import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';

const initState = Immutable.fromJS({
    userInfo: {}, // 登录返回的用户信息
    abc: '',
});

export default (state = initState, action) => {
    console.log('initState:',state.get('userInfo'));

    let globalState = state;
    switch (action.type) {
        case ActionTypes.ACTION_LOGIN_SUCCESS:

            debugger

            global.token = action.payload.token;
            global.userId = action.payload.userId;
            global.userName = action.payload.userName;
            global.photoRefNo = action.payload.photoRefNo;
            global.phone = action.payload.phone;

            globalState = globalState.set('userInfo', action.payload);
            return globalState;

        default:
            return state;
    }
};
