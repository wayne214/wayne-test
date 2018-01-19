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
    ScrollView,
    Modal
} from 'react-native';
import {Geolocation} from 'react-native-baidu-map-xzx';
import DeviceInfo from 'react-native-device-info';
import JPushModule from 'jpush-react-native';
import Carousel from 'react-native-snap-carousel';
import Speech from '../../utils/VoiceUtils';
import Communications from 'react-native-communications';
import Dialog from './components/dialog';
import Toast from '@remobile/react-native-toast';
import {NavigationActions} from 'react-navigation';
import HomeCell from './components/homeCell';
import WeatherCell from './components/weatherCell';
import * as ConstValue from '../../constants/constValue';
import Speeker from '../../utils/BDSpeech';
import StaticImage from '../../constants/staticImage';
import * as API from '../../constants/api';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import NUmberLength from '../../utils/validator';
import HTTPRequest from '../../utils/httpRequest'
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import TimeToDoSomething from '../../utils/uploadLoggerRequest';
import NavigatorBar from "../../common/navigationBar/navigationBar";
import {
    WHITE_COLOR,
    BLUE_CONTACT_COLOR,
    DEVIDE_LINE_COLOR,
    COLOR_SEPARATE_LINE,
    LIGHT_GRAY_TEXT_COLOR,
    LIGHT_BLACK_TEXT_COLOR,
    COLOR_VIEW_BACKGROUND,
    COLOR_LIGHT_GRAY_TEXT,
    REFRESH_COLOR,
} from '../../constants/staticColor';
import {
    locationAction,
    getHomePageCountAction,
    getCarrierHomoPageCountAction,
    mainPressAction,
    updateVersionAction,
} from '../../action/app';
import {
    setUserCarAction,
    queryEnterpriseNatureSuccessAction,
    saveUserCarList,
    setCurrentCharacterAction,
    setOwnerCharacterAction,
    setDriverCharacterAction
} from '../../action/user';
import {setMessageListIconAction} from '../../action/jpush';
import CharacterChooseCell from '../login/components/characterChooseCell';


const {width, height} = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = 28;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const itemHeight = 125 * itemWidth / 335;

const JpushAliasNumber = global.userId;

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const images = [
    StaticImage.bannerImage1,
    StaticImage.bannerImage2,
];

const styles = StyleSheet.create({
    line: {
        backgroundColor: DEVIDE_LINE_COLOR,
        height: 0.5,
        marginLeft: 50,
    },
    imageView: {
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
        color: BLUE_CONTACT_COLOR,
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
        backgroundColor: BLUE_CONTACT_COLOR,
        borderRadius: 3,
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 10,
    },
    container: {
        ...Platform.select({
            ios: {
                height: ConstValue.NavigationBar_StatusBar_Height,
            },
            android: {
                height: 50,
            },
        }),
        backgroundColor: WHITE_COLOR,
        width: width,
    },
    titleContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: ConstValue.StatusBar_Height,
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
    },
    centerContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7,
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        color: LIGHT_BLACK_TEXT_COLOR,
    },
    icon: {
        fontFamily: 'iconfont',
        fontSize: 15,
        color: REFRESH_COLOR,
        alignSelf: 'center',
        paddingRight: 15,
    },
    weather: {
        height: 50,
        width: width,
        backgroundColor: WHITE_COLOR,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    day: {
        fontSize: 22,
        color: LIGHT_BLACK_TEXT_COLOR,
    },
    date: {
        marginLeft: 20,
    },
    week: {
        fontSize: 13,
        color: LIGHT_BLACK_TEXT_COLOR,
    },
    containerView: {
        flex: 1,
        backgroundColor: COLOR_VIEW_BACKGROUND,
    },
    limitViewStyle: {
        position: 'absolute',
        right: 0,
        marginRight: 20,
    },
    locationStyle: {
        padding: 10,
        flexDirection: 'row',
    },
    locationText: {
        fontSize: 14,
        color: COLOR_LIGHT_GRAY_TEXT,
        marginLeft: 10,
    },
    divideLine: {
        height: 1,
        backgroundColor: LIGHT_GRAY_TEXT_COLOR,
    },
});

class Home extends Component {
    constructor(props) {
        super(props);
        // if (Platform.OS === 'android') JPushModule.initPush();
        const params = this.props.navigation.state.params;

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
            modalVisible: false,
            character: '司机',
            bubbleSwitch: false,
            show: false,
            CarOwnerState: params ? params.CarOwnerState : ''
        };


