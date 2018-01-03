/**
 * Created by xizhixin on 2017/9/22.
 * storage中存值说明
 */

const IS_FIRST_START_FLAG = 'IS_FIRST_START_FLAG'; // 是否第一次启动App标记

const USER_INFO = 'USER_INFO'; // 用户信息

const TOKEN = 'TOKEN'; // 用户登录有效期

const PHOTO_REF_NO = 'PHOTO_REF_NO'; // 用户头像

const UDID = 'UDID'; // 唯一标识

const USER_ID = 'USER_ID'; // 用户ID

const CarSuccessFlag = 'setCarSuccessFlag'; //设置车辆的flag

const PlateNumber = 'plateNumber'; // 车牌号

const changeCarInfoResult = 'changeCarInfoResult'; // 司机增加车辆认证提交的信息

const carInfoResult = 'carInfoResult'; // 车辆的信息

const changePersonInfoResult = 'changePersonInfoResult'; // 司机认证提交的信息

const personInfoResult = 'personInfoResult'; // 个人信息

const enterpriseownerInfoResult = 'enterpriseownerInfoResult'; // 企业车主认证信息

const personownerInfoResult = 'personownerInfoResult'; // 个人车主认证信息

const PlateNumberObj = 'PlateNumberObj'; // 绑定车辆的具体信息

const userCarList = 'userCarList'; // 车辆列表

const acceptMessage = 'acceptMessage'; //接收消息

const newMessageFlag = 'newMessageFlag'; //新消息标记

const payPassword = 'payPassword'; //支付密码

const carOwnerAddDriverInfo = 'carOwnerAddDriverInfo'; // 车主增加司机

const carOwnerAddCarInfo = 'carOwnerAddCarInfo'; // 车主增加车辆

const USER_DRIVER_STATE = 'USER_ID'; // 司机身份

const USER_CAROWN_STATE = 'USER_CAROWN_STATE'; // 车主身份

const USER_CURRENT_STATE = 'USER_CURRENT_STATE'; // 当前身份

export default {
    IS_FIRST_START_FLAG,
    USER_INFO,
    TOKEN,
    PHOTO_REF_NO,
    UDID,
    USER_ID,
    CarSuccessFlag,
    PlateNumber,
    changeCarInfoResult,
    carInfoResult,
    changePersonInfoResult,
    personInfoResult,
    PlateNumberObj,
    userCarList,
    acceptMessage,
    newMessageFlag,
    payPassword,
    carOwnerAddDriverInfo,
    carOwnerAddCarInfo,
    enterpriseownerInfoResult,
    personownerInfoResult,
    USER_DRIVER_STATE,
    USER_CAROWN_STATE,
    USER_CURRENT_STATE
}

