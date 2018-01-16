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
    Keyboard,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native';

import Button from 'apsl-react-native-button';
import Toast from '@remobile/react-native-toast';
import JPushModule from 'jpush-react-native';
import {Geolocation} from 'react-native-baidu-map-xzx';
import { NavigationActions } from 'react-navigation';
import BaseContainer from '../base/baseContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

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
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
} from '../../action/user';
import PermissionsAndroid from '../../utils/permissionManagerAndroid';

const {width, height} = Dimensions.get('window');

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentView: {
        justifyContent: 'space-between',
        width,
        marginTop: 20,
    },
    leftText: {
        width: 80,
        paddingLeft: 15,
        justifyContent: 'center',
    },
    leftTextString: {
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 16,
        alignItems: 'center',
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
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        alignItems: 'center',
        paddingRight: 15,
    },
    phoneNumView: {
        marginLeft: 10,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInputStyle: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        alignItems: 'center',
        paddingRight: 15,
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
    loginBackground: {
        width: width - 20,
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 0,
        height: 44,
        resizeMode: 'stretch',
        alignItems: 'center',
        justifyContent:'center'
    },
    loginButton: {
        backgroundColor: '#00000000',
        width: width - 20,
        marginBottom: 0,
        height: 44,
        borderWidth: 0,
        borderColor: '#00000000',
    },
    // loginButton: {
    //     marginLeft: 10,
    //     marginTop: 15,
    //     marginRight: 10,
    //     borderWidth: 0,
    //     height: 44,
    //     backgroundColor: '#0083ff',
    //     borderRadius: 5,
    // },
    clearButton: {
        width: 15,
        height: 15,
        marginRight: 15,
        marginLeft: 10,
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
        alignItems: 'center',

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


class LoginSms extends BaseContainer {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            phoneNumber: params ? params.loginPhone : '',
            smsCode: '',
            loading: false,
        };
        this.clearPhoneNum = this.clearPhoneNum.bind(this);
        this.clearSmsCodeNum = this.clearSmsCodeNum.bind(this);
        this.login = this.login.bind(this);
        this.requestVCodeForLogin = this.requestVCodeForLogin.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this.InquireAccountRole = this.InquireAccountRole.bind(this);
    }

    componentWillMount () {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidHide(){
        this.refs.phoneNumber && this.refs.phoneNumber.blur();
        this.refs.smsCode && this.refs.smsCode.blur();
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

                //FIXME 登录界面判断是否已经绑定
                const isBind = responseData.result.isBind;
                console.log('-lqq---isBind',isBind);
                if(isBind){//继续登录操作
                    lastTime = new Date().getTime();
                    // ReadAndWriteFileUtil.appendFile('通过验证码登录接口', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    //     locationData.district, lastTime - currentTime, '短信登录页面');
                    const loginUserId = responseData.result.userId;
                    Storage.save(StorageKey.USER_ID, loginUserId);
                    Storage.save(StorageKey.USER_INFO, responseData.result);
                    Storage.save(StorageKey.CarSuccessFlag, '1'); // 设置车辆的Flag

                    // 发送Action,全局赋值用户信息
                    this.props.sendLoginSuccessAction(responseData.result);

                    this.InquireAccountRole(responseData.result.phone;
                    // const resetAction = NavigationActions.reset({
                    //     index: 0,
                    //     actions: [
                    //         NavigationActions.navigate({ routeName: 'Main'}),
                    //     ]
                    // });
                    // this.props.navigation.dispatch(resetAction);

                }else{//跳转到绑定设备界面
                    this.props.navigation.navigate('CheckPhone', {
                        loginPhone: responseData.result.phone,
                        responseData: responseData,
                        sourcePage: 1,
                    });
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

    /*查询账户角色*/
    InquireAccountRole(phone) {
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
                        // 车主
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
                        this.props.setCompanyCodeAction(responseData.result[0].companyCode);
                    }

                    if (responseData.result[0].owner == 2) {
                        // 司机
                        responseData.result[0].certificationStatus == '1201' ?
                            this.props.setDriverCharacterAction('1')
                            : responseData.result[0].certificationStatus == '1202' ?
                            this.props.setDriverCharacterAction('2') :
                            this.props.setDriverCharacterAction('3')
                        this.props.setCurrentCharacterAction('driver')
                    }
                }

                if (responseData.result.length == 2) {

                    if (responseData.result[0].owner == 1) {
                        // 先是车主
                        if (responseData.result[0].companyNature == '个人') {
                            // 确认个人车主
                            responseData.result[0].certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('11')
                                : responseData.result[0].certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('12') :
                                this.props.setOwnerCharacterAction('13')
                        } else {
                            // 确认企业车主
                            responseData.result[0].certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('21')
                                : responseData.result[0].certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('22') :
                                this.props.setOwnerCharacterAction('23')
                        }

                        // 后是司机
                        responseData.result[1].certificationStatus == '1201' ?
                            this.props.setDriverCharacterAction('1')
                            : responseData.result[1].certificationStatus == '1202' ?
                            this.props.setDriverCharacterAction('2') :
                            this.props.setDriverCharacterAction('3')

                        this.props.setCurrentCharacterAction('driver')
                        this.props.setCompanyCodeAction(responseData.result[0].companyCode);
                    }

                    if (responseData.result[0].owner == 2) {
                        // 先是司机
                        responseData.result[0].certificationStatus == '1201' ?
                            this.props.setDriverCharacterAction('1')
                            : responseData.result[0].certificationStatus == '1202' ?
                            this.props.setDriverCharacterAction('2') :
                            this.props.setDriverCharacterAction('3')

                        // 后是车主
                        if (responseData.result[1].companyNature == '个人') {
                            // 确认个人车主
                            responseData.result[1].certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('11')
                                : responseData.result[1].certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('12') :
                                this.props.setOwnerCharacterAction('13')
                        } else {
                            // 确认企业车主
                            responseData.result[1].certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('21')
                                : responseData.result[1].certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('22') :
                                this.props.setOwnerCharacterAction('23')
                        }
                        this.props.setCurrentCharacterAction('driver')
                        this.props.setCompanyCodeAction(responseData.result[1].companyCode);
                    }
                }

                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'Main'}),
                    ]
                });
                this.props.navigation.dispatch(resetAction);

                JPushModule.setAlias(phone, ()=>{}, ()=>{});

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
        // console.log('lqq-render--smsCode--',smsCode);
        return (
            <View style={styles.container}>
               { false &&
                    <NavigationBar
                        title={'登录'}
                        navigator={navigator}
                        leftButtonHidden={false}/>
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
                            <View style={styles.leftText}>
                                <Text style={styles.leftTextString}>
                                    手机号
                                </Text>
                            </View>
                            <TextInput
                                ref='phoneNumber'
                                underlineColorAndroid={'transparent'}
                                style={styles.textInputStyle}
                                value={phoneNumber}
                                onChangeText={(phoneNumber) => {
                                    this.setState({phoneNumber});
                                }}
                                keyboardType="numeric"
                                placeholder="请输入手机号"
                                placeholderTextColor="#cccccc"
                                textAlign="left"/>
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
                        <View style={styles.cellContainer}>
                            <View style={styles.leftText}>
                                <Text style={styles.leftTextString}>
                                    验证码
                                </Text>
                            </View>
                            <TextInput
                                ref='smsCode'
                                underlineColorAndroid={'transparent'}
                                style={styles.textInputStyle}
                                value={this.state.smsCode}
                                onChangeText={(smsCode) => {
                                    this.setState({smsCode});
                                }}
                                placeholder="请输入验证码"
                                keyboardType="numeric"
                                placeholderTextColor="#cccccc"
                                textAlign="left"
                                returnKeyType='done'/>
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

                            <CountDownButton
                                enable={phoneNumber.length}
                                style={{width: 100}}
                                textStyle={{color: '#0078ff'}}
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
                        <Image style={styles.loginBackground} source ={StaticImage.BlueButtonArc}>
                            <Button
                                isDisabled={!(phoneNumber && smsCode)}
                                style={styles.loginButton}
                                textStyle={{color: 'white', fontSize: 18}}
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
                        </Image>
                        <View style={styles.bottomView}>
                            <Text
                                onPress={() => {
                                    this.props.navigation.navigate('Login', {
                                        loginPhone: this.state.phoneNumber
                                    });

                                }}
                                style={styles.bottomViewText}
                            >
                                账号密码登录
                            </Text>
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
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        driverStatus:state.user.get('driverStatus'),
        ownerStatus:state.user.get('ownerStatus'),
    };

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

export default connect(mapStateToProps, mapDispatchToProps)(LoginSms);
