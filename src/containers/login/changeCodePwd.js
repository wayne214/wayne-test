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
import {Geolocation} from 'react-native-baidu-map-xzx';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation';
import  HTTPRequest from '../../utils/httpRequest';

import NavigationBar from '../../common/navigationBar/navigationBar';

import * as API from '../../constants/api';
import * as StaticColor from '../../constants/staticColor';

import XeEncrypt from '../../utils/XeEncrypt';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import Loading from '../../utils/loading';

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


export default class changeCodePWD extends Component {

    constructor(props) {
        super(props);

        const params = this.props.navigation.state.params;
        this.state = {
            newPWD: '',
            newPWDagain: '',
            identifyCode: params.identifyCode,
            phoneNum: params.phoneNum,
            loading: false,

        };

        this.changePsd = this.changePsd.bind(this);
        this.loginSecretCode = this.loginSecretCode.bind(this);
        this.finish = this.finish.bind(this);
    }

    componentDidMount() {
         this.getCurrentPosition();
    }
    //获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }
    /*获取加密秘钥*/
    loginSecretCode() {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_GET_SEC_TOKEN,
            params: {},
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取登录密钥', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime);
                const secretCode = responseData.result;
                const secretnewPWD = XeEncrypt.aesEncrypt(this.state.newPWD, secretCode, secretCode);

                this.changePsd(secretnewPWD);
            },
            error: (errorInfo)=>{
                this.setState({
                    loading: false,
                });
            },
            finish:()=>{

            }
        });
    }


    /*修改密码*/
    changePsd(secret) {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_NEW_CHANGE_PSD_WITH_CODE,
            params: {
                confirmPassword: secret,
                identifyCode: this.state.identifyCode,
                newPassword: secret,
                phoneNum: this.state.phoneNum,
            },
            loading: ()=>{

            },
            success: (responseData)=>{
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('忘记密码', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '忘记密码页面');

                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Login'}),
                    ]
                });
                this.props.navigation.dispatch(resetAction);
                Toast.showShortCenter(responseData.message);

            },
            error: (errorInfo)=>{

            },
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
    }


    finish() {
        if (this.state.newPWD === '' && this.state.newPWDagain === '') {
            Toast.showShortCenter('密码不能为空');
        } else if (this.state.newPWD !== this.state.newPWDagain) {
            Toast.showShortCenter('两次密码输入不一致');
        } else {

            this.loginSecretCode();
        }
    }

    render() {
        const navigator = this.props.navigation;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'忘记密码'}
                    navigator={navigator}
                    leftButtonHidden={false}
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
                            backgroundColor: StaticColor.COLOR_MAIN,
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
                                color: 'white',
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
