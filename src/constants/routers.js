/**
 * Created by xizhixin on 2017/8/24.
 * 界面路由栈
 */
import React from 'react';

import {TabNavigator} from 'react-navigation';
import {TabRouteConfigs, TabNavigatorConfigs} from './tabBar/tabBar';

// import Setting from '../containers/setting';
// import ChooseCar from '../containers/chooseCar';
// import Income from '../containers/income/income';
// import BillWaterPage from '../containers/income/billWaterPage';

import Splash from '../containers/splash/splash';
import Login from '../containers/login/login';
import Guide from '../containers/guide/guide';
import Protocol from '../containers/register/protocol';
import Registered from '../containers/register/registered';
import RegisterSuccess from '../containers/register/registerSuccess';

import ChooseCar from '../containers/home/chooseCar';
import Location from '../containers/home/location';

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
import BusinessDetail from '../containers/income/businessDetail/businessDetail';
import GoodsDetailPage from '../containers/goodSource/entryGoodsDetail';
import TakeCamear from '../containers/mine/verified/takeCamera';
import TakeCamearV from '../containers/mine/verified/takeCameraVertical';
import Certification from '../containers/mine/verified/certification';
import TakeCameraEnd from '../containers/mine/verified/takeCameraEnd';
import TakeCameraVEnd from '../containers/mine/verified/takeCameraVerticalEnd';
import Verified from '../containers/mine/verified/verified';
import ShowBigImage from '../containers/mine/verified/verifiedShowBigImage';
import VerifiedState from '../containers/mine/verified/verifiedState';
import CerifiedState from '../containers/mine/verified/certificationState';
import MsgList from '../containers/mine/msgList';
import MsgDetails from '../containers/mine/msgDetails';
import PersonInfo from '../containers/mine/personInfo';
import BankCardDeatil from '../containers/income/bankCardDeatil';
import GoodsPreferencePage from '../containers/goodSource/preference/goodsPreferences';
import ChoiceCityPage from '../containers/goodSource/preference/choiceCitys';
import GoodsBiddingPage from '../containers/goodSource/bidding/goodsBidding';
import ImageShow from '../containers/order/imageShow';
import CarInfo from '../containers/mine/carInfo';

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
    ChooseCar: {
        screen: ChooseCar,
        navigationOptions: {
            header: null
        }
    },
    Location: {
        screen: Location,
        navigationOptions: {
            header: null
        }
    },
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
    BusinessDetail: {
        screen: BusinessDetail,
        navigationOptions: {
            header: null
        }
    },
    GoodsDetailPage: {
        screen: GoodsDetailPage,
        navigationOptions: {
            header: null
        }
    },
    TakeCamearPage: {
        screen: TakeCamear,
        navigationOptions: {
            header: null
        }
    },
    GoodsPreferencePage: {
        screen: GoodsPreferencePage,
        navigationOptions: {
            header: null
        }
    },
    MsgList: {
        screen: MsgList,
        navigationOptions: {
            header: null
        }
    },
    ChoiceCityPage: {
        screen: ChoiceCityPage,
        navigationOptions: {
            header: null
        }
    },
    TakeCamearVPage: {
        screen: TakeCamearV,
        navigationOptions: {
            header: null
        }
    },
    MsgDetails: {
        screen: MsgDetails,
        navigationOptions: {
            header: null
        }
    },
    CertificationPage: {
        screen: Certification,
            navigationOptions: {
            header: null
        }
    },
    TakeCameraEndPage: {
        screen: TakeCameraEnd,
        navigationOptions: {
            header: null
        }
    },
    VerifiedPage: {
        screen: Verified,
        navigationOptions: {
            header: null
        }
    },
    TakeCameraVEndPage: {
        screen: TakeCameraVEnd,
            navigationOptions: {
            header: null
        }
    },
    ShowBigImagePage: {
        screen: ShowBigImage,
        navigationOptions: {
            header: null
        }
    },
    VerifiedStatePage: {
        screen: VerifiedState,
        navigationOptions: {
            header: null
        }
    },
    PersonInfo: {
        screen: PersonInfo,
        navigationOptions: {
            header: null
        }
    },
    CerifiedStatePage: {
        screen: CerifiedState,
        navigationOptions: {
            header: null
        }
    },
    BankCardDeatil: {
        screen: BankCardDeatil,
            navigationOptions: {
            header: null
        }
    },
    GoodsBiddingPage: {
        screen: GoodsBiddingPage,
        navigationOptions: {
            header: null
        }
    },
    ImageShow: {
        screen: ImageShow,
        navigationOptions: {
            header: null
        }
    },
    CarInfo: {
        screen: CarInfo,
        navigationOptions: {
            header: null
        }
    },
};
const StackNavigatorConfigs = {
    initialRouteName: 'Splash', // 初始化哪个界面为根界面
    mode: 'card', // 跳转方式：默认的card，在iOS上是从右到左跳转，在Android上是从下到上，都是使用原生系统的默认跳转方式。
    headerMode: 'screen', // 导航条动画效果：float表示会渐变，类似于iOS的原生效果，screen表示没有渐变。none表示隐藏导航条
};

export {
    StackRouteConfigs,
    StackNavigatorConfigs
};
