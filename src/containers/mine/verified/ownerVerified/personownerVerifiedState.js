/**
 * 个人车主认证详情页面
 * */

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
    Dimensions
} from 'react-native';

import NavigatorBar from '../../../../common/navigationBar/navigationBar';
import VerifiedGrayTitleItem from './../verifiedIDItem/verifiedGrayTitleItem';
import RealNameItem from './ownerVerifiedItem/verifiedPersonownerRealNameItem';
import DriverItem from './ownerVerifiedItem/verifiedPersonOwnerDriverItem';
import VerifiedFailItem from './../verifiedIDItem/verifiedFailItem';
import * as API from '../../../../constants/api';
import Storage from '../../../../utils/storage';
import Toast from '@remobile/react-native-toast';
import LoadingView from '../../../../utils/loading';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../../utils/readAndWriteFileUtil';
import HTTPRequest from '../../../../utils/httpRequest';
import StorageKey from '../../../../constants/storageKeys';
import StaticImage from '../../../../constants/staticImage';
import Button from 'apsl-react-native-button';
import Line from '../verifiedIDItem/verifiedLineItem';

const headerImageFail = require('./../images/verifiedFail.png');
const headerImageSuccess = require('./../images/verifiedSuccess.png');
const headerImageLoading = require('./../images/verifieding.png');


let currentTime = 0;
let lastTime = 0;
let locationData = '';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff'
    },
    headStyle:{
        //backgroundColor: '#1b82d1',
        height: 190,
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 20,
        color: 'white',
        position: 'absolute',
        bottom: 10,
        backgroundColor: 'transparent'
    },
    bottomViewStyle: {
        height: 40,
        marginBottom: 0,
        marginHorizontal: 0,
        backgroundColor: '#1b82d1',
        width
    },
    bottomTextStyle: {
        fontSize: 17,
        color: 'white',
        textAlign: 'center',
        marginVertical: 10,
    },
    loginButton: {
        backgroundColor: '#00000000',
        width: width,
        marginBottom: 0,
        height: 44,
        borderWidth: 0,
        borderColor: '#00000000',
    },

});

class personownerVerifiedState extends Component{
    constructor(props) {
        super(props);

        this.state = {
            resultInfo: {},
            appLoading: false,
            qualifications: '',
        };

        this.getRealNameDetail = this.getRealNameDetail.bind(this);
        this.reloadVerified = this.reloadVerified.bind(this);
        this.showBigImage = this.showBigImage.bind(this);

    }


    componentDidMount() {

        this.getCurrentPosition();
        this.getRealNameDetail(global.phone);

        /*
        if (this.props.ownerStatus == '11' || this.props.ownerStatus == '13') {
            this.getRealNameDetail(global.phone);

        } else {
            Storage.get(StorageKey.personownerInfoResult).then((value) => {
                if (value) {
                    this.setState({
                        resultInfo: value,
                    });
                } else {

                    console.log('global.phone:', global.phone);
                    this.getRealNameDetail(global.phone);

                }
            });

        }
        */
    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }

