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

import NavigatorBar from '../../../common/navigationBar/navigationBar';
import VerifiedGrayTitleItem from './verifiedIDItem/verifiedGrayTitleItem';
import RealNameItem from './verifiedIDItem/verifiedRealNameItem'
import DriverItem from './verifiedIDItem/verifiedDriverItem';
import VerifiedFailItem from './verifiedIDItem/verifiedFailItem';
import * as API from '../../../constants/api';
import Storage from '../../../utils/storage';
import Toast from '@remobile/react-native-toast';
import LoadingView from '../../../utils/loading';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import HTTPRequest from '../../../utils/httpRequest';
import StorageKey from '../../../constants/storageKeys';
import StaticImage from '../../../constants/staticImage';
import Button from 'apsl-react-native-button';

const headerImageFail = require('./images/verifiedFail.png');
const headerImageSuccess = require('./images/verifiedSuccess.png');
const headerImageLoading = require('./images/verifieding.png');


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

class carOwnerAddDriverDetail extends Component{
    constructor(props) {
        super(props);

        this.state={
            resultInfo: {},
            appLoading: false,
            qualifications: this.props.navigation.state.params.qualifications,
        };

        this.getRealNameDetail = this.getRealNameDetail.bind(this);

        this.reloadVerified = this.reloadVerified.bind(this);
        this.showBigImage = this.showBigImage.bind(this);

    }



    componentDidMount() {

        this.getCurrentPosition();

        if (this.state.qualifications == '1203') {

            this.getRealNameDetail(global.phone);

        } else {

            // 先判断是否有存储的值
            this.getRealNameDetail(global.phone);
        }
    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }

    /*司机认证*/
    getRealNameDetail(userPhone) {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_AUTH_REALNAME_DETAIL + userPhone,
            params: {
                phoneNum: userPhone
            },
            loading: () => {
                this.setState({
                    appLoading: true,
                });
            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取司机认证详情', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '司机认证详情页面');
                if(responseData.result){
                    this.setState({
                        resultInfo: responseData.result,
                        qualifications: responseData.result.certificationStatus,
                    });

                    if (responseData.result.certificationStatus == '1202'){
                        // 是否需要保存值
                    }
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
        // 移除保存的值
        //Storage.remove(StorageKey.personInfoResult);

        Storage.get(StorageKey.carOwnerAddDriverInfo).then((value) => {
            if (value){
                this.props.navigation.navigate('VerifiedPage', {
                    resultInfo: value,
                });
            }else {
                this.props.navigation.navigate('VerifiedPage', {
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

        // 1201  认证中   1202 认证通过  1203 认证驳回

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
                    title={'司机详情'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                />

                <ScrollView
                    bounces={false}>

                    {headView}

                    <VerifiedGrayTitleItem title="身份证"/>

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
                                      if (index === 2){
                                          if (this.state.resultInfo.handleIdNormalPhotoAddress){
                                              this.showBigImage([this.state.resultInfo.handleIdNormalPhotoAddress], 0);
                                          }else
                                              Toast.showShortCenter('暂无图片');
                                      }

                                  }}/>

                    <VerifiedGrayTitleItem title="驾驶证"/>
                    <DriverItem resultInfo={this.state.resultInfo}
                                imageClick={(index)=>{

                                    if (index === 0){
                                        if (this.state.resultInfo.drivingLicenceHomePage){
                                            this.showBigImage([this.state.resultInfo.drivingLicenceHomePage], 0);
                                        }else
                                            Toast.showShortCenter('暂无图片');
                                    }
                                    if (index === 1){
                                        if (this.state.resultInfo.drivingLicenceSubPage){
                                            this.showBigImage([this.state.resultInfo.drivingLicenceSubPage], 0);
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(carOwnerAddDriverDetail);
