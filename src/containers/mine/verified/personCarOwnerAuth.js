import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,
    Platform,
    InteractionManager,
    Alert,
} from 'react-native';

import VerifiedSpaceItem from './verifiedIDItem/verifiedSpaceItem';
import NavigatorBar from '../../../common/navigationBar/navigationBar';
import VerifiedIDTitleItem from './verifiedIDItem/verifiedIDTitleItem'
import VerifiedIDItemView from './verifiedIDItem/verifiedIDItem';
import VerifiedGrayTitleItem from './verifiedIDItem/verifiedGrayTitleItem';
import VerifiedIDInfoItem from './verifiedIDItem/verifiedIDInfoItem';
import VerifiedIDDateItem from './verifiedIDItem/verifiedIDInfoDateItem';
import LoadingView from '../../../utils/loading';
import VerifiedDataSource from './verifiedIDItem/verifiedDateSource';
import AlertSheetItem from '../../../common/alertSelected';
import PermissionsManager from '../../../utils/permissionManager';
import PermissionsManagerAndroid from '../../../utils/permissionManagerAndroid';
import ImagePicker from 'react-native-image-picker';
import TimePicker from 'react-native-picker-custom';
import * as API from '../../../constants/api';
import {upLoadImageManager} from '../../../utils/upLoadImageToVerified';
import Toast from '@remobile/react-native-toast';
import VerifiedLineItem from './verifiedIDItem/verifiedLineItem';
import VerifiedTravelInfoItemOne from './verifiedIDItem/verifiedTravelInfoItemOne';
import VerifiedDateSources from './verifiedIDItem/verifiedDateSource';
import Validator from '../../../utils/validator';
import Storage from '../../../utils/storage';
import StorageKey from '../../../constants/storageKeys';
import VierifiedBottomItem from './verifiedIDItem/verifiedBottomItem';
import HTTPRequest from '../../../utils/httpRequest';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import {
    setOwnerCharacterAction,
} from '../../../action/user';
import {Geolocation} from 'react-native-baidu-map-xzx';


const idCardLeftImage = require('./images/IdCardModel.png');
const idCardRightImage = require('./images/IdCardAdd.png');
const idCardTrunLeftImage = require('./images/IdCardTurnModel.png');
const idCardTrunRightImage = require('./images/IdCardTurnAdd.png');

const travelRightImage = require('./images/travelCardHome_right.png');
const travelLeftImage = require('./images/travelCardHome.png');
const travelTrunLeftImage = require('./images/travelCard.png');
const travelTrunRightImage = require('./images/travelCard_right.png');

const selectedArr = ["拍照", "从手机相册选择"];


/*
 * 0=身份证正面
 * 1=身份证反面
 * 2=行驶证主页
 * 3=行驶证副页
 * */
let selectType = 0;

/*
* 0  身份证有效期
* 1  行驶证有效期
* */
let selectDatePickerType = 0;


let userID = '';
let userName = '';
let userPhone = '';

let lastTime = 0;
let locationData = '';
let currentTime = 0;

