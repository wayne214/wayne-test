/**
 * OUTSIDEDRIVER  外部司机
 * Personalowner  个人车主
 * Enterpriseowner  企业车主
 * driverStatus ： 0 未认证 1 认证中 2 认证驳回
 * ownerStatus ： 0 未认证 1 个人车主认证中 2 个人车主认证驳回 3 企业车主认证中 4 企业车主认证驳回
 */
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
    driverStatus: '0',
    ownerStatus: '0',

});

export default (state = initState, action) => {
    // console.log('initState:',state.get('userInfo'));
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
            global.plateNumber = action.payload.carNum;
            global.plateNumberObj = action.payload;

            Storage.save(StorageKey.PlateNumber, action.payload.carNum);
            Storage.save(StorageKey.PlateNumberObj, action.payload);

            globalState = globalState.set('plateNumber', action.payload.carNum);
            globalState = globalState.set('plateNumberObj', action.payload);

            return globalState;

        case ActionTypes.ACTION_USER_CLEAR:

            global.token = '';
            global.userId = '';
            global.userName = '';
            global.photoRefNo = '';
            global.phone = '';
            global.userInfo = {};
            global.plateNumber = '';
            global.userInfo = {carNum: '', carStatus: 0};

            Storage.remove(StorageKey.USER_INFO);
            Storage.remove(StorageKey.TOKEN);
            Storage.remove(StorageKey.PHOTO_REF_NO);
            Storage.remove(StorageKey.USER_ID);

            globalState = globalState.set('userInfo', {});
            globalState = globalState.set('userName', '');
            globalState = globalState.set('plateNumber', '');
            globalState = globalState.set('plateNumberObj', {carNum: '', carStatus: 0});
            globalState = globalState.set('userCarList', []);

            return globalState;

        case ActionTypes.ACTION_QUERY_ENTER_PRISE_NATURE:
            globalState = globalState.set('queryEnterPrise', action.payload);
            return globalState;

        case ActionTypes.ACTION_SAVE_USER_CAR_LIST:
            console.log('userCarList', action.payload);
            Storage.save('userCarList', action.payload);
            globalState = globalState.set('userCarList', action.payload);
            return globalState;
        case ActionTypes.ACTION_SET_CHARACTER:
            // globalState = globalState.set('driver', action.payload.driver);
            // globalState = globalState.set('owner', action.payload.owner);
            globalState = globalState.set('driverStatus', action.payload.driverStatus);
            globalState = globalState.set('ownerStatus', action.payload.ownerStatus);
            return globalState;
        default:
            return state;
    }
};
