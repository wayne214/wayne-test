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
import VerifiedDateSources from './verifiedIDItem/verifiedDateSource';
import VerfiedCompanyItem from './verifiedIDItem/verifiedCompanyItem';
import Validator from '../../../utils/validator';

const businessTrunRightImage = require('./images/business_right_add.png');
const businessTrunLeftImage = require('./images/business_right.png');
const idCardLeftImage = require('./images/IdCardModel.png');
const idCardRightImage = require('./images/IdCardAdd.png');
const idCardTrunLeftImage = require('./images/IdCardTurnModel.png');
const idCardTrunRightImage = require('./images/IdCardTurnAdd.png');

const selectedArr = ["拍照", "从手机相册选择"];


/*
 * 0=身份证正面
 * 1=身份证反面
 * 2=营业执照
 * */
let selectType = 0;

/*
 * 0  身份证有效期
 * 1  营业执照有效期
 * */
let selectDatePickerType = 0;

class companyCarOwnerAuth extends Component {
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


            companyName: '',
            companyOwnerName: '',
            companyAddress: '',
            companyCode: '',
            businessTrunLeftImage,
            businessTrunRightImage,
            businessLicenseValidUntil: '', // 营业执照有效期
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
    showDatePick(showLongTime, type) {

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
            isShowLongTime: showLongTime,
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
                            businessLicenseValidUntil: '长期',
                        });
                    }
                } else {

                    let year = pickedValue[0].substring(0, pickedValue[0].length - 1);
                    let month = pickedValue[1].substring(0, pickedValue[1].length - 1);
                    let day = pickedValue[2].substring(0, pickedValue[2].length - 1);

                    if (selectDatePickerType === 0) {
                        this.setState({
                            IDDate: Validator.timeTrunToDateString(year + month + day),
                        });
                    } else {
                        this.setState({
                            businessLicenseValidUntil: Validator.timeTrunToDateString(year + month + day),
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
                                        this.showDatePick(true ,'cardID');
                                    }}/>
            </View> ;


        const companyInfo =
            <View>
                <VerifiedGrayTitleItem title="确认营业执照基本信息"/>

                <VerfiedCompanyItem companyName={this.state.companyName}
                                    companyOwnerName={this.state.companyOwnerName}
                                    companyAddress={this.state.companyAddress}
                                    companyCode={this.state.companyCode}
                                    companyNameChange={(text)=>{
                                        this.setState({
                                            companyName: text,
                                        });
                                    }}
                                    companyOwnerNameChange={(text)=>{
                                        this.setState({
                                            companyOwnerName: text,
                                        });
                                    }}
                                    companyAddressValueChange={(text)=>{
                                        this.setState({
                                            companyAddress: text,
                                        });
                                    }}
                                    companyCodeValueChange={(text)=>{
                                        this.setState({
                                            companyCode: text,
                                        });
                                    }}
                                    textOnFocus={(y)=>{
                                        if (Platform.OS === 'ios'){
                                            this.refs.scrollView.scrollTo({x: 0, y: y, animated: true});
                                        }
                                    }}
                                    />
            </View> ;

        const plat = Platform.OS === 'ios' ? 'on-drag' : 'none';

        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'企业车主认证'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    backIconClick={() => {
                        navigator.goBack();
                    }}
                />
                <ScrollView keyboardDismissMode={plat} ref="scrollView">
                    <View style={{backgroundColor: '#f5f5f5'}}>
                        <Text style={{
                            marginVertical: 10,
                            marginHorizontal: 10,
                            color: '#999',
                            lineHeight: 20,
                            fontSize: 13
                        }}>
                            您所提供的信息仅用于核实您的身份，不会向任何第三方泄露，请放心上传；完善真实有效的信息才可以认证通过。
                        </Text>
                    </View>
                    <VerifiedIDTitleItem title="营业执照"/>

                    <View style={{height: 15, backgroundColor: 'white'}}>
                        <Text
                            style={{ height: 1, marginTop: 14, marginLeft: 10, marginRight: 0, backgroundColor: '#f5f5f5',}}/>
                    </View>
                    <VerifiedIDDateItem IDDate={this.state.businessLicenseValidUntil}
                                        clickDataPick={()=>{
                                             selectDatePickerType = 1;
                                             this.showDatePick(false);
                                        }}
                    />

                    <VerifiedLineItem />

                    <VerifiedIDItemView showTitle="营业执照要清晰"
                                        leftImage={businessTrunLeftImage}
                                        rightImage={this.state.businessTrunRightImage}
                                        isChooseRight={false}
                                        click={()=> {
                                            selectType=2;
                                            this.showAlertSelected();
                                        }}
                    />

                    {companyInfo}
                    <VerifiedSpaceItem/>


                    <VerifiedIDTitleItem title="法人身份证正面"/>
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


                    <VerifiedIDTitleItem title="法人身份证反面"/>
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

                    <VerifiedSpaceItem/>

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

export default connect(mapStateToProps, mapDispatchToProps)(companyCarOwnerAuth);

