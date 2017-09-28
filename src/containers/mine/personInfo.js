import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    ScrollView,
    InteractionManager,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import {CachedImage} from 'react-native-img-cache';
import Toast from '@remobile/react-native-toast';
import Button from 'apsl-react-native-button';
import CommonCell from '../../containers/mine/cell/commonCell';
import stylesCommon from '../../../assets/css/common';
import NavigationBar from '../../common/navigationBar/navigationBar';
import * as API from '../../constants/api';
import Storage from '../../utils/storage';
import PersonImage from '../../../assets/person/personInfo.png';
import * as StaticColor from '../../constants/staticColor';
import Loading from '../../utils/loading';
import NoImage from '../../../assets/person/noiamgeShow.png';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import HTTPRequest from '../../utils/httpRequest';
import StorageKeys from '../../constants/storageKeys';


const {width} = Dimensions.get('window');
let imgListTemp = [];
let imgList = [];
let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flex: 1,
        backgroundColor: 'white',
    },
    Button: {
        backgroundColor: StaticColor.BLUE_ALL_COLOR,
        marginTop: 55,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 0,
        height: 40,
        borderRadius: 5,
        marginBottom: 0,
    },
    ButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    separatorLine: {
        height: 10,
        backgroundColor: '#f5f5f5',
    },
    imageStyle: {
        width: 102,
        height: 65,
        borderWidth: 1,
        borderColor: '#f5f5f5',
        borderRadius: 3,
    },
    subImageContainer: {
        borderColor: '#cccccc',
        borderWidth: 1,
        width: 112,
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        color: '#666666',
        fontSize: 14,
        marginTop: 10,
    },
    subContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
    },
});

