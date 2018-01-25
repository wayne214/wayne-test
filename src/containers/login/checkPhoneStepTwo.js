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
import {NavigationActions} from 'react-navigation';
import Toast from '@remobile/react-native-toast';
import {Geolocation} from 'react-native-baidu-map-xzx';
import JPushModule from 'jpush-react-native';

import NavigationBar from '../../common/navigationBar/navigationBar';
import CountDownButton from '../../common/timerButton';
import Loading from '../../utils/loading';
import HTTPRequest from '../../utils/httpRequest';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
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
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
    setOwnerNameAction,
    setCompanyCodeAction,
} from '../../action/user';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
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

class CheckPhoneStepTwo extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.state = {
            pwdCode: '',
            buttonForget: '获取验证码',
            loading: false,

        };
        this.nextStep = this.nextStep.bind(this);
        this.bindDevice = this.bindDevice.bind(this);
        this.requestVCodeForLogin = this.requestVCodeForLogin.bind(this);
        this.phoneNo = params.loginPhone;
        this.loginResponseData = params.responseData;
        this.clearPhoneCode = this.clearPhoneCode.bind(this);
        this.InquireAccountRole = this.InquireAccountRole.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        console.log('lqq-countDownButton--', this.refs.countDownButton);
        this.refs.countDownButton && this.refs.countDownButton.shouldStartCountting(true);
    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch(e => {
            console.log(e, 'error');
        });
    }

    /*绑定设备*/
    bindDevice() {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_BIND_DEVICE,
            params: {
                identifyCode: this.state.pwdCode,
                phoneNum: this.phoneNo,
                deviceId: global.UDID,
                platform: global.platform,
                loginSite: 1
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('绑定设备', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '绑定设备');
                if (responseData.result) {
                    const loginUserId = this.loginResponseData.result.userId;
                    Storage.save(StorageKey.USER_ID, loginUserId);
                    Storage.save(StorageKey.USER_INFO, this.loginResponseData.result);
                    Storage.save(StorageKey.CarSuccessFlag, '1'); // 设置车辆的Flag

                    // 发送Action,全局赋值用户信息
                    this.props.sendLoginSuccessAction(this.loginResponseData.result);

                    this.InquireAccountRole(responseData.result.phone);


                    if(this.loginResponseData.result.phone){
                        JPushModule.setAlias(this.loginResponseData.result.phone, () => {
                        }, () => {
                        });
                    }
                } else {
                    Toast.showShortCenter('输入的验证码不正确');
                }
            },
            error: (errorInfo) => {

            },
            finish: () => {
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
                console.log('===responseData', responseData);

                if (responseData.result.length == 0) {
                    this.props.navigation.navigate('CharacterList');
                    return
                }

                if (responseData.result.length == 1) {
                    if (responseData.result[0].owner == 1) {
                        // 车主
                        if (responseData.result[0].companyNature == '个人') {
                            // 确认个人车主
                            if (responseData.result[0].status != 10) {
                                responseData.result[0].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('11')
                                    : responseData.result[0].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('12') :
                                    this.props.setOwnerCharacterAction('13')
                                this.props.setCurrentCharacterAction('personalOwner');
                                this.props.setOwnerNameAction(responseData.result[0].name);
                            } else {
                                Toast.show('个人车主身份被禁用，请联系客服人员');
                                return
                            }
                        } else {
                            // 确认企业车主
                            if (responseData.result[0].status != 10) {
                                responseData.result[0].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('21')
                                    : responseData.result[0].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('22') :
                                    this.props.setOwnerCharacterAction('23')
                                this.props.setCurrentCharacterAction('businessOwner');
                                this.props.setOwnerNameAction(responseData.result[0].name);
                            } else {
                                Toast.show('企业车主身份被禁用，请联系客服人员');
                                return
                            }
                        }
                        // 保存承运商编码
                        this.props.setCompanyCodeAction(responseData.result[0].companyCode);
                    }

                    if (responseData.result[0].owner == 2) {
                        // 司机
                        if (responseData.result[0].status != 10) {
                            responseData.result[0].certificationStatus == '1201' ?
                                this.props.setDriverCharacterAction('1')
                                : responseData.result[0].certificationStatus == '1202' ?
                                this.props.setDriverCharacterAction('2') :
                                this.props.setDriverCharacterAction('3')
                            this.props.setCurrentCharacterAction('driver')
                        } else {
                            Toast.show('司机身份被禁用，请联系客服人员');
                            return
                        }
                    }
                }

                if (responseData.result.length == 2) {

                    if (responseData.result[0].owner == 1) {
                        // 保存承运商编码
                        // this.props.getCompanyCodeAction(responseData.result[0].companyCode);
                        // 先是车主
                        if (responseData.result[0].companyNature == '个人') {
                            // 确认个人车主
                            if (responseData.result[0].status != 10) {
                                responseData.result[0].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('11')
                                    : responseData.result[0].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('12') :
                                    this.props.setOwnerCharacterAction('13')
                            } else {
                                this.props.setOwnerCharacterAction('14')
                            }
                        } else {
                            // 确认企业车主
                            if (responseData.result[0].status != 10) {
                                responseData.result[0].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('21')
                                    : responseData.result[0].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('22') :
                                    this.props.setOwnerCharacterAction('23')
                            } else {
                                this.props.setOwnerCharacterAction('24')
                            }
                        }

                        // 后是司机
                        if (responseData.result[1].status != 10) {
                            responseData.result[1].certificationStatus == '1201' ?
                                this.props.setDriverCharacterAction('1')
                                : responseData.result[1].certificationStatus == '1202' ?
                                this.props.setDriverCharacterAction('2') :
                                this.props.setDriverCharacterAction('3')
                        } else {
                            this.props.setDriverCharacterAction('4')
                        }

                        if (responseData.result[0].status == 10 && responseData.result[1].status == 10) {
                            Toast.show('司机车主身份均被禁用，请联系客服人员')
                            return
                        }
                        if (responseData.result[0].status == 10) {
                            this.props.setCurrentCharacterAction('driver');
                        }

                        if (responseData.result[1].status == 10) {
                            if (responseData.result[0].companyNature == '个人') {
                                this.props.setCurrentCharacterAction('personalOwner');
                                this.props.setOwnerNameAction(responseData.result[0].name);
                            } else {
                                this.props.setCurrentCharacterAction('businessOwner');
                                this.props.setOwnerNameAction(responseData.result[0].name);
                            }
                        } else {
                            this.props.setCurrentCharacterAction('driver');
                            this.props.setOwnerNameAction(responseData.result[0].name);
                            this.props.setCompanyCodeAction(responseData.result[0].companyCode);
                        }
                    }

                    if (responseData.result[0].owner == 2) {
                        // 先是司机
                        if (responseData.result[0].status != 10) {
                            responseData.result[0].certificationStatus == '1201' ?
                                this.props.setDriverCharacterAction('1')
                                : responseData.result[0].certificationStatus == '1202' ?
                                this.props.setDriverCharacterAction('2') :
                                this.props.setDriverCharacterAction('3')
                        } else {
                            this.props.setDriverCharacterAction('4')
                        }

                        // 后是车主
                        if (responseData.result[1].companyNature == '个人') {

                            // 确认个人车主
                            if (responseData.result[1].status != 10) {
                                responseData.result[1].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('11')
                                    : responseData.result[1].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('12') :
                                    this.props.setOwnerCharacterAction('13')
                            } else {
                                this.props.setOwnerCharacterAction('14')
                            }
                        } else {

                            // 确认企业车主
                            if (responseData.result[1].status != 10) {
                                responseData.result[1].certificationStatus == '1201' ?
                                    this.props.setOwnerCharacterAction('21')
                                    : responseData.result[1].certificationStatus == '1202' ?
                                    this.props.setOwnerCharacterAction('22') :
                                    this.props.setOwnerCharacterAction('23')
                            } else {
                                this.props.setOwnerCharacterAction('24')
                            }
                        }


                        if (responseData.result[0].status == 10 && responseData.result[1].status == 10) {
                            Toast.show('司机车主身份均被禁用，请联系客服人员')
                            return
                        }
                        if (responseData.result[1].status == 10) {
                            this.props.setCurrentCharacterAction('driver');
                        }

                        if (responseData.result[0].status == 10) {
                            if (responseData.result[0].companyNature == '个人') {
                                this.props.setOwnerNameAction(responseData.result[1].name);
                                this.props.setCurrentCharacterAction('personalOwner');
                            } else {
                                this.props.setOwnerNameAction(responseData.result[1].name);
                                this.props.setCurrentCharacterAction('businessOwner');
                            }
                        } else {
                            this.props.setCurrentCharacterAction('driver');
                            this.props.setOwnerNameAction(responseData.result[1].name);
                            this.props.setCompanyCodeAction(responseData.result[1].companyCode);
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
                if (phone) {
                    JPushModule.setAlias(phone, () => {
                    }, () => {
                    });
                }
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

    // 下一步按钮
    nextStep() {
        if (this.phoneNo && this.state.pwdCode) {
            this.bindDevice();
        } else {
            Toast.showShortCenter('账号或验证码不能为空');
        }
    }

    /*获取登录验证码*/
    requestVCodeForLogin(shouldStartCountting) {
        HTTPRequest({
            url: API.API_GET_LOGIN_WITH_CODE,
            params: {
                deviceId: global.UDID + '-1',
                phoneNum: this.phoneNo,
            },
            loading: () => {

            },
            success: (responseData) => {
                /*开启倒计时*/
                shouldStartCountting(true);
                Toast.showShortCenter('验证码已发送');

            },
            error: (errorInfo) => {
                /*关闭倒计时*/
                shouldStartCountting(false);

            },
            finish: () => {

            }
        })
    }

    clearPhoneCode() {
        if (this.state.pwdCode.length > 0) {
            this.setState({
                pwdCode: '',
            });
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
                    {false && <View style={styles.iconStyle}>
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
                                    <TouchableOpacity onPress={() => {
                                        this.clearPhoneCode()
                                    }}>
                                        <View style={styles.iconStyle}>
                                            <Image source={StaticImage.clearIcon}/>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                        })()
                    }
                    {false && <View style={{width: 1, backgroundColor: COLOR_VIEW_BACKGROUND}}/>}
                    <CountDownButton
                        ref='countDownButton'
                        enable={this.phoneNo.length}
                        style={{width: 100, backgroundColor: WHITE_COLOR, paddingRight: 15}}
                        textStyle={{color: '#0078ff'}}
                        timerCount={60}
                        onClick={(shouldStartCountting) => {
                            if (Validator.isPhoneNumber(this.phoneNo)) {
                                this.requestVCodeForLogin(shouldStartCountting);
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
                            justifyContent: 'center'
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
                            提交
                        </Text>

                    </Image>
                </TouchableOpacity>

                {
                    this.state.loading ? <Loading/> : null
                }
            </View>


        );
    }
}

function mapStateToProps(state) {
    return {
        driverStatus: state.user.get('driverStatus'),
        ownerStatus: state.user.get('ownerStatus'),
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
        setOwnerNameAction:(data)=>{
            dispatch(setOwnerNameAction(data));
        },
        setCompanyCodeAction: (result) => {
            dispatch(setCompanyCodeAction(result));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckPhoneStepTwo);
