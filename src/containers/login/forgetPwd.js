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
    Dimensions,
    Platform,
    Alert
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
} from '../../constants/staticColor';
import * as API from '../../constants/api';

import Validator from '../../utils/validator';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import StaticImage from '../../constants/staticImage';
const {width, height} = Dimensions.get('window');
import PermissionsAndroid from '../../utils/permissionManagerAndroid';

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
            phoneNo: params.loginPhone,
            pwdCode: '',
            buttonForget: '获取验证码',
            loading: false,

        };
        this.getForgetVCode = this.getForgetVCode.bind(this);
        this.canclePhoneNO = this.canclePhoneNO.bind(this);
        this.canclePhonePWD = this.canclePhonePWD.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.checkCode = this.checkCode.bind(this);
    }

    componentDidMount() {
        if(Platform.OS === 'ios'){
            // this.getCurrentPosition();
        }else {
            PermissionsAndroid.locationPermission().then((data) => {
                this.getCurrentPosition();
            }, (err) => {
                Alert.alert('提示','请到设置-应用-授权管理设置定位权限');
            });
        }
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

    canclePhoneNO() {
        this.setState({
            phoneNo: '',
        });
    }

    canclePhonePWD() {
        this.setState({
            pwdCode: '',
        });
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
                // ReadAndWriteFileUtil.appendFile('校验忘记密码的验证码是否正确',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                //     locationData.district, lastTime - currentTime, '忘记密码');
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
        const {phoneNo} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'忘记密码'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                />

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 10,
                    }}
                >
                    { false &&<View style={styles.iconStyle}>
                        <Text style={styles.iconfont}> &#xe62a;</Text>
                    </View>
                    }

                    <View style={{flex: 1}}>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#CCCCCC"
                            placeholder="请输入手机号码"
                            value={this.state.phoneNo}
                            onChangeText={(phoneNo) => {
                                this.setState({phoneNo});
                            }}
                        />
                    </View>
                    {
                        (() => {
                            if (this.state.phoneNo.length > 0) {
                                return (
                                    <TouchableOpacity onPress={() => this.canclePhoneNO()}>

                                        <View style={styles.iconStyle}>
                                            <Image source={StaticImage.clearIcon} />
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                        })()
                    }
                </View>
                <View style={{backgroundColor: 'white',height: 1, width: width,alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{width: width-30,height: 1, backgroundColor: '#e8e8e8'}}/>
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
                        enable={phoneNo.length}
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
                    <Image
                        style={{
                            width: width - 20,
                            marginTop: 15,
                            marginLeft: 10,
                            marginRight: 10,
                            marginBottom: 0,
                            height: 44,
                            resizeMode: 'stretch',
                            alignItems: 'center',
                            justifyContent:'center'
                        }}
                        source={StaticImage.BlueButtonArc}
                    >

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: WHITE_COLOR,
                                backgroundColor: '#00000000'
                            }}
                        >
                            下一步
                        </Text>

                    </Image>
                </TouchableOpacity>

                {
                    this.state.loading ? <Loading /> : null
                }
            </View>


        );
    }
}
