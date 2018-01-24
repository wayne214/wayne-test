/**
 * 手机号码验证第一步
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

import {
    WHITE_COLOR,
    COLOR_VIEW_BACKGROUND,
} from '../../constants/staticColor';
import * as API from '../../constants/api';

import Validator from '../../utils/validator';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import StaticImage from '../../constants/staticImage';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';

const {width, height} = Dimensions.get('window');
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
    setCompanyCodeAction,
    setOwnerNameAction,
} from '../../action/user';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_VIEW_BACKGROUND,
    },

});

class CheckPhone extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.state = {
            loading: false,

        };
        this.phoneNo = this.props.navigation.state.params.loginPhone;
        this.sourcePage = this.props.navigation.state.params.sourcePage;
        this.loginData = params.responseData;
        this.nextStep = this.nextStep.bind(this);
        this.requestVCodeForLogin = this.requestVCodeForLogin.bind(this);
        this.bindDevice = this.bindDevice.bind(this);
        this.InquireAccountRole = this.InquireAccountRole.bind(this);
        console.log('lqq---this.phoneNo ---', this.phoneNo);
    }

    componentDidMount() {

        this.getCurrentPosition();
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


    // 下一步按钮
    nextStep() {
        if (this.phoneNo) {
            console.log('lqq--sourcePage---', this.sourcePage);
            if (this.sourcePage === 1) {//手机号、验证码登录界面
                //绑定设备
                this.bindDevice();
            } else if (this.sourcePage === -1) {//账号密码登录界面
                //验证手机号
                this.requestVCodeForLogin();
            }
        } else {
            Toast.showShortCenter('手机号不能为空');
        }
    }

    /*绑定设备*/
    bindDevice() {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_BIND_DEVICE,
            params: {
                phoneNum: this.phoneNo,
                deviceId: global.UDID,
                platform: global.platform,
                loginSite: 2
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
                    const loginUserId = this.loginData.result.userId;
                    Storage.save(StorageKey.USER_ID, loginUserId);
                    Storage.save(StorageKey.USER_INFO, this.loginData.result);
                    Storage.save(StorageKey.CarSuccessFlag, '1'); // 设置车辆的Flag

                    // 发送Action,全局赋值用户信息
                    this.props.sendLoginSuccessAction(this.loginData.result);

                    this.InquireAccountRole(this.phoneNo);
                    if (this.loginData.result.phone) {
                        JPushModule.setAlias(this.loginData.result.phone, () => {
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

    /*获取登录验证码*/
    requestVCodeForLogin() {
        HTTPRequest({
            url: API.API_GET_LOGIN_WITH_CODE,
            params: {
                deviceId: global.UDID + '-1',
                phoneNum: this.phoneNo,
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (responseData) => {
                // Toast.showShortCenter('验证码已发送');
                //验证手机号
                this.props.navigation.navigate('CheckPhoneStepTwo', {
                    loginPhone: this.phoneNo,
                    responseData: this.loginData
                });

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

    render() {
        const navigator = this.props.navigation;
        let text = null;
        if (this.sourcePage === 1) {//手机号、验证码登录界面
            text = (<Text
                style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: WHITE_COLOR,
                    backgroundColor: '#00000000'
                }}
            >
                立即绑定
            </Text> );
        } else if (this.sourcePage === -1) {//账号密码登录界面
            text = (<Text
                style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: WHITE_COLOR,
                    backgroundColor: '#00000000'
                }}
            >
                立即验证
            </Text> );
        }
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'手机号码验证'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                />

                <View
                    style={{
                        marginTop: 10,
                    }}
                >
                    <View style={{marginTop: 80, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={StaticImage.CheckPhoneLogo}/>
                    </View>
                    <View style={{
                        marginTop: 15,
                        marginLeft: 30,
                        marginRight: 30,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: 18,
                            color: '#666666',
                            textAlign: 'center'
                        }}>由于您在新设备上登录，需要验证您的手机号({Validator.newPhone(this.phoneNo)})</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.nextStep()}>
                    <Image
                        style={{
                            marginTop: 70,
                            width: width - 20,
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
                        {text}

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
        setCompanyCodeAction: (result) => {
            dispatch(setCompanyCodeAction(result));
        },
        setOwnerNameAction: (data) => {
            dispatch(setOwnerNameAction(data));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckPhone);

