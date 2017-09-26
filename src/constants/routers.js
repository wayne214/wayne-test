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
import Protocol from '../containers/register/protocol';
import Registered from '../containers/register/registered';
import RegisterSuccess from '../containers/register/registerSuccess';
// import ChooseCar from '../containers/chooseCar';
import ForgetPwd from '../containers/login/forgetPwd';
import LoginSms from '../containers/login/loginSms';
import ChangePwd from '../containers/login/changePassword';
import ChangeCodePwd from '../containers/login/changeCodePwd';
import MyBankCard from '../containers/income/myBankCard';
import Income from '../containers/income/AccountFlow/income';
import BillWaterPage from '../containers/income/AccountFlow/billWaterPage';
import AddBankCard from '../containers/income/addBankCard/addBankCard';
import AddBankCardPhone from '../containers/income/addBankCard/addBankCardPhone';
import VerificationCardPhone from '../containers/income/addBankCard/verificationCardPhone';
import Setting from '../containers/mine/setting';
import AboutUs from '../containers/mine/aboutUs';

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
    Protocol: {
        screen: Protocol,
        navigationOptions: {
            header: null
        }
    },
    Registered: {
        screen: Registered,
        navigationOptions: {
            header: null
        }
    },
    RegisterSuccess: {
        screen: RegisterSuccess,
        navigationOptions: {
            header: null
        }
    },
    // ChooseCar: {
    //     screen: ChooseCar,
    //     navigationOptions: {
    //         header: null
    //     }
    // },
    ForgetPwd: {
        screen: ForgetPwd,
        navigationOptions: {
            header: null
        }
    },
    LoginSms: {
        screen: LoginSms,
        navigationOptions: {
            header: null
        }
    },
    ChangePwd: {
        screen: ChangePwd,
        navigationOptions: {
            header: null
        }
    },
    ChangeCodePwd: {
        screen: ChangeCodePwd,
        navigationOptions: {
            header: null
        }
    },
    Income: {
        screen: Income,
        navigationOptions: {
            header: null
        }
    },
    BillWaterPage: {
        screen: BillWaterPage,
        navigationOptions: {
            header: null
        }
    },
    MyBankCard: {
        screen: MyBankCard,
        navigationOptions: {
            header: null
        }
    },
    AddBankCard: {
        screen: AddBankCard,
        navigationOptions: {
            header: null
        }
    },
    AddBankCardPhone: {
        screen: AddBankCardPhone,
        navigationOptions: {
            header: null
        }
    },
    VerificationCardPhone: {
        screen: VerificationCardPhone,
        navigationOptions: {
            header: null
        }
    },
    Setting: {
        screen: Setting,
        navigationOptions: {
            header: null
        }
    },
    AboutUs: {
        screen: AboutUs,
        navigationOptions: {
            header: null
        }
    },
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
