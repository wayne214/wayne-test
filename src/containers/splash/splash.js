/**
 * Created by xizhixin on 2017/9/20.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Dimensions,
    Platform,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import SplashImg from './images/splash.png';
const {width, height} = Dimensions.get('window');
import BaseContainer from '../base/baseContainer';

export default class Splash extends BaseContainer {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log('splash ================================');
        global.platform = Platform.OS === 'ios' ? 1 : 2;
        if (Platform.OS === 'ios') {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Main'}),
                ]
            });
            this.props.navigation.dispatch(resetAction);
            // NativeModules.SplashScreen.close();
        }
        if (Platform.OS === 'android') {
            this.timer = setTimeout(() => {
                // 将一些耗时较长的工作放到动画完成之后再进行
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Guide'}),
                    ]
                });
                this.props.navigation.dispatch(resetAction);
            }, 3000);
        }
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
                source={SplashImg}
            />
        );
    }
}


 Splash;
