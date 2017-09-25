/**
 * Created by wangl on 2017/6/28.
 * 注册界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TextInput,
    Dimensions
} from 'react-native';
import Button from 'apsl-react-native-button';
import Toast from '@remobile/react-native-toast';
// import {Geolocation} from 'react-native-baidu-map-xzx';
import Loading from '../../utils/loading';
import  HTTPRequest from '../../utils/httpRequest';

import NavigationBar from '../../common/navigationBar/navigationBar';
import CountDownButton from '../../common/timerButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import StaticImage from '../../constants/staticImage';
import * as StaticColor from '../../constants/staticColor';
import * as API from '../../constants/api';

import Validator from '../../utils/validator';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';


const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    registeredTitle: {
        fontSize: 20,
        color: StaticColor.WHITE_COLOR,
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        marginTop: 18
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    codeInput: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    verticalLine: {
        height: 45,
        width: 1,
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR
    },
    registeredTextInput: {
        height: 45,
        fontSize: 16,
        color: StaticColor.BLACK_COLOR,
        alignItems: 'center',
        marginLeft: 10,
    },
    registeredCodeTextInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
        color: StaticColor.BLACK_COLOR,
        alignItems: 'center',
        marginLeft: 10,
    },
    loginButton: {
        backgroundColor: StaticColor.BLUE_ALL_COLOR,
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 0,
        height: 38,
        borderRadius: 5,
        marginBottom: 0,
    },
    loginButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    screenEndView: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: width,
        marginTop: height - 40 - 64,
    },
    screenEndViewText: {
        fontSize: 14,
        color: StaticColor.COLOR_MAIN,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    bottomViewText: {
        fontSize: 14,
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    separateLine: {
        height: 1,
        width,
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
    },
});

export default class Registered extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phoneNum: '',
            messageCode: '',
            password: '',
            newPassword: '',
            loading: false,
        };

        this.registerAccount = this.registerAccount.bind(this);
        this.registeredIdentityCode = this.registeredIdentityCode.bind(this);
    }

    // componentDidMount() {
    // this.getCurrentPosition();
    // }

    // 获取当前位置
    // getCurrentPosition() {
    // Geolocation.getCurrentPosition().then(data => {
    //     console.log('position =', JSON.stringify(data));
    //     locationData = data;
    // }).catch(e => {
    //     console.log(e, 'error');
    // });
    // }

    /*注册*/
    registerAccount() {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_REGISTER,
            params: {
                confirmPassword: this.state.newPassword,
                identifyCode: this.state.messageCode,
                password: this.state.password,
                phoneNum: this.state.phoneNum,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('注册用户', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '注册页面');

                this.props.navigation.navigate('RegisterSuccess');

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


    /*获取注册验证码*/
    registeredIdentityCode(shouldStartCountting) {

        HTTPRequest({
            url: API.API_REGISTER_IDENTIFY_CODE,
            params: {
                deviceId: global.UDID,
                phoneNum: this.state.phoneNum,
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
        const {phoneNum, messageCode, password, newPassword} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'注册'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <KeyboardAwareScrollView style={{ width: width, height: height}}>

                    <View style={styles.content}>
                        <View style={{position: 'absolute'}}>
                            <Image
                                source={StaticImage.registerBackground}
                                style={{width, height: 200}}
                            />
                        </View>
                        <Image source={StaticImage.LoginIcon}/>
                        <Text style={styles.registeredTitle}>欢迎加入鲜易通</Text>
                    </View>

                    <View style={{backgroundColor: StaticColor.WHITE_COLOR}}>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            placeholder="手机号"
                            placeholderTextColor="#cccccc"
                            keyboardType="numeric"
                            style={styles.registeredTextInput}
                            value={phoneNum}
                            onChangeText={(phoneNum) => {
                            this.setState({phoneNum});
                        }}
                        />
                        <View style={styles.separateLine}/>
                        <View style={styles.codeInput}>
                            <TextInput
                                underlineColorAndroid={'transparent'}
                                placeholder="验证码"
                                placeholderTextColor="#cccccc"
                                keyboardType="numeric"
                                style={styles.registeredCodeTextInput}
                                value={messageCode}
                                onChangeText={(messageCode) => {
                                this.setState({messageCode});
                            }}
                            />
                            <View style={styles.verticalLine}/>
                            <CountDownButton
                                enable={phoneNum.length}
                                style={{width: 110, marginRight: 10}}
                                textStyle={{color: StaticColor.COLOR_MAIN}}
                                timerCount={60}
                                onClick={(shouldStartCountting) => {
                                if (Validator.isPhoneNumber(phoneNum)) {
                                    this.registeredIdentityCode(shouldStartCountting)
                                } else {
                                    Toast.showShortCenter('手机号输入有误，请重新输入');
                                    shouldStartCountting(false);
                                }
                            }}
                            />

                        </View>
                        <View style={styles.separateLine}/>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                            placeholder="新密码"
                            placeholderTextColor="#cccccc"
                            style={styles.registeredTextInput}
                            value={password}
                            onChangeText={(password) => {
                            this.setState({password});
                        }}
                        />
                        <View style={styles.separateLine}/>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                            placeholder="确认密码"
                            placeholderTextColor="#cccccc"
                            style={styles.registeredTextInput}
                            value={newPassword}
                            onChangeText={(newPassword) => {
                            this.setState({newPassword});
                        }}
                        />
                    </View>

                    <Button
                        isDisabled={!(phoneNum && messageCode && password && newPassword)}
                        style={styles.loginButton}
                        textStyle={styles.loginButtonText}
                        onPress={() => {
                this.props.navigation.navigate('RegisterSuccess');

                        {/*if (Validator.isPhoneNumber(phoneNum)) {*/}
                            {/*this.registerAccount();*/}
                            {/*this.setState({*/}
                                {/*messageCode:'',*/}
                            {/*})*/}
                        {/*} else {*/}
                            {/*Toast.showShortCenter('手机号码输入有误，请重新输入');*/}
                        {/*}*/}
                    }}
                    >
                        立即注册
                    </Button>
                    <View style={styles.screenEndView}>
                        <View style={{height: 20, justifyContent: 'center'}}>
                            <Text style={styles.bottomViewText}>点击"立即注册"代表同意</Text>
                        </View>
                        <View style={{height: 21, justifyContent: 'center'}}>
                            <Text
                                style={styles.screenEndViewText}
                                onPress={() => {
                                this.props.navigation.navigate('Protocol');
                            }}
                            >
                                鲜易供应链服务协议
                            </Text>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }
}
