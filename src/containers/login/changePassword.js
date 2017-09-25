/**
 * Created by xizhixin on 2017/3/22.
 * 修改密码界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
// import JPushModule from 'jpush-react-native';
// import {Geolocation} from 'react-native-baidu-map-xzx';
import Toast from '@remobile/react-native-toast';

import NavigationBar from '../../common/navigationBar/navigationBar';

// import * as API from '../../constants/api';
import * as StaticColor from '../../constants/staticColor';

// import XeEncrypt from '../../utils/XeEncrypt';
import Storage from '../../utils/storage';
import Validator from '../../utils/validator';
import ClickUtil from '../../utils/prventMultiClickUtil';
// import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    container1: {
        flex: 1,
        paddingTop: 10,
    },
    container2: {
        backgroundColor: StaticColor.WHITE_COLOR,
        paddingLeft: 20,
        paddingRight: 20,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
    },
    textInput: {
        fontSize: 16,
        width: 100,
        height: 40,
        flex: 2,
    },

    line: {
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
        height: 1,
    },
    button: {
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#008dcf',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 40,
    },
    buttonText: {
        fontSize: 18,
        color: StaticColor.WHITE_COLOR,
        fontWeight: '300',
    },
    tipText: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
    },
});
class changePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmNewPwd: '',
            userId: '',
        };
        this.modifyPwdSuccCallback = this.modifyPwdSuccCallback.bind(this);
        this.press = this.press.bind(this);
        this.loginSecretCode = this.loginSecretCode.bind(this);
        this.loginSecretCodeSuccessCallBack = this.loginSecretCodeSuccessCallBack.bind(this);


        this.success = this.success.bind(this);
        this.fail = this.fail.bind(this);


        Storage.get('userId').then((value) => {
            console.log('value', value);
            this.setState({
                userId: value,
            });
            console.log('value', this.state.userId);
        });
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
    //     const oldPwd = this.state.oldPassword;
    //     const newPwd = this.state.newPassword;
    //     const confNd = this.state.confirmNewPwd;
    //     if (oldPwd === '') {
    //         Toast.showShortCenter('原密码不能为空');
    //         return;
    //     }
    //     if (newPwd === '') {
    //         Toast.showShortCenter('新密码不能为空');
    //         return;
    //     }
    //     if (newPwd === oldPwd) {
    //         Toast.showShortCenter('原密码和新密码不能相同');
    //     } else if (newPwd !== confNd) {
    //         Toast.showShortCenter('新密码两次输入不一致，请重新输入');
    //     } else {
    //         currentTime = new Date().getTime();
    //         this.props.loginSecretCode(loginSecretCodeSuccessCallBack);
    //     }
    // }

    // loginSecretCodeSuccessCallBack(result) {
    //     lastTime = new Date().getTime();
    //     ReadAndWriteFileUtil.appendFile('获取登录密钥', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
    //         locationData.district, lastTime - currentTime, '修改密码页面');
    //     console.log('1234567', result);
    //     const secretCode = result;
    //     const secretOldPWD = XeEncrypt.aesEncrypt(this.state.oldPassword, secretCode, secretCode);
    //     const secretNewPWD = XeEncrypt.aesEncrypt(this.state.newPassword, secretCode, secretCode);
    //     console.log('----changeCodePWD--', secretOldPWD, secretNewPWD);
    //     // this.getForgetChangeCodeAction(secretnewPWD, this.getForgetChangeCodeSucccessCallBack);
    //     this.press(this.modifyPwdSuccCallback, secretOldPWD, secretNewPWD, this.state.userId);
    // }
    //
    // press(modifyPasswordSuccCallBack, secretOldPWD, secretNewPWD, userid) {
    //     currentTime = new Date().getTime();
    //     this.props.changPasswordAction({
    //         confirmPassword: secretNewPWD,
    //         newPassword: secretNewPWD,
    //         oldPassword: secretOldPWD,
    //         userId: userid,
    //     }, modifyPasswordSuccCallBack);
    // }
    // fail = () => {
    // };
    //
    // success = () => {
    //     NativeAppEventEmitter.addListener('ReceiveNotification', (message) => {
    //     });
    // };
    // modifyPwdSuccCallback(result) {
    //     lastTime = new Date().getTime();
    //     ReadAndWriteFileUtil.appendFile('获取登录密钥', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
    //         locationData.district, lastTime - currentTime, '修改密码页面');
    //     if (result) {
    //         Toast.showShortCenter('恭喜，密码修改成功');
    //         Storage.remove('userInfo');
    //         Storage.remove('setCarSuccessFlag');
    //         Storage.remove('plateNumber');
    //         JPushModule.setAlias('', this.success, this.fail);
    //         this.props.navigator.resetTo({
    //             component: LoginContainer,
    //             name: RouteType.LOGIN_PAGE,
    //             key: RouteType.LOGIN_PAGE,
    //         });
    //     }
    // }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'修改密码'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <View style={styles.container1}>
                    <View style={styles.container2}>
                        <TextInput
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            placeholder="原密码"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            value={this.state.oldPassword}
                            onChangeText={(oldPassword) => {
                                this.setState({oldPassword});
                            }}
                        />
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.container2}>
                        <TextInput
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            placeholder="新密码"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            value={this.state.newPassword}
                            onChangeText={(newPassword) => {
                                this.setState({newPassword});
                            }}
                        />
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.container2}>
                        <TextInput
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            placeholder="确认新密码"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            value={this.state.confirmNewPwd}
                            onChangeText={(confirmNewPwd) => {
                                this.setState({confirmNewPwd});
                            }}
                        />
                    </View>
                    <View style={styles.tipText}>
                        <Text style={{fontSize: 15, color: StaticColor.GRAY_TEXT_COLOR}}>密码由6-14位英文字母或数字组成</Text>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                ClickUtil.resetLastTime();
                                if (ClickUtil.onMultiClick()) {
                                    if (Validator.isNewPassword(this.state.newPassword)) {
                                        if (Validator.isNewPassword(this.state.confirmNewPwd)) {
                                            {/*this.loginSecretCode(this.loginSecretCodeSuccessCallBack)*/}
                                        } else {
                                            Toast.showShortCenter('新密码不可包含特殊字符,总长度应为6至14位,需包含英文和数字');
                                        }
                                    } else {
                                        Toast.showShortCenter('新密码不可包含特殊字符,总长度应为6至14位,需包含英文和数字');
                                    }
                                }
                            }}
                        >
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>完成</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        // app: state.app,
        // userInfo: state.user.get('userInfo'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // changPasswordAction: (params, modifyPasswordSuccCallBack) => {
        //     dispatch(changPasswordAction({
        //         url: API.API_NEW_CHANGE_PSD_WITH_OLD_PSD,
        //         body: {
        //             confirmPassword: params.confirmPassword,
        //             newPassword: params.newPassword,
        //             oldPassword: params.oldPassword,
        //             userId: params.userId,
        //         },
        //         successCallBack: (response) => {
        //             modifyPasswordSuccCallBack(response.result);
        //             dispatch(changePwdSucc(response));
        //         },
        //         failCallBack: () => {
        //             // Toast.showShortCenter('网络异常');
        //         },
        //         ...params,
        //     }));
        // },
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

export default connect(mapStateToProps, mapDispatchToProps)(changePassword);
