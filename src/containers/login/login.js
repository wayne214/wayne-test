/**
 * Created by xizhixin on 2017/9/22.
 * 登录界面
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TextInput,
    Dimensions,
    Platform,
    Keyboard,
    NativeAppEventEmitter,
    InteractionManager,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BaseContainer from '../base/baseContainer';
import Button from 'apsl-react-native-button';
import * as StaticColor from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';
import * as API from '../../constants/api';
import  HTTPRequest from '../../utils/httpRequest';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import XeEncrypt from '../../utils/XeEncrypt';
import Validator from '../../utils/validator';
import Toast from '@remobile/react-native-toast';
import Loading from '../../utils/loading';
// import {Geolocation} from 'react-native-baidu-map-xzx';
// import JPushModule from 'jpush-react-native';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';
const dismissKeyboard = require('dismissKeyboard');
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    backgroundImageView: {
        position: 'absolute',
    },
    contentView: {
        justifyContent:'space-between',
        width,
        height: 185,
        marginTop: (height - 490) * 0.6,
    },
    textInput: {
        height: 45,
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
    },
    lineUnderInput: {
        height: 1,
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 10,
    },
    loginButton: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 0,
        height: 46,
        borderRadius: 5,
        marginBottom: 0,
    },
    loginButtonText: {
        fontSize: 18,
        color: StaticColor.COLOR_MAIN,
    },
    bottomView: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 30,
        width: width - 20,
        marginLeft: 10,
        marginTop: 15,
    },
    bottomViewText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        backgroundColor: 'rgba(255,255,255,0)',
    },
    screenEndView: {
        position:'absolute',
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: 30,
        width: width - 20,
        marginLeft: 10,
        marginTop: height - 100,
    },
    screenEndViewText: {
        fontSize: 14,
        color: 'rgba(255,255,255,1)',
        backgroundColor: 'rgba(255,255,255,0)',
    },
});
export default class Login extends BaseContainer {

    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: __DEV__ ? '15136273254' : '',
            password: __DEV__ ? 'a123456' : '',
            loading: false,
        };
        this.loginSecretCode = this.loginSecretCode.bind(this);
        this.login = this.login.bind(this);
    }


    componentDidMount() {
        // Geolocation.getCurrentPosition().then(data => {
        //     console.log('position..........',JSON.stringify(data));
        //     locationData = data;
        // }).catch(e =>{
        //     console.log(e, 'error');
        // });

    }

    /*获取加密秘钥*/
    loginSecretCode() {
        HTTPRequest({
            url: API.API_GET_SEC_TOKEN,
            params:{},
            loading:()=>{
                this.setState({
                    loading: true,
                });
            },
            success:(responseData)=>{
                const secretCode = responseData.result;
                const secretPassWord = XeEncrypt.aesEncrypt(this.state.password, secretCode, secretCode);
                console.log('----log--', secretPassWord);
                this.login(secretPassWord);
            },
            error:(errorInfo)=>{
                this.setState({
                    loading: false,
                });
            },
            finish: ()=>{

            }
        });
    }


    /*账号密码登录*/
    login(secretCode) {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_LOGIN_WITH_PSD,
            params: {
                phoneNum: this.state.phoneNumber,
                password: secretCode,
                deviceId: global.UDID,
                platform: global.platform,
            },
            loading: ()=>{

            },
            success: (responseData)=>{
                this.setState({
                    loading: false,
                }, ()=>{
                    lastTime = new Date().getTime();

                    // ReadAndWriteFileUtil.writeFile('通过密码登录', locationData.city, locationData.latitude, locationData.longitude, result.phone, locationData.province,
                    //     locationData.district, lastTime - currentTime, result.userId, result.userName, '登录页面');

                    const loginUserId = responseData.result.userId;
                    Storage.save(StorageKey.USER_ID, loginUserId);

                    Storage.save(StorageKey.CarSuccessFlag, '1'); // 设置车辆的Flag
                    global.userId = responseData.result.userId;
                    global.phone = responseData.result.phone;
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Main'}),
                        ]
                    });
                    this.props.navigation.dispatch(resetAction);
                    // JPushModule.setAlias(result.phone, this.success, this.fail);
                });

            },
            error: (errorInfo)=>{
                this.setState({
                    loading: false,
                });
            },
            finish: ()=>{
            }
        });

    }

    render() {
        const {phoneNumber, password} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.backgroundImageView}>
                    <Image
                        source={StaticImage.LoginBackground}
                        style={{width, height}}
                    />
                </View>
                <KeyboardAwareScrollView style={{ width: width, height: height}}>
                    <View style={{alignItems: 'center', paddingTop: 122}}>
                        <Image
                            source={StaticImage.LoginIcon}
                        />
                        <Image
                            style={{marginTop: 15}}
                            source={StaticImage.LoginFont}
                        />
                    </View>

                    <View style={styles.contentView}>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            placeholder="手机号"
                            placeholderTextColor="white"
                            textAlign="center"
                            keyboardType="numeric"
                            style={styles.textInput}
                            onChangeText={(phoneNumber) => {
                                this.setState({phoneNumber});
                            }}
                            value={phoneNumber}
                        />
                        <View
                            style={styles.lineUnderInput}
                        />
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                            placeholder="密码"
                            placeholderTextColor="white"
                            textAlign="center"
                            returnKeyLabel={'done'}
                            returnKeyType={'done'}
                            style={styles.textInput}
                            onChangeText={(password) => {
                                this.setState({password});
                            }}
                            value={password}
                        />
                        <View
                            style={styles.lineUnderInput}
                        />
                        <Button
                            isDisabled={!(phoneNumber && password)}
                            onPress={() => {
                                dismissKeyboard();
                                if (Validator.isPhoneNumber(phoneNumber)) {
                                    this.loginSecretCode();
                                } else {
                                    Toast.showShortCenter('手机号码输入有误，请重新输入');
                                }
                            }}
                            style={styles.loginButton}
                            textStyle={styles.loginButtonText}
                        >
                            登录
                        </Button>
                        <View style={styles.bottomView}>
                            <Text
                                onPress={() => {

                                    this.props.navigation.navigate('LoginSms', {
                                        loginPhone:this.state.phoneNumber
                                    });

                                }}
                                style={styles.bottomViewText}
                            >
                                短信验证登录
                            </Text>
                            <Text
                                onPress={() => {
                                    this.props.navigation.navigate('ForgetPwd', {
                                        loginPhone: this.state.phoneNumber
                                    });

                                }}
                                style={styles.bottomViewText}
                            >
                                忘记密码？
                            </Text>
                        </View>
                    </View>

                <View style={styles.screenEndView}>
                    <Text style={styles.bottomViewText}>没有账号？</Text>
                    <Text
                        style={styles.screenEndViewText}
                        onPress={()=>{
                            this.props.navigation.navigate('Registered');
                        }}
                    >
                        立即注册
                    </Text>
                </View>
                {/*<LoadingView*/}
                    {/*showLoading={this.props.appLoading}*/}
                {/*/>*/}
                </KeyboardAwareScrollView>

                {
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }
}
