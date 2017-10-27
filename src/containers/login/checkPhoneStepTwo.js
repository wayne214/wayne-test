/**
 * Created by 58416 on 2017/3/21.
 * 忘记密码 通过手机号登录的界面
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import Toast from '@remobile/react-native-toast';
import {Geolocation} from 'react-native-baidu-map-xzx';

import NavigationBar from '../../common/navigationBar/navigationBar';
import CountDownButton from '../../common/timerButton';
import Loading from '../../utils/loading';
import  HTTPRequest from '../../utils/httpRequest';

import {
    LIGHT_GRAY_TEXT_COLOR,
    WHITE_COLOR,
    COLOR_VIEW_BACKGROUND,
    COLOR_MAIN,
} from '../../constants/staticColor';
import * as API from '../../constants/api';

import Validator from '../../utils/validator';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import StaticImage from '../../constants/staticImage';
const {width, height} = Dimensions.get('window');

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: COLOR_VIEW_BACKGROUND,
    },
    iconStyle: {
        height: 44,
        paddingLeft: 10,
        paddingRight: 15,
        backgroundColor: WHITE_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSize: {
        width: 16,
        height: 16,
    },
    textStyle: {
        paddingLeft: 15,
        height: 44,
        fontSize: 16,
        color: '#666666',
    },
    textInputStyle: {
        paddingLeft: 15,
        height: 44,
        fontSize: 16,
        backgroundColor: WHITE_COLOR,
    },
    iconfont: {
        fontFamily: 'iconfont',
        color: LIGHT_GRAY_TEXT_COLOR,
        lineHeight: 20,
        fontSize: 16,
    },
});

export default class forgetPWD extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.state = {
            pwdCode: '',
            buttonForget: '获取验证码',
            loading: false,

        };
        this.getForgetVCode = this.getForgetVCode.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.checkCode = this.checkCode.bind(this);
        this.phoneNo = params.loginPhone;
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

    /*获取验证码*/
    getForgetVCode(shouldStartCountting) {

        HTTPRequest({
            url: API.API_GET_FORGET_PSD_CODE,
            params: {
                deviceId: global.UDID,
                phoneNum: this.state.phoneNo,
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

    /*检验验证码是否正确*/
    checkCode(){
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_CHECK_IDENTIFY_CODE,
            params: {
                identifyCode: this.state.pwdCode,
                phoneNum: this.state.phoneNo,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('校验忘记密码的验证码是否正确',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '忘记密码');
                if (responseData.result) {
                    this.props.navigation.navigate('ChangeCodePwd', {
                        identifyCode: this.state.pwdCode,
                        phoneNum: this.state.phoneNo,
                    });
                } else {
                    Toast.showShortCenter('输入的验证码不正确');
                }
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

    // 下一步按钮
    nextStep() {
        if (this.state.phoneNo !== '' && this.state.pwdCode !== '') {
            this.checkCode();
        } else {
            Toast.showShortCenter('账号或密码不能为空');
        }
    }


    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'手机号码验证'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                />

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 10,
                    }}
                >
                    

                    <View style={{flex: 1}}>
                        <Text
                            style={styles.textStyle}
                        >短信验证码已发送至({Validator.newPhone(this.phoneNo)})，请填写验证码</Text>
                    </View>
                    
                </View>
                <View
                    style={{
                        flexDirection: 'row',

                    }}
                >
                    { false && <View style={styles.iconStyle}>
                        <Text style={styles.iconfont}> &#xe634;</Text>

                    </View>
                    }

                    <View style={{flex: 1}}>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            placeholder="请输入验证码"
                            value={this.state.pwdCode}
                            onChangeText={(pwdCode) => {
                                this.setState({pwdCode});
                            }}
                            returnKeyType='done'

                        />
                    </View>
                    {
                        (() => {
                            if (this.state.pwdCode.length > 0) {
                                return (
                                    <TouchableOpacity onPress={() => this.canclePhonePWD()}>
                                        <View style={styles.iconStyle}>
                                            <Image source={StaticImage.clearIcon} />
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                        })()
                    }
                    { false && <View style={{width: 1, backgroundColor: COLOR_VIEW_BACKGROUND}}/>}
                    <CountDownButton
                        enable={this.phoneNo.length}
                        style={{width: 100, backgroundColor: WHITE_COLOR, paddingRight: 15}}
                        textStyle={{color: '#0078ff'}}
                        timerCount={60}
                        onClick={(shouldStartCountting) => {
                            if (Validator.isPhoneNumber(phoneNo)) {
                                this.getForgetVCode(shouldStartCountting);
                            } else {
                                Toast.showShortCenter('手机号码输入有误，请重新输入');
                                shouldStartCountting(false);
                            }
                        }}
                    />
                </View>

                <TouchableOpacity onPress={() => this.nextStep()}>
                    <View
                        style={{
                            backgroundColor: '#0083ff',
                            borderRadius: 5,
                            height: 44,
                            margin: 10,
                            marginTop: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: WHITE_COLOR,
                            }}
                        >
                            提交
                        </Text>

                    </View>
                </TouchableOpacity>

                {
                    this.state.loading ? <Loading /> : null
                }
            </View>


        );
    }
}
