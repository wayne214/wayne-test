/**
 * Created by xizhixin on 2017/9/20.
 */

import React, {Component} from 'react';
import {
    BackHandler,
    ToastAndroid
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {StackRouteConfigs, StackNavigatorConfigs} from '../constants/routers';

const AppNavigator = StackNavigator(StackRouteConfigs, StackNavigatorConfigs);
let lastBackPressed = null;

class App extends Component {
    constructor(props) {
        super(props);
        this.onBackAndroid = this.onBackAndroid.bind(this);

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
        if(this.navigator._navigation.state.routes.length > 1) {
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
            />
        );
    }
}

export default App;

