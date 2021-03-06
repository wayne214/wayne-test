import { HOST } from './setting';

/** *****************************************************伙伴资源中心接口***************************************************/
// 查询伙伴角色信息
export const API_INQUIRE_ACCOUNT_ROLE = `${HOST}app/rmc/company/queryAppRoleInfoByBusTel/`;
// export const API_INQUIRE_ACCOUNT_ROLE = `http://192.168.32.83:8899/app/rmc/company/queryAppRoleInfoByBusTel/`;
// 根据手机号查询伙伴信息
export const API_QUERY_COMPANY_INFO = `${HOST}app/rmc/company/queryCompanyInfoByBusTel`;
// export const API_QUERY_COMPANY_INFO = `http://192.168.32.83:8899/app/rmc/company/queryCompanyInfoByBusTel`;
/** *****************************************************在线用户接口******************************************************/
// APP退出登录
// export const API_USER_LOGOUT = `${HOST}app/user/logout/`;
export const API_USER_LOGOUT = `${HOST}app/user/logout/v3.0/`;

/** *****************************************************结算中心接口******************************************************/
export const API_AC_BALANCE = `${HOST}app/ac/balance`;

export const API_AC_ACCOUNT_FLOW = `${HOST}app/ac/accountFlow`;
// 根据单号获取结算金额
export const API_AC_GET_SETTLE_AMOUNT = `${HOST}app/ac/getSettleAmount/`;
// 获取支付状态
export const API_AC_GET_SETTLE_STATE= `${HOST}app/ac/queryStatusByOrderCode/`;
// 确认支付--现金
export const API_AC_COMFIRM_PAYMENT = `${HOST}app/ac/confirmPayment`;
// 获取微信二维码
export const API_AC_GET_WECHAT_QRCODE = `${HOST}app/ac/getWeChatQrCode`;
// 二维码支付
export const API_AC_QRCODE_PAYMENT = `${HOST}app/ac/qrCodePayment/`;

/** *****************************************************用户中心接口******************************************************/
// 用户绑定车辆
export const API_SET_USER_CAR = `${HOST}app/uam/addUserCar`;
// 根据司机id获取推送状态
export const API_NEW_GET_PUSHSTATUS_WITH_DRIVERID = `${HOST}app/uam/jpush/getPushStatusByUserId/`;
// 更改状态
export const API_CHANGE_ACCEPT_MESSAGE = `${HOST}app/uam/jpush/setPushStatus`;

// 根据验证码修改密码
export const API_NEW_CHANGE_PSD_WITH_CODE = `${HOST}app/uam/login/forgetPassword`;
// 获取登录密钥接口
export const API_GET_SEC_TOKEN = `${HOST}app/uam/login/getSecToken`;
// export const API_GET_SEC_TOKEN = `http://192.168.32.83:8899/app/uam/login/getSecToken`;
// 通过密码登录接口
export const API_LOGIN_WITH_PSD = `${HOST}app/uam/login/loginWithPassword/v3.0`;
// 通过验证码登录接口
export const API_LOGIN_WITH_CODE = `${HOST}app/uam/login/loginWithVerificationCode/v3.0`;
// 根据旧密码修改密码
export const API_CHANGE_PSD_WITH_OLD_PSD = `${HOST}app/uam/login/modifyPassword`;
//登陆后绑定设备信息接口
export const API_BIND_DEVICE = `${HOST}app/uam/login/bindDevice`;

// 校验忘记密码的验证码是否正确
export const API_CHECK_IDENTIFY_CODE = `${HOST}app/uam/message/checkForgetIdentifyCode`;
// 获取忘记密码验证码接口
export const API_GET_FORGET_PSD_CODE = `${HOST}app/uam/message/getForgetIdentifyCode`;
// 获取登录验证码接口
export const API_GET_LOGIN_WITH_CODE = `${HOST}app/uam/message/getLoginIdentifyCode`;

// 注册用户接口
export const API_REGISTER = `${HOST}app/uam/register`;
// 注册用户获取短信验证码
export const API_REGISTER_IDENTIFY_CODE = `${HOST}app/uam/register/identifyCode`;
// 查询头像接口
export const API_QUERY_USER_AVATAR = `${HOST}app/uam/queryUserAvatar`;
// 更换头像接口
// export const API_CHANGE_USER_AVATAR = `${HOST}app/uam/changeUserAvatar`;
export const API_CHANGE_USER_AVATAR = `${HOST}app/uam/changeUserAvatarNew`;