export default class PersonInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            personInfo: '',
            loading: false,
        };
        this.fetchData = this.fetchData.bind(this);
        this.getPersonInfoSuccessCallback = this.getPersonInfoSuccessCallback.bind(this);
        this.getPersonInfoFailCallback = this.getPersonInfoFailCallback.bind(this);
        this.onClickImage = this.onClickImage.bind(this);
    }

    componentDidMount() {
        const {verifiedState} = this.props;
        imgListTemp = [];
        imgList = [];
        Storage.get(StorageKeys.personInfoResult).then((value) => {
            if (value) {
                if (value.drivingLicenceHomePage && value.drivingLicenceHomePage !== '') {
                    imgListTemp.push(value.drivingLicenceHomePage);
                }
                if (value.drivingLicenceSubPage && value.drivingLicenceSubPage !== '') {
                    imgListTemp.push(value.drivingLicenceSubPage);
                }
                if (value.positiveCard && value.positiveCard !== '') {
                    imgListTemp.push(value.positiveCard);
                }
                if (value.oppositeCard && value.oppositeCard !== '') {
                    imgListTemp.push(value.oppositeCard);
                }
                this.setState({
                    personInfo: value,
                });
            } else {
                if (verifiedState === 1200) {
                    this.setState({
                        personInfo: '',
                    });
                } else {
                    this.setState({
                        personInfo: {},
                    });
                    InteractionManager.runAfterInteractions(() => {
                        this.fetchData(this.getPersonInfoSuccessCallback, this.getPersonInfoFailCallback);
                    });
                }
            }
        });
    }
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }
    getPersonInfoFailCallback() {
        const {verifiedState} = this.props;
        if (verifiedState === '1200') {
            this.setState({
                personInfo: '',
            });
        } else {
            this.setState({
                personInfo: {},
            });
        }
    }
    getPersonInfoSuccessCallback(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('实名认证详情', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '个人信息页面');
        if (result) {
            Storage.save('personInfoResult', result);
            this.setState({
                personInfo: result,
            });
            if (result.drivingLicenceHomePage && result.drivingLicenceHomePage !== '') {
                imgListTemp.push(result.drivingLicenceHomePage);
            }
            if (result.drivingLicenceSubPage && result.drivingLicenceSubPage !== '') {
                imgListTemp.push(result.drivingLicenceSubPage);
            }
            if (result.positiveCard && result.positiveCard !== '') {
                imgListTemp.push(result.positiveCard);
            }
            if (result.oppositeCard && result.oppositeCard !== '') {
                imgListTemp.push(result.oppositeCard);
            }
        }
    }
    fetchData(getPersonInfoSuccessCallback,getPersonInfoFailCallback) {

            if (global.phone) {
                currentTime = new Date().getTime();

                HTTPRequest({
                    url: API.API_AUTH_REALNAME_DETAIL + global.phone,
                    params: {
                        mobilePhone: global.phone,
                    },
                    loading: () => {
                        this.setState({
                            loading: true,
                        });
                    },
                    success: (response) => {
                        getPersonInfoSuccessCallback(response.result);
                    },
                    error: (err) => {
                        getPersonInfoFailCallback();

                    },
                    finish: () => {
                        this.setState({
                            loading: false,
                        });
                    },

                })
                // this.props.getPersonInfoAction({
                //     mobilePhone: userInfo.result.phone,
                // }, getPersonInfoSuccessCallback);


            }

    }

    onClickImage(imgIndex) {
        if (imgListTemp.length > 0) {
            if (imgIndex > imgListTemp.length) {
                imgIndex = imgListTemp.length - 1;
            }
            imgList = imgListTemp.map((i, index) => {
                return {url: i ? i : ''};
            });
            this.props.navigation.navigate('ImageShow',
                {
                    image: imgList,
                    num: imgIndex,
                });
        }
    }
    render() {
        const navigator = this.props.navigation;
        const {driverInfo} = this.props;

        const person = this.state.personInfo !== null && this.state.personInfo !== '' ? this.state.personInfo : '';
        const showDrivingLicenceHomePage = person.drivingLicenseHomepageThumbnailAddress !== null && person.drivingLicenseHomepageThumbnailAddress !== '' ||
            person.drivingLicenceHomePage && person.drivingLicenceHomePage !== '';
        const showDrivingLicenceSubPage = person.drivingLicenseVicePageThumbnailAddress !== null && person.drivingLicenseVicePageThumbnailAddress !== '' ||
            person.drivingLicenceSubPage && person.drivingLicenceSubPage !== '';
        const showPositiveCard = person.idFaceSideThumbnailAddress !== null && person.idFaceSideThumbnailAddress !== '' ||
            person.positiveCard && person.positiveCard !== '';
        const showOppositeCard = person.idBackSideThumbnailAddress !== null && person.idBackSideThumbnailAddress !== '' ||
            person.oppositeCard && person.oppositeCard !== '';
        return (
            <View style={stylesCommon.container}>
                <NavigationBar
                    title={'个人信息'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                />
                {
                    person == '' ?
                        <View style={{
                            width,
                            alignItems: 'center',
                        }}>
                            <Image
                                style={{
                                    marginTop: 130,
                                }}
                                source={PersonImage}/>
                            <Text
                                style={{
                                    marginTop: 30,
                                    fontSize: 16,
                                    color: '#333333',
                                }}
                            >
                                您的个人信息为空，请先去实名认证吧~
                            </Text>
                            <Button
                                style={styles.Button}
                                textStyle={styles.ButtonText}
                                onPress={() => {
                                    // 跳转实名认证页面
                                    this.props.navigation.navigate('VerifiedStatePage');
                                }}
                            >
                                立即认证
                            </Button>
                        </View>
                        :
                        <ScrollView>
                            <View style={styles.container}>
                                <CommonCell itemName="姓名"
                                            content={person.idCardName ? person.idCardName : person.driverPhone ? person.driverPhone : ''}/>
                                <CommonCell itemName="手机号码"
                                            content={person.driverPhone !== null ? person.driverPhone : ''}/>
                                <CommonCell itemName="身份证"
                                            content={person.idCard !== null ? person.idCard : ''}/>
                                <CommonCell itemName="身份证有效期至"
                                            content={person.idCardValidity !== null ? person.idCardValidity : ''}/>
                                <CommonCell itemName="驾驶证号"
                                            content={person.driverCard !== null ? person.driverCard : ''}/>
                                <CommonCell itemName="准驾车型"
                                            content={person.quasiCarType !== null ? person.quasiCarType : ''}/>
                                <CommonCell itemName="驾驶证有效期至"
                                            content={person.driverCardExpiry !== null ? person.driverCardExpiry : ''}
                                            hideBottomLine={true}/>
                                <View style={styles.separatorLine}/>
                                <View>
                                    <CommonCell itemName="驾驶证照片"
                                                titleColorStyle={{color: '#333333'}}
                                                content={''}/>
                                    <View style={styles.subContainer}>
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => { showDrivingLicenceHomePage ?
                                                this.onClickImage(0) : Toast.showShortCenter('暂无图片'); }}
                                                style={styles.subImageContainer}
                                            >
                                                {
                                                    showDrivingLicenceHomePage ?
                                                        <CachedImage style={styles.imageStyle} source={{uri: person.drivingLicenseHomepageThumbnailAddress ? person.drivingLicenseHomepageThumbnailAddress : person.drivingLicenceHomePage}}/> :
                                                        <Image style={styles.imageStyle} source={NoImage}/>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.textStyle}>驾驶证主页</Text>
                                        </View>
                                        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => { showDrivingLicenceSubPage ?
                                                this.onClickImage(1) : Toast.showShortCenter('暂无图片'); }}
                                                style={styles.subImageContainer}
                                            >
                                                {
                                                    showDrivingLicenceSubPage ?
                                                        <CachedImage style={styles.imageStyle} source={{uri: person.drivingLicenseVicePageThumbnailAddress ? person.drivingLicenseVicePageThumbnailAddress : person.drivingLicenceSubPage}}/> :
                                                        <Image style={styles.imageStyle} source={NoImage}/>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.textStyle}>驾驶证副页</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.separatorLine}/>
                                <View>
                                    <CommonCell itemName="身份证照片"
                                                titleColorStyle={{color: '#333333'}}
                                                content={''}/>
                                    <View style={styles.subContainer}>
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => { showPositiveCard ?
                                                this.onClickImage(2) : Toast.showShortCenter('暂无图片'); }}
                                                style={styles.subImageContainer}
                                            >
                                                {
                                                    showPositiveCard ?
                                                        <CachedImage style={styles.imageStyle} source={{uri: person.idFaceSideThumbnailAddress ? person.idFaceSideThumbnailAddress : person.positiveCard}}/> :
                                                        <Image style={styles.imageStyle} source={NoImage}/>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.textStyle}>身份证正面</Text>
                                        </View>
                                        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => { showOppositeCard ?
                                                this.onClickImage(3) : Toast.showShortCenter('暂无图片'); }}
                                                style={styles.subImageContainer}
                                            >
                                                {
                                                    showOppositeCard ?
                                                        <CachedImage style={styles.imageStyle} source={{uri: person.idBackSideThumbnailAddress ? person.idBackSideThumbnailAddress : person.oppositeCard}}/> :
                                                        <Image style={styles.imageStyle} source={NoImage}/>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.textStyle}>身份证反面</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                }
                {
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }
}