        this.getHomePageCount = this.getHomePageCount.bind(this);
        this.getCarrierHomePageCount = this.getCarrierHomePageCount.bind(this);
        this.setData = this.setData.bind(this);
        this.setUserCar = this.setUserCar.bind(this);
        this.setUserCarSuccessCallBack = this.setUserCarSuccessCallBack.bind(this);
        this.getUserCar = this.getUserCar.bind(this);
        this.getUserCarSuccessCallBack = this.getUserCarSuccessCallBack.bind(this);
        this.saveUserCarInfo = this.saveUserCarInfo.bind(this);
        this.saveUserCarList = this.saveUserCarList.bind(this);
        this.getUserCarMine = this.getUserCarMine.bind(this);
        this.getUserCarMineSuccessCallBack = this.getUserCarMineSuccessCallBack.bind(this);

        this.saveMessage = this.saveMessage.bind(this);
        this.pushToMsgList = this.pushToMsgList.bind(this);
        this.getCurrentPosition = this.getCurrentPosition.bind(this);
        this.getWeather = this.getWeather.bind(this);
        this.getCurrentWeekday = this.getCurrentWeekday.bind(this);
        this.compareVersion = this.compareVersion.bind(this);

        this.vehicleLimit = this.vehicleLimit.bind(this);
        this.queryEnterpriseNature = this.queryEnterpriseNature.bind(this);
        this.resetTo = this.resetTo.bind(this);
        this.popToTop = this.popToTop.bind(this);
        this.speechContent = this.speechContent.bind(this);
        this.searchDriverState = this.searchDriverState.bind(this);


    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location !== nextProps.location) {
            this.getWeather(nextProps.location);
            this.vehicleLimit(nextProps.location);
        }
        console.log('nextProps=', nextProps.currentStatus);
        console.log('currentProps=', this.props.currentStatus);
        if (nextProps.currentStatus != this.props.currentStatus) {
            if (nextProps.currentStatus == 'driver') {
                this.getHomePageCount(this.props.plateNumber, this.props.userInfo.phone);
            } else if (nextProps.currentStatus == '') {
            } else {
                this.getCarrierHomePageCount();
            }
        }
    }

    componentDidMount() {

        if (this.state.CarOwnerState) {
            this.props.setCurrentCharacterAction('owner');
            this.setState({
                bubbleSwitch: false,
                show: false,
            })
        }

        this.compareVersion();
        this.getCurrentPosition(0);

        if (this.props.currentStatus == 'driver') {
            this.queryEnterpriseNature();
        }
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
                if (message.alertContent.indexOf('认证') < 0) {
                    this.speechContent(message.alertContent, 0);
                }
                if (message.alertContent.indexOf('新货源') > -1) {
                    Alert.alert('提示', '您有新的订单，是否进入货源界面', [
                        {
                            text: '确定',
                            onPress: () => {
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
                    if (notification.aps.alert.indexOf('认证') < 0) {
                        this.speechContent(notification.aps.alert, 0);
                    }
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
            if (this.props.currentStatus == 'driver') {
                if (this.props.plateNumber) {
                    const {userInfo} = this.props;
                    this.getHomePageCount(this.props.plateNumber, userInfo.phone)
                }
            } else {
                this.getCarrierHomePageCount();
            }
        });
        this.getUserCarListener = DeviceEventEmitter.addListener('getUserCar', () => {
            this.getUserCar();
        });

        this.notifyCarStatusListener = DeviceEventEmitter.addListener('notifyCarStatus', () => {
            this.notifyCarStatus();
        });

        this.notifyCertificationListener = DeviceEventEmitter.addListener('certification', () => {
            if (this.props.currentStatus == 'driver') {
                if (this.props.driverStatus == 1) {
                    Alert.alert('提示', '认证资料正在审核中');
                } else if (this.props.driverStatus == 3) {
                    Alert.alert('提示', '认证资料已驳回，请重新上传资料');
                }
            } else {
                if (this.props.ownerStatus == 11 || this.props.ownerStatus == 21) {
                    Alert.alert('提示', '认证资料正在审核中');
                } else if (this.props.ownerStatus == 13 || this.props.ownerStatus == 23) {
                    Alert.alert('提示', '认证资料已驳回，请重新上传资料');
                }
            }
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
        // TimeToDoSomething.sendMsgToNative();
        this.logListener = NativeAppEventEmitter.addListener('nativeSendMsgToRN', (data) => {
            this.getCurrentPosition(1);
        });
        // 我的界面车辆列表监听
        this.getUserCarMineListener = DeviceEventEmitter.addListener('getUserCarMine', (data) => {
            this.getUserCarMine();
        });
    }

    // componentDidUpdate() {
    //     if (this.props.versionUrl !== '') {
    //         this.refs.dialog.show('提示', '版本过低，需要升级到最新版本，否则可能影响使用');
    //     }
    // }
    // 语音播报内容
    speechContent(message, voiceType) {
        if (this.props.speechSwitchStatus) {
            if (Platform.OS === 'ios') {
                Speeker.speek(message);
            } else
                Speech.speak(message, voiceType);
        }
    }

    // 版本升级方法
    dialogOkCallBack() {
        Communications.web(this.props.versionUrl);
    }


    notifyCarStatus() {
        Alert.alert('提示', '关联车辆已被禁用，请联系运营人员');
    }

    componentWillUnmount() {
        this.listener.remove();
        this.getUserCarListener.remove();
        this.Listener.remove();
        this.bindCarListener.remove();
        this.notifyCarStatusListener.remove();
        this.notifyCertificationListener.remove();
        this.logListener.remove();
        this.getUserCarMineListener.remove();
    }

    // 版本对比
    compareVersion() {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_COMPARE_VERSION,
            params: {
                version: DeviceInfo.getVersion(),
                platform: Platform.OS === 'ios' ? '1' : '2',
            },
            loading: () => {
            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('版本对比', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '首页');
                if (responseData.result) {
                    if (responseData.result !== '') {
                        this.props.updateVersion(responseData.result);
                        this.setState({
                            modalVisible: true,
                        });
                        if (this.refs.updateDialog) {
                            this.refs.updateDialog.show('提示', '版本过低，需要升级到最新版本，否则可能影响使用');
                        }
                    }
                } else {
                    if (this.props.currentStatus == 'driver') {
                        this.setData();
                    } else {
                        this.getCarrierHomePageCount();
                    }
                }
            },
            error: (errorInfo) => {
                if (this.props.currentStatus == 'driver') {
                    this.setData();
                } else {
                    this.getCarrierHomePageCount();
                }
            },
            finish: () => {
            }
        });
    }

    // 跳转界面并重置路由栈
    resetTo(index = 0, routeName) {
        const resetAction = NavigationActions.reset({
            index: index,
            actions: [
                NavigationActions.navigate({routeName: routeName}),
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    // 返回到根界面
    popToTop() {
        const routes = this.props.routes;
        let key = routes[1].key;
        this.props.navigation.goBack(key);
    }

    // 获取车辆列表
    getUserCar() {
        Storage.get(StorageKey.USER_INFO).then((value) => {
            currentTime = new Date().getTime();
            if (value) {
                console.log('value', value);
                HTTPRequest({
                    url: API.API_QUERY_ALL_BIND_CAR_BY_PHONE,
                    params: {
                        phoneNum: value.phone,
                    },
                    loading: () => {
                    },
                    success: (responseData) => {
                        this.getUserCarSuccessCallBack(responseData.result);
                    },
                    error: (errorInfo) => {
                    },
                    finish: () => {
                    }
                });
            }
        });
    }

    // 获取车辆列表成功
    getUserCarSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取绑定车辆', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '首页');
        console.log('carList=', result);

        if (result) {
            if (result.length > 1) {
                this.saveUserCarList(result);
                this.props.navigation.navigate('ChooseCar', {
                    carList: result,
                    currentCar: '',
                    flag: true,
                });
            } else if (result.length === 1) {
                this.saveUserCarList(result);
                this.setState({
                    plateNumber: result[0].carNum,
                    plateNumberObj: result[0],
                });
                this.saveUserCarInfo(result[0]);
                this.setUserCar(result[0].carNum, this.setUserCarSuccessCallBack);
            }
        } else {
            Alert.alert('提示', '您的账号未绑定车辆，请添加车辆');
        }
    }

    // 获取车辆列表
    getUserCarMine() {
        Storage.get(StorageKey.USER_INFO).then((value) => {
            if (value) {
                console.log('value', value);
                HTTPRequest({
                    url: API.API_QUERY_ALL_BIND_CAR_BY_PHONE,
                    params: {
                        phoneNum: value.phone,
                    },
                    loading: () => {
                    },
                    success: (responseData) => {
                        this.getUserCarMineSuccessCallBack(responseData.result);
                    },
                    error: (errorInfo) => {
                    },
                    finish: () => {
                    }
                });
            }
        });
    }

    // 获取车辆列表成功
    getUserCarMineSuccessCallBack(result) {
        if (result) {
            if (result.length != 0)
                this.saveUserCarList(result);
        } else {
            Alert.alert('提示', '您的账号未绑定车辆，请添加车辆');
        }
    }

    // 设置车辆
    setUserCar(plateNumber) {
        currentTime = new Date().getTime();
        Storage.get(StorageKey.USER_INFO).then((value) => {
            if (value) {
                HTTPRequest({
                    url: API.API_SET_USER_CAR,
                    params: {
                        plateNumber: plateNumber,
                        phoneNum: value.phone,
                    },
                    loading: () => {
                    },
                    success: (responseData) => {
                        this.setUserCarSuccessCallBack(responseData.result);
                    },
                    error: (errorInfo) => {
                    },
                    finish: () => {
                    }
                });
            }
        });
    }

    searchDriverState() {
        HTTPRequest({
            url: API.API_DRIVER_QUERY_DRIVER_INFO+global.phone,
            params: {
            },
            loading: () => {
            },
            success: (responseData) => {
                console.log('--------666--------',responseData)
                if (!responseData.result) {
                    if (responseData.result.status == '10') {
                        this.props.setDriverCharacterAction('4');
                        this.setState({
                            bubbleSwitch: false,
                            show: false,
                        })
                        Toast.show('司机身份已经被禁用，如需帮助请联系客服');
                        return
                    } else {
                        if (responseData.result.certificationStatus == '1201') {
                            this.props.setDriverCharacterAction('1');
                        }
                        if (responseData.result.certificationStatus == '1202') {
                            this.props.setDriverCharacterAction('2');
                        }
                        if (responseData.result.certificationStatus == '1203') {
                            this.props.setDriverCharacterAction('3');
                        }
                        if (responseData.result.certificationStatus == '1203') {
                            Storage.get(StorageKey.changePersonInfoResult).then((value) => {
                                if (value) {
                                    this.props.navigation.navigate('VerifiedPage', {
                                        resultInfo: value,
                                        commitSuccess: () => {
                                            this.setState({
                                                bubbleSwitch: false,
                                                show: false,
                                            })
                                        }
                                    });
                                } else {
                                    this.props.navigation.navigate('VerifiedPage', {
                                        commitSuccess: () => {
                                            this.setState({
                                                bubbleSwitch: false,
                                                show: false,
                                            })
                                        }
                                    });
                                }
                            });

                            this.setState({
                                show: false,
                            })

                        } else {
                            this.props.setCurrentCharacterAction('driver');

                            this.setState({
                                bubbleSwitch: false,
                                show: false,
                            })
                        }
                    }
                } else {
                    this.props.navigation.navigate('VerifiedPage', {
                        commitSuccess: () => {
                            this.setState({
                                bubbleSwitch: false,
                                show: false,
                            })
                        }
                    });
                }

            },
            error: (errorInfo) => {
            },
            finish: () => {
            }
        });


    }

    // 设置车辆成功
    setUserCarSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('设置车辆', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '首页');
        const userInfo = this.props.userInfo;

        console.log('设置车辆成功了', this.props.plateNumber, userInfo.phone);
        this.getHomePageCount(this.props.plateNumber, userInfo.phone);
        this.saveUserCarInfo(this.props.plateNumberObj);
        Storage.save('setCarSuccessFlag', '2');
        DeviceEventEmitter.emit('updateOrderList');
        DeviceEventEmitter.emit('resetGood');
    }

    // 保存车辆列表
    saveUserCarList(carList) {
        this.props.saveUserCarListAction(carList);
    }


    // 获取首页状态数量
    getHomePageCount(plateNumber, phone) {
        currentTime = new Date().getTime();
        if (plateNumber) {
            HTTPRequest({
                url: API.API_INDEX_STATUS_NUM,
                params: {
                    plateNumber,
                    driverPhone: phone,
                },
                loading: () => {
                },
                success: (responseData) => {
                    lastTime = new Date().getTime();
                    ReadAndWriteFileUtil.appendFile('获取首页状态数量', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                        locationData.district, lastTime - currentTime, '首页');
                    if (responseData.result) {
                        this.props.getHomoPageCountAction(responseData.result);
                    }
                },
                error: () => {
                },
                finish: () => {
                },
            });
        }
    }

    // 获取首页状态数量
    getCarrierHomePageCount() {
        currentTime = new Date().getTime();
        if (this.props.carrierCode) {
            HTTPRequest({
                url: API.API_CARRIER_INDEX_STATUS_NUM,
                params: {
                    carrierCode: this.props.carrierCode,
                },
                loading: () => {
                },
                success: (responseData) => {
                    lastTime = new Date().getTime();
                    ReadAndWriteFileUtil.appendFile('获取首页状态数量', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                        locationData.district, lastTime - currentTime, '首页');
                    if (responseData.result) {
                        this.props.getCarrierHomoPageCountAction(responseData.result);
                    }
                },
                error: () => {
                },
                finish: () => {
                },
            });
        }
    }

    setData() {
        Storage.get(StorageKey.CarSuccessFlag).then((value) => {
            console.log('---value', value);
            if (value && value * 1 === 1) {
                this.getUserCar();
            } else {
                setTimeout(() => {
                    // 开发中reload后，保存车辆列表信息，后面切换车辆会用到
                    Storage.get(StorageKey.userCarList).then((carList) => {
                        this.saveUserCarList(carList);
                    });
                    Storage.get(StorageKey.PlateNumberObj).then((plateNumObj) => {
                        if (plateNumObj) {
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
            let mouth = parseInt(date.getMonth()) + 1;

            const timer = date.getFullYear() + '/' + NUmberLength.leadingZeros(mouth, 2) + '/' +
                NUmberLength.leadingZeros(date.getDate(), 2) + ' ' +
                NUmberLength.leadingZeros(date.getHours(), 2) + ':' +
                NUmberLength.leadingZeros(date.getMinutes(), 2) + ':' +
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
    getCurrentPosition(type) {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =', JSON.stringify(data));
            this.props.getLocationAction(data.city);
            locationData = data;
            if (type === 1) {
                ReadAndWriteFileUtil.appendFile('定位', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, 0, '定位');
                TimeToDoSomething.uploadDataFromLocalMsg();
            } else {
                this.getWeather(data.city);
                if (this.props.currentStatus == 'driver') {
                    this.vehicleLimit(data.city);
                }
            }
        }).catch(e => {
            console.log(e, 'error');
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
            loading: () => {
            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取天气', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '首页');
                const result = responseData.result;
                if (result.weather) {
                    this.setState({
                        weather: result.weather,
                        weatherNum: result.weather,
                        temperatureLow: result.temperatureLow,
                        temperatureHigh: result.temperatureHigh,
                    });
                } else {
                    this.setState({
                        weather: '天气',
                        temperatureLow: '--',
                        temperatureHigh: '--',
                        weatherNum: '',
                    });
                    setTimeout(() => {
                        this.getWeather(this.state.city);
                    }, 600000);
                }
            },
            error: (errorInfo) => {
                this.setState({
                    weather: '天气',
                    temperatureLow: '--',
                    temperatureHigh: '--',
                    weatherNum: '',
                });
            },
            finish: () => {
            }
        });

    }

    //获取限行尾号方法
    vehicleLimit(cityName) {
        HTTPRequest({
            url: API.API_VEHICLE_LIMIT,
            params: {
                cityName
            },
            loading: () => {
            },
            success: (responseData) => {
                console.log('---------------', responseData.result);
                let result = responseData.result;
                if (result && result !== '') {
                    this.setState({
                        limitNumber: '今日限行 ' + responseData.result,
                    });
                } else {
                    this.setState({
                        limitNumber: '',
                    });
                }
            },
            error: (error) => {
                console.log('获取限行尾号失败');
            },
            finish: () => {
            }
        });
    }

    // 查询司机对应企业性质
    queryEnterpriseNature() {
        HTTPRequest({
            url: API.API_QUERY_ENTERPRISE_NATURE + global.phone,
            params: {},
            loading: () => {
            },
            success: (responseData) => {
                global.enterpriseNature = responseData.result;
                if (responseData.result) {
                    this.props.queryEnterpriseNatureAction(responseData.result);
                }
            },
            error: (errorInfo) => {
            },
            finish: () => {
            }
        });
    }

    ownerVerifiedHome() {
        if (this.props.userInfo) {
            if (this.props.userInfo.phone) {

                HTTPRequest({
                    url: API.API_QUERY_COMPANY_INFO,
                    params: {
                        busTel: global.phone,
                        // companyNature: '个人'
                    },
                    loading: () => {

                    },
                    success: (responseData) => {
                        console.log('ownerVerifiedState==', responseData.result);
                        let result = responseData.result;
                        this.setState({
                            verifiedState: result && result.certificationStatus,
                        });
                        // 首页状态
                        if (result.companyNature == '个人') {
                            // 确认个人车主
                            if (result.certificationStatus == '1201') {
                                this.props.setOwnerCharacterAction('11');
                                this.props.setCurrentCharacterAction('personalOwner');
                                this.setState({
                                    bubbleSwitch: false,
                                    show: false,
                                })
                            } else {
                                if (result.certificationStatus == '1202') {
                                    this.props.setOwnerCharacterAction('12');
                                    this.props.setCurrentCharacterAction('personalOwner');
                                    this.setState({
                                        bubbleSwitch: false,
                                        show: false,
                                    })
                                } else {
                                    this.props.setOwnerCharacterAction('13');
                                    this.props.navigation.navigate('PersonownerVerifiedStatePage');
                                    this.setState({
                                        show: false,
                                    })
                                }
                            }

                        } else {
                            if (result.companyNature == '企业') {
                                // 确认企业车主
                                if (result.certificationStatus == '1201') {
                                    this.props.setOwnerCharacterAction('21');
                                    this.props.setCurrentCharacterAction('businessOwner');
                                    this.setState({
                                        bubbleSwitch: false,
                                        show: false,
                                    })
                                } else {
                                    if (result.certificationStatus == '1202') {
                                        this.props.setOwnerCharacterAction('22');
                                        this.props.setCurrentCharacterAction('businessOwner');
                                        this.setState({
                                            bubbleSwitch: false,
                                            show: false,
                                        })
                                    } else {
                                        this.props.setOwnerCharacterAction('23');
                                        this.props.navigation.navigate('EnterpriseownerVerifiedStatePage');
                                        this.setState({
                                            show: false,
                                        })
                                    }
                                }
                            } else {
                                this.props.navigation.navigate('CharacterOwner');
                                this.setState({
                                    show: false,
                                })
                            }

                        }

                    },
                    error: (errorInfo) => {

                        if (errorInfo.message == '没有车主角色') {
                            this.props.navigation.navigate('CharacterOwner');
                            this.setState({
                                show: false,
                            })
                        }

                    },
                    finish: () => {
                    }
                });
            }
        }
    }

    getCurrentWeekday(day) {
        let weekday = new Array(7);
        weekday[0] = "周日";
        weekday[1] = "周一";
        weekday[2] = "周二";
        weekday[3] = "周三";
        weekday[4] = "周四";
        weekday[5] = "周五";
        weekday[6] = "周六";
        return weekday[day];
    }

    renderImg(item, index) {
        console.log('------item-----', item);
        return (
            <Image
                style={{
                    width: itemWidth,
                    height: itemHeight,
                }}
                resizeMode='contain'
                source={item.item}
            />
        );
    }


    render() {
        const {homePageState, carrierHomePageState, routes} = this.props;
        const {weather, temperatureLow, temperatureHigh} = this.state;
        const navigator = this.props.navigation;
        const limitView = this.state.limitNumber || this.state.limitNumber !== '' ?
            <View style={styles.limitViewStyle}>
                <Text style={{
                    fontSize: 14,
                    color: LIGHT_BLACK_TEXT_COLOR,
                    alignSelf: 'center'
                }}>{this.state.limitNumber}</Text>
            </View> : null;
        let date = new Date();
        const driverView = <View style={{marginTop: 10, backgroundColor: WHITE_COLOR, width: width,}}>
            <HomeCell
                title="接单"// 文字
                describe="方便接单，快速查看"
                padding={10}// 文字与文字间距
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}// 背景色
                badgeText={homePageState === null ? 0 : homePageState.pendingCount}// 消息提示
                renderImage={() => <Image source={StaticImage.receiptIcon}/>}// 图标
                clickAction={() => { // 点击事件
                    if (this.props.driverStatus == 2) {
                        DeviceEventEmitter.emit('resetGood');
                        this.props.navigation.navigate('GoodsSource');
                    } else {
                        DeviceEventEmitter.emit('certification');
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
                    if (this.props.driverStatus == 2) {
                        this.changeOrderTab(1);
                        DeviceEventEmitter.emit('changeOrderTabPage', 1);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="签收"
                describe="签收快捷，免去后顾之忧"
                padding={10}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                badgeText={0}
                renderImage={() => <Image source={StaticImage.signIcon}/>}
                clickAction={() => {
                    if (this.props.driverStatus == 2) {
                        this.changeOrderTab(2);
                        DeviceEventEmitter.emit('changeOrderTabPage', 2);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="回单"
                describe="接收回单，方便快捷"
                padding={8}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                badgeText={0}
                renderImage={() => <Image source={StaticImage.receiveIcon}/>}
                clickAction={() => {
                    if (this.props.driverStatus == 2) {
                        this.changeOrderTab(3);
                        DeviceEventEmitter.emit('changeOrderTabPage', 3);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="道路异常"
                describe="道路异常，上传分享"
                padding={8}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                badgeText={0}
                renderImage={() => <Image source={StaticImage.roadIcon}/>}
                clickAction={() => {
                    if (this.props.driverStatus == 2) {
                        this.props.navigation.navigate('UploadAbnormal');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
        </View>;
        const carrierView = <View style={{marginTop: 10, backgroundColor: WHITE_COLOR, width: width,}}>
            <HomeCell
                title="接单"// 文字
                describe="方便接单，快速查看"
                padding={10}// 文字与文字间距
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}// 背景色
                badgeText={carrierHomePageState === null ? 0 : carrierHomePageState.notYetReceiveCount}// 消息提示
                renderImage={() => <Image source={StaticImage.receiptIcon}/>}// 图标
                clickAction={() => { // 点击事件
                    if (this.props.ownerStatus == 12 || this.props.ownerStatus == 22) {
                        this.props.navigation.navigate('GoodsSource');
                        DeviceEventEmitter.emit('resetGood');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="调度"
                describe="一键调度，快捷无忧"
                padding={10}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                badgeText={carrierHomePageState === null ? 0 : carrierHomePageState.noDispatchCount}
                renderImage={() => <Image source={StaticImage.dispatchIcon}/>}
                clickAction={() => {
                    if (this.props.ownerStatus == 12 || this.props.ownerStatus == 22) {
                        this.changeOrderTab(1);
                        DeviceEventEmitter.emit('changeOrderTabPage', 1);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
        </View>;
        let state = '';
        console.log('this.props.driverStatus', this.props.driverStatus);
        console.log('this.props.ownerStatus', this.props.ownerStatus);
        if (this.props.currentStatus == 'driver') {

            switch (this.props.driverStatus) {
                case '1' || 1:
                    state = '(认证中)';
                    break;
                case '2' || 2:
                    state = '';
                    break;
                case '3' || 3:
                    state = '(认证驳回)';
                    break;
                default:
                    state = '';
                    break;
            }

        } else {
            //state = this.props.ownerStatus == '11' || this.props.ownerStatus == '21' ? '(认证中)' :
            //this.props.ownerStatus == '13' || this.props.ownerStatus == '23'? '(认证驳回)' : '';

            switch (this.props.ownerStatus) {
                case '11' || 11:
                case '21' || 21:
                    state = '(认证中)';
                    break;
                case '13' || 13:
                case '23' || 23:
                    state = '(认证驳回)';
                    break;
                default:
                    state = '';
                    break;
            }


        }
        return (
            <View style={styles.containerView}>
                <NavigatorBar
                    title={`首页${state}`}
                    navigator={navigator}
                    leftButtonHidden={false}
                    leftButtonConfig={{
                        type: 'image',
                        image: this.props.currentStatus == 'driver' ?
                            this.state.bubbleSwitch ? StaticImage.DriverUp : StaticImage.DriverDown
                            : this.state.bubbleSwitch ? StaticImage.OwnerUp : StaticImage.OwnerDown,
                        // disableImage: StaticImage.DriverUp,
                        leftImageStyle: {
                            width: 17,
                            height: 17,
                        },
                        onClick: () => {
                            this.setState({
                                bubbleSwitch: !this.state.bubbleSwitch,
                                show: !this.state.show,
                            })
                        },
                    }}
                    rightButtonConfig={{
                        type: 'image',
                        image: this.props.jpushIcon === true ? StaticImage.MessageNew : StaticImage.Message,
                        imageStyle: {
                            width: 17,
                            height: 17,
                        },
                        onClick: () => {
                            this.props.setMessageListIcon(false);
                            Storage.save(StorageKey.newMessageFlag, '0');
                            this.pushToMsgList();
                        },
                    }}
                />
                <ScrollView>
                    <View style={styles.locationStyle}>
                        <Image source={StaticImage.locationIcon}/>
                        <Text
                            style={styles.locationText}>{this.props.location ? '您所在的位置：' + this.props.location : '定位失败'}</Text>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 0,
                            }}
                            onPress={() => {
                                this.getCurrentPosition(0);
                            }}
                        >
                            <Text style={styles.icon}>&#xe66b;</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Carousel
                            data={images}
                            renderItem={this.renderImg}
                            sliderWidth={width}
                            itemWidth={itemWidth}
                            hasParallaxImages={true}
                            firstItem={1}
                            inactiveSlideScale={0.94}
                            inactiveSlideOpacity={0.8}
                            enableMomentum={true}
                            loop={true}
                            loopClonesPerSide={2}
                            autoplay={true}
                            autoplayDelay={500}
                            autoplayInterval={3000}
                            removeClippedSubviews={false}
                        />
                    </View>
                    <View style={styles.weather}>
                        <View style={styles.date}>
                            <Text style={styles.day}>
                                {date.getUTCDate()}
                            </Text>
                            <Text style={styles.week}>
                                {this.getCurrentWeekday(date.getDay())}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', marginLeft: 20}}>
                            <View style={{
                                marginRight: 15,
                                justifyContent: 'center',
                            }}>
                                <WeatherCell weatherIcon={this.state.weatherNum}/>
                            </View>
                            <Text style={{
                                marginRight: 10,
                                fontSize: 14,
                                color: LIGHT_BLACK_TEXT_COLOR,
                                alignSelf: 'center'
                            }}> {weather}</Text>
                            <Text style={{
                                marginRight: 10,
                                fontSize: 14,
                                color: LIGHT_BLACK_TEXT_COLOR,
                                alignSelf: 'center'
                            }}>{temperatureHigh}℃/{temperatureLow}℃</Text>
                        </View>
                        {limitView}
                    </View>
                    {this.props.currentStatus == 'driver' ? driverView : carrierView}
                </ScrollView>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}>
                    <Dialog
                        ref="updateDialog"
                        callback={this.dialogOkCallBack.bind(this)}/>
                </Modal>
                {this.state.show ?
                    <CharacterChooseCell
                        carClick={() => {
                            this.ownerVerifiedHome();
                            // if (this.props.ownerStatus == '0'){
                            //     this.props.navigation.navigate('CharacterOwner');
                            //         this.setState({
                            //             show : false,
                            //         })
                            // }else {
                            //     if (this.props.ownerStatus == '23' ||  this.props.ownerStatus == '13'){
                            //         this.props.navigation.navigate('CharacterOwner');
                            //         this.setState({
                            //             show : false,
                            //         })
                            //
                            //     }else {
                            //         this.props.setCurrentCharacterAction('owner');
                            //         this.setState({
                            //             bubbleSwitch: false,
                            //             show : false,
                            //         })
                            //     }
                            //
                            // }

                        }}
                        driverClick={() => {
                            this.searchDriverState();
                            // if (this.props.driverStatus == '4') {
                            //     this.setState({
                            //         bubbleSwitch: false,
                            //         show: false,
                            //     })
                            //     Toast.show('司机身份已经被禁用，如需帮助请联系客服');
                            //     return
                            // } else {
                            //     if (this.props.driverStatus == '0' || this.props.driverStatus == '3') {
                            //         Storage.get(StorageKey.changePersonInfoResult).then((value) => {
                            //             if (value) {
                            //                 this.props.navigation.navigate('VerifiedPage', {
                            //                     resultInfo: value,
                            //                     commitSuccess: () => {
                            //                         this.setState({
                            //                             bubbleSwitch: false,
                            //                             show: false,
                            //                         })
                            //                     }
                            //                 });
                            //             } else {
                            //                 this.props.navigation.navigate('VerifiedPage', {
                            //                     commitSuccess: () => {
                            //                         this.setState({
                            //                             bubbleSwitch: false,
                            //                             show: false,
                            //                         })
                            //                     }
                            //                 });
                            //             }
                            //         });
                            //
                            //         this.setState({
                            //             show: false,
                            //         })
                            //
                            //     } else {
                            //         this.props.setCurrentCharacterAction('driver');
                            //
                            //         this.setState({
                            //             bubbleSwitch: false,
                            //             show: false,
                            //         })
                            //     }
                            // }
                        }}
                    /> : null}

            </View>
        );
    }
}


function mapStateToProps(state) {
    return {
        userInfo: state.user.get('userInfo'),
        homePageState: state.app.get('getHomePageCount'),
        carrierHomePageState: state.app.get('getCarrierHomePageCount'),
        jpushIcon: state.jpush.get('jpushIcon'),
        location: state.app.get('locationData'),
        plateNumber: state.user.get('plateNumber'),
        plateNumberObj: state.user.get('plateNumberObj'),
        routes: state.nav.routes,
        userCarList: state.user.get('userCarList'),
        speechSwitchStatus: state.app.get('speechSwitchStatus'),
        versionUrl: state.app.get('versionUrl'),
        driverStatus: state.user.get('driverStatus'),
        ownerStatus: state.user.get('ownerStatus'),
        currentStatus: state.user.get('currentStatus'),
        carrierCode: state.user.get('companyCode'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getHomoPageCountAction: (response) => {
            dispatch(getHomePageCountAction(response));
        },
        getCarrierHomoPageCountAction: (response) => {
            dispatch(getCarrierHomoPageCountAction(response));
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
        setCurrentCharacterAction: (data) => {
            dispatch(setCurrentCharacterAction(data));
        },
        setOwnerCharacterAction: (result) => {
            dispatch(setOwnerCharacterAction(result));
        },
        setDriverCharacterAction: (result) => {
            dispatch(setDriverCharacterAction(result));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
