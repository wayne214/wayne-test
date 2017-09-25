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
    Image
} from 'react-native';
import Toast from '@remobile/react-native-toast';
// import {Geolocation} from 'react-native-baidu-map-xzx';

import NavigationBar from '../../common/navigationBar/navigationBar';
import CountDownButton from '../../common/timerButton';

import {
    LIGHT_GRAY_TEXT_COLOR,
    WHITE_COLOR,
    COLOR_VIEW_BACKGROUND,
    COLOR_MAIN,
} from '../../constants/staticColor';
// import * as API from '../../constants/api';

import Validator from '../../utils/validator';
// import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import StaticImage from '../../constants/staticImage';

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
        paddingRight: 10,
        backgroundColor: WHITE_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSize: {
        width: 16,
        height: 16,
    },
    textInputStyle: {
        height: 44,
        backgroundColor: WHITE_COLOR,
    },
    iconfont: {
        fontFamily: 'iconfont',
        color: LIGHT_GRAY_TEXT_COLOR,
        lineHeight: 20,
        fontSize: 16,
    },
});

class forgetPWD extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.state = {
            phoneNo: params.loginPhone,
            pwdCode: '',
            buttonForget: '获取验证码',
        };
        // this.getForgetVCode = this.getForgetVCode.bind(this);
        this.canclePhoneNO = this.canclePhoneNO.bind(this);
        this.canclePhonePWD = this.canclePhonePWD.bind(this);
        // this._sendCode = this._sendCode.bind(this);
        this.nextPage = this.nextPage.bind(this);
        // this.getForgetNextPageNew = this.getForgetNextPageNew.bind(this);
        // this.getForgetNextPageNewSuccessCallBack = this.getForgetNextPageNewSuccessCallBack.bind(this);
    }

    componentDidMount() {
        // this.getCurrentPosition();
    }
    // 获取当前位置
    // getCurrentPosition() {
    //     Geolocation.getCurrentPosition().then(data => {
    //         console.log('position =',JSON.stringify(data));
    //         locationData = data;
    //     }).catch(e =>{
    //         console.log(e, 'error');
    //     });
    // }
    // componentWillReceiveProps() {
    //     setTimeout(() => {
    //         const {forgetNextPage} = this.props;
    //         console.log('====login======');
    //         console.log('7890-===== ', forgetNextPage);
    //
    //         if (forgetNextPage.code == '200') {
    //             console.log('====loginggggg======');
    //             this.props.router.redirect(
    //                 RouteType.CHANGE_CODE_PWD,
    //                 {
    //                     w_identifyCode: this.state.pwdCode,
    //                     w_phoneNum: this.state.phoneNo,
    //                 },
    //             );
    //         }
    //     }, 500);
    // }

    // getForgetVCode(shouldStartCountting) {
    //     this.props.getForgetVCode({
    //         body: {
    //             deviceId: global.UDID,
    //             phoneNum: this.state.phoneNo,
    //         },
    //         successMsg: '验证码已发送',
    //     }, shouldStartCountting);
    // }

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

    // getForgetNextPageNew(getForgetNextPageNewSuccessCallBack){
    //     currentTime = new Date().getTime();
    //     this.props.getForgetNextPageNew({
    //         body: {
    //             identifyCode: this.state.pwdCode,
    //             phoneNum: this.state.phoneNo,
    //         },
    //     }, getForgetNextPageNewSuccessCallBack);
    // }
    //
    // getForgetNextPageNewSuccessCallBack(result){
    //     lastTime = new Date().getTime();
    //     ReadAndWriteFileUtil.appendFile('校验忘记密码的验证码是否正确',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
    //         locationData.district, lastTime - currentTime, '忘记密码');
    //     if (result === true) {
    //         this.props.router.redirect(
    //             RouteType.CHANGE_CODE_PWD,
    //             {
    //                 w_identifyCode: this.state.pwdCode,
    //                 w_phoneNum: this.state.phoneNo,
    //             },
    //         );
    //     } else {
    //         Toast.showShortCenter('校验失败');
    //     }
    //
    // }

    // 下一页按钮
    nextPage() {
        if (this.state.phoneNo !== '' && this.state.pwdCode !== '') {
            // this.getForgetNextPageNew(this.getForgetNextPageNewSuccessCallBack);

            // this.props.getForgetNextPage({
            //     identifyCode: this.state.pwdCode,
            //     phoneNum: this.state.phoneNo,
            // });

            // this.props.router.redirect(
            //     RouteType.CHANGE_CODE_PWD,
            //     {
            //         w_identifyCode: this.state.pwdCode,
            //         w_phoneNum: this.state.phoneNo
            //     }
            // );
        } else {
            Toast.showShortCenter('账号或密码不能为空');
        }
    }

    // 获取验证码按钮
    // _sendCode() {
    //     if (this.state.phoneNo != '') {
    //         this.props.getForgetVCode({
    //             deviceId: DeviceInfo.getUniqueID(),
    //             phoneNum: this.state.phoneNo
    //         })
    //         //判断返回的提示
    //         if (typeof(this.props.app.get('forgetVcode').code) != "undefined") {
    //             Toast.showShortCenter(`${this.props.app.get('forgetVcode').code}`);
    //         }
    //     } else {
    //         Toast.showShortCenter('手机号不能为空');
    //     }
    // }

    render() {
        const navigator = this.props.navigation;
        const {phoneNo} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    // backIconClick={
                    //     () => {
                    //         this.props.router.pop();
                    //     }
                    // }
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
                    <View style={styles.iconStyle}>
                        <Text style={styles.iconfont}> &#xe62a;</Text>
                    </View>

                    <View style={{flex: 1}}>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#CCCCCC"
                            placeholder="手机"
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

                <View style={{height: 1, backgroundColor: COLOR_VIEW_BACKGROUND}}/>

                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <View style={styles.iconStyle}>
                        <Text style={styles.iconfont}> &#xe634;</Text>

                    </View>

                    <View style={{flex: 1}}>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            placeholder="验证码"
                            value={this.state.pwdCode}
                            onChangeText={(pwdCode) => {
                                this.setState({pwdCode});
                            }}
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
                    <View style={{width: 1, backgroundColor: COLOR_VIEW_BACKGROUND}}/>
                    <CountDownButton
                        enable={phoneNo.length}
                        style={{width: 110, backgroundColor: WHITE_COLOR}}
                        textStyle={{color: COLOR_MAIN}}
                        timerCount={60}
                        onClick={(shouldStartCountting) => {
                            if (Validator.isPhoneNumber(phoneNo)) {
                                {/*this.getForgetVCode(shouldStartCountting);*/}
                            } else {
                                Toast.showShortCenter('手机号码输入有误，请重新输入');
                                shouldStartCountting(false);
                            }
                        }}
                    />
                </View>

                <TouchableOpacity onPress={() => this.nextPage()}>
                    <View
                        style={{
                            backgroundColor: COLOR_MAIN,
                            borderRadius: 5,
                            height: 40,
                            margin: 10,
                            marginTop: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >

                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: WHITE_COLOR,
                            }}
                        >
                            下一步
                        </Text>

                    </View>
                </TouchableOpacity>

            </View>


        );
    }
}

function mapStateToProps(state) {
    return {
        // app: state.app,
        // forgetNextPage: state.app.get('forgetNextPage'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // getForgetVCode: (params, shouldStartCountting) => dispatch(getForgetVCodeAction({
        //     url: API.API_NEW_GET_FORGET_PSD_CODE,
        //     body: {
        //         deviceId: params.deviceId,
        //         phoneNum: params.phoneNo,
        //     },
        //     successCallBack: () => {
        //         console.log('获取验证码成功，开始倒计时');
        //         shouldStartCountting(true);
        //     },
        //     failCallBack: () => {
        //         shouldStartCountting(false);
        //     },
        //     ...params,
        // })),
        // getForgetNextPageNew: (params, getForgetNextPageNewSuccessCallBack) => {
        //     dispatch(getForgetNextPageNewAction({
        //         url: API.API_NEW_CHECK_IDENTIFY_CODE,
        //         successCallBack: (response) => {
        //             getForgetNextPageNewSuccessCallBack(response.result);
        //             dispatch(getForgetNextPageNewSuccessAction(response));
        //         },
        //         failCallBack: (err) => {
        //             console.log(err);
        //         },
        //         ...params,
        //     }));
        // },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(forgetPWD);
