/**
 * Created by 58416 on 2017/3/23.
 * 忘记密码界面 通过验证码后更改密码的界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
// import {Geolocation} from 'react-native-baidu-map-xzx';
// import Toast from '@remobile/react-native-toast';

import NavigationBar from '../../common/navigationBar/navigationBar';

// import * as API from '../../constants/api';
import * as StaticColor from '../../constants/staticColor';

// import XeEncrypt from '../../utils/XeEncrypt';
// import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    iconStyle: {
        height: 44,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: StaticColor.WHITE_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSize: {
        width: 16,
        height: 19,
    },
    textInputStyle: {
        height: 44,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    iconfont: {
        fontFamily: 'iconfont',
        color: StaticColor.GRAY_TEXT_COLOR,
        lineHeight: 20,
        fontSize: 16,
    },
});


class changeCodePWD extends Component {

    constructor(props) {
        super(props);

        const params = this.props.navigation.state.params;
        this.state = {
            newPWD: '',
            newPWDagain: '',
            identifyCode: params.w_identifyCode,
            phoneNum: params.w_phoneNum,
        };

        // this.getForgetChangeCodeAction = this.getForgetChangeCodeAction.bind(this);
        // this.getForgetChangeCodeSucccessCallBack =
        //     this.getForgetChangeCodeSucccessCallBack.bind(this);
        // this.loginSecretCode = this.loginSecretCode.bind(this);
        // this.loginSecretCodeSuccessCallBack = this.loginSecretCodeSuccessCallBack.bind(this);
        // this.finish = this.finish.bind(this);
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
    // loginSecretCode(loginSecretCodeSuccessCallBack) {
    //     currentTime = new Date().getTime();
    //     this.props.loginSecretCode(loginSecretCodeSuccessCallBack);
    // }
    //
    // loginSecretCodeSuccessCallBack(result) {
    //     lastTime = new Date().getTime();
    //     ReadAndWriteFileUtil.appendFile('获取登录密钥', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
    //         locationData.district, lastTime - currentTime);
    //     const secretCode = result;
    //     const secretnewPWD = XeEncrypt.aesEncrypt(this.state.newPWD, secretCode, secretCode);
    //     const secretnewPWDagain = XeEncrypt.aesEncrypt(this.state.newPWDagain, secretCode, secretCode);
    //     console.log('----changeCodePWD--', secretnewPWD, secretnewPWDagain);
    //     this.getForgetChangeCodeAction(secretnewPWD, this.getForgetChangeCodeSucccessCallBack);
    // }
    //
    // getForgetChangeCodeAction(secret,getForgetChangeCodeSucccessCallBack) {
    //     currentTime = new Date().getTime();
    //     this.props.getForgetChangeCodeAction({
    //         confirmPassword: secret,
    //         // identifyCode: this.state.identifyCode,
    //         identifyCode: this.state.identifyCode,
    //         // newPassword: this.state.newPWD,
    //         newPassword: secret,
    //         // phoneNum: this.state.phoneNum,
    //         phoneNum: this.state.phoneNum,
    //     }, getForgetChangeCodeSucccessCallBack);
    // }
    //
    // getForgetChangeCodeSucccessCallBack(result) {
    //     console.log('------dengluchenggong66666-----', result);
    //     lastTime = new Date().getTime();
    //     ReadAndWriteFileUtil.appendFile('忘记密码', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
    //         locationData.district, lastTime - currentTime, '忘记密码页面');
    //     // this.props.router.popToRoute(RouteType.LOGIN_PAGE);
    //     this.props.navigator.resetTo({
    //         component: LoginContainer,
    //         name: RouteType.LOGIN_PAGE,
    //         key: RouteType.LOGIN_PAGE,
    //     });
    // }
    //
    // finish() {
    //     if (this.state.newPWD === '' && this.state.newPWDagain === '') {
    //         Toast.showShortCenter('密码不能为空');
    //     } else if (this.state.newPWD !== this.state.newPWDagain) {
    //         Toast.showShortCenter('两次密码输入不一致');
    //     } else {
    //         // this.getForgetChangeCodeAction(this.getForgetChangeCodeSucccessCallBack);
    //         console.log(this.state.newPWD)
    //         // global.newPWD = this.state.newPWD;
    //         // global.newPWDagain = this.state.newPWDagain;
    //         // global.phoneNum = this.state.phoneNum;
    //         // global.identifyCode = this.state.identifyCode;
    //         this.loginSecretCode(this.loginSecretCodeSuccessCallBack);
    //     }
    // }

    render() {
        const {navigator} = this.props;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'忘记密码'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                />

                <View
                    style={{
                        flexDirection: 'row', marginTop: 10,
                    }}
                >
                    <View style={styles.iconStyle}>
                        <Text style={styles.iconfont}> &#xe60f;</Text>
                    </View>

                    <View
                        style={{flex: 1}}
                    >
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            placeholder="新密码"
                            value={this.state.newPWD}
                            onChangeText={(newPWD) => {
                                this.setState({newPWD});
                            }}
                        />
                    </View>

                </View>

                <View
                    style={{height: 1, backgroundColor: '#F5F5F5'}}
                />

                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <View style={styles.iconStyle}>
                        <Text style={styles.iconfont}> &#xe60f;</Text>
                    </View>

                    <View style={{flex: 1}}>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            placeholder="确认新密码"
                            value={this.state.newPWDagain}
                            onChangeText={(newPWDagain) => {
                                this.setState({newPWDagain});
                            }}
                        />
                    </View>

                </View>


                <TouchableOpacity
                    onPress={() => {
                        this.finish();
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#008BCA',
                            borderRadius: 10,
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
                                color: 'white',
                            }}
                        >
                            提交
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
        // forgetChangeCode: state.app.get('forgetChangeCode'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // getForgetChangeCodeAction: (params, getForgetChangeCodeSucccessCallBack) =>
        //     dispatch(getForgetChangeCodeAction({
        //         url: API.API_NEW_CHANGE_PSD_WITH_CODE,
        //         body: {	// 调用接口时真正传递的参数是 body
        //             confirmPassword: params.confirmPassword,
        //             identifyCode: params.identifyCode,
        //             newPassword: params.newPassword,
        //             phoneNum: params.phoneNum,
        //         },
        //         successMsg: '密码更改成功',
        //         successCallBack: (response) => {
        //             getForgetChangeCodeSucccessCallBack(response.result);
        //             dispatch(gotForgetChangeCodeSuccAction(response));
        //         },
        //         failCallBack: (err) => {
        //
        //         },
        //     })),
        // loginSecretCode: (loginSecretCodeSuccessCallBack) => {
        //     dispatch(loginSecretCodeAction({
        //         url: API.API_NEW_GET_SEC_TOKEN,
        //         successCallBack: (response) => {
        //             loginSecretCodeSuccessCallBack(response.result);
        //             dispatch(loginSecretCodeSuccessAction(response));
        //         },
        //         failCallBack: (err) => {
        //             console.log(err);
        //         },
        //
        //     }));
        // },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(changeCodePWD);
