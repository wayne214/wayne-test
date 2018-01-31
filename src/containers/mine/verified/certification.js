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
    Alert
} from 'react-native';

import * as API from '../../../constants/api';
import { NavigationActions } from 'react-navigation';

import ImagePicker from 'react-native-image-picker';
import TimePicker from 'react-native-picker-custom';

import NavigatorBar from '../../../common/navigationBar/navigationBar';
import VerifiedSpaceItem from './verifiedIDItem/verifiedSpaceItem';
import VerifiedIDTitleItem from './verifiedIDItem/verifiedIDTitleItem'
import VerifiedIDItemView from './verifiedIDItem/verifiedIDItem';
import VerifiedLineItem from './verifiedIDItem/verifiedLineItem';
import VerifiedGrayTitleItem from './verifiedIDItem/verifiedGrayTitleItem';
import VerifiedTravelInfoItem from './verifiedIDItem/verifiedTravelInfoItem';
import VierifiedBottomItem from './verifiedIDItem/verifiedBottomItem';
import AlertSheetItem from '../../../common/alertSelected';
import VerifiedIDDateItem from './verifiedIDItem/verifiedIDInfoDateItem';
import {upLoadImageManager} from '../../../utils/upLoadImageToVerified';
import VerifiedTravelPaperItem from './verifiedIDItem/verifiedTravelPaperItem';
import VerifiedDateSources from './verifiedIDItem/verifiedDateSource';
import HTTPRequest from '../../../utils/httpRequest';
import {setUserCarAction} from '../../../action/user';
import StorageKey from '../../../constants/storageKeys';
import LoadingView from '../../../utils/loading';
import Toast from '@remobile/react-native-toast';
import Validator from '../../../utils/validator';

import Storage from '../../../utils/storage';
import PermissionsManager from '../../../utils/permissionManager';
import PermissionsManagerAndroid from '../../../utils/permissionManagerAndroid';

const travelLeftImage = require('./images/travelCardHome.png');
const travelRightImage = require('./images/travelCardHome_right.png');
const travelTrunLeftImage = require('./images/travelCard.png');
const travelTrunRightImage = require('./images/travelCard_right.png');
const qiangxianLeftImage = require('./images/qiangxian.png');
const qiangxianRightImage = require('./images/qiangxian_right.png');
const carHeaderLeftImage = require('./images/carheader.png');
const carHeaderRightImage = require('./images/carheader_right.png');


const selectedArr = ["拍照", "从手机相册选择"];

let carWeightDataSource = {};
let userID = '';
let userName = '';
let userPhone = '';


/*
 * 0=行驶证主页
 * 1=行驶证副页
 * 2=交强险
 * 3=车头照
 * */
let selectType = 0;
let selectDatePickerType = 0; // 0  行驶证有效期  1  交强险有效期   2  车辆类型   3   车长

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

class certification extends Component {

