/**
 * Created by xizhixin on 2017/4/5.
 * 扫描界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
    Vibration,
    TouchableOpacity,
    DeviceEventEmitter,
    Animated,
    Easing,
    BackHandler,
    Dimensions,
    InteractionManager,
    Alert,
} from 'react-native';
import Camera from 'react-native-camera';
// import Sound from 'react-native-sound';

import * as API from '../../constants/api';
import HTTPRequest from '../../utils/httpRequest';
import Storage from '../../utils/storage';
import ViewFinder from './components/viewFinder';
import Loading from '../../utils/loading';
import Toast from '@remobile/react-native-toast';

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

import {
    BLACK_COLOR,
    WHITE_COLOR,
    COLOR_MAIN,
} from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';
import * as ConstValue from '../../constants/constValue';

const {width, height} = Dimensions.get('window');
let isLoadEnd = false;
const styles = StyleSheet.create({
    allContainer: {
        flex: 1,
        backgroundColor: BLACK_COLOR,
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
        backgroundColor: BLACK_COLOR,
        opacity: 0.6,
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
        flex: 0,
        justifyContent: 'center',
    },
    backImg: {
        marginLeft: 10,
    },
    cameraStyle: {
        alignSelf: 'center',
        width,
        height,
    },
    flash: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 60,
    },
    flashIcon: {
        fontSize: 1,
        color: WHITE_COLOR,
    },
    text: {
        fontSize: 14,
        color: WHITE_COLOR,
        marginTop: 5,
    },
    icon: {
        color: WHITE_COLOR,
        fontSize: 20,
        fontFamily: 'iconfont',
    },
    scanLine: {
        alignSelf: 'center',
    },
    centerContainer: {
        ...Platform.select({
            ios: {
                height: (height - 278) / 2,
            },
            android: {
                height: (height - 200) / 3,
            },
        }),
        width,
        backgroundColor: BLACK_COLOR,
        opacity: 0.6,
    },
    bottomContainer: {
        alignItems: 'center',
        backgroundColor: BLACK_COLOR,
        alignSelf: 'center',
        opacity: 0.6,
        flex: 1,
        width,
    },
    fillView: {
        width: (width - 300) / 2,
        height: 150,
        backgroundColor: BLACK_COLOR,
        opacity: 0.6,
    },
    scan: {
        width: 300,
        height: 150,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: COLOR_MAIN,
    },
});

class Scan extends Component {
    constructor(props) {
        super(props);
        this.camera = null;
        this.state = {
            transCode: '',
            openFlash: false,
            active: false,
            flag: true,
            fadeInOpacity: new Animated.Value(0), // 初始值
            plateNumber: '',
            isAlways: false,
            types: [],
            status: {},
            loading: false,
        };
        this.goBack = this.goBack.bind(this);
        this.startAnimation = this.startAnimation.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.endTimer = this.endTimer.bind(this);
        this.barcodeReceived = this.barcodeReceived.bind(this);
        // this.playSound = this.playSound.bind(this);
        this.searchTransCode = this.searchTransCode.bind(this);
        this.searchScheduleCode = this.searchScheduleCode.bind(this);
        this.getOrderSuccessCallBack = this.getOrderSuccessCallBack.bind(this);
        this.getOrderFailCallBack = this.getOrderFailCallBack.bind(this);
        this.getScheduleSuccessCallBack = this.getScheduleSuccessCallBack.bind(this);
        this.getScheduleFailCallBack = this.getScheduleFailCallBack.bind(this);
        this.changeFlash = this.changeFlash.bind(this);
        this.saveSearchList = this.saveSearchList.bind(this);
        this.changeState = this.changeState.bind(this);
        this.startTimeout = this.startTimeout.bind(this);
        this.endTimeout = this.endTimeout.bind(this);
    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }

    componentDidMount() {
        this.setState({
            loading: true
        });
        this.getCurrentPosition();
        this.timeout = setTimeout(() => {
            this.setState({
                active: true,
                loading: false
            });
        }, 1000);
        this.startAnimation();
        Storage.get('plateNumber').then((value) => {
            if (value) {
                console.log('value=', value);
                this.setState({
                    plateNumber: value,
                });
            }
        });
        this.startTimer();
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        this.listener = DeviceEventEmitter.addListener('startAni', () => {
            this.startAnimation();
            this.startTimer();
            this.transCode = null;
            isLoadEnd = false;
        });
    }

    componentWillUnmount() {
        this.endTimer();
        this.endTimeout();
        this.listener.remove();
        this.timeout && clearTimeout(this.timeout);
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        this.transCode = null;
        isLoadEnd = false;

        this.setState({
            transCode: '',
            openFlash: false,
            active: false,
            flag: true,
            fadeInOpacity: new Animated.Value(0), // 初始值
            plateNumber: '',
        });
    }

    onBackAndroid = () => {
        if(this.props.navigation && this.props.routes.length > 1) {
            this.props.navigation.goBack();
            return true;
        }
        return false;
    };

    // 获取调度单成功回调
    getScheduleSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('扫描调度单',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '扫描页面');
        console.log('============= getSchedule success call back ', result);
        if (result) {
            this.endTimer();
            this.props.navigation.navigate('SearchResultForSchedule', {
                productResult: result,
            });
            this.saveSearchList();
        } else {
            Toast.showShortCenter('单号不存在！');
            this.startTimeout();
        }
        this.changeState(true);
    }

    // 获取失败回调
    getScheduleFailCallBack(err) {
        console.log('============= getSchedule fail call back ', err);
        this.startTimeout();
        this.changeState(true);
    }

    // 获取订单成功回调
    getOrderSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('扫描运输单', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '扫描页面');
        console.log('============= getOrder success call back ', result);
        if (result.length > 0) {
            this.endTimer();
            const order = result[0];
            switch (order.transOrderStatsu) {
                case '3':
                    // 待签收
                    this.props.navigation.navigate('SearchResultForSignIn', {
                        productResult: order,
                    });
                    this.saveSearchList();
                    break;
                case '4':
                    // 待回单
                    this.props.navigation.navigate('SearchResultForToWaitSure', {
                        productResult: order,
                    });
                    this.saveSearchList();
                    break;
                case '5':
                    // 已回单
                    this.props.navigation.navigate('SearchResultForToSure', {
                        productResult: order,
                    });
                    this.saveSearchList();
                    break;
                default:
                    this.props.navigation.navigate('SearchResultForToBeShipped', {
                        productResult: order,
                    });
                    this.saveSearchList();
                    break;
            }
        } else {
            Toast.showShortCenter('单号不存在！');
            this.startTimeout();
        }
        this.changeState(true);
    }

    // 获取失败回调
    getOrderFailCallBack(err) {
        console.log('============= getOrder fail call back ', err);
        this.startTimeout();
        this.changeState(true);
    }

    // 搜索订单
    searchTransCode() {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_NEW_GET_GOODS_SOURCE,
            params: {
                transCodeList: [ this.transCode ],
                plateNumber: this.state.plateNumber,
            },
            loading: ()=>{},
            success: (responseData)=>{
                this.getOrderSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
                this.getOrderFailCallBack(errorInfo);
            },
            finish:()=>{}
        });
    }

    // 搜索调度单
    searchScheduleCode() {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_NEW_GET_SCHEDULE_INFO_BY_CODE,
            params: {
                scheduleCode: this.transCode,
                plateNumber: this.state.plateNumber,
            },
            loading: ()=>{},
            success: (responseData)=>{
                this.getScheduleSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
                this.getScheduleFailCallBack(errorInfo);
            },
            finish:()=>{}
        });
    }

    barcodeReceived(e) {
        // console.log('before transCode', this.transCode);
        // console.log('------------code-----------', e);
        if (isLoadEnd) {
            return;
        }
        isLoadEnd = true;
        if (e.data !== this.transCode) {
            // this.playSound();
            // Vibration.vibrate([0, 500, 200, 500]);
            // this.setState({
            //     transCode: e.data
            // })
            this.transCode = e.data; // 放在this上，防止触发多次，setstate有延时
            if (this.state.flag) {
                this.changeState(false);
                if (e.data.indexOf('DP') > -1) {
                    this.searchScheduleCode();
                } else {
                    this.searchTransCode();
                }
            }
            console.log('after transCode', this.transCode);
        }
        // this.transCode = e.data; // 放在this上，防止触发多次，setstate有延时
    }
    // 播放声音
    playSound() {
        // const s = new Sound('ding.mp3', Sound.MAIN_BUNDLE, (e) => {
        //     if (e) {
        //         console.log('error', e);
        //     } else {
        //         console.log('duration', s.getDuration());
        //         s.play();
        //     }
        // });
    }

    // 开始动画，循环播放
    startAnimation() {
        Animated.timing(this.state.fadeInOpacity, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
        }).start();
    }

    // 开启定时器
    startTimer() {
        console.log('-------------startAnimation');
        this.timer = setInterval(() => {
            this.state.fadeInOpacity.setValue(0);
            this.startAnimation();
        }, 1500);
    }

    // 关闭定时器
    endTimer() {
        console.log('---------------stopAnimation');
        this.timer && clearInterval(this.timer);
    }

    // 保存历史记录
    saveSearchList() {
        Storage.get('searchList').then((value) => {
            if (value) {
                if (value.length >= 20) {
                    value.pop();
                }
                if (value.indexOf(this.transCode) < 0) {
                    value.unshift(this.transCode);
                }
                Storage.save('searchList', value);
                console.log('-- scan SearchList From Storage --', value);
            } else {
                const searchList = [];
                searchList.unshift(this.transCode);
                Storage.save('searchList', searchList);
                console.log('-- scan Create New SearchList  --', searchList);
            }
        });
    }

    // 延时操作
    startTimeout() {
        this.scanTimeout = setTimeout(() => {
            this.transCode = null;
            isLoadEnd = false;
        }, 5000);
    }

    // 移除延时
    endTimeout() {
        this.scanTimeout && clearTimeout(this.scanTimeout);
    }

    // 返回按钮点击事件
    goBack() {
        this.props.navigation.goBack();
    }


    // 开灯关灯
    changeFlash() {
        this.setState({
            openFlash: !this.state.openFlash,
        });
    }

    // 改变请求状态
    changeState(status) {
        this.setState({
            flag: status,
        });
    }

    render() {
        const {
            openFlash,
            active,
            loading
        } = this.state;
        return (
            <View style={styles.allContainer}>
                {(() => {
                    if (active) {
                        return (
                            <Camera
                                ref={(cam) => {
                                    this.camera = cam;
                                }}
                                style={styles.cameraStyle}
                                barcodeScannerEnabled={true}
                                onBarCodeRead={
                                    this.barcodeReceived
                                }
                                torchMode={openFlash ? 'on' : 'off'}
                            >
                                <View style={styles.container}>
                                    <View style={styles.titleContainer}>
                                        <View style={styles.leftContainer}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={this.goBack}
                                            >
                                                <View style={{width: 80}}>
                                                    <Image
                                                        style={styles.backImg}
                                                        source={StaticImage.scanBackIcon}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.centerContainer}/>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={styles.fillView}/>
                                    <View style={styles.scan}>
                                        <ViewFinder />
                                        <Animated.View
                                            style={[styles.scanLine, {
                                                opacity: 1,
                                                transform: [{
                                                    translateY:
                                                        this.state.fadeInOpacity.interpolate(
                                                            {
                                                                inputRange: [0, 1],
                                                                outputRange: [0, 150],
                                                            }),
                                                }],
                                            }]}
                                        >
                                            <Image source={StaticImage.scanLine}/>
                                        </Animated.View>
                                    </View>
                                    <View style={styles.fillView}/>
                                </View>
                                <View style={styles.bottomContainer}>
                                    <Text
                                        style={[
                                            styles.text, {
                                                textAlign: 'center',
                                                width: 300,
                                                marginTop: active ? 25 : 175,
                                                lineHeight: 21,
                                            },
                                        ]}
                                        numberOfLines={2}
                                    >
                                        将运单/调度单上的条码放入框内即可自动扫描。
                                    </Text>
                                    <TouchableOpacity
                                        onPress={this.changeFlash}
                                    >
                                        <View style={styles.flash}>
                                            <Text style={styles.icon}>&#xe61a;</Text>
                                            <Text style={styles.text}>
                                                开灯/关灯
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Camera>
                        );
                    }
                })()}
                {loading ? <Loading/> : null}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Scan);