class personCarOwnerAuth extends Component {
    constructor(props) {
        super(props);

        if (this.props.navigation.state.params) {
            const result = this.props.navigation.state.params.resultInfo;



            this.state = {
                appLoading: false,

                IDName: result.IDName,
                IDCard: result.IDCard,
                IDDate: result.IDDate,

                idCardImage: {uri: result.idCardImage} ,
                idCardTrunImage: {uri: result.idCardTrunImage} ,

                idFaceSideNormalPhotoAddress: result.idFaceSideNormalPhotoAddress, // 身份证正面原图
                idFaceSideThumbnailAddress: result.idFaceSideThumbnailAddress, // 身份证正面缩略图

                idBackSideNormalPhotoAddress: result.idBackSideNormalPhotoAddress, // 身份证反面原图
                idBackSideThumbnailAddress: result.idBackSideThumbnailAddress, // 身份证反面缩略图


                carNumber: result.carNumber,
                carOwner: result.carOwner,
                carEngineNumber: result.carEngineNumber,
                travelRightImage: {uri: result.travelRightImage} ,
                travelTrunRightImage:  {uri: result.travelTrunRightImage},
                drivingLicenseValidUntil: result.drivingLicenseValidUntil, // 行驶证有效期

                vehicleLicenseHomepageNormalPhotoAddress: result.vehicleLicenseHomepageNormalPhotoAddress, // 行驶证主页原图
                vehicleLicenseHomepageThumbnailAddress: result.vehicleLicenseHomepageThumbnailAddress, // 行驶证主页缩略图

                vehicleLicenseVicePageNormalPhotoAddress: result.vehicleLicenseVicePageNormalPhotoAddress, // 行驶证副页原图
                vehicleLicenseVicePageThumbnailAddress: result.vehicleLicenseVicePageThumbnailAddress, // 行驶证副页缩略图

                isChooseCardImage: result.isChooseCardImage,
                isChooseCardTrunImage: result.isChooseCardTrunImage,
                isChooseVehicleLicenseViceImage: result.isChooseVehicleLicenseViceImage,
                isChooseVehicleLicenseViceTrunImage: result.isChooseVehicleLicenseViceTrunImage,

                isShowCardInfo: result.IDCard ? true : false,
                isShowDriverInfo: result.carEngineNumber ? true : false,

                // 默认
                moRenidCardName: result.moRenidCardName, // 身份证解析姓名
                moRenidCard: result.moRenidCard, // 解析身份证号
                moRenidCardValidity: result.moRenidCardValidity, // 解析身份证有效期
                moRencarNum: result.moRencarNum, // 车牌号
                moRenhaverName: result.moRenhaverName, // 所有人
                moRenengineNum: result.moRenengineNum, // 发动机号码
                moRendrivingValidsity: result.moRendrivingValidity, // 行驶证有效期
            };
        }else {
            this.state = {
                appLoading: false,

                IDName: '',
                IDCard: '',
                IDDate: '',

                idCardImage: idCardRightImage,
                idCardTrunImage: idCardTrunRightImage,

                idFaceSideNormalPhotoAddress: '', // 身份证正面原图
                idFaceSideThumbnailAddress: '', // 身份证正面缩略图

                idBackSideNormalPhotoAddress: '', // 身份证反面原图
                idBackSideThumbnailAddress: '', // 身份证反面缩略图


                carNumber: '',
                carOwner: '',
                carEngineNumber: '',
                travelRightImage: travelRightImage,
                travelTrunRightImage: travelTrunRightImage,
                drivingLicenseValidUntil: '', // 行驶证有效期

                vehicleLicenseHomepageNormalPhotoAddress: '', // 行驶证主页原图
                vehicleLicenseHomepageThumbnailAddress: '', // 行驶证主页缩略图

                vehicleLicenseVicePageNormalPhotoAddress: '', // 行驶证副页原图
                vehicleLicenseVicePageThumbnailAddress: '', // 行驶证副页缩略图

                isChooseCardImage: false,
                isChooseCardTrunImage: false,
                isChooseVehicleLicenseViceImage: false,
                isChooseVehicleLicenseViceTrunImage: false,

                isShowCardInfo: false,
                isShowDriverInfo: false,

                // 默认
                moRenidCardName: '', // 身份证解析姓名
                moRenidCard: '', // 解析身份证号
                moRenidCardValidity: '', // 解析身份证有效期
                moRencarNum: '', // 车牌号
                moRenhaverName: '', // 所有人
                moRenengineNum: '', // 发动机号码
                moRendrivingValidity: '', // 行驶证有效期

            };
        }

        this.showDatePick = this.showDatePick.bind(this);
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.selectPhoto = this.selectPhoto.bind(this);
        this.selectCamera = this.selectCamera.bind(this);
        this.upLoadImage = this.upLoadImage.bind(this);
        this.upDataToHttp = this.upDataToHttp.bind(this);
        this.getCurrentPosition = this.getCurrentPosition.bind(this);

    }
    componentDidMount() {
        this.getCurrentPosition();

        userID = global.userId;
        userName = global.userName;
        userPhone = global.phone;

        /*相机拍照*/
        this.listener = DeviceEventEmitter.addListener('endSureCameraPhotoEnd', (imagePath) => {

            console.log('DeviceEventEmitter:', imagePath);

            if (Platform.OS === 'ios') {
                imagePath = 'file://' + imagePath;
            }

            let source = {uri: imagePath};

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {uri: imagePath, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,

            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('phoneNum', userPhone);
            formData.append('isShot', 'Y');
            switch (selectType) {
                case 0:
                    this.setState({
                        idCardImage: source,
                        isChooseCardImage: true
                    });

                    this.upLoadImage(API.API_GET_IDCARD_INFO, formData, 'camera');
                    break;
                case 1:
                    this.setState({
                        idCardTrunImage: source,
                        isChooseCardTrunImage: true,
                    });
                    this.upLoadImage(API.API_GET_IDCARD_TRUN_INFO, formData, 'camera');

                    break;
                case 2:
                    this.setState({
                        travelRightImage: source,
                        isChooseVehicleLicenseViceImage: true
                    });
                    this.upLoadImage(API.API_GET_TRAVEL_INFO, formData, 'camera');

                    break;
                case 3:
                    this.setState({
                        travelTrunRightImage: source,
                        isChooseVehicleLicenseViceTrunImage: true
                    });
                    this.upLoadImage(API.API_GET_TRAVEL_TRUN_INFO, formData, 'camera');

                    break;
            }
            this.setState({
                appLoading: true,
            });
        });

    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }

    /*显示日期选取器*/
    showDatePick(type) {

        let date = new Date();
        let selectValue = [];

        let year;
        let month;
        let day;
        if (type === 'cardID') {

            if (this.state.IDDate) {
                year = this.state.IDDate.substr(0, 4);
                month = this.state.IDDate.substr(5, 2);
                day = this.state.IDDate.substr(8, 2);
            } else {
                year = date.getUTCFullYear();
                month = date.getUTCMonth() + 1;
                day = date.getUTCDate();
            }

            selectValue = [year + '年', month + '月', day + '日'];

        }

        TimePicker.init({
            selectedValue: selectValue,
            isShowLongTime: true,
            pickerLongTimeText: '长期',
            pickerData: VerifiedDataSource.createDateData(),
            pickerToolBarFontSize: 16,
            pickerLongTimeFontSize: 16,
            pickerFontSize: 17,
            pickerFontColor: [0, 0, 0, 1],
            pickerBg: [255, 255, 255, 1],
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '有效期至',
            pickerConfirmBtnColor: [0, 121, 251, 1],
            pickerCancelBtnColor: [137, 137, 137, 1],
            pickerTitleColor: [20, 20, 20, 1],
            pickerLongTimeFontColor: [51, 51, 51, 1],
            pickerToolBarBg: [238, 238, 239, 1],
            pickerLongTimeBg: [255, 255, 255, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                console.log('onPickerConfirm', pickedValue, pickedIndex);
                if (pickedValue === '' || pickedValue.length === 0) {
                    console.log('长期');
                    if (selectDatePickerType === 0) {
                        this.setState({
                            IDDate: '长期',
                        });
                    } else {
                        this.setState({
                            drivingLicenseValidUntil: '长期',
                        });
                    }
                } else {
                    let year = pickedValue[0].substring(0, pickedValue[0].length - 1);
                    let month = pickedValue[1].substring(0, pickedValue[1].length - 1);

                    if (selectDatePickerType === 0) {
                        let day = pickedValue[2].substring(0, pickedValue[2].length - 1);
                        this.setState({
                            IDDate:Validator.timeTrunToDateString(year + month + day),
                        });
                    } else {
                        this.setState({
                            drivingLicenseValidUntil: Validator.timeTrunToDateString(year + month),
                        });
                    }

                }

            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('onPickerCanceldate', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('onPickerSelectdate', pickedValue, pickedIndex);
            }
        });

        TimePicker.show();
    }


    /*点击弹出菜单*/
    showAlertSelected() {
        this.dialog.show("请选择照片", selectedArr, '#333333', this.callbackSelected);
    }

    /*选择 拍照  相册*/
    callbackSelected(i) {
        switch (i) {
            case 0:
                // 拍照

                if (Platform.OS === 'ios') {
                    PermissionsManager.cameraPermission().then(data=>{
                        this.selectCamera();

                    }).catch(err=>{
                        // Toast.showShortCenter(err.message);
                        Alert.alert(null,err.message)
                    });
                }else{
                    PermissionsManagerAndroid.cameraPermission().then((data) => {
                        this.selectCamera();
                    }, (err) => {
                        Alert.alert('提示','请到设置-应用-授权管理设置相机权限');
                    });
                }
                break;
            case 1:
                if (Platform.OS === 'ios') {
                    // 图库
                    PermissionsManager.photoPermission().then(data=>{
                        this.selectPhoto();

                    }).catch(err=>{
                        // Toast.showShortCenter(err.message);
                        Alert.alert(null,err.message)

                    });
                }else
                    this.selectPhoto();

                break;
        }
    }

    /*选择相机*/
    selectCamera() {
        this.props.navigation.navigate('TakeCamearPage', {
            cameraType: selectType,
            verifiedType: 1,
        });
    }

    /*选择照片*/
    selectPhoto() {

        //  相册选项
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {uri: response.uri};

                let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
                let file = {uri: response.uri, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,

                formData.append("photo", file);   //这里的files就是后台需要的key
                formData.append('phoneNum', userPhone);
                formData.append('isShot', 'N');

                switch (selectType) {
                    case 0:
                        this.setState({
                            idCardImage: source,
                            isChooseCardImage: false
                        });

                        this.upLoadImage(API.API_GET_IDCARD_INFO, formData, 'photo');

                        break;
                    case 1:
                        this.setState({
                            idCardTrunImage: source,
                            isChooseCardTrunImage: false
                        });

                        this.upLoadImage(API.API_GET_IDCARD_TRUN_INFO, formData, 'photo');

                        break;

                    case 2:
                        this.setState({
                            travelRightImage: source,
                            isChooseVehicleLicenseViceImage: false
                        });
                        this.upLoadImage(API.API_GET_TRAVEL_INFO, formData, 'photo');
                        break;

                    case 3:
                        this.setState({
                            travelTrunRightImage: source,
                            isChooseVehicleLicenseViceTrunImage: false,

                        });
                        this.upLoadImage(API.API_GET_TRAVEL_TRUN_INFO, formData, 'photo');

                        break;

                }

                this.setState({
                    appLoading: true,
                });
            }
        });
    }
    /*上传图片*/
    upLoadImage(url, data, source) {

        upLoadImageManager(url,
            data,
            () => {
                console.log('开始请求数据');
            },
            (respones) => {
                console.log(respones);

                if (respones.code === 200) {
                    switch (selectType) {
                        case 0:
                            if (respones.result.idName && respones.result.idNum){
                            }else
                                Toast.showShortCenter('图片解析失败，请手动填写信息');

                            this.setState({
                                IDName: respones.result.idName,
                                IDCard: respones.result.idNum,

                                // 默认
                                moRenidCardName: respones.result.idName, // 身份证解析姓名
                                moRenidCard: respones.result.idNum, // 解析身份证号

                                idFaceSideNormalPhotoAddress: respones.result.idFaceSideNormalPhotoAddress,
                                idFaceSideThumbnailAddress: respones.result.idFaceSideThumbnailAddress,
                                isShowCardInfo : true,
                            });


                            break;
                        case 1:
                            if (respones.result.idValidUntil){
                            }else
                                Toast.showShortCenter('图片解析失败，请手动填写信息');

                            this.setState({
                                IDDate: Validator.timeTrunToDateString(respones.result.idValidUntil),

                                moRenidCardValidity:  Validator.timeTrunToDateString(respones.result.idValidUntil), // 解析身份证有效期

                                idBackSideNormalPhotoAddress: respones.result.idBackSideNormalPhotoAddress,
                                idBackSideThumbnailAddress: respones.result.idBackSideThumbnailAddress,
                                isShowCardInfo : true,
                            });

                            break;
                        case 2:
                            if (respones.result.plateNumber && respones.result.owner && respones.result.engineNumber) {
                            } else
                                Toast.showShortCenter('图片解析失败，请手动填写信息');

                            this.setState({
                                carNumber: respones.result.plateNumber,
                                carOwner: respones.result.owner,
                                carEngineNumber: respones.result.engineNumber,
                                vehicleLicenseHomepageNormalPhotoAddress: respones.result.vehicleLicenseHomepageNormalPhotoAddress,
                                vehicleLicenseHomepageThumbnailAddress: respones.result.vehicleLicenseHomepageThumbnailAddress,
                                isShowDriverInfo: true,

                                moRencarNum: respones.result.plateNumber, // 车牌号
                                moRenhaverName: respones.result.owner, // 所有人
                                moRenengineNum: respones.result.engineNumber, // 发动机号码

                            });

                            break;
                        case 3:
                            this.setState({
                                vehicleLicenseVicePageNormalPhotoAddress: respones.result.vehicleLicenseVicePageNormalPhotoAddress,
                                vehicleLicenseVicePageThumbnailAddress: respones.result.vehicleLicenseVicePageThumbnailAddress,
                                isShowDriverInfo: true,
                            });
                            break;
                    }
                }else
                    Toast.showShortCenter('解析失败，请重新上传');


                this.setState({
                    appLoading: false,
                });

            },
            (error) => {
                Toast.showShortCenter('解析失败，请重新上传');

                this.setState({
                    appLoading: false,
                });
            });
    }

