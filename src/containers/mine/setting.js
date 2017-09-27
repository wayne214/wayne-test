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
import LoginContainer from '../../containers/login/login';
// import {changeAcceptMessageAction, changeAcceptMessageSuccessAction} from '../../action/setting';
// import {
//     pushStatusByUserIdAction,
//     pushStatusByUserIdActionSuccessAction,
//     getIsAcceptMessageAction,
//     loadUserFromLocalAction,
//     loginOutAction,
// } from '../../action/user';
// import {saveUserSetCarSuccess, getHomePageCountAction} from '../../action/app';
import * as API from '../../constants/api';
import JPushModule from 'jpush-react-native';
// import {ImageCache} from 'react-native-img-cache';
import HTTPRequest from '../../utils/httpRequest';


import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';


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
});

class setting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            switchIsOn: true,
            userId: '',
        };
        this.loginChangeAcceptMessage = this.loginChangeAcceptMessage.bind(this);
        this.loginChangeAcceptMessageSuccessCallBack =
            this.loginChangeAcceptMessageSuccessCallBack.bind(this);
        this.press = this.press.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.getPushStatusAction = this.getPushStatusAction.bind(this);
        this.getPushStatusSuccessCallBack = this.getPushStatusSuccessCallBack.bind(this);
        this.loginOut = this.loginOut.bind(this);


        this.success = this.success.bind(this);
        this.fail = this.fail.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        setTimeout(() =>{
            Storage.get('userInfo').then((value) => {
                this.setState({
                    userId: value.result.userId,
                });
                this.getPushStatusAction(value.result.userId,this.getPushStatusSuccessCallBack);
            });
        },200);

        console.log('isacceptmessage6666666', this.props.isChangeMessage,this.state.userId);
        this.setState({
            switchIsOn: this.props.isChangeMessage,
        });
        console.log('data22222')
        this.subscription = DeviceEventEmitter.addListener('jpushMessage',(data) => {
            console.log('data',data)
            if (data != null){
                this.setState({
                    switchIsOn: data,
                });
            }

        })
    }

    componentWillUnmount() {
        this.subscription.remove();
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
    loginChangeAcceptMessage(loginChangeAcceptMessageSuccessCallBack, value) {
        if (value) {
            this.props.loginChangeAcceptMessage({
                body: {
                    id: this.state.userId,
                    status: 0,
                },
            }, loginChangeAcceptMessageSuccessCallBack);
        } else {
            this.props.loginChangeAcceptMessage({
                body: {
                    id: this.state.userId,
                    status: 1,
                },
            }, loginChangeAcceptMessageSuccessCallBack);
        }
    }

    loginChangeAcceptMessageSuccessCallBack(result) {
        console.log(result, 'setting--line--83');
        if (this.state.switchIsOn){
            this.props.getIsAcceptMessage(true);
        } else {
            this.props.getIsAcceptMessage(false);
        }
    }

    loginOut(){

        HTTPRequest({
            url:API.API_USER_LOGOUT + global.phone,
            params: {},
            loading: () => {

            },
            success: (response) => {
                lastTime = new Date().getTime();
                // ReadAndWriteFileUtil.appendFile('获取账户余额', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                //     locationData.district, lastTime - currentTime, '收入页面');
                this.setState({
                    accountMoney: response.result
                })
            },
            error: (err) => {

            },
            finish: () => {

            },

        })

        // this.props.loginOut({
        //     url:API.API_USER_LOGOUT + global.phone,
        // })
    }

    press() {
        this.loginOut();
        // this.props.removeUserInfoAction();
        // this.props.reloadHomePageNum();
        // ImageCache.get().clear();
        // this.props.saveUserSetCarSuccess('');
        // JPushModule.setAlias('', this.success, this.fail);

        Storage.remove('userInfo');
        Storage.remove('setCarSuccessFlag');
        Storage.remove('plateNumber');
        Storage.remove('userCarList');
        Storage.remove('personInfoResult');
        Storage.remove('carInfoResult');
        Storage.remove('NewPhotoRefNo');
        Storage.remove('changePersonInfoResult');
        Storage.remove('changeCarInfoResult');
        Storage.remove('haseSubmitQuote');
        Storage.remove('acceptMessage');
        Storage.remove('setCityFlag');
        Storage.remove('plateNumberObj');

        this.props.navigation.navigate('Login');
    }

    fail = () => {
    };

    success = () => {
        NativeAppEventEmitter.addListener('ReceiveNotification', (message) => {
        });
    };

    valueChange(value) {
        console.log('llll', value);
        this.setState({
            switchIsOn: value,
        });
        this.loginChangeAcceptMessage(this.loginChangeAcceptMessageSuccessCallBack, value);
    }

    getPushStatusAction(userID,getPushStatusSuccessCallBack){
        currentTime = new Date().getTime();
        console.log('userID',userID)
        this.props.getPushStatusAction({
            url: API.API_NEW_GET_PUSHSTATUS_WITH_DRIVERID + this.state.userId,
            body:{
                id:this.state.userId,
            },
        },getPushStatusSuccessCallBack);
    }

    getPushStatusSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('查询推送司机APP的状态', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '设置页面');
        console.log('成功',result);
        const loginIsAcceptMessage = result.toString();
        console.log('成功',loginIsAcceptMessage);
        Storage.save('isAcceptMessage', loginIsAcceptMessage);

        DeviceEventEmitter.emit('jpushMessage', result);
        console.log('data1')
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
                        onTintColor={'#008BCA'}
                        onValueChange={(value) => {
                            this.valueChange(value);
                        }}
                        style={{marginBottom: 10, marginTop: 10}}
                        value={this.state.switchIsOn}
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

setting.propTypes = {
    router: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired,
    loginChangeAcceptMessage: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    console.log('------ state', state);
    return {
        mine: state.mine,
        isChangeMessage: state.user.get('isChangeMessage'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loginChangeAcceptMessage: (params, loginChangeAcceptMessageSuccessCallBack) =>
            dispatch(changeAcceptMessageAction({
                url: API.API_CHANGE_ACCEPT_MESSAGE,
                successCallBack: (response) => {
                    loginChangeAcceptMessageSuccessCallBack(response.result);
                    dispatch(changeAcceptMessageSuccessAction(response));
                },
                failCallBack: (err) => {
                    console.log('setting', err);
                },
                ...params,
            })),
        getPushStatusAction: (params, getPushStatusSuccessCallBack) => {
            dispatch(pushStatusByUserIdAction({
                successCallBack: (response) => {
                    getPushStatusSuccessCallBack(response.result);
                    dispatch(pushStatusByUserIdActionSuccessAction(response));
                    dispatch(getIsAcceptMessageAction(response.result));
                },
                failCallBack: () => {
                },
                ...params,
            }));
        },
        removeUserInfoAction:()=>{
            dispatch(loadUserFromLocalAction(null));
        },

        getIsAcceptMessage: (data) => {
            dispatch(getIsAcceptMessageAction(data));
        },

        saveUserSetCarSuccess: (plateNumber) => {
            dispatch(saveUserSetCarSuccess(plateNumber));
        },
        loginOut: (params) => {
            dispatch(loginOutAction({
                successCallBack: (response) => {
                },
                failCallBack: () => {
                },
                ...params,
            }));
        },
        reloadHomePageNum:()=>{
            dispatch(getHomePageCountAction(null));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(setting);
