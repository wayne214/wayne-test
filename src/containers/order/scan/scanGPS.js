/**
 * GPS设备扫描界面
 * Created by xizhixin on 2017/12/20.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    BackHandler,
    DeviceEventEmitter,
    Easing,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
} from 'react-native';
import Camera from 'react-native-camera';
import HTTPRequest from '../../../utils/httpRequest';
import * as API from '../../../constants/api';
import ViewFinder from '../components/viewFinder';
import Loading from '../../../utils/loading';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import StaticImage from '../../../constants/staticImage';
import * as StaticColor from '../../../constants/staticColor';
import * as ConstValue from '../../../constants/constValue';
import Toast from '@remobile/react-native-toast';

const {width, height} = Dimensions.get('window');
let isLoadEnd = false;
let currentTime = 0;
let lastTime = 0;
let locationData = '';

class scanGPS extends Component {
    constructor(props) {
        super(props);
        this.camera = null;
        this.state = {
            gpsDeviceCode: '',
            openFlash: false,
            active: false,
            flag: true,
            fadeInOpacity: new Animated.Value(0), // 初始值
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
        this.changeFlash = this.changeFlash.bind(this);
        this.changeState = this.changeState.bind(this);
        this.startTimeout = this.startTimeout.bind(this);
        this.endTimeout = this.endTimeout.bind(this);
        this.bindGPS = this.bindGPS.bind(this);
        this.getGPSDetails = this.getGPSDetails.bind(this);
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
        this.startTimer();
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        this.listener = DeviceEventEmitter.addListener('startAni', () => {
            this.startAnimation();
            this.startTimer();
            this.gpsDeviceCode = null;
            isLoadEnd = false;
        });
    }

    onBackAndroid = () => {
        if(this.props.navigation && this.props.routes.length > 1) {
            this.props.navigation.goBack();
            return true;
        }
        return false;
    };

    componentWillUnmount() {
        this.endTimer();
        this.endTimeout();
        this.listener.remove();
        this.timeout && clearTimeout(this.timeout);
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        this.gpsDeviceCode = null;
        isLoadEnd = false;

        this.setState({
            gpsDeviceCode: '',
            openFlash: false,
            active: false,
            flag: true,
            fadeInOpacity: new Animated.Value(0), // 初始值
        });
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

    // 获取GPS设备信息
    getGPSDetails() {
        HTTPRequest({
            url: API.API_GET_GPS_DETAILS,
            params: {
                barCode: this.state.barCode,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                if(responseData.result) {
                    let data = responseData.result;
                    if(data.isDisabled == 0){
                        if(data.eleValue && parseInt(data.eleValue) > 20) {
                            this.bindGPS();
                        }else {
                            Alert.alert('提示', '设备当前电量已不足20%，您确认要使用此设备？', [
                                {
                                    text: '确定',
                                    onPress: () => {
                                        this.bindGPS();
                                    },
                                },
                                {text: '取消'},
                            ], {cancelable: false});                        }
                    }else {
                        Toast.showShortCenter('该设备已禁用，不能进行绑定');
                    }
                } else {
                    Toast.showShortCenter('该设备不存在，不能进行绑定');
                }
            },
            error: (errorInfo)=>{},
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
    }

    // 绑定GPS设备
    bindGPS() {
        // 传递参数
        HTTPRequest({
            url: API.API_BIND_OR_RELIEVE_GPS,
            params: {
                driverPhone: global.phone,
                userId: global.userId,
                userName: global.userName,
                bindCarNum: global.plateNumber,
                barCode: this.state.barCode,
                isBind: 1, // 绑定
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                if(responseData.result){
                    Toast.showShortCenter('绑定成功');
                    this.props.navigation.goBack();
                    DeviceEventEmitter.emit('refreshShippedDetails');
                } else {
                    Toast.showShortCenter('绑定失败');
                }
            },
            error: (errorInfo)=>{},
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
    }

    barcodeReceived(e) {
        // console.log('before transCode', this.transCode);
        // console.log('------------code-----------', e);
        if (isLoadEnd) {
            return;
        }
        isLoadEnd = true;
        if (e.data !== this.gpsDeviceCode) {
            // this.playSound();
            // Vibration.vibrate([0, 500, 200, 500]);
            this.gpsDeviceCode = e.data; // 放在this上，防止触发多次，setstate有延时
            if (this.state.flag) {
                this.changeState(false);
                this.getGPSDetails();
            }
            console.log('after transCode', this.gpsDeviceCode);
        }
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

    // 延时操作
    startTimeout() {
        this.scanTimeout = setTimeout(() => {
            this.gpsDeviceCode = null;
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
                                        <View style={styles.leftContainer}>
                                            <Text style={styles.titleText}>扫描GPS设备</Text>
                                        </View>
                                        <View style={styles.leftContainer}>
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
                                <View style={styles.tipContainer}>
                                    <Text
                                        style={[
                                            styles.text, {
                                                textAlign: 'center',
                                                width: width - 48,
                                                marginTop: active ? 25 : 175,
                                                lineHeight: 21,
                                            },
                                        ]}
                                        numberOfLines={2}
                                    >
                                        请将GPS设备的条码放入框内，即可自动扫描。
                                    </Text>
                                </View>
                                <View style={styles.bottomContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate('BindGPS');
                                        }}
                                    >
                                        <View>
                                            <Image style={styles.bottomIcon} source={StaticImage.inputNum}/>
                                            <Text style={styles.tipText}>输入绑定编号</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this.changeFlash}
                                    >
                                        <View>
                                            <Image style={styles.bottomIcon} source={StaticImage.light}/>
                                            <Text style={styles.tipText}>打开手电筒</Text>
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

const styles =StyleSheet.create({
    allContainer: {
        flex: 1,
        backgroundColor: StaticColor.BLACK_COLOR,
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
        backgroundColor: 'rgba(0,0,0,0.6)',
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
    titleText: {
        color: StaticColor.WHITE_COLOR,
        fontSize: 18,
    },
    leftContainer: {
        justifyContent: 'center',
        flex: 1
    },
    backImg: {
        marginLeft: 10,
    },
    cameraStyle: {
        alignSelf: 'center',
        width,
        height,
    },
    flashIcon: {
        fontSize: 1,
        color: StaticColor.WHITE_COLOR,
    },
    text: {
        fontSize: 14,
        color: StaticColor.WHITE_COLOR,
        marginTop: 5,
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
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    tipContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignSelf: 'center',
        flex: 1,
        width,
    },
    fillView: {
        width: 24,
        height: 150,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    scan: {
        width: width - 48,
        height: 150,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: StaticColor.BLUE_CONTACT_COLOR
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 54,
        marginRight: 54,
        marginBottom: 17
    },
    bottomIcon: {
        alignSelf: 'center',
    },
    tipText: {
        fontSize: 13,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
    }
});

function mapStateToProps(state){
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(scanGPS);

