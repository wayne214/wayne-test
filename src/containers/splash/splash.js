/**
 * Created by xizhixin on 2017/9/20.
 * 闪屏界面
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Dimensions,
    Platform,
    InteractionManager,
    NativeModules,
    Alert,
    Linking
} from 'react-native';
import {connect} from 'react-redux';

import { NavigationActions } from 'react-navigation';
import {loginSuccessAction, setUserNameAction, setUserCarAction} from '../../action/user';

import splashImg from '../../../assets/splash/splash.png';
import BaseContainer from '../base/baseContainer';
import StorageKey from '../../constants/storageKeys';
import Storage from '../../utils/storage';
import UUID from '../../utils/uuid';
import ObjectUitls from '../../utils/objectUitls';
import PermissionManagerAndroid from '../../utils/permissionManagerAndroid';

// 热更新
import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
} from 'react-native-update';
import updateConfig from '../../../update.json';
const {appKey} = updateConfig[Platform.OS];

const {width, height} = Dimensions.get('window');

class Splash extends BaseContainer {
    constructor(props) {
        super(props);
        this.getInfoForGlobal = this.getInfoForGlobal.bind(this);
        this.skip = this.skip.bind(this);
        this.resetTo = this.resetTo.bind(this);
    }
    componentWillMount() {
        if (isFirstTime) {
            markSuccess();
        } else if (isRolledBack) {
            Alert.alert('提示', '刚刚更新失败了,版本被回滚.')
        }
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            PermissionManagerAndroid.externalPermission().then((data) => {
                console.log("存储权限申请", data);
            }).catch((err) => {

            })
        }
        this.checkUpdate();
        this.getInfoForGlobal();
        this.skip();
    }
    // 下载更新
    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            Alert.alert('提示', '下载完毕,是否重启应用?', [
                {text: '是', onPress: ()=>{switchVersion(hash);}},
                {text: '否',},
                {text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
            ]);
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    };
    // 检查更新
    checkUpdate = () => {
        checkUpdate(appKey).then(info => {
            if (info.expired) { // 应用包(原生部分)已过期
                Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                    {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
                ]);
            } else if (info.upToDate) { // 当前已经更新到最新，无需进行更新
                Alert.alert('提示', '您的应用版本已是最新.');
            } else {
                Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
                    {text: '是', onPress: ()=>{this.doUpdate(info)}},
                    {text: '否',},
                ]);
            }
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    };
    //global赋值
    getInfoForGlobal() {

        Storage.get(StorageKey.USER_INFO).then((result) => {
            if (result && !ObjectUitls.isOwnEmpty(result)){
                // 发送Action,全局赋值用户信息
                this.props.sendLoginSuccessAction(result);
            }
        });

        Storage.get(StorageKey.PlateNumberObj).then((result) => {
            if (result && !ObjectUitls.isOwnEmpty(result)){
                // 发送Action,全局赋值车辆信息

                this.props.sendUserPlateNumberAction(result);
            }
        });

        Storage.get(StorageKey.UDID).then((value) => {
            if (value && !ObjectUitls.isOwnEmpty(value)) {
                global.UDID = value;
                console.log('-- UDID From Storage --', global.UDID);
            } else {
                const NewUUID = UUID();
                global.UDID = NewUUID;
                Storage.save(StorageKey.UDID, global.UDID);
                console.log('-- Create New UDID  --', global.UDID);
            }
        });
        global.platform = Platform.OS === 'ios' ? 1 : 2;
    }

    // 跳转界面并重置路由栈
    resetTo(index = 0, routeName) {
        const resetAction = NavigationActions.reset({
            index: index,
            actions: [
                NavigationActions.navigate({ routeName: routeName}),
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    // 跳转逻辑
    skip() {
        let title;
        Storage.get(StorageKey.IS_FIRST_START_FLAG).then((value) => {
            if (value && value * 1 === 1) {
                Storage.get(StorageKey.USER_INFO).then((userInfo) => {
                    console.log('>>>>>>>> userinfo is login ', userInfo);
                    if (!ObjectUitls.isOwnEmpty(userInfo)) {
                        title = 'Main';
                    } else {
                        title = 'LoginSms';
                    }
                    if (Platform.OS === 'ios') {
                        this.timer = setTimeout(() => {
                            this.resetTo(0, title);
                            NativeModules.SplashScreen.close();
                        },1000)
                    }
                    if (Platform.OS === 'android') {
                        this.timer = setTimeout(() => {
                            InteractionManager.runAfterInteractions(() => {
                                this.resetTo(0, title);
                            });
                        }, 3000);
                    }
                });
            } else {
                if (Platform.OS === 'ios') {
                    this.resetTo(0, 'Guide');
                    NativeModules.SplashScreen.close();
                }
                if (Platform.OS === 'android') {
                    this.timer = setTimeout(() => {
                        // 将一些耗时较长的工作放到动画完成之后再进行
                        InteractionManager.runAfterInteractions(() => {
                            this.resetTo(0, 'Guide');
                        });
                    }, 3000);
                }
            }
        });
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        if (Platform.OS === 'ios') {
            return (
                <View style={{backgroundColor:'#fff', flex:1}} />
            );
        }
        return (
            <Image
                // 保持原有大小
                resizeMode="stretch"
                style={{flex: 1, width, height}}
                source={splashImg}
            />
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
        sendUserPlateNumberAction: (result) => {
          dispatch(setUserCarAction(result));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