    upDataToHttp(){
        currentTime = new Date().getTime();

        let obj = {
            userId: userID, //用户ID
            userName: userName, // 用户名
            busTel: userPhone, // 用户手机号
            companyNature: '个人', // 伙伴性质

            positiveCard: this.state.idFaceSideNormalPhotoAddress, // 身份证正面原图地址
            positiveCardThumbnail: this.state.idFaceSideThumbnailAddress, // 身份证正面缩略图地址
            oppositeCard: this.state.idBackSideNormalPhotoAddress, // 身份证反面原图地址
            oppositeCardThumbnail: this.state.idBackSideThumbnailAddress, // 身份证反面缩略图地址

            // personName: '', // 姓名
            // personCardCode: '', // 身份证号
            // personCardCodeTime: '', // 身份证有效期至
            // drivingCardTime: '', // 行驶证有效期


            drivingCardHomePage: this.state.vehicleLicenseHomepageNormalPhotoAddress, // 行驶证正面原图地址
            drivingCardHomePageThumbnail: this.state.vehicleLicenseHomepageThumbnailAddress, // 行驶证正面缩略图地
            drivingPermitSubPage: this.state.vehicleLicenseVicePageNormalPhotoAddress, // 行驶证反面原图地
            drivingPermitSubPageThumbnail: this.state.vehicleLicenseVicePageThumbnailAddress, // 行驶证反面缩略图地
            rmcAnalysisAndContrastQo:{ // 片解析信息

                manualIdCardName: this.state.IDName, // 手动修改的姓名
                manualIdCard: this.state.IDCard, // 修改的身份证号
                manualIdCardValidity: this.state.IDDate, // 修改身份证有效期
                manualCarNum: this.state.carNumber, // 修改后的车牌号
                manualHaverName: this.state.carOwner, // 修改的所有人
                manualEngineNum: this.state.carEngineNumber, // 修改的发动机号
                drivingValidity: this.state.drivingLicenseValidUntil, // 行驶证有效期
                // 默认
                idCardName: this.state.moRenidCardName, // 身份证解析姓名
                idCard: this.state.moRenidCard, // 解析身份证号
                idCardValidity: this.state.moRenidCardValidity, // 解析身份证有效期
                carNum: this.state.moRencarNum, // 车牌号
                haverName: this.state.moRenhaverName, // 所有人
                engineNum: this.state.moRenengineNum, // 发动机号码
            }
        };
        console.log(obj);
        HTTPRequest({
            url: API.API_COMPANY_CERTIFICATION,
            params: obj,
            loading: () => {
                this.setState({
                    appLoading: true,
                });
            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('个人车主认证', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '个人车主认证');

                Storage.remove(StorageKey.personownerInfoResult);
                Toast.showShortCenter('个人车主认证提交成功');
                this.props.navigation.navigate('Main',{CarOwnerState: true});

                this.props.setOwnerCharacterAction('11');

            },
            error: (errorInfo) => {

            },
            finish: () => {
                this.setState({
                    appLoading: false,
                });
            }
        });
    }



