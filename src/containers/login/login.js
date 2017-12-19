/**
 * 登录界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

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
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import Toast from '@remobile/react-native-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import BaseContainer from '../base/baseContainer';
import Button from 'apsl-react-native-button';
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
} from '../../action/user';

import * as StaticColor from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';
import * as API from '../../constants/api';

import HTTPRequest from '../../utils/httpRequest';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import XeEncrypt from '../../utils/XeEncrypt';
import Validator from '../../utils/validator';
import Loading from '../../utils/loading';
import {Geolocation} from 'react-native-baidu-map-xzx';
import JPushModule from 'jpush-react-native';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import PermissionsAndroid from '../../utils/permissionManagerAndroid';

let currentTime = 0;
let lastTime = 0;
let locationData = '';
const dismissKeyboard = require('dismissKeyboard');
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backgroundImageView: {
        position: 'absolute',
    },
    contentView: {
        justifyContent: 'space-between',
        width,
        marginTop: 20,
    },
    cellContainer: {
        flex: 1,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    textLeft: {
        width: 80,
        fontSize: 16,
        color: '#333333',
        alignItems: 'center',
        paddingLeft: 15,

    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        alignItems: 'center',
        paddingRight: 15,
    },
    lineUnderInput: {
        height: 2,
        backgroundColor: '#e8e8e8',
        marginLeft: 10,
        marginRight: 10,
    },
    lineUnder: {
        width: 1,
        height: 14,
        backgroundColor: '#666666',
        marginLeft: 10,
        marginRight: 10,
    },
    loginBackground: {
        width: width - 20,
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 0,
        height: 44,
        resizeMode: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        backgroundColor: '#00000000',
        width: width - 20,
        marginBottom: 0,
        height: 44,
        borderWidth: 0,
        borderColor: '#00000000',
    },
    loginButtonText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center'
    },
    bottomView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        marginTop: 20,
    },
    bottomViewText: {
        fontSize: 15,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
    },
    screenEndView: {
        position: 'absolute',
        // flex: 1,
        width,
        flexDirection: 'row',
        justifyContent: 'center',
        // alignItems: 'flex-end',
        height: 40,
        top: height - 60,
        left: 0,
        // marginBottom: 20
    },
    screenEndViewTextLeft: {
        fontSize: 15,
        color: StaticColor.GRAY_TEXT_COLOR,
    },
    screenEndViewText: {
        fontSize: 15,
        color: StaticColor.BLUE_CONTACT_COLOR,
    },
});

class Login extends BaseContainer {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            phoneNumber: params ? params.loginPhone : '',
            password: '',
            loading: false,
        };
        this.loginSecretCode = this.loginSecretCode.bind(this);
        this.login = this.login.bind(this);
        this.InquireAccountRole = this.InquireAccountRole.bind(this);
        this.getCurrentPosition = this.getCurrentPosition.bind(this);

        this.success = this.success.bind(this);
        this.fail = this.fail.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);

    }

    componentWillMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidHide() {
        this.refs.phoneNumber && this.refs.phoneNumber.blur();
        this.refs.password && this.refs.password.blur();
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            // this.getCurrentPosition();
        } else {
            PermissionsAndroid.locationPermission().then((data) => {
                this.getCurrentPosition();
            }, (err) => {
                Alert.alert('提示', '请到设置-应用-授权管理设置定位权限');
            });
        }
    }

    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position..........', JSON.stringify(data));
            locationData = data;
        }).catch(e => {
            console.log(e, 'error');
        });
    }

    /*获取加密秘钥*/
    loginSecretCode() {
        HTTPRequest({
            url: API.API_GET_SEC_TOKEN,
            params: {},
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (responseData) => {
                const secretCode = responseData.result;
                const secretPassWord = XeEncrypt.aesEncrypt(this.state.password, secretCode, secretCode);
                console.log('----log--', secretPassWord);
                this.login(secretPassWord);
            },
            error: (errorInfo) => {
                this.setState({
                    loading: false,
                });
            },
            finish: () => {

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
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (responseData) => {
                this.setState({
                    loading: false,
                }, () => {
                    console.log('lqq---responseData---', responseData);

                    let isBind = responseData.result.isBind;
                    console.log('-lqq---isBind', isBind);
                    // TODO 暂时关掉登录验证
                    isBind = true;
                    if (isBind) {//继续登录操作
                        lastTime = new Date().getTime();

                        // ReadAndWriteFileUtil.writeFile('通过密码登录', locationData.city, locationData.latitude, locationData.longitude, responseData.result.phone, locationData.province,
                        //     locationData.district, lastTime - currentTime, responseData.result.userId, responseData.result.userName, '登录页面');

                        const loginUserId = responseData.result.userId;
                        Storage.save(StorageKey.USER_ID, loginUserId);
                        Storage.save(StorageKey.USER_INFO, responseData.result);
                        Storage.save(StorageKey.CarSuccessFlag, '1'); // 设置车辆的Flag

                        // 发送Action,全局赋值用户信息
                        this.props.sendLoginSuccessAction(responseData.result);

                        // const resetAction = NavigationActions.reset({
                        //     index: 0,
                        //     actions: [
                        //         NavigationActions.navigate({routeName: 'Main'}),
                        //         // NavigationActions.navigate({routeName: 'CharacterList'}),
                        //     ]
                        // });
                        // this.props.navigation.dispatch(resetAction);

                        // JPushModule.setAlias(responseData.result.phone, this.success, this.fail);
                        this.InquireAccountRole();
                    } else {
                        //跳转到绑定设备界面
                        this.props.navigation.navigate('CheckPhone', {
                            loginPhone: responseData.result.phone,
                            responseData: responseData,
                            sourcePage: -1,
                        });
                    }
                });

            },
            error: (errorInfo) => {
                this.setState({
                    loading: false,
                });
            },
            finish: () => {
                this.setState({
                    loading: false,
                });
            }
        });

    }

    /*查询账户角色*/
    InquireAccountRole() {
        HTTPRequest({
            url: API.API_INQUIRE_ACCOUNT_ROLE + global.phone,
            params: {},
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (responseData) => {

                if (responseData.result.length == 0) {
                    this.props.navigation.navigate('CharacterList');
                    return
                }

                if (responseData.result.length == 1) {
                    if (responseData.result[0].owner == 1) {
                        // 先是车主
                        if (responseData.result[0].isApp == 1) {
                            if (responseData.result[0].companyNature == '个人') {
                                // 确认个人车主
                                responseData.result[0].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('11')
                                    : responseData.result[0].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('12') :
                                    this.props.setOwnerCharacterAction('13')
                                this.props.setCurrentCharacterAction('personalOwner')
                            } else {
                                // 确认企业车主
                                responseData.result[0].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('21')
                                    : responseData.result[0].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('22') :
                                    this.props.setOwnerCharacterAction('23')
                                this.props.setCurrentCharacterAction('businessOwner')
                            }
                        }
                    }

                    if (responseData.result[0].owner == 2) {
                        // 先是司机
                        if (responseData.result[0].isApp == 1) {
                            responseData.result[0].certificationStatus == '1201' ?
                                this.props.setDriverCharacterAction('1')
                                : responseData.result[0].certificationStatus == '1202' ?
                                this.props.setDriverCharacterAction('2') :
                                this.props.setDriverCharacterAction('3')
                            this.props.setCurrentCharacterAction('driver')
                        }

                    }
                }

                if (responseData.result.length == 2) {

                    if (responseData.result[0].owner == 1) {
                        // 先是车主
                        if (responseData.result[0].isApp == 1) {
                            if (responseData.result[0].companyNature == '个人') {
                                // 确认个人车主
                                responseData.result[0].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('11')
                                    : responseData.result[0].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('12') :
                                    this.props.setOwnerCharacterAction('13')
                                this.props.setCurrentCharacterAction('personalOwner')
                            } else {
                                // 确认企业车主
                                responseData.result[0].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('21')
                                    : responseData.result[0].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('22') :
                                    this.props.setOwnerCharacterAction('23')
                                this.props.setCurrentCharacterAction('businessOwner')
                            }
                        }
                        // 后是司机
                        if (responseData.result[1].isApp == 1) {
                            responseData.result[1].certificationStatus == '1201' ?
                                this.props.setDriverCharacterAction('1')
                                : responseData.result[1].certificationStatus == '1202' ?
                                this.props.setDriverCharacterAction('2') :
                                this.props.setDriverCharacterAction('3')
                            this.props.setCurrentCharacterAction('driver')
                        }
                    }

                    if (responseData.result[0].owner == 2) {
                        // 先是司机
                        if (responseData.result[0].isApp == 1) {
                            responseData.result[0].certificationStatus == '1201' ?
                                this.props.setDriverCharacterAction('1')
                                : responseData.result[0].certificationStatus == '1202' ?
                                this.props.setDriverCharacterAction('2') :
                                this.props.setDriverCharacterAction('3')
                            this.props.setCurrentCharacterAction('driver')
                        }
                        // 后是车主
                        if (responseData.result[1].isApp == 1) {
                            if (responseData.result[1].companyNature == '个人') {
                                // 确认个人车主
                                responseData.result[1].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('11')
                                    : responseData.result[1].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('12') :
                                    this.props.setOwnerCharacterAction('13')
                                this.props.setCurrentCharacterAction('personalOwner')
                            } else {
                                // 确认企业车主
                                responseData.result[1].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('21')
                                    : responseData.result[1].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('22') :
                                    this.props.setOwnerCharacterAction('23')
                                this.props.setCurrentCharacterAction('businessOwner')
                            }
                        }
                    }

                }

                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'Main'}),
                    ]
                });
                this.props.navigation.dispatch(resetAction);

                JPushModule.setAlias(responseData.result.phone, this.success, this.fail);

            },
            error: (errorInfo) => {
                this.setState({
                    loading: false,
                });
            },
            finish: () => {

            }
        });
    }

    fail = () => {
    };

    success = () => {
        NativeAppEventEmitter.addListener('ReceiveNotification', (message) => {
        });
    };

    render() {
        const {phoneNumber, password} = this.state;
        return (
            <View style={styles.container}>
                {false &&
                <View style={styles.backgroundImageView}>
                    <Image
                        source={StaticImage.LoginBackground}
                        style={{width, height}}
                    />
                </View>
                }
                <KeyboardAwareScrollView style={{width: width, height: height}}>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            source={StaticImage.LoginTopBg}
                            resizeMode={'stretch'}
                            style={{width: width, height: width * 224 / 375}}
                        />

                    </View>

                    <View style={styles.contentView}>
                        <View style={styles.cellContainer}>
                            <Text style={styles.textLeft}>账号</Text>
                            <TextInput
                                ref='phoneNumber'
                                underlineColorAndroid={'transparent'}
                                placeholder="请输入手机号"
                                placeholderTextColor="#cccccc"
                                textAlign="left"
                                keyboardType="numeric"
                                style={styles.textInput}
                                onChangeText={(phoneNumber) => {
                                    this.setState({phoneNumber});
                                }}
                                value={phoneNumber}/>
                        </View>

                        <View style={styles.cellContainer}>
                            <Text style={styles.textLeft}>密码</Text>
                            <TextInput
                                ref='password'
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                placeholder="密码"
                                placeholderTextColor="#cccccc"
                                textAlign="left"
                                returnKeyLabel={'done'}
                                returnKeyType={'done'}
                                style={styles.textInput}
                                onChangeText={(password) => {
                                    this.setState({password});
                                }}
                                value={password}/>
                        </View>

                        <Image style={styles.loginBackground} source={StaticImage.BlueButtonArc}>
                            <Button
                                ref='button'
                                isDisabled={!(phoneNumber && password)}
                                style={styles.loginButton}
                                textStyle={{color: 'white', fontSize: 18}}
                                onPress={() => {
                                    // dismissKeyboard();
                                    if (Validator.isPhoneNumber(phoneNumber)) {
                                        this.loginSecretCode();
                                    } else {
                                        Toast.showShortCenter('手机号码输入有误，请重新输入');
                                    }
                                }}
                            >
                                登录
                            </Button>
                        </Image>
                        <View style={styles.bottomView}>
                            <View>
                                <Text
                                    onPress={() => {
                                        this.props.navigation.navigate('LoginSms', {
                                            loginPhone: this.state.phoneNumber
                                        });

                                    }}
                                    style={styles.bottomViewText}
                                >
                                    手机快捷登录
                                </Text>
                            </View>
                            <View style={styles.lineUnder}/>
                            <View>
                                <Text
                                    onPress={() => {
                                        this.props.navigation.navigate('ForgetPwd', {
                                            loginPhone: this.state.phoneNumber
                                        });

                                    }}
                                    style={styles.bottomViewText}
                                >
                                    忘记密码
                                </Text>
                            </View>
                        </View>
                    </View>


                </KeyboardAwareScrollView>
                <View style={styles.screenEndView}>
                    <Text style={styles.screenEndViewTextLeft}>没有鲜易通账号？</Text>
                    <Text
                        style={styles.screenEndViewText}
                        onPress={() => {
                            this.props.navigation.navigate('RegisterStepOne');
                        }}
                    >
                        去注册
                    </Text>
                </View>
                {
                    this.state.loading ? <Loading/> : null
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
        setDriverCharacterAction: (result) => {
            dispatch(setDriverCharacterAction(result));
        },
        setOwnerCharacterAction: (result) => {
            dispatch(setOwnerCharacterAction(result));
        },
        setCurrentCharacterAction: (result) => {
            dispatch(setCurrentCharacterAction(result));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
