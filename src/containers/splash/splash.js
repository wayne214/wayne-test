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
    NativeModules
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import splashImg from '../../../assets/splash/splash.png';
import BaseContainer from '../base/baseContainer';
import StorageKey from '../../constants/storageKeys';
import Storage from '../../utils/storage';
import UUID from '../../utils/uuid';

const {width, height} = Dimensions.get('window');

export default class Splash extends BaseContainer {
    constructor(props) {
        super(props);
        this.getInfoForGlobal = this.getInfoForGlobal.bind(this);
        this.skip = this.skip.bind(this);
        this.resetTo = this.resetTo.bind(this);
    }

    componentDidMount() {
        this.getInfoForGlobal();
        this.skip();
    }

    //global赋值
    getInfoForGlobal() {
        Storage.get(StorageKey.TOKEN).then((value) => {
            if (value){
                global.token = value;
            }
        });
        Storage.get(StorageKey.USER_INFO).then((value) => {
            if (value){
                global.userId = value.result.userId;
                global.userName = value.result.userName;
            }
        });
        Storage.get(StorageKey.PHOTO_REF_NO).then((value) => {
            if (value){
                global.photoRefNo = value.result.photoRefNo;
            }
        });
        Storage.get(StorageKey.UDID).then((value) => {
            if (value) {
                global.UDID = value;
                console.log('-- UDID From Storage --', global.UDID);
            } else {
                const NewUUID = UUID();
                global.UDID = NewUUID;
                Storage.save(UDID, global.UDID);
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
                    if (userInfo) {
                        title = 'Main';
                    } else {
                        title = 'Login';
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