    render() {
        const navigator = this.props.navigation;

        const personCardInfo = this.state.isShowCardInfo ?
            <View>
                <VerifiedGrayTitleItem title="确认身份证基本信息"/>
                <VerifiedIDInfoItem IDName={this.state.IDName}
                                    IDCard={this.state.IDCard}
                                    nameChange={(text)=>{
                                        this.setState({
                                            IDName: text,
                                        });
                                    }}
                                    cardChange={(text)=>{
                                        this.setState({
                                            IDCard: text,
                                        });
                                    }}
                                    textOnFocus={()=>{
                                        if (Platform.OS === 'ios'){
                                            this.refs.scrollView.scrollTo({x: 0, y: 300, animated: true});
                                        }

                                    }}
                />
            </View> : null;

        const personCardDate = this.state.isShowCardInfo ?
            <View>
                <VerifiedIDDateItem IDDate={this.state.IDDate}
                                    clickDataPick={()=>{
                                        if (Platform.OS === 'ios'){
                                            this.refs.scrollView.scrollTo({x: 0, y: 350, animated: true});
                                        }
                                        selectDatePickerType = 0;
                                        this.showDatePick('cardID');
                                    }}/>
            </View> : null;


        const plat = Platform.OS === 'ios' ? 'on-drag' : 'none';

        let travelInfo = this.state.isShowDriverInfo ?
            <View>
                <VerifiedGrayTitleItem title="确认行驶证基本信息"/>
                <VerifiedTravelInfoItemOne carNumber={this.state.carNumber}
                                            carOwner={this.state.carOwner}
                                            carEngineNumber={this.state.carEngineNumber}
                                            carNumberChange={(text)=>{

                                                 this.setState({
                                                     carNumber: text,
                                                 });

                                            }}
                                            carOwnerChange={(text)=>{

                                                  this.setState({
                                                     carOwner: text,
                                                  });

                                            }}
                                            carEngineNumberChange={(text)=>{

                                                 this.setState({
                                                     carEngineNumber: text,
                                                 });

                                            }}
                                            textOnFocus={(value)=>{
                                                 if (Platform.OS === 'ios'){
                                                     this.refs.scrollView.scrollTo({x: 0, y: value, animated: true});

                                                 }

                                            }}
                />
            </View> : null;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'个人车主认证'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    backIconClick={() => {

                        const info = {
                            appLoading: false,
                            IDName: this.state.IDName,
                            IDCard: this.state.IDCard,
                            IDDate: this.state.IDDate,

                            idCardImage: this.state.idCardImage.uri || '../navigationBar/IdCardAdd.png',
                            idCardTrunImage: this.state.idCardTrunImage.uri || '../navigationBar/IdCardTurnAdd.png',

                            idFaceSideNormalPhotoAddress: this.state.idFaceSideNormalPhotoAddress, // 身份证正面原图
                            idFaceSideThumbnailAddress: this.state.idFaceSideThumbnailAddress , // 身份证正面缩略图

                            idBackSideNormalPhotoAddress: this.state.idBackSideNormalPhotoAddress, // 身份证反面原图
                            idBackSideThumbnailAddress: this.state.idBackSideThumbnailAddress , // 身份证反面缩略图


                            carNumber: this.state.carNumber,
                            carOwner: this.state.carOwner,
                            carEngineNumber: this.state.carEngineNumber,
                            travelRightImage: this.state.travelRightImage.uri || '../navigationBar/travelCardHome_right.png',
                            travelTrunRightImage: this.state.travelTrunRightImage.uri || '../navigationBar/travelCard_right.png',
                            drivingLicenseValidUntil: this.state.drivingLicenseValidUntil, // 行驶证有效期

                            vehicleLicenseHomepageNormalPhotoAddress: this.state.vehicleLicenseHomepageNormalPhotoAddress, // 行驶证主页原图
                            vehicleLicenseHomepageThumbnailAddress: this.state.vehicleLicenseHomepageThumbnailAddress, // 行驶证主页缩略图

                            vehicleLicenseVicePageNormalPhotoAddress: this.state.vehicleLicenseVicePageNormalPhotoAddress, // 行驶证副页原图
                            vehicleLicenseVicePageThumbnailAddress: this.state.vehicleLicenseVicePageThumbnailAddress, // 行驶证副页缩略图

                            isChooseCardImage: this.state.isChooseCardImage,
                            isChooseCardTrunImage: this.state.isChooseCardTrunImage,
                            isChooseVehicleLicenseViceImage: this.state.isChooseVehicleLicenseViceImage,
                            isChooseVehicleLicenseViceTrunImage: this.state.isChooseVehicleLicenseViceTrunImage,

                            // 默认
                            moRenidCardName: this.state.moRenidCardName, // 身份证解析姓名
                            moRenidCard: this.state.moRenidCard, // 解析身份证号
                            moRenidCardValidity: this.state.moRenidCardValidity, // 解析身份证有效期
                            moRencarNum: this.state.moRencarNum, // 车牌号
                            moRenhaverName: this.state.moRenhaverName, // 所有人
                            moRenengineNum: this.state.moRenengineNum, // 发动机号码
                            moRendrivingValidity: this.state.moRendrivingValidity, // 行驶证有效期
                        };

                        Storage.save(StorageKey.personownerInfoResult, info);
                        navigator.goBack();
                    }}
                />
                <ScrollView keyboardDismissMode={plat} ref="scrollView">
                    <VerifiedSpaceItem />
                    <VerifiedIDTitleItem title="身份证正面"/>
                    <VerifiedIDItemView showTitle="身份证号要清晰"
                                        leftImage={idCardLeftImage}
                                        rightImage={this.state.idCardImage}
                                        isChooseRight={this.state.isChooseCardImage}
                                        click={()=> {
                                            selectType=0;
                                            this.showAlertSelected();
                                        }}
                    />
                    <VerifiedLineItem />


                    <VerifiedIDTitleItem title="身份证反面"/>
                    <VerifiedIDItemView showTitle="身份信息要清晰"
                                        leftImage={idCardTrunLeftImage}
                                        rightImage={this.state.idCardTrunImage}
                                        isChooseRight={this.state.isChooseCardTrunImage}
                                        click={()=> {
                                            selectType=1;
                                            this.showAlertSelected();
                                        }}
                    />

                    {personCardInfo}
                    {personCardDate}

                    <VerifiedSpaceItem />

                    <VerifiedIDTitleItem title="行驶证主页"/>
                    <View style={{height: 15, backgroundColor: 'white'}}>
                        <Text
                            style={{ height: 1, marginTop: 14, marginLeft: 10, marginRight: 0, backgroundColor: '#f5f5f5',}}/>
                    </View>
                    <VerifiedIDDateItem IDDate={this.state.drivingLicenseValidUntil}
                                        clickDataPick={()=>{
                                             selectDatePickerType = 1;
                                             this.showDatePick(true, VerifiedDateSources.createDateDataYearMouth(), 'yearMouth');
                                        }}
                    />
                    <VerifiedLineItem />

                    <VerifiedIDItemView showTitle="证件要清晰，拍摄完整"
                                        leftImage={travelLeftImage}
                                        rightImage={this.state.travelRightImage}
                                        isChooseRight={this.state.isChooseVehicleLicenseViceImage}
                                        click={()=> {
                                            selectType=2;
                                            this.showAlertSelected();
                                        }}
                    />
                    <VerifiedLineItem />

                    <VerifiedIDTitleItem title="行驶证副页"/>
                    <VerifiedIDItemView showTitle="证件要清晰，拍摄完整"
                                        leftImage={travelTrunLeftImage}
                                        rightImage={this.state.travelTrunRightImage}
                                        isChooseRight={this.state.isChooseVehicleLicenseViceTrunImage}
                                        click={()=> {
                                            selectType=3;
                                            this.showAlertSelected();
                                        }}
                    />

                    {travelInfo}
                    <VierifiedBottomItem clickAction={()=>{
                        this.upDataToHttp();
                    }}/>
                </ScrollView>
                <AlertSheetItem ref={(dialog)=>{
                    this.dialog = dialog;
                }}/>

                {
                    this.state.appLoading ? <LoadingView /> : null
                }
            </View>
        )
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
});

function mapStateToProps(state){
    return {};
}


function mapDispatchToProps (dispatch){
    return {
        setOwnerCharacterAction: (result) => {
            dispatch(setOwnerCharacterAction(result));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(personCarOwnerAuth);

