/**
 * Created by xizhixin on 2017/8/24.
 * 界面路由栈
 */
import React from 'react';

import {
    TabNavigator,
    StackNavigator,
} from 'react-navigation';
import {TabRouteConfigs, TabNavigatorConfigs} from './tabBar/tabBar';

import Scan from '../containers/order/scan';
import BaiduMap from '../containers/map/baiduMap';

import Search from '../containers/order/search/search';
import SearchResultForSchedule from '../containers/order/search/searchResultForSchedule';
import SearchResultForToBeWaitSure from '../containers/order/search/searchResultForToBeWaitSure';
import SearchResultForToBeSure from '../containers/order/search/searchResultForToBeSure';
import SearchResultForToBeShipped from '../containers/order/search/searchResultForToBeShipped';
import SearchResultForToBeSignIn from '../containers/order/search/searchResultForToBeSignIn';
import EntryToBeShipped from '../containers/order/orderDetailScrollList/components/entryToBeShipped';
import EntryToBeSignIn from '../containers/order/orderDetailScrollList/components/entryToBeSignin';
import ReceiptPhotoShow from '../containers/order/imageViewer';
import SignPage from '../containers/order/signPage';
import UploadReceipt from '../containers/order/uploadReceipt';

import Splash from '../containers/splash/splash';
import Login from '../containers/login/login';
import Guide from '../containers/guide/guide';
import Protocol from '../containers/register/protocol';
import RegisterStepOne from '../containers/register/registerStepOne';
import RegisterStepTwo from '../containers/register/registerStepTwo';

import RegisterSuccess from '../containers/register/registerSuccess';

import ChooseCar from '../containers/home/chooseCar';
import Location from '../containers/home/location';