// 道路异常-上传图片附件
export const API_UPLOAD_FILE = `${HOST}app/uam/uploadFile`;
// 道路异常-上传视频附件
export const API_UPLOAD_VIDEO_FILE = `${HOST}app/uam/uploadVideoFile`;

/** *****************************************************调度中心接口******************************************************/
// 取消接单
export const API_NEW_DRIVER_CANCEL_ORDER = `${HOST}app/dpc/driverAppCancelOrder`;

// 接单--司机
export const API_NEW_DRIVER_RECEIVE_ORDER = `${HOST}app/dpc/driverAppReceiveOrder`;
// 接单--车主
export const API_NEW_CARRIER_RECEIVE_ORDER = `${HOST}app/dpc/acceptOrder`;

// 拒单--司机
export const API_NEW_DRIVER_REFUSE_ORDER = `${HOST}app/dpc/driverAppRefuseOrder`;
// 拒单--车主
export const API_NEW_CARRIER_REFUSE_ORDER = `${HOST}app/dpc/refuseOrder`;

// 搜索根据单号查询调度单信息
export const API_NEW_GET_SCHEDULE_INFO_BY_CODE = `${HOST}app/dpc/queryDispatchDocByCode`;
// 根据时间获取获取货源列表--司机
export const API_NEW_GET_SOURCE_BY_DATE = `${HOST}app/dpc/queryDispatchDocByDateV2`; // 4.0版本--司机

// 根据时间获取获取货源列表---车主
export const API_CARRIER_GET_SOURCE_BY_DATE = `${HOST}app/dpc/queryDispatchDocWithCarrier`; // 4.0版本--车主

// 接单拒单数量
// export const API_NEW_GET_STATUS_NUMBER = `${HOST}app/dpc/queryDispatchDocStatusNum`;
// // 调度单发车数量接口
// export const API_NEW_QUERY_BOL_COUNT = `${HOST}app/transport/queryBolCountByTelPhoneNo/`;

//车主获取待发运列表
export const API_NEW_APP_DISPATCH_DOC_CARRIER = `${HOST}app/dpc/queryDispatchDocByStatus`;
// 首页-状态数量统计
export const API_INDEX_STATUS_NUM = `${HOST}app/dpc/queryIndexStatusNum`;
// 车主首页-状态数量统计
export const API_CARRIER_INDEX_STATUS_NUM = `${HOST}app/dpc/queryCarrierDispatchCount`;
// 竞价排名查询接口
export const API_NEW_QUERY_RANK = `${HOST}app/dpc/queryRank`;
// 提交报价接口
export const API_NEW_SUBMIT_QUOTES = `${HOST}app/dpc/submitQuotes`;
// 安排车辆
export const API_NEW_ARRANGE_CARS = `${HOST}app/dpc/arrangeVehicles`;

/** *****************************************************资源中心接口******************************************************/
// 根据司机手机号查询车辆信息
export const API_NEW_GET_CARS_WITH_USER_PHONE = `${HOST}app/rmc/getCarInfoByDriverPhone`;
// 根据司机手机号查询司机信息
export const API_NEW_GET_DRIVER_INFO_WITH_DRIVER_PHONE = `${HOST}app/rmc/getDriverInfoByDriverPhone`;
// 查询绑定的车辆信息
export const API_QUERY_ALL_BIND_CAR_BY_PHONE = `${HOST}app/rmc/rmcCar/queryAllBindCarByPhone/v2.1.0`;
// 资质认证状态查询接口
export const API_AUTH_QUALIFICATIONS_STATUS = `${HOST}app/rmc/auth/qualifications/status`;
// 实名认证状态查询接口
export const API_AUTH_REALNAME_STATUS = `${HOST}app/rmc/auth/realName/status/`;
// 货源-设置货源偏好
export const API_SET_GOODSOURCE_PREFERENCE = `${HOST}app/rmc/preference/v2.0.1/set`;
// 货源-货源偏好查询
export const API_QUERY_GOODSOURCE_PREFERENCE = `${HOST}app/rmc/preference/v2.0.1/query`;

//银行卡-绑定接口
export const API_BANK_CARD_BUNDING = `${HOST}app/rmc/bankCard/bunding/`;
//银行卡-列表查询接口
export const API_BANK_CARD_LIST = `${HOST}app/rmc/bankCard/list`;
//银行卡-默认卡设置
export const API_BANK_CARD_SETDEFAULT = `${HOST}app/rmc/bankCard/setDefault/`;
//银行卡-解除绑定设置
export const API_BANK_CARD_UNBUNDING = `${HOST}app/rmc/bankCard/unbunding/`;
//司机对应企业性质
export const API_QUERY_ENTERPRISE_NATURE = `${HOST}app/rmc/queryEnterpriseNature/`;