// PersonInfo.propTypes = {
//     navigator: React.PropTypes.object.isRequired,
//     getPersonInfoAction: React.PropTypes.func.isRequired,
//     driverInfo: React.PropTypes.object.isRequired,
//     router: React.PropTypes.object.isRequired,
// };

// function mapStateToProps(state) {
//     console.log('------ state====', state);
//     console.log('......data', state.app.get('getPersonInfoData'));
//     return {
//         app: state.app,
//         driverInfo: state.app.get('getPersonInfoData'),
//         appLoading: state.app.get('appLoading'),
//         verifiedState: state.jpush.get('verifiedState'),
//     };
// }
//
// function mapDispatchToProps(dispatch) {
//     return {
//         getPersonInfoAction: (params, getPersonInfoSuccessCallback, getPersonInfoFailCallback) => {
//             dispatch(getPersonInfoAction({
//                 url: API.API_AUTH_REALNAME_DETAIL + params.mobilePhone,
//                 body: {
//                     phoneNum: params.mobilePhone,
//                 },
//                 successCallBack: (response) => {
//                     getPersonInfoSuccessCallback(response.result);
//                 },
//                 failCallBack: () => {
//                     getPersonInfoFailCallback();
//                     dispatch(changeAppLoadingAction(false));
//                 },
//             }));
//         },
//         changeAppLoading: (appLoading) => {
//             dispatch(changeAppLoadingAction(appLoading));
//         },
//     };
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(PersonInfo);