    /*个人车主实名认证*/
    getRealNameDetail(userPhone) {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_QUERY_COMPANY_INFO,
            //url: '192.168.32.83:8899/app/rmc/company/queryCompanyInfoByBusTel',
            params: {
                busTel: userPhone,
                companyNature: '个人'
            },
            loading: () => {
                this.setState({
                    appLoading: true,
                });
            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取实名认证详情', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '实名认证详情页面');
                if(responseData.result){

                    let obj = {
                        IDName: responseData.result.rmcAnalysisAndContrast.manualIdCardName,
                        IDCard: responseData.result.rmcAnalysisAndContrast.manualIdCard,
                        IDDate: responseData.result.rmcAnalysisAndContrast.manualIdCardValidity,

                        idCardImage: responseData.result.positiveCardThumbnail ,
                        idCardTrunImage: responseData.result.oppositeCardThumbnail ,

                        idFaceSideNormalPhotoAddress: responseData.result.positiveCard, // 身份证正面原图
                        idFaceSideThumbnailAddress: responseData.result.positiveCardThumbnail, // 身份证正面缩略图

                        idBackSideNormalPhotoAddress: responseData.result.oppositeCard, // 身份证反面原图
                        idBackSideThumbnailAddress: responseData.result.oppositeCardThumbnail, // 身份证反面缩略图


                        carNumber: responseData.result.rmcAnalysisAndContrast.manualCarNum,
                        carOwner: responseData.result.rmcAnalysisAndContrast.manualHaverName,
                        carEngineNumber: responseData.result.rmcAnalysisAndContrast.manualEngineNum,

                        travelRightImage: responseData.result.drivingCardHomePageThumbnail ,
                        travelTrunRightImage:  responseData.result.drivingPermitSubPageThumbnail,
                        drivingLicenseValidUntil: responseData.result.drivingValidity, // 行驶证有效期

                        //resultInfo.rmcAnalysisAndContrast.drivingValidity.replace(/-/g,'/')
                        vehicleLicenseHomepageNormalPhotoAddress: responseData.result.drivingCardHomePage, // 行驶证主页原图
                        vehicleLicenseHomepageThumbnailAddress: responseData.result.drivingCardHomePageThumbnail, // 行驶证主页缩略图

                        vehicleLicenseVicePageNormalPhotoAddress: responseData.result.drivingPermitSubPage, // 行驶证副页原图
                        vehicleLicenseVicePageThumbnailAddress: responseData.result.drivingPermitSubPageThumbnail, // 行驶证副页缩略图

                        isChooseCardImage: false,
                        isChooseCardTrunImage: false,
                        isChooseVehicleLicenseViceImage: false,
                        isChooseVehicleLicenseViceTrunImage: false,

                        isShowCardInfo: true,
                        isShowDriverInfo: true,

                        // 默认
                        moRenidCardName: responseData.result.idCardName, // 身份证解析姓名
                        moRenidCard: responseData.result.idCard, // 解析身份证号
                        moRenidCardValidity: responseData.result.idCardValidity, // 解析身份证有效期
                        moRencarNum: responseData.result.carNum, // 车牌号
                        moRenhaverName: responseData.result.haverName, // 所有人
                        moRenengineNum: responseData.result.engineNum, // 发动机号码
                        moRendrivingValidsity: responseData.result.drivingValidity, // 行驶证有效期
                    };

                    this.setState({
                        resultInfo: responseData.result,
                        qualifications: responseData.result.certificationStatus,
                    });

                    //if (responseData.result.certificationStatus == '1202'){
                        Storage.save(StorageKey.personownerInfoResult, obj);
                    //}
                    DeviceEventEmitter.emit('verifiedSuccess');

                }
            },
            error: (errorInfo) => {
                Toast.showShortCenter('获取详情失败');
            },
            finish: () => {
                this.setState({
                    appLoading: false,
                });
            }
        });


    }


    /*重新认证*/
    reloadVerified(){
        Storage.get(StorageKey.personownerInfoResult).then((value) => {


            if (value){
                this.props.navigation.navigate('PersonCarOwnerAuth', {
                    resultInfo: value,
                });
            }else {
                this.props.navigation.navigate('PersonCarOwnerAuth', {
                    resultInfo: this.state.resultInfo,
                });
            }
        });
    }

    /*显示原图*/
    showBigImage(imageUrls, selectIndex){
        this.props.navigation.navigate('ShowBigImagePage', {
            imageUrls: imageUrls,
            selectIndex: selectIndex,
        });
    }

    render() {
        const navigator = this.props.navigation;

        // 11  个人车主认证中   12 个人车主认证通过  13 个人车主认证驳回

        let headView = this.state.qualifications == '1201' ?
            <View style={styles.headStyle}>

                <Image source={headerImageLoading}/>

                <Text style={styles.textStyle}>认证中</Text>
            </View>
            : this.state.qualifications == '1202' ?
                <View style={styles.headStyle}>

                    <Image source={headerImageSuccess}/>

                    <Text style={styles.textStyle}>认证通过</Text>
                </View>
                :
                <View style={styles.headStyle}>

                    <Image source={headerImageFail}/>

                    <Text style={styles.textStyle}>认证驳回</Text>
                </View>;

        let bottomView = this.state.qualifications == '1203' ?
            <View>
                <VerifiedGrayTitleItem title='驳回原因'/>
                <VerifiedFailItem reason={this.state.resultInfo.certificationOpinion}/>
            </View> : null;

        let bottomReloadView = this.state.qualifications == '1203' ?
            <Image style={styles.bottomViewStyle} source ={StaticImage.BlueButtonArc}>
                <Button
                    ref='button'
                    isDisabled={false}
                    style={styles.loginButton}
                    textStyle={{color: 'white', fontSize: 18}}
                    onPress={() => {
                        this.reloadVerified();
                    }}
                >
                    重新上传
                </Button>
            </Image>: null;

        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'车主认证'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                    rightButtonConfig={this.state.qualifications == '1203' ? {
                        type: 'string',
                        title: '企业认证',
                        onClick: ()=> {
                            // 进行企业车主认证
                            //this.props.navigation.navigate('CompanyCarOwnerAuth');
                            Storage.get(StorageKey.enterpriseownerInfoResult).then((value) => {
                                 if (value) {
                                     navigator.navigate('CompanyCarOwnerAuth', {
                                         resultInfo: value,
                                         });
                                 } else {
                                     navigator.navigate('CompanyCarOwnerAuth');
                                 }
                            });
                        }
                    } : {}}
                />

                <ScrollView
                    bounces={false} showsVerticalScrollIndicator={false}>

                    {headView}
                    <View style={{height: 10, width: width, backgroundColor: '#f5f5f5'}}/>
                    <VerifiedGrayTitleItem title="身份证"/>
                    <Line/>
                    <RealNameItem resultInfo={this.state.resultInfo}
                                  imageClick={(index)=>{
                                      
                                      if (index === 0){
                                          if (this.state.resultInfo.positiveCard){
                                              this.showBigImage([this.state.resultInfo.positiveCard], 0);
                                          }else 
                                              Toast.showShortCenter('暂无图片');
                                      }
                                      if (index === 1){
                                          if (this.state.resultInfo.oppositeCard){                   
                                              this.showBigImage([this.state.resultInfo.oppositeCard], 0);
                                          }else 
                                              Toast.showShortCenter('暂无图片');
                                      }

                                  }}/>
                    <View style={{height: 10, width: width, backgroundColor: '#f5f5f5'}}/>
                    <VerifiedGrayTitleItem title="行驶证"/>
                    <Line/>
                    <DriverItem resultInfo={this.state.resultInfo}
                                imageClick={(index)=>{
                                    
                                    if (index === 0){
                                        if (this.state.resultInfo.drivingCardHomePage){
                                            this.showBigImage([this.state.resultInfo.drivingCardHomePage], 0);
                                        }else 
                                            Toast.showShortCenter('暂无图片');
                                    }
                                    if (index === 1){
                                        if (this.state.resultInfo.drivingPermitSubPage){
                                            this.showBigImage([this.state.resultInfo.drivingPermitSubPage], 0);
                                        }else 
                                            Toast.showShortCenter('暂无图片');
                                    }
                                                                    

                                  }}/>

                    {bottomView}

                </ScrollView>

                {bottomReloadView}

                {
                    this.state.appLoading ? <LoadingView /> : null
                }
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        ownerStatus: state.user.get('ownerStatus'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(personownerVerifiedState);
