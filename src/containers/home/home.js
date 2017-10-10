/**
 * Created by xizhixin on 2017/9/20.
 * 首页界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    Platform,
    NativeAppEventEmitter,
    Alert,
    DeviceEventEmitter,
    TouchableOpacity,
} from 'react-native';
import {Geolocation} from 'react-native-baidu-map-xzx';
import DeviceInfo from 'react-native-device-info';
import JPushModule from 'jpush-react-native';
import Swiper from 'react-native-swiper';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation';

import HomeCell from './components/homeCell';
import WeatherCell from './components/weatherCell';

import {
    WHITE_COLOR,
    BLUE_TEXT_COLOR,
    DEVIDE_LINE_COLOR,
    COLOR_SEPARATE_LINE,
    LIGHT_GRAY_TEXT_COLOR,
    LIGHT_BLACK_TEXT_COLOR,
} from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';
import * as API from '../../constants/api';

import {
    locationAction,
    getHomePageCountAction,
    mainPressAction,
    updateVersionAction,
} from '../../action/app';

import {
    setUserCarAction,
    queryEnterpriseNatureSuccessAction,
    saveUserCarList,
} from '../../action/user';

import {setMessageListIconAction} from '../../action/jpush';

import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import NUmberLength from '../../utils/validator';
import HTTPRequest from '../../utils/httpRequest'


const {width, height} = Dimensions.get('window');
const JpushAliasNumber = global.userId;

import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

import TimeToDoSomething from '../../utils/uploadLoggerRequest';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

let imageHeight = 189 * width / 375;

const images = [
    StaticImage.bannerImage1,
    StaticImage.bannerImage2
];

const styles = StyleSheet.create({
    line: {
        backgroundColor: DEVIDE_LINE_COLOR,
        height: 0.5,
        marginLeft: 50,
    },
    imageView:{
        paddingRight: 15,
        paddingLeft: 5,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subView: {
        marginLeft: 45,
        marginRight: 45,
        backgroundColor: WHITE_COLOR,
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: LIGHT_GRAY_TEXT_COLOR,
    },
    modalTitle: {
        fontSize: 17,
        color: LIGHT_BLACK_TEXT_COLOR,
        marginTop: 25,
        marginBottom: 20,
        alignSelf: 'center',
    },
    // 水平的分割线
    horizontalLine: {
        height: 1,
        backgroundColor: COLOR_SEPARATE_LINE,
    },
    // 按钮
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 17,
        color: BLUE_TEXT_COLOR,
        textAlign: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        backgroundColor: WHITE_COLOR,
        borderRadius: 3,
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 10,
    },
    activeDot: {
        width: 6,
        height: 6,
        backgroundColor: BLUE_TEXT_COLOR,
        borderRadius: 3,
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 10,
    },
    container: {
        ...Platform.select({
            ios: {
                height: 64,
            },
            android: {
                height: 50,
            },
        }),
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        width: width,
        top: 0,
    },
    titleContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: 15,
            },
            android: {
                paddingTop: 0,
            },
        }),
        flexDirection: 'row',
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 5,
    },
    centerContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 3
    },
    title: {
        fontSize: 18,
        color: WHITE_COLOR,
    },
    icon: {
        fontFamily: 'iconfont',
        fontSize: 16,
        color: WHITE_COLOR,
        alignSelf: 'center',
    },
    iconTitle: {
        fontSize: 10,
        color: WHITE_COLOR,
        paddingTop: 3,
        width: 45,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    weather:{
        height: 50,
        width: width - 20,
        borderRadius: 5,
        marginLeft: 10,
        backgroundColor: WHITE_COLOR,
        alignItems: 'center',
        justifyContent:'space-between',
        flexDirection: 'row',
    },
    date:{
        fontSize: 13,
        marginLeft: 10,
        color: LIGHT_BLACK_TEXT_COLOR,
    },
    layout: {
        position:'absolute',
        top: imageHeight - 9,
    },
    containerView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
});

class Home extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') JPushModule.initPush();

        this.state = {
            acceptMessge: '',
            plateNumber: '',
            setUserCar: false,
            weather: '天气',
            temperatureLow: '--',
            temperatureHigh: '--',
            weatherNum: '',
            limitNumber: '',
            plateNumberObj: {},
        };

        this.getHomePageCount = this.getHomePageCount.bind(this);
        this.setData = this.setData.bind(this);
        this.setUserCar = this.setUserCar.bind(this);
        this.setUserCarSuccessCallBack = this.setUserCarSuccessCallBack.bind(this);
        this.getUserCar = this.getUserCar.bind(this);
        this.getUserCarSuccessCallBack = this.getUserCarSuccessCallBack.bind(this);
        this.saveUserCarInfo = this.saveUserCarInfo.bind(this);
        this.saveUserCarList = this.saveUserCarList.bind(this);

        this.saveMessage = this.saveMessage.bind(this);
        this.locate = this.locate.bind(this);
        this.pushToMsgList = this.pushToMsgList.bind(this);
        this.getCurrentPosition = this.getCurrentPosition.bind(this);
        this.getWeather = this.getWeather.bind(this);
        this.compareVersion = this.compareVersion.bind(this);

        this.getQualificationsStatus = this.getQualificationsStatus.bind(this);
        this.getQualificationsStatusSuccessCallBack = this.getQualificationsStatusSuccessCallBack.bind(this);
        this.vehicleLimit = this.vehicleLimit.bind(this);
        this.queryEnterpriseNature = this.queryEnterpriseNature.bind(this);
        this.resetTo = this.resetTo.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.location !== nextProps.location){
            this.getWeather(nextProps.location);
            this.vehicleLimit(nextProps.location);
        }

    }
    componentDidMount() {

        this.compareVersion();
        this.getCurrentPosition(0);
        this.queryEnterpriseNature();


        if (Platform.OS === 'android') {
            JPushModule.notifyJSDidLoad((resultCode) => {
                if (resultCode === 0) {
                }
            });
            // 收到自定义消息后触发
            JPushModule.addReceiveCustomMsgListener((message) => {
                console.log(message);
            });
            // 收到推送时将会触发此事件
            JPushModule.addReceiveNotificationListener((message) => {
                console.log('home,ANreceive notification: ', message);

                this.props.setMessageListIcon(true);
                this.saveMessage(message.alertContent);

                if (message.alertContent.indexOf('新货源') > -1) {
                    Alert.alert('提示', '您有新的订单，是否进入货源界面', [
                        {
                            text: '确定',
                            onPress: () => {
                                // this.props.navigator.popToTop();
                                DeviceEventEmitter.emit('resetGood');
                                this.props.navigation.navigate('GoodsSource');
                            },
                        },
                        {text: '取消'},
                    ], {cancelable: false});
                }

                if (message.alertContent.indexOf('快来竞拍吧') > -1) {
                    Alert.alert('提示', '您有新的货源可以竞拍', [
                        {
                            text: '确定',
                            onPress: () => {
                                // this.props.navigator.popToTop();
                                this.props.navigation.navigate('Order');
                                this.changeOrderTab(1);
                                DeviceEventEmitter.emit('changeOrderTabPage', 1);
                            },
                        },
                        {text: '取消'},
                    ], {cancelable: false});
                }

                if (message.alertContent.indexOf('竞价成功') > -1) {
                    Alert.alert('提示', '恭喜您，竞价成功, 是否进入订单页面', [
                        {
                            text: '确定',
                            onPress: () => {
                                // this.props.navigator.popToTop();
                                this.props.navigation.navigate('Order');
                                this.changeOrderTab(1);
                                DeviceEventEmitter.emit('changeOrderTabPage', 1);
                            },
                        },
                        {text: '取消'},
                    ], {cancelable: false});
                }

                if (message.alertContent.indexOf('竞拍失败') > -1) {

                }

                if (message.alertContent.indexOf('实名认证>已认证通过') > -1) {

                }

                if (message.alertContent.indexOf('实名认证>已认证驳回') > -1) {

                }

                if (message.alertContent.indexOf('资质认证>已认证通过') > -1) {

                }

                if (message.alertContent.indexOf('资质认证>已认证驳回') > -1) {

                }


            });
            // 点击通知后，将会触发此事件
            JPushModule.addReceiveOpenNotificationListener((map) => {
                console.log('home,ANOpening notification!', map);

                this.props.setMessageListIcon(true);
                this.saveMessage(map.alertContent);
                if (map.alertContent.indexOf('竞价成功') > -1) {
                    this.props.navigation.navigate('Order');
                    this.changeOrderTab(1);
                    DeviceEventEmitter.emit('changeOrderTabPage', 1);
                }
                if (map.alertContent.indexOf('新货源') > -1) {
                    DeviceEventEmitter.emit('resetGood');
                    this.props.navigation.navigate('GoodsSource');
                }
            });
        }
        // -----------jpush  ios start
        if (Platform.OS === 'ios') {
            NativeAppEventEmitter.addListener(
                'OpenNotification',
                (notification) => {
                    console.log('打开推送', notification);

                    this.props.setMessageListIcon(true);
                    this.saveMessage(notification.aps.alert);
                    if (notification.aps.alert.indexOf('竞价成功') > -1) {
                        this.props.navigation.navigate('Order');
                        this.changeOrderTab(1);
                        DeviceEventEmitter.emit('changeOrderTabPage', 1);
                    }
                    if (notification.aps.alert.indexOf('新货源') > -1) {
                        DeviceEventEmitter.emit('resetGood');
                        this.props.navigation.navigate('GoodsSource');
                    }
                },
            );
            NativeAppEventEmitter.addListener(
                'ReceiveNotification',
                (notification) => {
                    console.log('-------------------收到推送----------------', notification);

                    this.props.setMessageListIcon(true);
                    this.saveMessage(notification.aps.alert);

                    if (notification.aps.alert.indexOf('新货源') > -1) {
                        Alert.alert('提示', '您有新的订单，是否进入货源界面', [
                            {
                                text: '确定',
                                onPress: () => {
                                    // this.props.navigator.popToTop();
                                    DeviceEventEmitter.emit('resetGood');
                                    this.props.navigation.navigate('GoodsSource');
                                },
                            },
                            {text: '取消'},
                        ], {cancelable: false});
                    }

                    if (notification.aps.alert.indexOf('快来竞拍吧') > -1) {
                        Alert.alert('提示', '您有新的货源可以竞拍', [
                            {
                                text: '确定',
                                onPress: () => {
                                    // this.props.navigator.popToTop();
                                    this.props.navigation.navigate('Order');
                                    this.changeOrderTab(1);
                                    DeviceEventEmitter.emit('changeOrderTabPage', 1);
                                },
                            },
                            {text: '取消'},
                        ], {cancelable: false});
                    }

                    if (notification.aps.alert.indexOf('竞价成功') > -1) {
                        Alert.alert('提示', '恭喜您，竞价成功, 是否进入订单页面', [
                            {
                                text: '确定',
                                onPress: () => {
                                    // this.props.navigator.popToTop();
                                    this.props.navigation.navigate('Order');
                                    this.changeOrderTab(1);
                                    DeviceEventEmitter.emit('changeOrderTabPage', 1);
                                },
                            },
                            {text: '取消'},
                        ], {cancelable: false});
                    }

                    if (notification.aps.alert.indexOf('竞拍失败') > -1) {

                    }

                    if (notification.aps.alert.indexOf('实名认证>已认证通过') > -1) {

                    }

                    if (notification.aps.alert.indexOf('实名认证>已认证驳回') > -1) {

                    }

                    if (notification.aps.alert.indexOf('资质认证>已认证通过') > -1) {

                    }

                    if (notification.aps.alert.indexOf('资质认证>已认证驳回') > -1) {

                    }


                },
            );


        }
        // -----------jpush  ios end

        this.listener = DeviceEventEmitter.addListener('refreshHome', () => {
            if (this.props.plateNumber) {
                const {userInfo} = this.props;
                this.getHomePageCount(this.props.plateNumber, userInfo.phone);
            }
        });
        this.getUserCarListener = DeviceEventEmitter.addListener('getUserCar', () => {
            this.getUserCar();
        });

        this.notifyCarStatusListener = DeviceEventEmitter.addListener('notifyCarStatus', () => {
            this.notifyCarStatus();
        });

        this.Listener = DeviceEventEmitter.addListener('restToLoginPage', (message) => {
            Toast.showShortCenter(message);
            this.resetTo(0, 'Login');
        });

        this.bindCarListener = DeviceEventEmitter.addListener('bindUserCar', (value) => {
            if (value) {
                this.setUserCar(value);
            }
        });
        // 上传日志功能
        TimeToDoSomething.sendMsgToNative();
        this.logListener = NativeAppEventEmitter.addListener('nativeSendMsgToRN', (data) => {
            this.getCurrentPosition(1);
        });
    }

    //
    notifyCarStatus() {
        Alert.alert('提示', '关联车辆已被禁用，请联系运营人员');
    }

    componentWillUnmount() {
        this.listener.remove();
        this.getUserCarListener.remove();
        this.Listener.remove();
        this.bindCarListener.remove();
        this.notifyCarStatusListener.remove();
        this.logListener.remove();
    }

    // 版本对比
    compareVersion() {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_COMPARE_VERSION,
            params: {
                version: DeviceInfo.getVersion(),
                platform: Platform.OS === 'ios' ? '1': '2',
            },
            loading: ()=>{},
            success: (responseData)=>{
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('版本对比', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '首页');
                if (responseData.result) {
                    this.props.updateVersion(responseData.result);
                }else {
                    this.setData();
                }
            },
            error: (errorInfo)=>{
                this.setData();
            },
            finish:()=>{}
        });
    }

    // 跳转界面并重置路由栈
    resetTo(index = 0, routeName) {
        const resetAction = NavigationActions.reset({
            index: index,
            actions: [
                NavigationActions.navigate({ routeName: routeName}),
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    // 获取车辆列表
    getUserCar() {
        Storage.get(StorageKey.USER_INFO).then((value) => {
            currentTime = new Date().getTime();
            if(value) {
                console.log('value',value);
                HTTPRequest({
                    url: API.API_QUERY_ALL_BIND_CAR_BY_PHONE,
                    params: {
                        phoneNum: value.phone,
                    },
                    loading: ()=>{},
                    success: (responseData)=>{
                        this.getUserCarSuccessCallBack(responseData.result);
                    },
                    error: (errorInfo)=>{},
                    finish:()=>{}
                });
            }
        });
    }

    // 获取车辆列表成功
    getUserCarSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取绑定车辆', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '首页');
        console.log('carList=',result);

        if (result) {
            if(result.length > 1) {
                this.saveUserCarList(result);
                this.props.navigation.navigate('ChooseCar',{
                    carList: result,
                    currentCar: '',
                    flag: true,
                });
            } else if (result.length === 1) {
                this.setState({
                    plateNumber: result[0].carNum,
                    plateNumberObj: result[0],
                });
                this.certificationState();
            } else {
                this.certificationState();
            }
        } else {
            Alert.alert('提示','您的账号未绑定车辆，请进行资质认证',
                [
                    {
                        text: '好的',
                        onPress: () => {
                            // this.changeTab('mine');
                        },
                    },
                ], {cancelable: false});
        }
    }
    saveUserCarList(carList) {
        this.props.saveUserCarListAction(carList);
    }
    // 设置车辆
    setUserCar(plateNumber) {
        currentTime = new Date().getTime();
        Storage.get(StorageKey.USER_INFO).then((value) => {
            if(value) {
                HTTPRequest({
                    url: API.API_SET_USER_CAR,
                    params: {
                        plateNumber: plateNumber,
                        phoneNum: value.phone,
                    },
                    loading: ()=>{},
                    success: (responseData)=>{
                        this.setUserCarSuccessCallBack(responseData.result);
                    },
                    error: (errorInfo)=>{},
                    finish:()=>{}
                });
            }
        });
    }

    // 设置车辆成功
    setUserCarSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('设置车辆', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '首页');
        const userInfo = this.props.userInfo;

        console.log('设置车辆成功了', this.state.plateNumber, userInfo.phone);
        this.getHomePageCount(this.state.plateNumber, userInfo.phone);
        this.saveUserCarInfo(this.state.plateNumberObj);
        Storage.save('setCarSuccessFlag', '2');

        // Storage.get(StorageKey.PlateNumber).then((plate) => {
        //     if (plate){
        //         console.log('设置车辆成功了', plate, userInfo.result.phone);
        //         this.getHomePageCount(plate, userInfo.result.phone);
        //         this.saveUserCarInfo(plate);
        //         Storage.save('setCarSuccessFlag', '2');
        //     }
        // });
        // Storage.get(StorageKey.PlateNumberObj).then((platformObj) => {
        //     if (platformObj) {
        //         this.saveUserCarObj(platformObj);
        //     }
        // });
    }

    // 保存车辆列表
    saveUserCarList(carList) {
        this.props.saveUserCarListAction(carList);
    }


    // 获取首页状态数量
    getHomePageCount(plateNumber, phone) {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_INDEX_STATUS_NUM,
            params: {
                plateNumber,
                driverPhone: phone,
            },
            loading: ()=>{},
            success: (responseData)=>{
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取首页状态数量', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '首页');
                if (responseData.result) {
                    this.props.getHomoPageCountAction(responseData.result);
                }
            },
            error: ()=>{},
            finish: ()=>{},
        });
    }


    /*资质认证*/
    certificationState() {
        setTimeout(() => {
            Storage.get(StorageKey.PlateNumber).then((plate) => {
                if(plate){
                    this.getQualificationsStatus(plate);
                } else {
                    this.getQualificationsStatus(this.state.plateNumber);
                }
            });
        }, 500);
    }

    // 查询资质认证状态
    getQualificationsStatus(plate) {
        if (this.props.userInfo.phone) {
            let obj = {};
            if (plate) {
                obj = {
                    phoneNum: this.props.userInfo.phone,
                    plateNumber: plate,
                }
            } else {
                obj = {phoneNum: this.props.userInfo.phone};
            }
            HTTPRequest({
                url: API.API_AUTH_QUALIFICATIONS_STATUS,
                params: obj,
                loading: () => {},
                success: (responseData) => {
                    this.getQualificationsStatusSuccessCallBack(responseData.result);
                },
                error: (errorInfo) => {},
                finish: () => {}
            });
        }
    }

    // 查询资质认证状态成功
    getQualificationsStatusSuccessCallBack(result) {
        console.log('getQualificationsStatusSuccessCallBack', result);
        if (result === '1201') {
            Alert.alert('提示', '认证资料正在审核中');
        } else if (result === '1203') {
            Alert.alert('提示', '认证资料已驳回，请重新上传资料',[
                {
                    text: '好的',
                    onPress: () => {
                        this.props.navigation.navigate('CertificationPage', {
                            qualifications: result,
                        })
                    },
                },
            ],{cancelable: true});
        } else if (result === '1202') {
            this.saveUserCarInfo(this.state.plateNumberObj);
            this.setUserCar(this.state.plateNumber, this.setUserCarSuccessCallBack);
        } else{
            Alert.alert('提示','您的账号未绑定车辆，请进行资质认证',[
                {
                    text: '好的',
                    onPress: () => {
                        this.props.navigation.navigate('Mine');
                    },
                },
            ], {cancelable: false});
        }
    };

    setData(){
        Storage.get(StorageKey.CarSuccessFlag).then((value) => {
            console.log('---value', value);
            if (value && value * 1 === 1) {
                this.getUserCar();
            } else {
                setTimeout(() => {
                    // 开发中reload后，保存车辆列表信息，后面切换车辆会用到
                    Storage.get(StorageKey.userCarList).then((value) => {
                        this.saveUserCarList(value);
                    });
                    Storage.get(StorageKey.PlateNumberObj).then((plateNumObj) => {
                        if(plateNumObj) {
                            const plateNumber = plateNumObj.carNum;
                            console.log('home_plateNumber=', plateNumber);
                            if (plateNumber !== null) {
                                this.setState({
                                    plateNumber: plateNumber,
                                    plateNumberObj: plateNumObj,
                                });
                                if (value === 3) {
                                    const {userInfo} = this.props;
                                    this.saveUserCarInfo(plateNumObj);
                                    // this.prop.plateNumber
                                    this.getHomePageCount(plateNumber, userInfo.phone);
                                } else {
                                    if (plateNumber) {
                                        this.setUserCar(plateNumber, this.setUserCarSuccessCallBack);
                                    }
                                }
                            }
                        }
                    });
                }, 200);
            }
        });
    }

    // 切换订单tab
    changeOrderTab(orderTab) {
        this.props.changeOrderTab(orderTab);
    }

    // 保存车牌号对象
    saveUserCarInfo(plateNumberObj) {
        this.props.saveUserSetCarSuccess(plateNumberObj);
    }

    // 保存消息列表
    saveMessage(Message) {
        // Toast.showShortCenter(Message);
        console.log('-- save SearchList From Storage --', Message);
        Storage.get(StorageKey.acceptMessage).then((value) => {
            const date = new Date();
            let mouth = parseInt(date.getMonth())+1;

            const timer = date.getFullYear()+'/'+NUmberLength.leadingZeros(mouth, 2)+'/'+
                NUmberLength.leadingZeros(date.getDate(), 2)+ ' '+
                NUmberLength.leadingZeros(date.getHours(), 2)+':'+
                NUmberLength.leadingZeros(date.getMinutes(), 2)+':'+
                NUmberLength.leadingZeros(date.getSeconds(), 2);

            if (value) {
                if (value.length >= 20) {
                    value.pop();
                }
                if (value.indexOf(Message) < 0) {
                    let msgObj = {message: Message, isRead: false, time: timer};
                    value.unshift(msgObj);
                }
                Storage.save(StorageKey.acceptMessage, value);
                Storage.save(StorageKey.newMessageFlag, '1');
            } else {

                let msgObj = {message: Message, isRead: false, time: timer};

                const searchList = [];
                searchList.unshift(msgObj);
                Storage.save(StorageKey.acceptMessage, searchList);
                Storage.save(StorageKey.newMessageFlag, '1');
            }
        });
    }

    // 获取当前位置
    getCurrentPosition(type){
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            this.props.getLocationAction(data.city);
            locationData = data;
            if (type === 1) {
                ReadAndWriteFileUtil.appendFile('定位', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, 0, '定位');
                TimeToDoSomething.uploadDataFromLocalMsg();
            } else {
                this.getWeather(data.city);
                this.vehicleLimit(data.city);
            }
        }).catch(e =>{
            console.log(e, 'error');
        });
    }

    // 定位城市选择
    locate(){
        this.props.navigation.navigate('Location', {
            changeCity: (cityName) => {
                console.log('city =',cityName);
                this.props.getLocationAction(cityName);
                this.getWeather(cityName);
                this.vehicleLimit(cityName);
            }
        });
    }

    pushToMsgList() {
        this.props.navigation.navigate('MsgList');
    }

    //获取天气方法
    getWeather(city) {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_GET_WEATHER + '?city=' + city,
            params: {},
            loading: ()=>{},
            success: (responseData)=>{
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取天气', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                        locationData.district, lastTime - currentTime, '首页');
                const result = responseData.result;
                if (result.weather){
                    this.setState({
                        weather: result.weather,
                        weatherNum: result.weather,
                        temperatureLow: result.temperatureLow,
                        temperatureHigh: result.temperatureHigh,
                    });
                }else {
                    this.setState({
                        weather: '天气',
                        temperatureLow: '--',
                        temperatureHigh: '--',
                        weatherNum:'',
                    });
                    setTimeout(() => {
                        this.getWeather(this.state.city);
                    }, 600000);
                }
            },
            error: (errorInfo)=>{
                this.setState({
                    weather: '天气',
                    temperatureLow: '--',
                    temperatureHigh: '--',
                    weatherNum:'',
                });
            },
            finish: ()=>{}
        });

    }

    //获取限行尾号方法
    vehicleLimit(cityName){
        HTTPRequest({
            url: API.API_VEHICLE_LIMIT,
            params: {
                cityName
            },
            loading: ()=>{},
            success: (responseData)=> {
                console.log('---------------',responseData.result);
                let result = responseData.result;
                if(result && result !== '') {
                    this.setState({
                        limitNumber: '限行 ' + responseData.result,
                    });
                } else {
                    this.setState({
                        limitNumber: '',
                    });
                }
            },
            error: (error)=>{
                console.log('获取限行尾号失败');
            },
            finish: ()=>{}
        });
    }

    // 查询司机对应企业性质
    queryEnterpriseNature(){
        HTTPRequest({
            url: API.API_QUERY_ENTERPRISE_NATURE + global.phone,
            params: {},
            loading: ()=>{},
            success: (responseData)=>{
                global.enterpriseNature = responseData.result;
                if (responseData.result) {
                    this.props.queryEnterpriseNatureAction(responseData.result);
                }
            },
            error: (errorInfo)=>{},
            finish:()=>{}
        });
    }

    renderImg() {
        const imageViews = [];
        for (let i = 0; i < images.length; i++) {
            imageViews.push(
                <Image
                    key={i}
                    resizeMode="cover"
                    style={{
                        height: imageHeight,
                        width: width
                    }}
                    source={images[i]}
                />,
            );
        }
        return imageViews;
    }

    render() {
        const {homePageState,routes} = this.props;
        console.log('routes=',routes);
        const {weather, temperatureLow, temperatureHigh} = this.state;
        const TitleView =
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <View style={styles.leftContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() =>  {
                                this.locate();
                            }}
                        >
                            <Text style={styles.icon}>&#xe614;</Text>
                            <Text
                                style={styles.iconTitle}
                                numberOfLines={1}
                            >{this.props.location ? this.props.location : '定位中'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.centerContainer}>
                        <Text style={styles.title}>首页</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                this.props.setMessageListIcon(false);
                                Storage.save(StorageKey.newMessageFlag, '0');
                                this.pushToMsgList();
                            }}
                        >
                            <Image
                                source={this.props.jpushIcon === true ? StaticImage.MessageNew : StaticImage.Message}
                                style={{alignSelf:'center'}}
                            />
                            <Text style={styles.iconTitle}>消息</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>;
        let date = new Date();
        let limitView = this.state.limitNumber || this.state.limitNumber !== '' ?
            <Text style={{marginRight: 10, fontSize: 13, color: LIGHT_BLACK_TEXT_COLOR, alignSelf:'center'}}>{this.state.limitNumber}</Text>
            : null;
        return (
            <View style={styles.containerView}>
                <View style={{height: imageHeight}}>
                    <Swiper
                        // height={imageHeight}
                        width={width}
                        paginationStyle={{bottom: 5}}
                        autoplay={true}
                        dot={
                            <View style={styles.dot}/>
                        }
                        activeDot={
                            <View style={styles.activeDot}/>
                        }
                    >
                        {this.renderImg()}
                    </Swiper>
                </View>


                {TitleView}

                <View style={styles.layout}>
                    <View style={styles.weather}>
                        <Text style={styles.date}>
                            {date.getUTCFullYear() + '/' + (date.getUTCMonth()+1) + '/' + date.getUTCDate() + ''}
                        </Text>
                        <View style={{flexDirection:'row'}}>
                            <View style={{
                                marginLeft: 5,
                                marginRight: 5,
                                justifyContent: 'center',
                            }}>
                                <WeatherCell weatherIcon={this.state.weatherNum}/>
                            </View>
                            <Text style={{marginRight: 5, fontSize: 13, color: LIGHT_BLACK_TEXT_COLOR, alignSelf:'center'}}> {weather}</Text>
                            <Text style={{marginRight: 10, fontSize: 13, color: LIGHT_BLACK_TEXT_COLOR, alignSelf:'center'}}>{temperatureHigh}℃/{temperatureLow}℃</Text>
                            {limitView}
                        </View>
                    </View>
                    <View style={{margin: 10, backgroundColor: WHITE_COLOR, borderRadius: 5, width: width - 20,}}>
                        <HomeCell
                            title="接单"// 文字
                            describe="方便接单，快速查看"
                            padding={10}// 文字与文字间距
                            imageStyle={styles.imageView}
                            backgroundColor={{backgroundColor: WHITE_COLOR}}// 背景色
                            badgeText={homePageState === null ? 0 : homePageState.pendingCount}// 消息提示
                            renderImage={() => <Image source={StaticImage.receiptIcon}/>}// 图标
                            clickAction={() => { // 点击事件
                                if (this.props.plateNumber && this.props.plateNumber !== '') {
                                    if (this.props.plateNumberObj.carStatus && this.props.plateNumberObj.carStatus === 20) {
                                        DeviceEventEmitter.emit('resetGood');
                                        this.props.navigation.navigate('GoodsSource');
                                        // DeviceEventEmitter.emit('resetGood');
                                    } else {
                                        this.notifyCarStatus();
                                    }
                                } else {
                                    this.getUserCar();
                                }
                            }}
                        />
                        <View style={styles.line}/>
                        <HomeCell
                            title="发运"
                            describe="一键发运，安全无忧"
                            padding={10}
                            imageStyle={styles.imageView}
                            backgroundColor={{backgroundColor: WHITE_COLOR}}
                            badgeText={homePageState === null ? 0 : homePageState.notYetShipmentCount}
                            renderImage={() => <Image source={StaticImage.dispatchIcon}/>}
                            clickAction={() => {
                                if (this.props.plateNumber && this.props.plateNumber !== '') {
                                    if (this.props.plateNumberObj.carStatus && this.props.plateNumberObj.carStatus === 20) {
                                        this.props.navigation.navigate('Order');
                                        this.changeOrderTab(1);
                                        DeviceEventEmitter.emit('changeOrderTabPage', 1);
                                    } else {
                                        this.notifyCarStatus();
                                    }
                                } else {
                                    this.getUserCar();
                                }
                            }}
                        />
                        <View style={styles.line}/>
                        <HomeCell
                            title="签收回单"
                            describe="签收快捷，回单无忧"
                            padding={10}
                            imageStyle={styles.imageView}
                            backgroundColor={{backgroundColor: WHITE_COLOR}}
                            badgeText={0}
                            renderImage={() => <Image source={StaticImage.signIcon}/>}
                            clickAction={() => {
                                if (this.props.plateNumber && this.props.plateNumber !== '') {
                                    if (this.props.plateNumberObj.carStatus && this.props.plateNumberObj.carStatus === 20) {
                                        this.props.navigation.navigate('Order');
                                        this.changeOrderTab(2);
                                        DeviceEventEmitter.emit('changeOrderTabPage', 2);
                                    } else {
                                        this.notifyCarStatus();
                                    }
                                } else {
                                    this.getUserCar();
                                }
                            }}
                        />
                        {/*<View style={styles.line}/>*/}
                        {/*<HomeCell*/}
                        {/*title="回单"*/}
                        {/*describe="接收回单，方便快捷"*/}
                        {/*padding={8}*/}
                        {/*imageStyle={styles.imageView}*/}
                        {/*backgroundColor={{backgroundColor: WHITE_COLOR}}*/}
                        {/*badgeText={0}*/}
                        {/*renderImage={() => <Image source={receiveIcon}/>}*/}
                        {/*clickAction={() => {*/}
                        {/*Storage.get('plateNumber').then((value) =>{*/}
                        {/*if(value){*/}
                        {/*this.changeTab('order');*/}
                        {/*this.changeOrderTab(3);*/}
                        {/*DeviceEventEmitter.emit('changeOrderTabPage', 3);*/}
                        {/*}else {*/}
                        {/*Toast.showShortCenter('正在获取相关信息...');*/}
                        {/*this.getUserCar(this.getUserCarSuccessCallBack);*/}
                        {/*}*/}
                        {/*});*/}
                        {/*}}*/}
                        {/*/>*/}
                    </View>
                </View>
            </View>
        );
    }
}


function mapStateToProps(state) {
    return {
        userInfo: state.user.get('userInfo'),
        homePageState: state.app.get('getHomePageCount'),
        jpushIcon: state.jpush.get('jpushIcon'),
        location: state.app.get('locationData'),
        plateNumber: state.user.get('plateNumber'),
        plateNumberObj: state.user.get('plateNumberObj'),
        routes: state.nav.routes,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getHomoPageCountAction: (response) => {
            dispatch(getHomePageCountAction(response));
        },
        saveUserSetCarSuccess: (plateNumberObj) => {
            dispatch(setUserCarAction(plateNumberObj));
        },

        changeOrderTab: (orderTab) => {
            dispatch(mainPressAction(orderTab));
        },

        setMessageListIcon: (data) => {
            dispatch(setMessageListIconAction(data));
        },

        updateVersion: (data) => {
            dispatch(updateVersionAction(data));
        },

        getLocationAction: (data) => {
            dispatch(locationAction(data));
        },
        queryEnterpriseNatureAction: (data) => {
            dispatch(queryEnterpriseNatureSuccessAction(data));
        },
        saveUserCarListAction: (data) => {
            dispatch(saveUserCarList(data));
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
