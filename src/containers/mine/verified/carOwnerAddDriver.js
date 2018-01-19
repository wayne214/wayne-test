/**
 * Created by wangl on 2017/6/30.
 */
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
    TextInput
} from 'react-native';

import * as API from '../../../constants/api';
import ImagePicker from 'react-native-image-picker';
import TimePicker from 'react-native-picker-custom';

import NavigatorBar from '../../../common/navigationBar/navigationBar';
import VerifiedSpaceItem from './verifiedIDItem/verifiedSpaceItem';
import VerifiedIDTitleItem from './verifiedIDItem/verifiedIDTitleItem'
import VerifiedIDItemView from './verifiedIDItem/verifiedIDItem';
import VerifiedIDDateItem from './verifiedIDItem/verifiedIDInfoDateItem';
import VerifiedLineItem from './verifiedIDItem/verifiedLineItem';
import VerifiedGrayTitleItem from './verifiedIDItem/verifiedGrayTitleItem';
import VerifiedIDInfoItem from './verifiedIDItem/verifiedIDInfoItem';
import VerifiedCarInfoItem from './verifiedIDItem/verifiedCarInfoItem';
import VierifiedBottomItem from './verifiedIDItem/verifiedBottomItem';
import AlertSheetItem from '../../../common/alertSelected';
import {upLoadImageManager} from '../../../utils/upLoadImageToVerified';
import VerifiedDataSource from './verifiedIDItem/verifiedDateSource';
import LoadingView from '../../../utils/loading';
import Toast from '@remobile/react-native-toast';
import Storage from '../../../utils/storage';
import PermissionsManager from '../../../utils/permissionManager';
import PermissionsManagerAndroid from '../../../utils/permissionManagerAndroid';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import HTTPRequest from '../../../utils/httpRequest';
import { setUserNameAction } from '../../../action/user';
import StorageKey from '../../../constants/storageKeys';
import Validator from '../../../utils/validator';
import Line from './verifiedIDItem/verifiedLineItem';


const idCardLeftImage = require('./images/IdCardModel.png');
const idCardRightImage = require('./images/IdCardAdd.png');
const idCardTrunLeftImage = require('./images/IdCardTurnModel.png');
const idCardTrunRightImage = require('./images/IdCardTurnAdd.png');
const driverCardLeftImage = require('./images/driverModel.png');
const driverCardRightImage = require('./images/driverAdd.png');
const driverCardTrunLeftImage = require('./images/driverTrunModel.png');
const driverCardTrunRightImage = require('./images/driverTrunAdd.png');
const handCardTrunLeftImage = require('./images/handPicAdd.png');
const handCardTrunRightImage = require('./images/handPicModel.png');


const selectedArr = ["拍照", "从手机相册选择"];

let isFirstCarD = true;
let isFirstDriver = true;
/*
 * 0=身份证正面
 * 1=身份证反面
 * 2=驾驶证主页
 * 3=驾驶证副页
 * 4=手持身份证
 * */
let selectType = 0;
let selectDatePickerType = 0; // 0  身份证有效期  1  驾驶证有效期

let userID = '';
let userName = '';
let userPhone = '';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#f5f5f5',
    },
    textInputStyle:{
        ...Platform.select({
            ios: {
                marginTop: 15,
                marginBottom: 15,
            }
        }),
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
        flex: 2,
        textAlign: 'right',
    },
    titleStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        fontSize: 15,
        color: '#666666',
        flex: 1,
    },
});

class carOwnerAddDriver extends Component {

