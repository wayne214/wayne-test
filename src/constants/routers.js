/**
 * Created by xizhixin on 2017/8/24.
 * 界面路由栈
 */
import React from 'react';

import {TabNavigator} from 'react-navigation';

import {TabRouteConfigs, TabNavigatorConfigs} from './tabBar/tabBar';

// import Setting from '../containers/setting';
import Splash from '../containers/splash/splash';
import Login from '../containers/login/login';
import Guide from '../containers/guide/guide';
// import Protocol from '../containers/protocol';
// import Registered from '../containers/registered';
// import RegisterSuccess from '../containers/registerSuccess';
// import ChooseCar from '../containers/chooseCar';
// import ForgetPWD from '../containers/forgetPWD';
// import LoginSms from '../containers/loginSms';

const TabBarNavigator = TabNavigator(TabRouteConfigs, TabNavigatorConfigs);

const StackRouteConfigs = {
    Splash: {
        screen: Splash,
        navigationOptions: {
            header: null
        }
    },
    Login: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    Guide: {
        screen: Guide,
        navigationOptions: {
            header: null
        }
    },
    Main: {
        screen: TabBarNavigator,
        navigationOptions: {
            header: null
        }
    },
    // Setting: {
    //     screen: Setting,
    //     navigationOptions: {
    //         header: null
    //     }
    // },
    // Protocol: {
    //     screen: Protocol,
    //     navigationOptions: {
    //         header: null
    //     }
    // },
    // Registered: {
    //     screen: Registered,
    //     navigationOptions: {
    //         header: null
    //     }
    // },
    // RegisterSuccess: {
    //     screen: RegisterSuccess,
    //     navigationOptions: {
    //         header: null
    //     }
    // },
    // ChooseCar: {
    //     screen: ChooseCar,
    //     navigationOptions: {
    //         header: null
    //     }
    // },
    // ForgetPWD: {
    //     screen: ForgetPWD,
    //     navigationOptions: {
    //         header: null
    //     }
    // },
    // LoginSms: {
    //     screen: LoginSms,
    //     navigationOptions: {
    //         header: null
    //     }
    // },
};
const StackNavigatorConfigs = {
    initialRouteName: 'Splash', // 初始化哪个界面为根界面
    mode:'card', // 跳转方式：默认的card，在iOS上是从右到左跳转，在Android上是从下到上，都是使用原生系统的默认跳转方式。
    headerMode:'screen', // 导航条动画效果：float表示会渐变，类似于iOS的原生效果，screen表示没有渐变。none表示隐藏导航条
};

export {
    StackRouteConfigs,
    StackNavigatorConfigs
};
