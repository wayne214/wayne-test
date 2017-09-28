/**
 * Created by xizhixin on 2017/9/25.
 * 验证码登录界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import Button from 'apsl-react-native-button';
import Toast from '@remobile/react-native-toast';
import JPushModule from 'jpush-react-native';
import {Geolocation} from 'react-native-baidu-map-xzx';
import { NavigationActions } from 'react-navigation';

import NavigationBar from '../../common/navigationBar/navigationBar';
import CountDownButton from '../../common/timerButton';
import Loading from '../../utils/loading';
import StaticImage from '../../constants/staticImage';
import * as StaticColor from '../../constants/staticColor';
import * as API from '../../constants/api';
import HTTPRequest from '../../utils/httpRequest';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import Validator from '../../utils/validator';
import ClickUtil from '../../utils/prventMultiClickUtil';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import {loginSuccessAction, setUserNameAction} from '../../action/user';

const {width, height} = Dimensions.get('window');

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND
    },
    contentView: {
        width,
        height: 44 + 0.5 + 44,
        backgroundColor: StaticColor.WHITE_COLOR,
        marginTop: 10,
    },
    leftText: {
        height: 44,
        width: 50,
        justifyContent: 'center',
    },
    leftTextString: {
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        fontSize: 16,
    },
    phoneNumView: {
        marginLeft: 10,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInputStyle: {
        flex: 1,
        height: 44,
        fontSize: 16,
        marginLeft:10,
    },
    separateLine: {
        height: 0.5,
        width,
        backgroundColor: StaticColor.COLOR_SEPARATE_LINE,
    },
    smsCodeView: {
        marginLeft: 10,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    smsCodeButton: {
        width: 125,
        borderWidth: 0,
    },
    loginButton: {
        marginLeft: 10,
        marginTop: 15,
        marginRight: 10,
        borderWidth: 0,
        backgroundColor: StaticColor.COLOR_MAIN,
        borderRadius: 5,
    },
    clearButton: {
        width: 15,
        height: 15,
        marginRight: 15,
        marginLeft: 10,
    },
});


class LoginSms extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            phoneNumber: params.loginPhone,
            smsCode: '',
            loading: false,
        };
        this.clearPhoneNum = this.clearPhoneNum.bind(this);
        this.clearSmsCodeNum = this.clearSmsCodeNum.bind(this);
        this.login = this.login.bind(this);
        this.requestVCodeForLogin = this.requestVCodeForLogin.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
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

    clearPhoneNum() {
        this.setState({
            phoneNumber: '',
        });
    }

    clearSmsCodeNum() {
        this.setState({
            smsCode: '',
        });
    }

    /*验证码登录*/
    login() {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_LOGIN_WITH_CODE,
            params: {
                phoneNum: this.state.phoneNumber,
                identifyCode: this.state.smsCode,
                deviceId: global.UDID,
                platform: global.platform,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{

                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('通过验证码登录接口', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '短信登录页面');
                const loginUserId = responseData.result.userId;
                Storage.save(StorageKey.USER_ID, loginUserId);
                Storage.save(StorageKey.USER_INFO, responseData.result);
                Storage.save(StorageKey.CarSuccessFlag, '1'); // 设置车辆的Flag

                // 发送Action,全局赋值用户信息
                this.props.sendLoginSuccessAction(responseData.result);


                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Main'}),
                    ]
                });
                this.props.navigation.dispatch(resetAction);

                JPushModule.setAlias(result.phone, ()=>{}, ()=>{});
            },
            error: (errorInfo)=>{

            },
            finish: ()=>{
                this.setState({
                    loading: false,
                });
            }
        })


    }


    /*获取登录验证码*/
    requestVCodeForLogin(shouldStartCountting) {
       HTTPRequest({
           url: API.API_GET_LOGIN_WITH_CODE,
           params: {
               deviceId: global.UDID,
               phoneNum: this.state.phoneNumber,
           },
           loading: ()=>{

           },
           success: (responseData)=>{
               /*开启倒计时*/
               shouldStartCountting(true);
               Toast.showShortCenter('验证码已发送');

           },
           error: (errorInfo)=>{
               /*关闭倒计时*/
               shouldStartCountting(false);

           },
           finish: ()=>{

           }
       })
    }


    render() {
        const navigator = this.props.navigation;
        const {phoneNumber, smsCode} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'登录'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <View style={styles.contentView}>
                    <View style={styles.phoneNumView}>
                        <View style={styles.leftText}>
                            <Text style={styles.leftTextString}>
                                手机号
                            </Text>
                        </View>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={styles.textInputStyle}
                            value={phoneNumber}
                            onChangeText={(phoneNumber) => {
                                this.setState({phoneNumber});
                            }}
                            placeholder="手机号"
                        />
                        {
                            (() => {
                                if (phoneNumber.length > 0) {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.clearPhoneNum();
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <Image
                                                source={StaticImage.clearIcon}
                                                style={styles.clearButton}
                                            />
                                        </TouchableOpacity>
                                    );
                                }
                            })()
                        }
                    </View>
                    <View
                        style={styles.separateLine}
                    />
                    <View
                        style={styles.smsCodeView}
                    >
                        <View
                            style={styles.leftText}
                        >
                            <Text
                                style={styles.leftTextString}
                            >
                                验证码
                            </Text>
                        </View>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={styles.textInputStyle}
                            value={this.state.smsCode}
                            onChangeText={(smsCode) => {
                                this.setState({smsCode});
                            }}
                            placeholder="请输入验证码"
                            returnKeyType='done'
                        />
                        {
                            (() => {
                                if (smsCode.length > 0) {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.clearSmsCodeNum();
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <Image
                                                source={StaticImage.clearIcon}
                                                style={styles.clearButton}
                                            />
                                        </TouchableOpacity>
                                    );
                                }
                            })()
                        }
                        <View style={{
                            height:44,
                            width:0.5,
                            backgroundColor: StaticColor.COLOR_SEPARATE_LINE,
                        }}/>
                        <CountDownButton
                            enable={phoneNumber.length}
                            style={{width: 110, marginRight: 10}}
                            textStyle={{color: StaticColor.COLOR_MAIN}}
                            timerCount={60}
                            onClick={(shouldStartCountting) => {
                                if (Validator.isPhoneNumber(phoneNumber)) {
                                    this.requestVCodeForLogin(shouldStartCountting);
                                } else {
                                    Toast.showShortCenter('手机号输入有误，请重新输入');
                                    shouldStartCountting(false);
                                }
                            }}
                        />
                    </View>
                </View>
                <Button
                    isDisabled={!(phoneNumber && smsCode)}
                    style={styles.loginButton}
                    textStyle={{color: 'white', fontSize: 16}}
                    onPress={() => {
                        if (ClickUtil.onMultiClick()) {
                            this.setState({
                                smsCode:'',
                            });
                            this.login();

                        }
                    }}
                >
                    登录
                </Button>
                {
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {};

}

function mapDispatchToProps(dispatch) {
    return {
        /*登录成功发送Action，全局保存用户信息*/
        sendLoginSuccessAction: (result) => {
            dispatch(loginSuccessAction(result));
            dispatch(setUserNameAction(result.userName ? result.userName : result.phone))

        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginSms);