    constructor(props) {
        super(props);
        /*从认证驳回跳转到此页面，传递过来详细的信息*/
        if (this.props.navigation.state.params && this.props.navigation.state.params.resultInfo) {

            const result = this.props.navigation.state.params.resultInfo;


            this.state = {

                isFirst: result.carNum? true : false,
                appLoading: false,

                isChooseTravelRightImage: result.isChooseTravelRightImage ? true : false,
                isChooseTravelTrunRightImage: result.isChooseTravelTrunRightImage ? true : false,

                carNumber: result.carNum, // 车牌号
                carOwner: result.haverName, // 所有人
                carEngineNumber: result.engineNumber, // 发动机编号
                carType: result.carType, // 车辆类型
                carLength: result.carLen, // 车长
                carWeight: result.carryCapacity, // 载重
                carDate: result.driveValidity, // 行驶证有效期至
                insuranceData: result.insuranceDate, // 强险有效期至


                travelRightImage: {uri: result.drivingLicenseThumbnail} ,
                travelTrunRightImage: {
                    uri: result.drivingLicenseSecondaryThumbnail ?
                        result.drivingLicenseSecondaryThumbnail : '../navigationBar/driverTrunAdd.png'
                } ,
                qiangxianRightImage: {uri: result.insuranceThumbnail},
                carHeaderRightImage: {uri: result.carHeadThumbnail},


                vehicleLicenseHomepageNormalPhotoAddress: result.drivingLicensePicRelative, // 行驶证主页原图
                vehicleLicenseHomepageThumbnailAddress: result.drivingLicenseThumbnailRelative, // 行驶证主页缩略图

                vehicleLicenseVicePageNormalPhotoAddress: result.drivingLicenseSecondaryPicRelative, // 行驶证副页原图
                vehicleLicenseVicePageThumbnailAddress: result.drivingLicenseSecondaryThumbnailRelative, // 行驶证副页缩略图

                handleIDNormalPhotoAddress: result.insurancePicRelative, // 强险原图
                insuranceThumbnailAddress: result.insuranceThumbnailRelative, // 强险缩略图

                vehicleNormalPhotoAddress: result.carHeadPicRelative, // 车头照原图
                vehicleThumbnailAddress: result.carHeadThumbnailRelative, // 车头照缩略图

                analysisCarNum: result.analysisCarNum, // 解析车牌号
                analysisHaverName:result.analysisHaverName, // 解析所有人
                analysisEngineNum:result.analysisEngineNum, //  解析发动机号
            };
        } else {
            this.state = {
                travelRightImage,
                travelTrunRightImage,
                qiangxianRightImage,
                carHeaderRightImage,

                isChooseTravelRightImage: false,
                isChooseTravelTrunRightImage: false,

                carNumber: '', // 车牌号
                carOwner: '', // 所有人
                carType: '', // 车辆类型
                carLength: '', // 车长
                carWeight: '', // 载重
                carDate: '请选择有效期', // 有效期
                carEngineNumber: '', // 发动机号码

                insuranceData: '请选择有效期', // 交强险
                appLoading: false,


                vehicleLicenseHomepageNormalPhotoAddress: '', // 行驶证主页原图
                vehicleLicenseHomepageThumbnailAddress: '', // 行驶证主页缩略图

                vehicleLicenseVicePageNormalPhotoAddress: '', // 行驶证副页原图
                vehicleLicenseVicePageThumbnailAddress: '', // 行驶证副页缩略图

                handleIDNormalPhotoAddress: '', // 交强险原图
                insuranceThumbnailAddress: '', // 交强险缩略图

                vehicleNormalPhotoAddress: '', // 车头照原图
                vehicleThumbnailAddress: '', // 车头照缩略图

                analysisCarNum: '', // 解析车牌号
                analysisHaverName:'', // 解析所有人
                analysisEngineNum:'', //  解析发动机号
            };
        }
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.selectPhoto = this.selectPhoto.bind(this);
        this.selectCamera = this.selectCamera.bind(this);
        this.upLoadImage = this.upLoadImage.bind(this);
        this.showDatePick = this.showDatePick.bind(this);
        this.checkUploadParams = this.checkUploadParams.bind(this);
        this.implementationVerified = this.implementationVerified.bind(this);
        this.getCarLengthWeight = this.getCarLengthWeight.bind(this);
        this.isRightData = this.isRightData.bind(this);
        this.popToTop = this.popToTop.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        this.getCarLengthWeight();


        console.log('this.props.currentStatus: ',this.props.currentStatus);

        userID = global.userId;
        userName = global.userName;
        userPhone = global.phone;


        this.listener = DeviceEventEmitter.addListener('endSureCameraPhotoEnd', (imagePath) => {

            imagePath = 'file://' + imagePath;

            let source = {uri: imagePath};

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {uri: imagePath, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,

            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('phoneNum', userPhone);
            formData.append('isShot', 'Y');

            switch (selectType) {
                case 0:
                    this.setState({
                        travelRightImage: source,
                        carOwner: '',
                        isChooseTravelRightImage: true,
                        isFirst: false
                    });
                    this.upLoadImage(API.API_GET_TRAVEL_INFO, formData);

                    break;
                case 1:
                    this.setState({
                        travelTrunRightImage: source,
                        isChooseTravelTrunRightImage: true,
                        isFirst: false
                    });
                    this.upLoadImage(API.API_GET_TRAVEL_TRUN_INFO, formData);


                    break;
                case 2:
                    this.setState({
                        qiangxianRightImage: source,
                    });
                    this.upLoadImage(API.API_GET_SEND_QIANGXIAN_INFO, formData);

                    break;
                case 3:
                    this.setState({
                        carHeaderRightImage: source,
                    });
                    this.upLoadImage(API.API_GET_CAR_HEADER_INFO, formData);

                    break;
                default:
                    break
            }
            this.setState({
                appLoading: true,
            });

        });


    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
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

    /*获取车长载重数据*/
    getCarLengthWeight() {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_LENGTH_AND_WEIGHT_COMMIT,
            params: {},
            loading: () => {

            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取车长载重', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '司机增加车辆页面');
                for (let i = 0; i < responseData.result.length; i++) {

                    let key = responseData.result[i].carLen;
                    let valu = responseData.result[i].carryCapacity;

                    carWeightDataSource[key] = valu;
                }
            },
            error: (errorInfo) => {

            },
            finish: () => {
            }
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
                    PermissionsManager.cameraPermission().then(data => {
                        this.selectCamera();

                    }).catch(err => {
                        Alert.alert(null, err.message);

                    });
                } else {
                    PermissionsManagerAndroid.cameraPermission().then((data) => {
                        this.selectCamera();
                    }, (err) => {
                        Alert.alert('提示', '请到设置-应用-授权管理设置相机权限');
                    });
                }

                break;
            case 1:
                if (Platform.OS === 'ios') {
                    // 图库
                    PermissionsManager.photoPermission().then(data => {
                        this.selectPhoto();

                    }).catch(err => {
                        // Toast.showShortCenter(err.message);
                        Alert.alert(null, err.message)

                    });
                } else
                    this.selectPhoto();
                break;
        }
    }

