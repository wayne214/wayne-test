import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import Storage from '../utils/storage';
import StorageKey from '../constants/storageKeys';

const initState = Immutable.fromJS({
    userInfo: {}, // 登录返回的用户信息
    userName: '', // 用户名
    plateNumber: '', // 用户绑定的车辆
    plateNumberObj: {}, // 用户绑定的车辆信息
    userCarList: [], // 用户车辆列表
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
            global.userInfo = action.payload;

            Storage.save(StorageKey.USER_INFO, action.payload);
            Storage.save(StorageKey.TOKEN, action.payload.token);
            Storage.save(StorageKey.PHOTO_REF_NO, action.payload.photoRefNo);
            Storage.save(StorageKey.USER_ID, action.payload.userId);

            globalState = globalState.set('userInfo', action.payload);
            globalState = globalState.set('userName', action.payload.userName);

            return globalState;

        case ActionTypes.ACTION_USER_NAME:

            global.userName = action.payload;

            globalState = globalState.set('userName', action.payload);
            return globalState;

        case ActionTypes.ACTION_USER_CAR:

            global.plateNumber = action.payload.plateNumber;

            Storage.save(StorageKey.PlateNumber, action.payload.plateNumber);
            Storage.save(StorageKey.PlateNumberObj, action.payload);

            globalState = globalState.set('plateNumber', action.payload.plateNumber);
            globalState = globalState.set('plateNumberObj', action.payload);

            return globalState;

        case ActionTypes.ACTION_USER_CLEAR:

            global.token = '';
            global.userId = '';
            global.userName = '';
            global.photoRefNo = '';
            global.phone = '';
            global.userInfo = {};

            Storage.save(StorageKey.USER_INFO, {});
            Storage.save(StorageKey.TOKEN, '');
            Storage.save(StorageKey.PHOTO_REF_NO, '');
            Storage.save(StorageKey.USER_ID, '');

            globalState = globalState.set('userInfo', {});
            globalState = globalState.set('userName', '');
            globalState = globalState.set('plateNumber', '');
            globalState = globalState.set('plateNumberObj', {});
            globalState = globalState.set('userCarList', []);


            return globalState;


        default:
            return state;
    }
};