import ForgetPwd from '../containers/login/forgetPwd';
import LoginSms from '../containers/login/loginSms';
import CheckPhone from '../containers/login/checkPhone';
import CheckPhoneStepTwo from '../containers/login/checkPhoneStepTwo';
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
import TakeCamearPageV from '../containers/mine/verified/takeCameraVertical';
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
import ImageShow from '../containers/order/components/imageShow';
import CarInfo from '../containers/mine/carInfo';
import CarDisablePage from '../containers/mine/carDisablePage';
import Withdrawals from '../containers/income/AccountFlow/Withdrawals';
import DrawalsChooseCard from '../containers/income/AccountFlow/drawalsChooseCard';
import DrawalsDetail from '../containers/income/AccountFlow/drawalsDetail';
import IncomeListDetail from '../containers/income/AccountFlow/incomeListDetail';
import AddBankCardSuccess from '../containers/income/addBankCard/addBankCardSuccess';
import ChooseBankCity from '../containers/income/addBankCard/chooseBankCity';
import ChooseBankName from '../containers/income/addBankCard/chooseBankName';
import ChooseBranch from '../containers/income/addBankCard/chooseBranch';
import PayTypesPage from '../containers/order/receivables/payTypes';// 收款页面
import SignSuccess from '../containers/order/signSuccess';
import WeChatPayment from '../containers/order/receivables/weChatPayment';
import PayPassword from '../containers/mine/payPassword';
import SetPayPassword from '../containers/mine/setPayPassword';
import ForgetPayPassword from '../containers/mine/forgetPayPassword';
import ForgetPayPasswordCode from '../containers/mine/forgetPayPasswordCode';
import CharacterList from '../containers/login/character/characterList';
import CharacterOwner from '../containers/login/character/characterOwner';
import CarOwnerAddDriver from '../containers/mine/verified/carOwnerAddDriver';
import CarOwnerAddDriverDetail from '../containers/mine/verified/carOwnerAddDriverDetail';
import CarOwnerAddCar from '../containers/mine/verified/carOwnerAddCar';
import CarOwnerAddCarDetail from '../containers/mine/verified/carOwnerAddCarDetail';
import PersonCarOwnerAuth from '../containers/mine/verified/personCarOwnerAuth';
import CompanyCarOwnerAuth from '../containers/mine/verified/companyCarOwnerAuth';
import AddCarDriver from '../containers/mine/driver/addCarDriver';
import EnterpriseownerVerifiedStatePage from '../containers/mine/verified/ownerVerified/enterpriseownerVerifiedState';
import PersonownerVerifiedStatePage from '../containers/mine/verified/ownerVerified/personownerVerifiedState';
import DriverManagement from '../containers/mine/owner/driverManagement';
import CarManagement from '../containers/mine/owner/carManagement';
import UploadAbnormal from '../containers/home/uploadAbnormal';
import TakePhoto from '../containers/home/takePhoto';
import RecordVideo from '../containers/home/recordVideo';
import TakePhotoFinished from '../containers/home/takePhotoFinished';
import RecordVideoFinished from '../containers/home/recordVideoFinished';
import AddDriverPage from '../containers/mine/owner/addDriverPage';
import AddCarPage from '../containers/mine/owner/addCarPage';
import VideoShow from '../containers/home/videoShow';



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
    BaiduMap: {
        screen: BaiduMap,
        navigationOptions: {
            header: null
        }
    },
    Protocol: {
        screen: Protocol,
        navigationOptions: {
            header: null
        }
    },
    RegisterStepOne: {
        screen: RegisterStepOne,
        navigationOptions: {
            header: null
        }
    },
    RegisterStepTwo: {
        screen: RegisterStepTwo,
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
    CheckPhone: {
        screen: CheckPhone,
        navigationOptions:{
            header: null
        }
    },
    CheckPhoneStepTwo: {
       screen: CheckPhoneStepTwo,
        navigationOptions:{
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
    CarDisablePage: {
        screen: CarDisablePage,
        navigationOptions: {
            header: null
        }
    },
    Scan: {
        screen: Scan,
        navigationOptions: {
            header: null
        }
    },
    Search: {
        screen: Search,
        navigationOptions: {
            header: null
        }
    },
    SearchResultForSchedule: {
        screen: SearchResultForSchedule,
        navigationOptions: {
            header: null
        }
    },
    SearchResultForToBeSure: {
        screen: SearchResultForToBeSure,
        navigationOptions: {
            header: null
        }
    },
    SearchResultForToBeWaitSure: {
        screen: SearchResultForToBeWaitSure,
        navigationOptions: {
            header: null
        }
    },
    SearchResultForToBeSignIn: {
        screen: SearchResultForToBeSignIn,
        navigationOptions: {
            header: null
        }
    },
    SearchResultForToBeShipped: {
        screen: SearchResultForToBeShipped,
        navigationOptions: {
            header: null
        }
    },
    EntryToBeShipped: {
        screen: EntryToBeShipped,
        navigationOptions: {
            header: null
        }
    },
    EntryToBeSignIn: {
        screen: EntryToBeSignIn,
        navigationOptions: {
            header: null
        }
    },
    ReceiptPhotoShow: {
        screen: ReceiptPhotoShow,
        navigationOptions: {
            header: null
        }
    },
    SignPage: {
        screen: SignPage,
        navigationOptions: {
            header: null
        }
    },
    UploadReceipt: {
        screen: UploadReceipt,
        navigationOptions: {
            header: null
        }
    },
    Withdrawals: {
        screen: Withdrawals,
        navigationOptions: {
            header: null
        }
    },
    DrawalsChooseCard: {
        screen: DrawalsChooseCard,
        navigationOptions: {
            header: null
        }
    },
    DrawalsDetail: {
        screen: DrawalsDetail,
        navigationOptions: {
            header: null
        }
    },
    IncomeListDetail: {
        screen: IncomeListDetail,
        navigationOptions: {
            header: null
        }
    },
    AddBankCardSuccess: {
        screen: AddBankCardSuccess,
        navigationOptions: {
            header: null
        }
    },
    ChooseBankCity: {
        screen: ChooseBankCity,
        navigationOptions: {
            header: null
        }
    },
    ChooseBankName:{
        screen: ChooseBankName,
        navigationOptions: {
            header: null
        }
    },
    ChooseBranch:{
        screen: ChooseBranch,
        navigationOptions: {
            header: null
        }
    },
    PayTypesPage:{
        screen: PayTypesPage,
        navigationOptions: {
            header: null
        }
    },
    SignSuccess:{
        screen: SignSuccess,
        navigationOptions: {
            header: null
        }
    },
    WeChatPayment:{
        screen: WeChatPayment,
        navigationOptions: {
            header: null
        }
    },
    PayPassword:{
        screen: PayPassword,
        navigationOptions: {
            header: null
        }
    },
    SetPayPassword:{
        screen: SetPayPassword,
            navigationOptions: {
            header: null
        }
    },
    ForgetPayPassword:{
        screen: ForgetPayPassword,
        navigationOptions: {
            header: null
        }
    },
    ForgetPayPasswordCode:{
        screen: ForgetPayPasswordCode,
        navigationOptions: {
            header: null
        }
    },
    TakeCameraVer: {
        screen: TakeCamearPageV,
        navigationOptions: {
            header: null
        }
    },
    CharacterList: {
        screen: CharacterList,
        navigationOptions: {
            header: null
        }
    },
    CharacterOwner: {
        screen: CharacterOwner,
        navigationOptions: {
            header: null
        }
    },
    CarOwnerAddDriver: {
        screen: CarOwnerAddDriver,
        navigationOptions: {
            header: null
        }
    },
    UploadAbnormal: {
        screen: UploadAbnormal,
        navigationOptions: {
            header: null
        }
    },
    AddCarDriver: {
        screen: AddCarDriver,
        navigationOptions: {
            header: null
        }
    },
    TakePhoto: {
        screen: TakePhoto,
        navigationOptions: {
            header: null
        }
    },

    CarOwnerAddDriverDetail: {
        screen: CarOwnerAddDriverDetail,
        navigationOptions: {
            header: null
        }
    },
    RecordVideo: {
        screen: RecordVideo,
        navigationOptions: {
            header: null
        }
    },
    CarManagement: {
        screen: CarManagement,
        navigationOptions: {
            header: null
        }
    },
    TakePhotoFinished: {
        screen: TakePhotoFinished,
        navigationOptions: {
            header: null
        }
    },
    EnterpriseownerVerifiedStatePage: {
        screen: EnterpriseownerVerifiedStatePage,
        navigationOptions: {
            header: null
        }
    },
    CarOwnerAddCar: {
        screen: CarOwnerAddCar,
        navigationOptions: {
            header: null
        }
    },
    CarOwnerAddCarDetail: {
        screen: CarOwnerAddCarDetail,
        navigationOptions: {
            header: null
        }
    },
    PersonCarOwnerAuth: {
        screen: PersonCarOwnerAuth,
        navigationOptions: {
            header: null
        }
    },
    CompanyCarOwnerAuth: {
        screen: CompanyCarOwnerAuth,
        navigationOptions: {
            header: null
        }
    },
    PersonownerVerifiedStatePage: {
        screen: PersonownerVerifiedStatePage,
        navigationOptions: {
            header: null
        }
    },
    DriverManagement: {
        screen: DriverManagement,
        navigationOptions: {
            header: null
        }
    },
    RecordVideoFinished: {
        screen: RecordVideoFinished,
        navigationOptions: {
            header: null
        }
    },
    AddDriverPage: {
        screen: AddDriverPage,
        navigationOptions: {
            header: null
        }
    },
    AddCarPage: {
        screen: AddCarPage,
        navigationOptions: {
            header: null
        }
    },
    VideoShow: {
        screen: VideoShow,
        navigationOptions: {
            header: null
        }
    },

};
const StackNavigatorConfigs = {
    initialRouteName: 'Splash', // 初始化哪个界面为根界面
    mode: 'card', // 跳转方式：默认的card，在iOS上是从右到左跳转，在Android上是从下到上，都是使用原生系统的默认跳转方式。
    headerMode: 'screen', // 导航条动画效果：float表示会渐变，类似于iOS的原生效果，screen表示没有渐变。none表示隐藏导航条
    gesturesEnabled: false,
};

const AppNavigator = StackNavigator(StackRouteConfigs, StackNavigatorConfigs);


export default AppNavigator;