export const API_QUERY_BANK_BRANCH = `${HOST}/app/rmc/bankCard/queryBankBranch`;
//根据伙伴手机号 查询伙伴下所有车辆列表
export const API_QUERY_CAR_LIST_BY_COMPANIONINFO = `${HOST}app/rmc/rmcCar/queryCarListByCompanionInfo`;
//根据司机手机号 查询伙伴下所有车辆列表
export const API_QUERY_CAR_LIST_BY_PHONE_NUM = `${HOST}/app/rmc/driver/queryDriversByPhoneNum/`;

//搜索全库车辆信息
export const API_QUERY_CAR_INFO_BY_PHONE_NUM_DRIVER = `${HOST}app/rmc/rmcCar/queryCarInfoByCarNum`;
//根据手机号查询
export const API_QUERY_CAR_INFO_BY_PHONE_NUM = `${HOST}app/rmc/rmcCar/queryCarInfoByCarNumForCompanion`;
//通过手机号或司机名称
export const API_QUERY_DRIVERS_ALL = `${HOST}/app/rmc/driver/queryDriversAll`;
//根据手机号查询司机
export const API_QUERY_DRIVERS_ALL_COMPANY = `${HOST}/app/rmc/driver/queryDriversByCompanyPhone`;

//搜索全库车辆信息
export const API_BIND_RELIEVE_CAR_COMPANION = `${HOST}app/rmc/rmcCar/bindRelieveCarCompanionRelation`;
//通过手机号或司机名称
export const API_COMPANION_RELATION = `${HOST}/app/rmc/driver/addDriverCompanionRelation`;
// 司机管理-绑定车辆
export const API_RMC_DRIVER_BINDING_CAR = `${HOST}/app/rmc/driver/bindingCar`;
// 车辆管理-绑定司机
export const API_BIND_CAR_DRIVER_RELATION = `${HOST}/app/rmc/rmcCar/bindCarDriverRelation`;
// 司机管理-解绑绑定司机
export const API_DEL_DRIVER_COMPANION_RELATION = `${HOST}/app/rmc/driver/delDriverCompanionRelation`;
// 车辆列表
export const API_QUERY_CAR_LIST = `${HOST}app/rmc/rmcCar/queryCarListByCompanionInfo`;
// 司机列表
export const API_QUERY_DRIVER_LIST = `${HOST}app/rmc/driver/queryDriversByCarNum/`;

// export const API_QUERY_DRIVER_LIST = `http://192.168.32.162:8899/app/rmc/driver/queryDriversByCarNum/`;
//司机绑定车辆
export const API_DRIVER_BIND_CAR = `${HOST}app/rmc/rmcCar/driverBindCarRelation`;
// 绑定GPS设备接口
export const API_BIND_OR_RELIEVE_GPS = `${HOST}app/rmc/rmcCar/bindOrRelieveCarBarCode`;
// 获取gps设备信息
export const API_GET_GPS_DETAILS = `${HOST}app/rmc/rmcCar/queryGpsInfoByCarNum`;

export const API_DRIVER_QUERY_DRIVER_INFO = `${HOST}/app/rmc/driver/queryDriverInfo/`;


/** *****************************************************运输中心接口******************************************************/
// 发运接口
export const API_NEW_DESPATCH = `${HOST}app/transport/despatch`;
// 获取货源详情  and  根据运输单号搜索
export const API_NEW_GET_GOODS_SOURCE = `${HOST}app/transport/goodsSource`; // 4.0版本
// 订单列表（待回单）
export const API_NEW_GET_RECEIVE_ORDER_LIST = `${HOST}app/transport/queryDelReceiptWithPageV4`;
// 运输中
export const API_NEW_GET_ORDER_LIST_TRANSPORT = `${HOST}app/transport/queryTransportList`;
// 运输中--车主
export const API_NEW_GET_CARRIER_ORDER_LIST_TRANSPORT = `${HOST}app/transport/queryCarrierTransportList`;
// 回单接口
export const API_NEW_RETURN_TRANSPORT_ORDER_V2 = `${HOST}app/transport/returnTransportOrder/v2.1`;
// 回单照片展示接口
export const API_ORDER_PICTURE_SHOW = `${HOST}app/transport/pictureList`;
// 签收接口
export const API_NEW_SIGN = `${HOST}app/transport/sign`;
// 批量签收接口
export const API_TRANSPORT_BATCH_SIGN = `${HOST}app/transport/batchSign/v3.0`; // 3.0版本
// 订单列表（全部，待发运）分页查询调度单
export const API_NEW_APP_DISPATCH_DOC_WITH_PAGE = `${HOST}app/transport/queryDeleveryWithPageV4`;
// 上传道路异常查询调度单
export const API_NEW_APP_UPLOAD_DISPATCH_ORDER = `${HOST}app/transport/finExceprionInfoByPlateNum`;
// 上传道路异常保存异常信息
export const API_NEW_APP_UPLOAD_SAVE_EXCEPTIONINFO= `${HOST}app/transport/saveExceptionInfo/`;

