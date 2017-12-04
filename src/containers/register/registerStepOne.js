/**
 * 注册第一步
 * 注册界面
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TextInput,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import Button from 'apsl-react-native-button';
import Toast from '@remobile/react-native-toast';
import {Geolocation} from 'react-native-baidu-map-xzx';
import Loading from '../../utils/loading';
import  HTTPRequest from '../../utils/httpRequest';

import NavigationBar from '../../common/navigationBar/navigationBar';
import CountDownButton from '../../common/timerButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PermissionsAndroid from '../../utils/permissionManagerAndroid';

import StaticImage from '../../constants/staticImage';
import * as StaticColor from '../../constants/staticColor';
import * as API from '../../constants/api';

import Validator from '../../utils/validator';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import * as ConstValue from '../../constants/constValue';

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
    loginButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    screenEndView: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: width,
        marginBottom: 20,
        top: height-120
    },
    screenEndViewTextLeft: {
        fontSize: 15,
        color: StaticColor.GRAY_TEXT_COLOR,
    },
    screenEndViewText: {
        fontSize: 15,
        color: StaticColor.BLUE_CONTACT_COLOR,
    },
    separateLine: {
        height: 1,
        width,
        marginLeft: 15,
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
    },
});

export default class RegisterStepOne extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phoneNum: '',
            messageCode: '',
            loading: false,
        };

        this.registerAccount = this.registerAccount.bind(this);
        this.registeredIdentityCode = this.registeredIdentityCode.bind(this);
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
        console.log('position =', JSON.stringify(data));
        locationData = data;
    }).catch(e => {
        console.log(e, 'error');
    });
    }

    /*注册*/
    registerAccount() {

    	 this.props.navigation.navigate('RegisterStepTwo', {
	          phoneNum: this.state.phoneNum,
	          messageCode: this.state.messageCode,
	      });

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
        const {phoneNum, messageCode} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'注册'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <View style={{ width: width, height: height}}>

                    <View style={{backgroundColor: StaticColor.WHITE_COLOR,marginTop:10}}>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            placeholder="请输入手机号"
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
                                placeholder="请输入验证码"
                                placeholderTextColor="#cccccc"
                                keyboardType="numeric"
                                style={styles.registeredCodeTextInput}
                                value={messageCode}
                                onChangeText={(messageCode) => {
                                this.setState({messageCode});
                            }}
                            />
                            <CountDownButton
                                enable={phoneNum.length}
                                style={{width: 110, marginRight: 10}}
                                textStyle={{color: '#0078ff'}}
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
                       
                    </View>
                    <Image style={styles.loginBackground} source ={StaticImage.BlueButtonArc}>
	                    <Button
	                        isDisabled={!(phoneNum && messageCode)}
	                        style={styles.loginButton}
	                        textStyle={styles.loginButtonText}
	                        onPress={() => {
	                            this.registerAccount();
	                    }}
	                    >
	                        下一步
	                    </Button>
                    </Image>
                    <View style={styles.screenEndView}>
                        <View style={{height: 20, justifyContent: 'center',alignItems: 'center'}}>
                            <Text style={styles.screenEndViewTextLeft}>点击"立即注册"代表同意</Text>
                        </View>
                        <View style={{height: 21, justifyContent: 'center',alignItems:'center'}}>
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
                </View>
                {
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }
}