    constructor(props) {
        super(props);

        if (this.props.navigation.state.params){
            const result = this.props.navigation.state.params.resultInfo;

            isFirstCarD = result.idCardName ? false : true;
            isFirstDriver = result.driverCard ? false : true;

            this.state = {


                isChooseCardImage: result.isChooseCardImage ? true : false,
                isChooseCardTrunImage: result.isChooseCardTrunImage ? true : false,
                isChooseDriverCarImage: result.isChooseDriverCarImage ? true : false,
                isChooseDriverCarTrunImage: result.isChooseDriverCarTrunImage ? true : false,
                isChooseHandPicImage: result.isChooseHandPicImage ? true : false,

                appLoading: false,

                IDName: result.idCardName, // 身份证姓名
                IDCard: result.idCard, // 身份证ID
                idCardImage:  {uri: result.idFaceSideThumbnailAddress} , // 身份证正面图片url
                idCardTrunImage:  {uri: result.idBackSideThumbnailAddress} , // 身份证反面图片url
                idFaceSideNormalPhotoAddress: result.positiveCardRelative, // 身份证正面原图
                idFaceSideThumbnailAddress: result.idFaceSideThumbnailAddressRelative, // 身份证正面缩略图

                IDDate: result.idCardValidity, // 身份证有效期
                idBackSideNormalPhotoAddress: result.oppositeCardRelative, // 身份证反面原图
                idBackSideThumbnailAddress: result.idBackSideThumbnailAddressRelative, // 身份证饭反面缩略图

                drivingLicenseName: result.drivingLicenceName, // 驾驶证姓名
                drivingLicenseNum: result.driverCard, // 驾驶证号
                drivingLicenseStartDate: result.drivingLicenseStartDate, // 驾驶证发证日期
                drivingLicenseValidUntil: result.driverCardExpiry, // 驾驶证有效期
                motorcycleType: result.quasiCarType, // 驾驶证类型
                driverCarImage: {uri: result.drivingLicenseHomepageThumbnailAddress} , // 驾驶证正面图片url
                drivereCarTrunImage: {uri: result.drivingLicenseVicePageThumbnailAddress}, // 驾驶证反面图片url

                drivingLicenseHomepageNormalPhotoAddress: result.drivingLicenceHomePageRelative, // 驾驶证正面原图
                drivingLicenseHomepageThumbnailAddress: result.drivingLicenseHomepageThumbnailAddressRelative, // 驾驶证正面缩略图

                drivingLicenseVicePageNormalAddress: result.drivingLicenceSubPageRelative, // 驾驶证反面原图
                drivingLicenseVicePageThumbnailAddress: result.drivingLicenseVicePageThumbnailAddressRelative, // 驾驶证反面缩略图

                handleIDNormalPhotoAddress: result.handleIdNormalPhotoAddressRelative, // 手持身份证原图
                handleIDThumbnailAddress: result.handleIdThumbnailAddressRelative, // 手持身份证缩略图
                handPicImage: {uri: result.handleIdThumbnailAddress}, // 手持身份证图片url

                // 默认
                idCardNameRecognition: result.idCardNameRecognition, //识别身份证姓名
                idCardRecognition: result.idCardRecognition, //识别身份证号
                idCardValidityRecognition: result.idCardValidityRecognition, //识别身份证有效期

                drivingLicenceNameRecognition: result.drivingLicenceNameRecognition, // 识别驾驶证姓名
                driverCardRecognition: result.driverCardRecognition, // 识别驾驶证号
                quasiCarTypeRecognition: result.quasiCarTypeRecognition, // 识别准驾车型
                driverLicenseValidateRecognition: result.driverLicenseValidateRecognition,  // 识别驾驶证有效期
                enterPhone: result.enterPhone,
            };
        }else {

            this.state = {
                enterPhone:'',
                idCardImage: idCardRightImage,
                idCardTrunImage: idCardTrunRightImage,
                driverCarImage: driverCardRightImage,
                drivereCarTrunImage: driverCardTrunRightImage,
                handPicImage: handCardTrunRightImage,

                isChooseCardImage: false,
                isChooseCardTrunImage: false,
                isChooseDriverCarImage: false,
                isChooseDriverCarTrunImage: false,
                isChooseHandPicImage: false,
                appLoading: false,

                IDName: '', // 姓名
                IDCard: '', // 身份证号
                IDDate: '', // 有效期

                drivingLicenseName: '', // 驾驶证姓名
                drivingLicenseNum: '', // 驾驶证号
                drivingLicenseStartDate: '', // 驾驶证发证日期
                drivingLicenseValidUntil: '', // 驾驶证有效期
                motorcycleType: '', // 驾驶证类型

                idFaceSideNormalPhotoAddress: '', // 身份证正面原图
                idFaceSideThumbnailAddress: '', // 身份证正面缩略图

                idBackSideNormalPhotoAddress: '', // 身份证反面原图
                idBackSideThumbnailAddress: '', // 身份证反面缩略图

                drivingLicenseHomepageNormalPhotoAddress: '', // 驾驶证正面原图
                drivingLicenseHomepageThumbnailAddress: '', // 驾驶证正面缩略图

                drivingLicenseVicePageNormalAddress: '', // 驾驶证反面原图
                drivingLicenseVicePageThumbnailAddress: '', // 驾驶证反面缩略图

                handleIDNormalPhotoAddress: '', // 手持身份证原图
                handleIDThumbnailAddress: '', // 手持身份证缩略图

                // 默认
                idCardNameRecognition: '', //识别身份证姓名
                idCardRecognition: '', //识别身份证号
                idCardValidityRecognition: '', //识别身份证有效期

                drivingLicenceNameRecognition: '', // 识别驾驶证姓名
                driverCardRecognition: '', // 识别驾驶证号
                quasiCarTypeRecognition: '', // 识别准驾车型
                driverLicenseValidateRecognition: '',  // 识别驾驶证有效期
            };
        }

        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.selectPhoto = this.selectPhoto.bind(this);
        this.selectCamera = this.selectCamera.bind(this);

        this.upLoadImage = this.upLoadImage.bind(this);
        this.showDatePick = this.showDatePick.bind(this);
        this.checkUploadParams = this.checkUploadParams.bind(this);

        this.realNameVerified = this.realNameVerified.bind(this);

        this.isRightData = this.isRightData.bind(this);
        this.formatterTime = this.formatterTime.bind(this);
        this.popToTop = this.popToTop.bind(this);
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
                        IDName: '',
                        IDCard: '',
                        isChooseCardImage: true,
                    });
                    this.upLoadImage(API.API_GET_IDCARD_INFO, formData);
                    isFirstCarD = true;
                    break;
                case 1:
                    this.setState({
                        idCardTrunImage: source,
                        IDDate: '',
                        isChooseCardTrunImage: true,

                    });
                    this.upLoadImage(API.API_GET_IDCARD_TRUN_INFO, formData);

                    break;
                case 2:

                    this.setState({
                        driverCarImage: source,
                        drivingLicenseName: '',
                        drivingLicenseNum: '',
                        isChooseDriverCarImage: true,

                    });
                    this.upLoadImage(API.API_GET_DRIVER_INFO, formData);
                    isFirstDriver = true;

                    break;
                case 3:
                    this.setState({
                        drivereCarTrunImage: source,
                        isChooseDriverCarTrunImage: true,

                    });

                    this.upLoadImage(API.API_GET_DRIVER_TRUN_INFO, formData);

                    break;
                case 4:
                    this.setState({
                        handPicImage: source,
                        isChooseHandPicImage: true,
                    });
                    this.upLoadImage(API.API_GET_HAND_PIC_INFO, formData);

                    break;
            }
            this.setState({
                appLoading: true,
            });
        });



    }

    componentWillUnmount() {
        if (this.listener)
            this.listener.remove();
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
                            isChooseCardImage: false,
                        });
                        isFirstCarD = true;
                        this.upLoadImage(API.API_GET_IDCARD_INFO, formData);

                        break;
                    case 1:
                        this.setState({
                            idCardTrunImage: source,
                            isChooseCardTrunImage: false,
                        });

                        this.upLoadImage(API.API_GET_IDCARD_TRUN_INFO, formData);

                        break;
                    case 2:

                        this.setState({
                            driverCarImage: source,
                            isChooseDriverCarImage: false,
                        });
                        isFirstDriver = true;
                        this.upLoadImage(API.API_GET_DRIVER_INFO, formData);

                        break;
                    case 3:
                        this.setState({
                            drivereCarTrunImage: source,
                            isChooseDriverCarTrunImage: false,
                        });

                        this.upLoadImage(API.API_GET_DRIVER_TRUN_INFO, formData);

                        break;
                    case 4:
                        this.setState({
                            handPicImage: source,
                            isChooseHandPicImage: false,
                        });
                        this.upLoadImage(API.API_GET_HAND_PIC_INFO, formData);

                        break;
                }

                this.setState({
                    appLoading: true,
                });
            }
        });
    }

    /*上传图片*/
    upLoadImage(url, data) {
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

                                idCardNameRecognition: respones.result.idName, //识别身份证姓名
                                idCardRecognition: respones.result.idNum, //识别身份证号

                                idFaceSideNormalPhotoAddress: respones.result.idFaceSideNormalPhotoAddress,
                                idFaceSideThumbnailAddress: respones.result.idFaceSideThumbnailAddress,
                            });
                            isFirstCarD = false;

                            break;
                        case 1:
                            if (respones.result.idValidUntil){
                            }else
                                Toast.showShortCenter('图片解析失败，请手动填写信息');
                            this.setState({
                                IDDate: Validator.timeTrunToDateString(respones.result.idValidUntil),

                                idCardValidityRecognition: respones.result.idValidUntil, //识别身份证有效期

                                idBackSideNormalPhotoAddress: respones.result.idBackSideNormalPhotoAddress,
                                idBackSideThumbnailAddress: respones.result.idBackSideThumbnailAddress,
                            });
                            isFirstCarD = false;

                            break;
                        case 2:
                            if (respones.result.drivingLicenseName && respones.result.drivingLicenseNum){
                            }else
                                Toast.showShortCenter('图片解析失败，请手动填写信息');

                            let time = 0;
                            if (respones.result.drivingLicenseValidUntil.length <= 3){
                                // 返回有效期为  多少年的
                                time = parseInt(respones.result.drivingLicenseStartDate) + parseInt(respones.result.drivingLicenseValidUntil)*10000;
                            }else
                                time = parseInt(respones.result.drivingLicenseValidUntil);

                            this.setState({
                                drivingLicenseName: respones.result.drivingLicenseName, // 驾驶证姓名
                                drivingLicenseNum: respones.result.drivingLicenseNum, // 驾驶证号
                                drivingLicenseStartDate: respones.result.drivingLicenseStartDate, // 驾驶证发证日期
                                drivingLicenseValidUntil: Validator.timeTrunToDateString(time.toString()), // 驾驶证有效期

                                drivingLicenceNameRecognition: respones.result.drivingLicenseName, // 识别驾驶证姓名
                                driverCardRecognition: respones.result.drivingLicenseNum, // 识别驾驶证号
                                quasiCarTypeRecognition: respones.result.motorcycleType, // 识别准驾车型
                                driverLicenseValidateRecognition: respones.result.drivingLicenseValidUntil,  // 识别驾驶证有效期

                                motorcycleType: respones.result.motorcycleType, // 驾驶证类型
                                drivingLicenseHomepageNormalPhotoAddress: respones.result.drivingLicenseHomepageNormalPhotoAddress,
                                drivingLicenseHomepageThumbnailAddress: respones.result.drivingLicenseHomepageThumbnailAddress,
                            });
                            isFirstDriver = false;

                            break;
                        case 3:
                            this.setState({
                                drivingLicenseVicePageNormalAddress: respones.result.drivingLicenseVicePageNormalAddress,
                                drivingLicenseVicePageThumbnailAddress: respones.result.drivingLicenseVicePageThumbnailAddress,
                            });
                            isFirstDriver = false;

                            break;
                        case 4:
                            this.setState({
                                handleIDNormalPhotoAddress: respones.result.handleIDNormalPhotoAddress,
                                handleIDThumbnailAddress: respones.result.handleIDThumbnailAddress,
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

    // 返回到根界面
    popToTop() {
        const routes = this.props.routes;
        let key = routes[1].key;
        this.props.navigation.goBack(key);
    }


    /*显示日期选取器*/
    showDatePick(type, longTime) {

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

        } else {

            if (this.state.drivingLicenseValidUntil) {
                year = this.state.drivingLicenseValidUntil.substr(0, 4);
                month = this.state.drivingLicenseValidUntil.substr(5, 2);
                day = this.state.drivingLicenseValidUntil.substr(8, 2);
            } else {
                year = date.getUTCFullYear();
                month = date.getUTCMonth() + 1;
                day = date.getUTCDate();
            }

            selectValue = [year + '年', month + '月', day + '日'];

        }


        TimePicker.init({
            selectedValue: selectValue,
            isShowLongTime: longTime,
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
                    console.log('onPickerConfirmdate', pickedValue, pickedIndex);
                    let year = pickedValue[0].substring(-0, pickedValue[0].length - 1);
                    let month = pickedValue[1].substring(-0, pickedValue[1].length - 1);
                    let day = pickedValue[2].substring(-0, pickedValue[2].length - 1);

                    console.log('year:',year);
                    console.log('month:',month);
                    console.log('day:',day);


                    if (selectDatePickerType === 0) {
                        this.setState({
                            IDDate: Validator.timeTrunToDateString(year + month + day),
                        });
                    } else {
                        this.setState({
                            drivingLicenseValidUntil: Validator.timeTrunToDateString(year + month + day),
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

    /*上传图片，调用接口*/
    checkUploadParams() {

        if (this.state.idFaceSideNormalPhotoAddress === '' && this.state.idFaceSideThumbnailAddress === '') {
            Toast.showShortCenter('请上传身份证正面照片');
            return;
        }
        if (this.state.idBackSideNormalPhotoAddress === '' && this.state.idBackSideThumbnailAddress === '') {
            Toast.showShortCenter('请上传身份证反面照片');
            return;
        }
        if (this.state.drivingLicenseHomepageNormalPhotoAddress === '' && this.state.drivingLicenseHomepageThumbnailAddress === '') {
            Toast.showShortCenter('请上传驾驶证正面照片');
            return;
        }
        if (this.state.drivingLicenseVicePageNormalAddress === '' && this.state.drivingLicenseVicePageThumbnailAddress === '') {
            Toast.showShortCenter('请上传驾驶证反面照片');
            return;
        }
        if (this.state.handleIDNormalPhotoAddress === '' && this.state.handleIDThumbnailAddress === '') {
            Toast.showShortCenter('请上传手持身份证照片');
            return;
        }
        if (this.state.IDName === '') {
            Toast.showShortCenter('请输入身份证姓名');
            return;
        }
        if (this.state.IDCard === '') {
            Toast.showShortCenter('请输入身份证证号');
            return;
        }

        let date = this.state.IDDate;

        if (date === '' ) {
            Toast.showShortCenter('请选择身份证有效期');
            return;
        }
        if (this.state.drivingLicenseName === '') {
            Toast.showShortCenter('请输入驾驶证姓名');
            return;
        }
        if (this.state.drivingLicenseNum === '') {
            Toast.showShortCenter('请输入驾驶证证号');
            return;
        }
        if (this.state.motorcycleType === '') {
            Toast.showShortCenter('请输入准驾车型');
            return;
        }

        let carddate = this.state.IDDate.replace(/(^\s*)|(\s*$)/g, ''); //  去除前面的空格

        let dataString = this.state.drivingLicenseValidUntil.replace(/(^\s*)|(\s*$)/g, ''); //  去除前面的空格

        if (dataString === '') {
            Toast.showShortCenter('请输入驾驶证有效期');
            return;
        }

        if (!this.isRightData(carddate)){
            Toast.showShortCenter('所选择的身份证有效期应大于今天，请重新选择');

            return;
        }
        if (!this.isRightData(dataString)){
            Toast.showShortCenter('所选择的驾驶证有效期应大于今天，请重新选择');

            return;
        }

        console.log('身份证姓名：', this.state.IDName);
        console.log('身份证证号：', this.state.IDCard);
        console.log('身份证有效期：', carddate);

        console.log('默认身份证姓名：', this.state.idCardNameRecognition);
        console.log('默认身份证证号：', this.state.idCardRecognition);
        console.log('默认身份证有效期：', this.state.idCardValidityRecognition);


        console.log('驾驶证姓名：', this.state.drivingLicenseName);
        console.log('驾驶证证号：', this.state.drivingLicenseNum);
        console.log('准驾车型：', this.state.motorcycleType);
        console.log('驾驶证有效期：', dataString);

        console.log('默认驾驶证姓名：', this.state.drivingLicenceNameRecognition);
        console.log('默认驾驶证证号：', this.state.driverCardRecognition);
        console.log('默认准驾车型：', this.state.quasiCarTypeRecognition);
        console.log('默认驾驶证有效期：', this.state.driverLicenseValidateRecognition);

        console.log('身份证正面原图：', this.state.idFaceSideNormalPhotoAddress);
        console.log('身份证正面缩略图：', this.state.idFaceSideThumbnailAddress);

        console.log('身份证反面原图：', this.state.idBackSideNormalPhotoAddress);
        console.log('身份证反面缩略图：', this.state.idBackSideThumbnailAddress);

        console.log('驾驶证正面原图：', this.state.drivingLicenseHomepageNormalPhotoAddress);
        console.log('驾驶证正面缩略图：', this.state.drivingLicenseHomepageThumbnailAddress);

        console.log('驾驶证反面原图：', this.state.drivingLicenseVicePageNormalAddress);
        console.log('驾驶证反面缩略图：', this.state.drivingLicenseVicePageThumbnailAddress);

        console.log('手持身份证原图：', this.state.handleIDNormalPhotoAddress);
        console.log('手持身份证缩略图：', this.state.handleIDThumbnailAddress);


        this.setState({
            appLoading: true,
        });
        this.realNameVerified(dataString, carddate);

    }

    formatterTime(date){
        date = date.replace('年', '-');
        date = date.replace('月', '-');
        date = date.replace('日', '');
        date = date.replace('', ' ');

        return date;
    }
    isRightData (date){
        date = this.formatterTime(date);

        const todayTimestamp = new Date().getTime();
        const selectTimestamp = new Date(date).getTime().toString();

        if (parseFloat(selectTimestamp) <= parseFloat(todayTimestamp)) {
            return false;
        }

        return true;

    }


    /*增加司机*/
    realNameVerified(dataString, date) {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_AUTH_REALNAME_COMMIT,
            params: {
                drivingLicenseHomepageNormalPhotoAddress: this.state.drivingLicenseHomepageNormalPhotoAddress,
                drivingLicenseHomepageThumbnailAddress: this.state.drivingLicenseHomepageThumbnailAddress,
                drivingLicenseName: this.state.drivingLicenseName,
                drivingLicenseNum: this.state.drivingLicenseNum,
                drivingLicenseValidUntil: dataString,
                drivingLicenseVicePageNormalAddress: this.state.drivingLicenseVicePageNormalAddress,
                drivingLicenseVicePageThumbnailAddress: this.state.drivingLicenseVicePageThumbnailAddress,
                handleIDNormalPhotoAddress: this.state.handleIDNormalPhotoAddress,
                handleIDThumbnailAddress: this.state.handleIDThumbnailAddress,
                idBackSideNormalPhotoAddress: this.state.idBackSideNormalPhotoAddress,
                idBackSideThumbnailAddress: this.state.idBackSideThumbnailAddress,
                idFaceSideNormalPhotoAddress: this.state.idFaceSideNormalPhotoAddress,
                idFaceSideThumbnailAddress: this.state.idFaceSideThumbnailAddress,
                idName: this.state.IDName,
                idNum: this.state.IDCard,
                idValidUntil: date,
                motorcycleType: this.state.motorcycleType,
                phoneNum: this.state.enterPhone,
                userId: userID,
                userName: this.state.IDName,
                companyPhone: userPhone,

                // 默认
                idCardNameRecognition: this.state.idCardNameRecognition, //识别身份证姓名
                idCardRecognition: this.state.idCardRecognition, //识别身份证号
                idCardValidityRecognition: Validator.timeTrunToDateString(this.state.idCardValidityRecognition), //识别身份证有效期
                drivingLicenceNameRecognition: this.state.drivingLicenceNameRecognition, // 识别驾驶证姓名
                driverCardRecognition: this.state.driverCardRecognition, // 识别驾驶证号
                quasiCarTypeRecognition: this.state.quasiCarTypeRecognition, // 识别准驾车型
                driverLicenseValidateRecognition: Validator.timeTrunToDateString(this.state.driverLicenseValidateRecognition),  // 识别驾驶证有效期
            },
            loading: () => {

            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('提交增加司机', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '增加司机页面');
                this.setState({
                    appLoading: false,
                });

                //this.props.reloadUserName(this.state.IDName);

                Storage.remove(StorageKey.carOwnerAddDriverInfo);
                //Storage.remove(StorageKey.personInfoResult);
                Toast.showShortCenter('增加司机提交成功');
                DeviceEventEmitter.emit('addDriverPage');

                // this.popToTop();
                this.props.navigation.goBack();

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

        const IDInfoTitle = (!isFirstCarD) ?
            <View>
                <VerifiedGrayTitleItem title="确认身份证基本信息"/>

            </View> : null;
        const IDCardInfo = (!isFirstCarD) ?
            <View>

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

        const IDCardDate = (!isFirstCarD) ?
            <View>
                <VerifiedIDDateItem IDDate={this.state.IDDate}
                                    clickDataPick={()=>{
                                        if (Platform.OS === 'ios'){
                                            this.refs.scrollView.scrollTo({x: 0, y: 350, animated: true});
                                        }
                                        selectDatePickerType = 0;
                                        this.showDatePick('cardID', true);
                                    }}/>
            </View> : null;

        const carInfo = (!isFirstDriver) ?
            <View>
                <VerifiedGrayTitleItem title="确认驾驶证基本信息"/>
                <VerifiedCarInfoItem drivingLicenseName={this.state.drivingLicenseName}
                                     drivingLicenseNum={this.state.drivingLicenseNum}
                                     drivingLicenseStartDate={this.state.drivingLicenseStartDate}
                                     drivingLicenseValidUntil={this.state.drivingLicenseValidUntil}
                                     motorcycleType={this.state.motorcycleType}
                                     clickDataPicker={()=>{
                                         if (Platform.OS === 'ios'){
                                             this.refs.scrollView.scrollToEnd();
                                         }
                                         selectDatePickerType = 1;
                                         this.showDatePick('driverID', true);
                                     }}
                                     nameChange={(text)=>{
                                          this.setState({
                                              drivingLicenseName: text, // 驾驶证姓名
                                          });
                                     }}
                                     cardChange={(text)=>{
                                        this.setState({
                                            drivingLicenseNum: text, // 驾驶证号
                                        });
                                     }}
                                     carTypeChange={(text)=>{
                                          this.setState({
                                              motorcycleType: text, // 驾驶证类型
                                          });
                                     }}
                                     textOnFocus={()=>{
                                          if (Platform.OS === 'ios'){
                                              this.refs.scrollView.scrollToEnd();
                                          }
                                     }}

                />
            </View> : null;

        const plat = Platform.OS === 'ios' ? 'on-drag' : 'none';


        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'新增司机'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    backIconClick={() => {

                        if (this.state.idCardTrunImage){
                            console.log('this.state.idCardTrunImage', this.state.idCardTrunImage);

                            console.log('this.state.idCardTrunImage.uri:', this.state.idCardTrunImage.uri);
                        }else{
                            console.log('./navigationBar/IdCardTurnAdd.png');
                        }

                        let info = {
                            appLoading: false,

                            idCardName: this.state.IDName, // 身份证姓名
                            idCard: this.state.IDCard, // 身份证ID
                            idFaceSideThumbnailAddress: this.state.idCardImage.uri ? this.state.idCardImage.uri : '../navigationBar/IdCardAdd.png', // 身份证正面图片url
                            idBackSideThumbnailAddress: this.state.idCardTrunImage.uri ? this.state.idCardTrunImage.uri : '../navigationBar/IdCardTurnAdd.png', // 身份证反面图片url
                            positiveCardRelative: this.state.idFaceSideNormalPhotoAddress, // 身份证正面原图
                            idFaceSideThumbnailAddressRelative: this.state.idFaceSideThumbnailAddress, // 身份证正面缩略图

                            idCardValidity: this.state.IDDate, // 身份证有效期
                            oppositeCardRelative: this.state.idBackSideNormalPhotoAddress, // 身份证反面原图
                            idBackSideThumbnailAddressRelative: this.state.idBackSideThumbnailAddress, // 身份证饭反面缩略图

                            drivingLicenceName: this.state.drivingLicenseName, // 驾驶证姓名
                            driverCard: this.state.drivingLicenseNum, // 驾驶证号
                            drivingLicenseStartDate: this.state.drivingLicenseStartDate, // 驾驶证发证日期
                            driverCardExpiry: this.state.drivingLicenseValidUntil, // 驾驶证有效期
                            quasiCarType: this.state.motorcycleType, // 驾驶证类型
                            drivingLicenseHomepageThumbnailAddress: this.state.driverCarImage.uri ? this.state.driverCarImage.uri : '../navigationBar/driverAdd.png', // 驾驶证正面图片url
                            drivingLicenseVicePageThumbnailAddress: this.state.drivereCarTrunImage.uri ? this.state.drivereCarTrunImage.uri : '../navigationBar/driverTrunAdd.png', // 驾驶证反面图片url

                            drivingLicenceHomePageRelative: this.state.drivingLicenseHomepageNormalPhotoAddress, // 驾驶证正面原图
                            drivingLicenseHomepageThumbnailAddressRelative: this.state.drivingLicenseHomepageThumbnailAddress, // 驾驶证正面缩略图

                            drivingLicenceSubPageRelative: this.state.drivingLicenseVicePageNormalAddress, // 驾驶证反面原图
                            drivingLicenseVicePageThumbnailAddressRelative: this.state.drivingLicenseVicePageThumbnailAddress, // 驾驶证反面缩略图

                            handleIdNormalPhotoAddressRelative: this.state.handleIDNormalPhotoAddress, // 手持身份证原图
                            handleIdThumbnailAddressRelative: this.state.handleIDThumbnailAddress, // 手持身份证缩略图
                            handleIdThumbnailAddress: this.state.handPicImage.uri ? this.state.handPicImage.uri : '../navigationBar/handPicModel.png', // 手持身份证图片url

                            isChooseCardImage: this.state.isChooseCardImage,
                            isChooseCardTrunImage: this.state.isChooseCardTrunImage,
                            isChooseDriverCarImage: this.state.isChooseDriverCarImage,
                            isChooseDriverCarTrunImage: this.state.isChooseDriverCarTrunImage,
                            isChooseHandPicImage: this.state.isChooseHandPicImage,
                            enterPhone: this.state.enterPhone,
                        };
                        Storage.save(StorageKey.carOwnerAddDriverInfo, info);
                        navigator.goBack();
                    }}
                />
                <ScrollView keyboardDismissMode={plat} ref="scrollView">
                    <VerifiedSpaceItem />

                    <View>
                        <View style={{flexDirection: 'row',backgroundColor:'white'}}>
                            <Text style={styles.titleStyle}>
                                手机号码
                            </Text>
                            <TextInput style={styles.textInputStyle}
                                       maxLength={15}
                                       underlineColorAndroid={'transparent'}
                                       onChangeText={(text) => {
                                           this.setState({
                                               enterPhone: text,
                                           });
                                       }}
                                       value={this.state.enterPhone}
                                       placeholder={'请输入手机号'}
                                       keyboardType='number-pad'

                            />
                        </View>
                        <Line/>
                        <View style={{backgroundColor: 'white',padding: 10, flexDirection: 'row'}}>
                            <Text style={{color: 'red'}}>*</Text>
                            <Text>
                                此手机号码是司机当前使用的手机号码，请谨慎填写。
                            </Text>
                        </View>
                    </View>

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

                    {IDInfoTitle}
                    {IDCardInfo}
                    {IDCardDate}

                    <VerifiedSpaceItem />


                    <VerifiedIDTitleItem title="驾驶证主页"/>
                    <VerifiedIDItemView showTitle="驾驶证号要清晰"
                                        leftImage={driverCardLeftImage}
                                        rightImage={this.state.driverCarImage}
                                        isChooseRight={this.state.isChooseDriverCarImage}

                                        click={()=> {
                                            selectType=2;
                                            this.showAlertSelected();
                                        }}
                    />
                    <VerifiedLineItem />


                    <VerifiedIDTitleItem title="驾驶证副页"/>
                    <VerifiedIDItemView showTitle="档案编号要清晰"
                                        leftImage={driverCardTrunLeftImage}
                                        rightImage={this.state.drivereCarTrunImage}
                                        isChooseRight={this.state.isChooseDriverCarTrunImage}

                                        click={()=> {
                                            selectType=3;
                                            this.showAlertSelected();
                                        }}
                    />


                    {carInfo}


                    <VerifiedGrayTitleItem title="手持身份证照"/>
                    <VerifiedIDItemView showTitle="头部、证件完整，号码清晰"
                                        leftImage={handCardTrunLeftImage}
                                        rightImage={this.state.handPicImage}
                                        isChooseRight={this.state.isChooseHandPicImage}

                                        click={()=> {
                                            selectType=4;
                                            this.showAlertSelected();
                                        }}
                    />


                    <VierifiedBottomItem clickAction={()=>{
                        this.checkUploadParams();
                    }}/>

                </ScrollView>
                <AlertSheetItem ref={(dialog)=>{
                    this.dialog = dialog;
                }}/>

                {
                    this.state.appLoading ? <LoadingView /> : null
                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        reloadUserName:(data)=>{
            dispatch(setUserNameAction(data));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(carOwnerAddDriver);
