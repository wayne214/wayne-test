import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    StyleSheet,
    Switch,
    TouchableOpacity,
    DeviceEventEmitter,
    NativeAppEventEmitter,
} from 'react-native';
import Storage from '../../utils/storage';
import NavigationBar from '../../common/navigationBar/navigationBar';
import {
    clearUser,
} from '../../action/user';
import {
    voiceSpeechAction,
    getHomePageCountAction
} from '../../action/app';
import * as API from '../../constants/api';
import JPushModule from 'jpush-react-native';
import HTTPRequest from '../../utils/httpRequest';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import { NavigationActions } from 'react-navigation';
import {ImageCache} from "react-native-img-cache";
import * as StaticColor from '../../constants/staticColor';


let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',

    },
    contentView: {
        flexDirection: 'row',
        height: 44,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    contentItemView: {
        flexDirection: 'row',
        height: 44,
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
    },
    contentItemText: {
        fontSize: 16,
        color: '#333333',
    },
    contentText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    separateLine: {
        height: 0.5,
        backgroundColor: StaticColor.COLOR_SEPARATE_LINE,
        marginLeft: 10,
    },
});

class setting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            switchIsOn: true,
            speechSwitch: this.props.speechSwitchStatus,
        };
        this.loginChangeAcceptMessage = this.loginChangeAcceptMessage.bind(this);
        this.press = this.press.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.getPushStatusAction = this.getPushStatusAction.bind(this);
        this.loginOut = this.loginOut.bind(this);
        this.speechValueChange = this.speechValueChange.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();

        this.getPushStatusAction();

    }
    componentWillUnmount() {
        if (this.subscription)
            this.subscription.remove();
    }

    /*获取通知状态*/
    getPushStatusAction() {
        currentTime = new Date().getTime();

        HTTPRequest({
            url:API.API_NEW_GET_PUSHSTATUS_WITH_DRIVERID + global.userId,
            params: {
                id:global.userId,
            },
            loading: () => {

            },
            success: (response) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('查询推送司机APP的状态', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '设置页面');
                //const loginIsAcceptMessage = response.result.toString();

                this.setState({
                    switchIsOn: response.result,
                });
            },
            error: (err) => {

            },
            finish: () => {

            },

        });

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

    /*退出登录请求*/
    loginOut(){
        HTTPRequest({
            url:API.API_USER_LOGOUT + global.phone,
            params: {},
            loading: () => {

            },
            success: (response) => {

            },
            error: (err) => {

            },
            finish: () => {

            },

        });
    }

    /*退出登录*/
    press() {
        this.loginOut();
        this.props.removeUserInfoAction();
        this.props.reloadHomePageNum();
        ImageCache.get().clear();
        DeviceEventEmitter.emit('updateOrderList');

        Storage.remove('userInfo');
        Storage.remove('setCarSuccessFlag');
        Storage.remove('plateNumber');
        Storage.remove('userCarList');
        Storage.remove('personInfoResult');
        Storage.remove('carInfoResult');
        Storage.remove('PHOTO_REF_NO');
        Storage.remove('changePersonInfoResult');
        Storage.remove('changeCarInfoResult');
        Storage.remove('acceptMessage');
        Storage.remove('setCityFlag');
        Storage.remove('plateNumberObj');


        // 清空存储数据
        // Storage.clear();
        JPushModule.setAlias('', ()=>{}, ()=>{});

        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Login'}),
            ]
        });
        this.props.navigation.dispatch(resetAction);

    }

    /*语音播报开关状态改变*/
    speechValueChange(value) {
        this.setState({
            speechSwitch: value,
        });
        this.props.speechSwitchAction(value);
    }
    /*通知开关状态改变*/
    valueChange(value) {
        this.setState({
            switchIsOn: value,
        });
        this.loginChangeAcceptMessage( value );
    }
    loginChangeAcceptMessage(value) {
        let body = {};
        if (value) {
                body = {
                    id: global.userId,
                    status: 0,
                }
        } else {
                body = {
                    id: global.userId,
                    status: 1,
                }
        }


        HTTPRequest({
            url:API.API_CHANGE_ACCEPT_MESSAGE,
            params: body,
            loading: () => {
            },
            success: (response) => {
            },
            error: (err) => {
            },
            finish: () => {
            },

        });
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'设置'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                />

                <View style={{height: 10}}/>

                <View style={styles.contentItemView}>
                    <Text style={styles.contentItemText}>
                        接收新消息通知
                    </Text>
                    <Switch
                        onTintColor={'#0083FF'}
                        onValueChange={(value) => {
                            this.valueChange(value);
                        }}
                        style={{marginBottom: 10, marginTop: 10}}
                        value={this.state.switchIsOn}
                    />
                </View>
                <View style={styles.separateLine}/>
                <View style={styles.contentItemView}>
                    <Text style={styles.contentItemText}>
                        语音播报
                    </Text>
                    <Switch
                        onTintColor={'#0083FF'}
                        onValueChange={(value) => {
                            this.speechValueChange(value);
                        }}
                        style={{marginBottom: 10, marginTop: 10}}
                        value={this.state.speechSwitch}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.press();
                    }}
                >
                    <View style={styles.contentView}>
                        <Text style={styles.contentText}>退出登录</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        speechSwitchStatus: state.app.get('speechSwitchStatus')
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeUserInfoAction:()=>{
            dispatch(clearUser());
        },
        speechSwitchAction:(data)=>{
            dispatch(voiceSpeechAction(data));
        },
        reloadHomePageNum:()=>{
            dispatch(getHomePageCountAction(null));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(setting);