    /*选择相机*/
    selectCamera() {

        if (selectType < 2) {
            this.props.navigation.navigate('TakeCamearPage', {
                cameraType: selectType + 5,
                verifiedType: 2,
            });
        } else {
            this.props.navigation.navigate('TakeCameraVer', {
                cameraType: selectType,
            });
        }
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
                            travelRightImage: source,
                            isChooseTravelRightImage: false,
                            isFirst: false
                        });
                        this.upLoadImage(API.API_GET_TRAVEL_INFO, formData);
                        break;
                    case 1:
                        this.setState({
                            travelTrunRightImage: source,
                            isChooseTravelTrunRightImage: false,
                            isFirst: false
                        });
                        this.upLoadImage(API.API_GET_TRAVEL_TRUN_INFO, formData);


                        break;
                    case 2:
                        this.setState({
                            qiangxianRightImage: source,
                        });
                        this.upLoadImage(API.API_GET_SEND_QIANGXIAN_INFO, formData);

                        break;
                    case 3:
                        this.setState({
                            carHeaderRightImage: source,
                        });
                        this.upLoadImage(API.API_GET_CAR_HEADER_INFO, formData);

                        break;
                    default:
                        break
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

                            if (respones.result.plateNumber && respones.result.owner && respones.result.engineNumber) {
                                this.setState({
                                    carNumber: respones.result.plateNumber === 'FailInRecognition' ? '' : respones.result.plateNumber,
                                    carOwner: respones.result.owner === 'FailInRecognition' ? '' : respones.result.owner,
                                    carEngineNumber: respones.result.engineNumber === 'FailInRecognition' ? '' : respones.result.engineNumber,

                                    analysisCarNum: respones.result.plateNumber, // 解析车牌号
                                    analysisHaverName:respones.result.owner, // 解析所有人
                                    analysisEngineNum:respones.result.engineNumber, //  解析发动机号

                                    vehicleLicenseHomepageNormalPhotoAddress: respones.result.vehicleLicenseHomepageNormalPhotoAddress,
                                    vehicleLicenseHomepageThumbnailAddress: respones.result.vehicleLicenseHomepageThumbnailAddress,
                                });
                            } else
                                Toast.showShortCenter('图片解析失败，请手动填写信息');
                            this.setState({
                                isFirst: true
                            });

                            break;
                        case 1:
                            this.setState({
                                vehicleLicenseVicePageNormalPhotoAddress: respones.result.vehicleLicenseVicePageNormalPhotoAddress,
                                vehicleLicenseVicePageThumbnailAddress: respones.result.vehicleLicenseVicePageThumbnailAddress,
                            });
                            this.setState({
                                isFirst: true
                            });
                            break;
                        case 2:
                            this.setState({
                                handleIDNormalPhotoAddress: respones.result.handleIDNormalPhotoAddress,
                                insuranceThumbnailAddress: respones.result.insuranceThumbnailAddress,
                            });
                            break;
                        case 3:
                            this.setState({
                                vehicleNormalPhotoAddress: respones.result.vehicleNormalPhotoAddress,
                                vehicleThumbnailAddress: respones.result.vehicleThumbnailAddress,
                            });
                            break;
                        default:
                            break
                    }
                } else
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
    showDatePick(showLongTime, data, type) {
        let date = new Date();

        let selectValue = [];
        let title = '有效期至';
        if (type === 'Date') {

            let year;
            let month;
            let day;
            if (this.state.insuranceData) {
                year = this.state.insuranceData.substr(0, 4);
                month = this.state.insuranceData.substr(5, 2);
                day = this.state.insuranceData.substr(8, 2);
            } else {
                year = date.getUTCFullYear();
                month = date.getUTCMonth() + 1;
                day = date.getUTCDate();
            }


            selectValue = [year + '年', month + '月', day + '日'];


        } else if (type === 'carType') {
            selectValue = [data[0]];
            title = '车辆类型';
        } else if (type === 'carLength') {
            selectValue = [data[0]];
            title = '车长';
        } else if (type === 'yearMouth') {
            let year;
            let month;
            if (this.state.carDate) {
                year = this.state.carDate.substr(0, 4);
                month = this.state.carDate.substr(5, 2);
            } else {
                year = date.getUTCFullYear();
                month = date.getUTCMonth() + 1;
            }
            selectValue = [year + '年', month + '月'];
        }

        TimePicker.init({
            selectedValue: selectValue,
            isShowLongTime: showLongTime,
            pickerLongTimeText: '长期',
            pickerData: data,
            pickerToolBarFontSize: 16,
            pickerLongTimeFontSize: 16,
            pickerFontSize: 17,
            pickerFontColor: [0, 0, 0, 1],
            pickerBg: [255, 255, 255, 1],
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: title,
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
                            carDate: '长期',
                        })
                    } else {
                        this.setState({
                            insuranceData: '长期',
                        })
                    }

                } else {
                    console.log('onPickerConfirmdate', pickedValue, pickedIndex);

                    if (selectDatePickerType === 0) {
                        let year = pickedValue[0].substring(-0, pickedValue[0].length - 1);
                        let month = pickedValue[1].substring(-0, pickedValue[1].length - 1);

                        this.setState({
                            carDate: Validator.timeTrunToDateString(year + month),
                        })
                    } else if (selectDatePickerType === 1) {
                        let year = pickedValue[0].substring(-0, pickedValue[0].length - 1);
                        let month = pickedValue[1].substring(-0, pickedValue[1].length - 1);
                        let day = pickedValue[2].substring(-0, pickedValue[2].length - 1);

                        this.setState({
                            insuranceData: Validator.timeTrunToDateString(year + month + day),
                        })
                    } else if (selectDatePickerType === 2) {
                        this.setState({
                            carType: pickedValue[0],
                        });
                    } else if (selectDatePickerType === 3) {
                        this.setState({
                            carLength: pickedValue[0],
                            carWeight: carWeightDataSource[pickedValue[0]],
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

        if (this.state.vehicleLicenseHomepageNormalPhotoAddress === '' && this.state.vehicleLicenseHomepageThumbnailAddress === '') {
            Toast.showShortCenter('请上传行驶证主页照片');
            return;
        }
        if (this.state.vehicleLicenseVicePageNormalPhotoAddress === '' && this.state.vehicleLicenseVicePageThumbnailAddress === '') {
            Toast.showShortCenter('请上传行驶证副页照片');
            return;
        }
        if (this.state.handleIDNormalPhotoAddress === '' && this.state.handleIDNormalPhotoAddress === '') {
            Toast.showShortCenter('请上传强险照片');
            return;
        }
        if (this.state.vehicleNormalPhotoAddress === '' && this.state.vehicleThumbnailAddress === '') {
            Toast.showShortCenter('请上传车头照片');
            return;
        }

        if (this.state.carNumber === '') {
            Toast.showShortCenter('请输入车牌号');
            return;
        }
        if (this.state.carOwner === '') {
            Toast.showShortCenter('请输入所有人');
            return;
        }
        if (this.state.carType === '') {
            Toast.showShortCenter('请选择车辆类型');
            return;
        }
        if (this.state.carLength === '') {
            Toast.showShortCenter('请选择车长');
            return;
        }
        if (this.state.carWeight === '') {
            Toast.showShortCenter('请选择车长');
            return;
        }
        if (this.state.carDate === '') {
            Toast.showShortCenter('请选择行驶证有效期');
            return;
        }
        if (this.state.carEngineNumber === '') {
            Toast.showShortCenter('请输入发动机号码');
            return;
        }
        if (this.state.insuranceData === '' || this.state.insuranceData === '请选择有效期') {
            Toast.showShortCenter('请选择强险有效期');
            return;
        }

        if (!this.isRightData(this.state.carDate)) {
            Toast.showShortCenter('所选择的行驶证有效期应大于今天，请重新选择');

            return;
        }

        if (!this.isRightData(this.state.insuranceData)) {
            Toast.showShortCenter('所选择的强险有效期应大于今天，请重新选择');

            return;
        }


        console.log('车牌号：', this.state.carNumber);
        console.log('所有人：', this.state.carOwner);
        console.log('车辆类型：', this.state.carType);

        console.log('默认车牌号：', this.state.analysisCarNum);
        console.log('默认所有人：', this.state.analysisHaverName);
        console.log('默认车辆类型：', this.state.analysisEngineNum);


        console.log('车长：', this.state.carLength);
        console.log('载重：', this.state.carWeight);
        console.log('行驶证有效期：', this.state.carDate);
        console.log('发动机号码：', this.state.carEngineNumber);
        console.log('强险有效期：', this.state.insuranceData);


        console.log('行驶证主页原图：', this.state.vehicleLicenseHomepageNormalPhotoAddress);
        console.log('行驶证主页缩略图：', this.state.vehicleLicenseHomepageThumbnailAddress);

        console.log('行驶证副页原图：', this.state.vehicleLicenseVicePageNormalPhotoAddress);
        console.log('行驶证副页缩略图：', this.state.vehicleLicenseVicePageThumbnailAddress);

        console.log('交强险原图：', this.state.handleIDNormalPhotoAddress);
        console.log('交强险缩略图：', this.state.insuranceThumbnailAddress);

        console.log('车头照原图：', this.state.vehicleNormalPhotoAddress);
        console.log('车头照缩略图：', this.state.vehicleThumbnailAddress);


        // let carData1 = this.state.carDate.replace('年', '-');
        // let carData2 = carData1.replace('月', '');
        let carData2 = this.state.carDate.replace(/(^\s*)|(\s*$)/g, ''); //  去除前面的空格

        // let insuranceData1 = this.state.insuranceData.replace('年', '-');
        // let insuranceData2 = insuranceData1.replace('月', '-');
        // let insuranceData3 = insuranceData2.replace('日', '');
        let insuranceData3 = this.state.insuranceData.replace(/(^\s*)|(\s*$)/g, ''); //  去除前面的空格

        this.setState({
            appLoading: true,
        });
        this.implementationVerified(carData2, insuranceData3);
    }

    isRightData(date) {

        date = date.replace('年', '-');
        date = date.replace('月', '-');
        date = date.replace('日', '');
        date = date.replace('', ' ');

        const todayTimestamp = new Date().getTime();
        const selectTimestamp = new Date(date).getTime().toString();

        if (parseFloat(selectTimestamp) <= parseFloat(todayTimestamp)) {
            return false;
        }

        return true;

    }

    /*司机增加车辆*/
    implementationVerified(carDate, insuranceData) {
        currentTime = new Date().getTime();
        // driver 司机  personalOwner 个人车主 businessOwner 企业车主

        // OUTSIDEDRIVER 司机  Personalowner 个人    Enterpriseowner 企业

        let shenfen = '';
        if (this.props.currentStatus === 'driver'){
            shenfen = 'OUTSIDEDRIVER';
        }
        if (this.props.currentStatus === 'personalOwner'){
            shenfen = 'Personalowner';
        }
        if (this.props.currentStatus === 'businessOwner'){
            shenfen = 'Enterpriseowner';
        }
        HTTPRequest({
            url: API.API_AUTH_QUALIFICATIONS_COMMIT,
            params: {
                engineNumber: this.state.carEngineNumber,
                handleIDNormalPhotoAddress: this.state.handleIDNormalPhotoAddress,
                insuranceThumbnailAddress: this.state.insuranceThumbnailAddress,
                insuranceValidUntil: insuranceData.replace('/', '-').replace('/', '-'),
                load: this.state.carWeight,
                owner: this.state.carOwner,
                phoneNum: userPhone,
                plateNumber: this.state.carNumber,
                userId: userID,
                userName: this.state.carOwner,
                validUntil: carDate.replace('/', '-'),
                vehicleLength: this.state.carLength,
                vehicleLicenseHomepageNormalPhotoAddress: this.state.vehicleLicenseHomepageNormalPhotoAddress,
                vehicleLicenseHomepageThumbnailAddress: this.state.vehicleLicenseHomepageThumbnailAddress,
                vehicleLicenseVicePageNormalPhotoAddress: this.state.vehicleLicenseVicePageNormalPhotoAddress,
                vehicleLicenseVicePageThumbnailAddress: this.state.vehicleLicenseVicePageThumbnailAddress,
                vehicleNormalPhotoAddress: this.state.vehicleNormalPhotoAddress,
                vehicleThumbnailAddress: this.state.vehicleThumbnailAddress,
                vehicleType: this.state.carType,
                analysisCarNum: this.state.analysisCarNum, // 解析车牌号
                analysisHaverName:this.state.analysisHaverName, // 解析所有人
                analysisEngineNum:this.state.analysisEngineNum, //  解析发动机号
                currentRole: shenfen

            },
            loading: () => {

            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('提交司机增加车辆', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '司机增加车辆页面');

                this.props.saveUserSetCarSuccess({carNum: this.state.carNumber, carStatus: 0});

                Toast.showShortCenter('司机增加车辆提交成功');
                Storage.remove(StorageKey.changeCarInfoResult);
                //DeviceEventEmitter.emit('certificationSuccess');
                //Storage.remove(StorageKey.carInfoResult);

                // this.popToTop();
                this.props.navigation.goBack()

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

        console.log('this.state.carOwner:',this.state.carOwner);
        console.log('this.state.carNumber:',this.state.carNumber);

        let travelInfo = this.state.isFirst ?
            <View>
                <VerifiedGrayTitleItem title="确认行驶证基本信息"/>
                <VerifiedTravelInfoItem carNumber={this.state.carNumber}
                                        carOwner={this.state.carOwner}
                                        carEngineNumber={this.state.carEngineNumber}
                                        carType={this.state.carType}
                                        carWeight={this.state.carWeight}
                                        carLength={this.state.carLength}
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
                                        carTypeClick={()=>{
                                             if (Platform.OS === 'ios'){
                                                this.refs.scrollView.scrollTo({x: 0, y: 315, animated: true});
                                             }
                                             selectDatePickerType = 2;
                                             this.showDatePick(false, VerifiedDateSources.createCarTypeDate(), 'carType');
                                         }}
                                        carLengthClick={()=>{
                                             if (Platform.OS === 'ios'){
                                                this.refs.scrollView.scrollTo({x: 0, y: 360, animated: true});
                                             }
                                             selectDatePickerType = 3;

                                             this.showDatePick(false, VerifiedDateSources.createCarLengthDate(carWeightDataSource), 'carLength');
                                         }}
                                        textOnFocus={(value)=>{
                                             if (Platform.OS === 'ios'){
                                                 this.refs.scrollView.scrollTo({x: 0, y: value, animated: true});

                                             }

                                         }}

                />
            </View>
            : null;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'新增车辆'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    backIconClick={() => {

                        const info = {
                            appLoading: false,

                            carNum: this.state.carNumber, // 车牌号
                            haverName: this.state.carOwner, // 所有人
                            engineNumber: this.state.carEngineNumber, // 发动机编号
                            carType: this.state.carType, // 车辆类型
                            carLen: this.state.carLength, // 车长
                            carryCapacity: this.state.carWeight, // 载重
                            driveValidity: this.state.carDate, // 行驶证有效期至
                            insuranceDate: this.state.insuranceData, // 强险有效期至


                            drivingLicenseThumbnail: this.state.travelRightImage.uri ? this.state.travelRightImage.uri : '../navigationBar/travelCardHome_right.png',
                            drivingLicenseSecondaryThumbnail: this.state.travelTrunRightImage.uri ? this.state.travelTrunRightImage.uri : '../navigationBar/travelCard_right.png',
                            insuranceThumbnail: this.state.qiangxianRightImage.uri ?this.state.qiangxianRightImage.uri : '../navigationBar/qiangxian_right.png',
                            carHeadThumbnail: this.state.carHeaderRightImage.uri ? this.state.carHeaderRightImage.uri : '../navigationBar/carheader_right.png',


                            drivingLicensePicRelative: this.state.vehicleLicenseHomepageNormalPhotoAddress, // 行驶证主页原图
                            drivingLicenseThumbnailRelative: this.state.vehicleLicenseHomepageThumbnailAddress, // 行驶证主页缩略图

                            drivingLicenseSecondaryPicRelative: this.state.vehicleLicenseVicePageNormalPhotoAddress, // 行驶证副页原图
                            drivingLicenseSecondaryThumbnailRelative: this.state.vehicleLicenseVicePageThumbnailAddress, // 行驶证副页缩略图

                            insurancePicRelative: this.state.handleIDNormalPhotoAddress, // 强险原图
                            insuranceThumbnailRelative: this.state.insuranceThumbnailAddress, // 强险缩略图

                            carHeadPicRelative: this.state.vehicleNormalPhotoAddress, // 车头照原图
                            carHeadThumbnailRelative: this.state.vehicleThumbnailAddress, // 车头照缩略图

                            isChooseTravelRightImage: this.state.isChooseTravelRightImage,
                            isChooseTravelTrunRightImage: this.state.isChooseTravelTrunRightImage,

                            analysisCarNum: this.state.analysisCarNum, // 解析车牌号
                            analysisHaverName:this.state.analysisHaverName, // 解析所有人
                            analysisEngineNum:this.state.analysisEngineNum, //  解析发动机号
                        };

                        console.log(info);
                        Storage.save(StorageKey.changeCarInfoResult, info);
                        navigator.goBack();

                    }}
                />
                <ScrollView keyboardDismissMode='on-drag' ref="scrollView">
                    <VerifiedSpaceItem />
                    <VerifiedIDTitleItem title="行驶证主页"/>
                    <View style={{height: 15, backgroundColor: 'white'}}>
                        <Text
                            style={{ height: 1, marginTop: 14, marginLeft: 10, marginRight: 0, backgroundColor: '#f5f5f5',}}/>
                    </View>
                    <VerifiedIDDateItem IDDate={this.state.carDate}
                                        clickDataPick={()=>{

                                             selectDatePickerType = 0;
                                             this.showDatePick(true, VerifiedDateSources.createDateDataYearMouth(), 'yearMouth');
                                        }}
                    />
                    <VerifiedLineItem />

                    <VerifiedIDItemView showTitle="证件要清晰，拍摄完整"
                                        leftImage={travelLeftImage}
                                        rightImage={this.state.travelRightImage}
                                        isChooseRight={this.state.isChooseTravelRightImage}
                                        click={()=> {
                                            selectType=0;
                                            this.showAlertSelected();
                                        }}
                    />
                    <VerifiedLineItem />


                    <VerifiedIDTitleItem title="行驶证副页"/>
                    <VerifiedIDItemView showTitle="证件要清晰，拍摄完整"
                                        leftImage={travelTrunLeftImage}
                                        rightImage={this.state.travelTrunRightImage}
                                        isChooseRight={this.state.isChooseTravelTrunRightImage}

                                        click={()=> {

                                            selectType=1;
                                            this.showAlertSelected();
                                        }}
                    />

                    {travelInfo}

                    <VerifiedSpaceItem />
                    <VerifiedIDTitleItem title="交强险"/>

                    <View style={{height: 15, backgroundColor: 'white'}}>
                        <Text
                            style={{ height: 1, marginTop: 14, marginLeft: 10, marginRight: 0, backgroundColor: '#f5f5f5',}}/>
                    </View>

                    <VerifiedIDDateItem IDDate={this.state.insuranceData}
                                        clickDataPick={()=>{
                                            if (Platform.OS === 'ios'){
                                                this.refs.scrollView.scrollTo({x: 0, y: 400, animated: true});
                                            }
                                            selectDatePickerType = 1;
                                            this.showDatePick(false, VerifiedDateSources.createDateData(), 'Date');
                                        }}
                    />
                    <VerifiedTravelPaperItem showTitle="驾驶证号要清晰"
                                             leftImage={qiangxianLeftImage}
                                             rightImage={this.state.qiangxianRightImage}
                                             click={()=> {
                                                selectType=2;
                                                this.showAlertSelected();
                                        }}
                    />

                    <VerifiedGrayTitleItem title="车头照"/>
                    <VerifiedIDItemView showTitle="车头要清晰，头部完整"
                                        leftImage={carHeaderLeftImage}
                                        rightImage={this.state.carHeaderRightImage}
                                        click={()=> {
                                            selectType=3;
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
        currentStatus: state.user.get('currentStatus'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveUserSetCarSuccess: (plateNumber) => {
            dispatch(setUserCarAction(plateNumber));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(certification);
