/**
 * Created by xizhixin on 2017/9/20.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    BackHandler,
    ToastAndroid,
    DeviceEventEmitter,
} from 'react-native';
import {StackNavigator, addNavigationHelpers} from 'react-navigation';
import {StackRouteConfigs, StackNavigatorConfigs} from '../constants/routers';
import {
    DEBUG,
} from '../constants/setting';

const AppNavigator = StackNavigator(StackRouteConfigs, StackNavigatorConfigs);
let lastBackPressed = null;

class App extends Component {
    constructor(props) {
        super(props);
        this.onBackAndroid = this.onBackAndroid.bind(this);
        // 生产环境日志打印重定向，提高性能
        if (!DEBUG) {
            console.log = () => {
            };
            console.error = () => {
            };
            console.warn = () => {
            };
            global.ErrorUtils.setGlobalHandler(() => {
            });
        }
        // 开发模式下关闭黄屏警告
        console.disableYellowBox = true;
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        lastBackPressed = null;
    }

    // Android物理返回键点击事件
    onBackAndroid() {
        if (this.navigator._navigation.state.routes.length > 1) {
            this.navigator._navigation.goBack();
            return true;
        }
        if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
            return false;
        }
        lastBackPressed = Date.now();
        ToastAndroid.showWithGravity('再点击一次退出程序', ToastAndroid.SHORT, ToastAndroid.CENTER);
        return true;
    }


    render() {
        return (
            <AppNavigator
                ref={nav => { this.navigator = nav; }}
                onNavigationStateChange={(prevNav, nav, action)=>{
                    console.log('prevNav=',prevNav);
                    console.log('nav=',nav);
                    console.log('action=',action);

                    switch (action.routeName) {

                        case 'Home':
                            break;

                        case 'GoodsSource':
                            break;

                        case 'Order':
                            break;

                        case 'Mine':
                            DeviceEventEmitter.emit('refreshMine');
                            break;

                        default:
                            break
                    }

                }}
            />
        );
    }
}

export default connect(state => ({ nav: state.nav }))(App);