/** *****************************************************获取图片信息******************************************************/
// 身份证正面
export const API_GET_IDCARD_INFO = `${HOST}app/photo/idCard/faceSide`;

// 身份证反面
export const API_GET_IDCARD_TRUN_INFO = `${HOST}app/photo/idCard/backSide`;

// 驾驶证主页
export const API_GET_DRIVER_INFO = `${HOST}app/photo/drivingLicense/homepage`;

// 驾驶证副页
export const API_GET_DRIVER_TRUN_INFO = `${HOST}app/photo/drivingLicense/vicePage`;

// 手持身份证
export const API_GET_HAND_PIC_INFO = `${HOST}app/photo/idCard/handle`;

// 行驶证主页
export const API_GET_TRAVEL_INFO = `${HOST}app/photo/vehicleLicense/homepage`;

// 行驶证副页
export const API_GET_TRAVEL_TRUN_INFO = `${HOST}app/photo/vehicleLicense/vicePage`;

// 交强险
export const API_GET_SEND_QIANGXIAN_INFO = `${HOST}app/photo/insurance`;

// 车头照
export const API_GET_CAR_HEADER_INFO = `${HOST}app/photo/vehicle`;

// 上传营业执照
export const API_GET_BUSINESS_LICENSE = `${HOST}app/photo/businessLicense`;
// export const API_GET_BUSINESS_LICENSE = `http://192.168.32.83:8899/app/photo/businessLicense`;

// 企业车主认证
export const API_COMPANY_CERTIFICATION = `${HOST}app/rmc/company/appInsertCertificationInfo`;

// 实名认证确认提交接口
export const API_AUTH_REALNAME_COMMIT = `${HOST}app/rmc/driver/addDriver`;

// 实名认证详情接口
export const API_AUTH_REALNAME_DETAIL = `${HOST}app/rmc/driver/queryDriverInfo/`;

// 资质认证确认提交接口
export const API_AUTH_QUALIFICATIONS_COMMIT = `${HOST}app/rmc/rmcCar/createCertificationQualification`;

// 资质认证详情接口
export const API_AUTH_QUALIFICATIONS_DETAIL = `${HOST}app/rmc/auth/qualifications/info`;

// 车长载重接口
export const API_LENGTH_AND_WEIGHT_COMMIT = `${HOST}app/rmc/rmcCar/queryVehicleLengthAndWeight`;

// 天气接口
export const API_GET_WEATHER = `${HOST}app/weather/`;
// 版本比较接口
export const API_COMPARE_VERSION = `${HOST}app/version/`;

// 收集日志接口
export const API_COLLECT_LOG = `${HOST}app/log/log`;

/** *****************************************************限行接口******************************************************/
// 限号接口
export const API_VEHICLE_LIMIT = `${HOST}app/vehicleLimit/`;

// 业务明细
export const API_BUSSNESS_DETAIL = `${HOST}app/ac/businessDetail`;

/** *****************************************************银行卡信息接口******************************************************/
//查询银行卡信息接口
export const API_BANKCARD_INFO = `${HOST}app/bankcard/`;

//修改银行卡信息接口
export const API_CHANGE_BANKCARD_INFO = `${HOST}app/rmc/bankCard/updateCompanyAccountByBankAccount`;

//发送验证码接口
export const API_BANKCARD_SENDVERIFYCODE = `${HOST}app/bankcard/sendVerifyCode`;
//效验验证码接口
export const API_BANKCARD_CHECK_VERIFYCODE = `${HOST}app/bankcard/checkVerifyCode/`;

//WebSocket
export const API_WEBSOCKET = `ws://mproxy-test.xianyiscm.com/webSocket/`;
