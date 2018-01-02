/**
 * Created by xizhixin on 2017/9/20.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    BackHandler,
    ToastAndroid,
} from 'react-native';
import {
    addNavigationHelpers,
    NavigationActions,
} from 'react-navigation';
import AppNavigator from '../constants/routers';
import {
    DEBUG,
} from '../constants/setting';

let lastBackPressed = null;

class App extends Component {
    constructor(props) {
        super(props);
        this.onBackAndroid = this.onBackAndroid.bind(this);
        // 生产环境日志打印重定向，提高性能
        if (DEBUG) {
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
        const routers = this.props.nav.routes;
        console.log('backAndroid,routers=',routers);
        if (routers.length > 1) {
            this.props.dispatch(NavigationActions.back());
            return true;
        } else {
            if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                return false;
            }
            lastBackPressed = Date.now();
            ToastAndroid.showWithGravity('再点击一次退出程序', ToastAndroid.SHORT, ToastAndroid.CENTER);
            return true;
        }
        // if (this.navigator._navigation.state.routes.length > 1) {
        //     this.navigator._navigation.goBack();
        //     return true;
        // }
        // if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
        //     return false;
        // }
        // lastBackPressed = Date.now();
        // ToastAndroid.showWithGravity('再点击一次退出程序', ToastAndroid.SHORT, ToastAndroid.CENTER);
        // return true;
    }


    render() {
        const { dispatch, nav } = this.props;
        return (
            <AppNavigator
                // ref={nav => { this.navigator = nav; }}
                navigation={addNavigationHelpers({
                    dispatch: dispatch,
                    state: nav
                })}
            />
        );
    }
}

const mapStateToProps = state =>({
    nav: state.nav,
});

export default connect(mapStateToProps)(App);
