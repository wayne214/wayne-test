/**
 * OUTSIDEDRIVER  外部司机
 * Personalowner  个人车主
 * Enterpriseowner  企业车主
 * driverStatus ： 1 司机认证中     2 司机认证通过     3 司机认证驳回
 * ownerStatus ： 11 个人车主认证中 12 个人车主认证通过 13 个人车主认证驳回
 *                21 企业车主认证中 22 企业车主认证通过 23 企业车主认证驳回
 * currentStatus ： driver 司机  personalOwner 个人车主 businessOwner 企业车主
 * companyCode ：号
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
    currentStatus:'driver',
    companyCode: '', // 承运商编码
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
        case ActionTypes.ACTION_SET_DRIVER_CHARACTER:
            globalState = globalState.set('driverStatus', action.payload);
            return globalState;
        case ActionTypes.ACTION_SET_OWNER_CHARACTER:
            globalState = globalState.set('ownerStatus', action.payload);
            return globalState;
        case ActionTypes.ACTION_SET_CURRENT_CHARACTER:
            globalState = globalState.set('currentStatus', action.payload);
            return globalState;
        case ActionTypes.ACTION_GET_COMPANY_CODE:
            globalState = globalState.set('companyCode', action.payload);
            return globalState;
        case ActionTypes.ACTION_SET_COMPANY_CODE:
            globalState = globalState.set('companyCode', action.payload);
            return globalState;
        default:
            return state;
    }
};
