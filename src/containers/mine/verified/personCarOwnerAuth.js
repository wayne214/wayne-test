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

class personCarOwnerAuth extends Component {
    constructor(props) {
        super(props);
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
        };


        this.showDatePick = this.showDatePick.bind(this);
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.selectPhoto = this.selectPhoto.bind(this);
        this.selectCamera = this.selectCamera.bind(this);
        this.upLoadImage = this.upLoadImage.bind(this);


    }
    componentDidMount() {

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
                        });

                        this.upLoadImage(API.API_GET_IDCARD_INFO, formData);

                        break;
                    case 1:
                        this.setState({
                            idCardTrunImage: source,
                        });

                        this.upLoadImage(API.API_GET_IDCARD_TRUN_INFO, formData);

                        break;

                    case 2:
                        this.setState({
                            travelRightImage: source,
                            carOwner: '',
                            carNumber: '',
                            isChooseTravelRightImage: false,
                        });
                        this.upLoadImage(API.API_GET_TRAVEL_INFO, formData);
                        break;

                    case 3:
                        this.setState({
                            travelTrunRightImage: source,
                            isChooseTravelTrunRightImage: false,
                        });
                        this.upLoadImage(API.API_GET_TRAVEL_TRUN_INFO, formData);

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

                                idFaceSideNormalPhotoAddress: respones.result.idFaceSideNormalPhotoAddress,
                                idFaceSideThumbnailAddress: respones.result.idFaceSideThumbnailAddress,
                            });

                            break;
                        case 1:
                            if (respones.result.idValidUntil){
                            }else
                                Toast.showShortCenter('图片解析失败，请手动填写信息');
                            this.setState({
                                IDDate: respones.result.idValidUntil,
                                idBackSideNormalPhotoAddress: respones.result.idBackSideNormalPhotoAddress,
                                idBackSideThumbnailAddress: respones.result.idBackSideThumbnailAddress,
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
                            });

                            break;
                        case 3:
                            this.setState({
                                vehicleLicenseVicePageNormalPhotoAddress: respones.result.vehicleLicenseVicePageNormalPhotoAddress,
                                vehicleLicenseVicePageThumbnailAddress: respones.result.vehicleLicenseVicePageThumbnailAddress,
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

    render() {
        const navigator = this.props.navigation;

        const personCardInfoTitle =
            <View>
                <VerifiedGrayTitleItem title="确认身份证基本信息"/>

            </View> ;
        const personCardInfo =
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
            </View> ;

        const personCardDate =
            <View>
                <VerifiedIDDateItem IDDate={this.state.IDDate}
                                    clickDataPick={()=>{
                                        if (Platform.OS === 'ios'){
                                            this.refs.scrollView.scrollTo({x: 0, y: 350, animated: true});
                                        }
                                        selectDatePickerType = 0;
                                        this.showDatePick('cardID');
                                    }}/>
            </View> ;


        const plat = Platform.OS === 'ios' ? 'on-drag' : 'none';

        let travelInfo =
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
            </View>
           ;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'个人车主认证'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    backIconClick={() => {
                        navigator.goBack();
                    }}
                />
                <ScrollView keyboardDismissMode={plat} ref="scrollView">
                    <VerifiedSpaceItem />
                    <VerifiedIDTitleItem title="身份证正面"/>
                    <VerifiedIDItemView showTitle="身份证号要清晰"
                                        leftImage={idCardLeftImage}
                                        rightImage={this.state.idCardImage}
                                        isChooseRight={false}
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
                                        isChooseRight={false}

                                        click={()=> {
                                            selectType=1;
                                            this.showAlertSelected();
                                        }}
                    />

                    {personCardInfoTitle}
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
                                        isChooseRight={false}
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
                                        isChooseRight={false}
                                        click={()=> {
                                            selectType=3;
                                            this.showAlertSelected();
                                        }}
                    />

                    {travelInfo}

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
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(personCarOwnerAuth);

