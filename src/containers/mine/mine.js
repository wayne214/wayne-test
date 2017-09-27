import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    DeviceEventEmitter,
    TouchableOpacity,
    InteractionManager,
    Platform,
    Alert,
} from 'react-native';
import {loadUserFromLocalAction, queryUserAvatarAction, changeUserAvatarAction} from '../../action/user';
import Storage from '../../utils/storage';
import * as StaticColor from '../../constants/staticColor';
import {PHOTOREFNO} from '../../constants/setting';
import NavigationBar from '../../common/navigationBar/navigationBar';
import CenterHeaderIcon from '../../../assets/mine/userCenterHeader.png';
import SettingCell from '../../containers/mine/cell/settingCell';
import CenterLoginAvatar from '../../../assets/mine/login_avatar.png';
import Message from '../../../assets/mine/message.png';
import MessageNew from '../../../assets/mine/newmessage.png';
import Toast from '@remobile/react-native-toast';
import {changeAppLoadingAction} from '../../action/app';
import ClickUtil from '../../utils/prventDoubleClickUtil';
import {
    setMessageListIconAction,
    setVerifiedAction,
    setCertificationAction,
    setCarNumAction
} from '../../action/jpush';
import {
    getQualificationsStatusAction,
    // getQualificationsStatusSuccessAction,
    getRealNameStatusAction,
    // getRealNameStatusSuccessAction,
} from '../../action/user';
import * as API from '../../constants/api';
import ImagePicker from 'react-native-image-picker';
import {upLoadImageManager} from '../../utils/upLoadImageToVerified';
// import {getPersonInfoAction} from '../../action/mine';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import PermissionsManager from '../../utils/permissionManager';
import HTTPRequest from '../../utils/httpRequest';
import Loading from '../../utils/loading';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const options = {
    title: '选择照片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '相册',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
};
const {height, width} = Dimensions.get('window');
const selectedArr = ["拍照", "从手机相册选择"];

const styles = StyleSheet.create({
    headerImage: {
        width,
        flexDirection: 'row',
        height: 100,
        alignItems: 'center',
    },
    headerView: {
        width: width - 92,
        flexDirection: 'row',
        height: 100,
        alignItems: 'center',
        marginBottom: 10,
    },
    contentPostionView: {
        position: 'absolute',
        top: 93,
    },
    numberView: {
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: StaticColor.WHITE_COLOR,
        height: 10,
        alignItems: 'center',
    },
    orderNmuberView: {
        flex: 1,
        marginLeft: 5,
        width: width * 0.5 - 0.5,
    },
    carNmuberView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    numberLine: {
        backgroundColor: StaticColor.COLOR_SEPARATE_GRAY_LINE,
        width: 0.5,
        height: 27,
    },
    numberText: {
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 15,
        color: '#333333',
    },
    numberContent: {
        fontSize: 18,
        color: StaticColor.RED_TEXT_COLOR,
        marginRight: 20,
    },
    separateView: {
        height: 10,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    lineView: {
        height: 0.5,
        backgroundColor: '#e8e8e8',
    },
    contentView: {
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    iconOutView: {
        marginBottom: 10,
        marginLeft: 15,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    driverIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    informView: {
        marginLeft: 15,
    },
    iconFont: {
        marginLeft: 20,
    },
    leftPart: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

class Mine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rightImageName: Message,
            driverName: '',
            phoneNum: '',
            qualifications: '',
            realName: '',
            userPlateNumber: '',
            // showChangeCar: false,
            avatarSource: '',
            loading: false,
        };
        this.pushToSetting = this.pushToSetting.bind(this);
        this.pushToMsgList = this.pushToMsgList.bind(this);
        this.getQualificationsStatus = this.getQualificationsStatus.bind(this);
        this.getQualificationsStatusSuccessCallBack = this.getQualificationsStatusSuccessCallBack.bind(this);
        this.getRealNameStatus = this.getRealNameStatus.bind(this);
        this.getRealNameStatusSuccessCallBack = this.getRealNameStatusSuccessCallBack.bind(this);
        this.queryUserAvatar = this.queryUserAvatar.bind(this);
        this.queryUserAvatarSuccessCallBack = this.queryUserAvatarSuccessCallBack.bind(this);
        this.certificationState = this.certificationState.bind(this);
        this.verifiedState = this.verifiedState.bind(this);
        this.changeAppLoading = this.changeAppLoading.bind(this);
        this.selectCamera = this.selectCamera.bind(this);
        this.selectPhoto = this.selectPhoto.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.getPeresonInfo = this.getPeresonInfo.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getPersonInfoSuccessCallback = this.getPersonInfoSuccessCallback.bind(this);

    }


    componentDidMount() {
        this.getCurrentPosition();
        setTimeout(() => {
            Storage.get('userInfo').then((userInfo) => {
                this.props.loadUserFromLocal(userInfo);
                this.setState({
                    driverName: userInfo.result.userName ? global.userName : userInfo.result.phone,
                    phoneNum: userInfo.result.phone,
                });
            });
        }, 200);


        Storage.get('newMessageFlag').then((value) => {
            console.log('newMessageFlag');
            if (value === '1') {
                this.props.setMessageListIcon(true);
            }
        });

        console.log('=====NewPhotoRefNo====')
        Storage.get('NewPhotoRefNo').then((value) => {
            console.log('=====NewPhotoRefNo====', value)
            if (value) {
                this.queryUserAvatar(value, this.queryUserAvatarSuccessCallBack)
            } else {
                if (global.photoRefNo) {
                    this.queryUserAvatar(global.photoRefNo, this.queryUserAvatarSuccessCallBack)
                }
            }
        })



        this.mineListener = DeviceEventEmitter.addListener('refreshMine', () => {
             this.certificationState();
             this.verifiedState();
        });

        this.infoListener = DeviceEventEmitter.addListener('UserInfoName', (e) => {

            this.setState({
                driverName:e,
            })
        });


        this.certificationState();
        this.verifiedState();


        /*资质认证提交成功，刷新状态*/
        this.cerlistener = DeviceEventEmitter.addListener('certificationSuccess', () => {

            this.certificationState();
        });

        /*实名认证提交成功，刷新状态*/
        this.verlistener = DeviceEventEmitter.addListener('verifiedSuccess', () => {

            this.verifiedState();
        });

        this.imglistener = DeviceEventEmitter.addListener('imageCallBack',(response)=>{
            this.imageProcess(response);
        });
    }


    componentWillUnmount() {
        this.mineListener.remove();
        this.infoListener.remove();
        this.cerlistener.remove();
        this.verlistener.remove();
        this.imglistener.remove();
    }




    // 获取个人信息
    getPeresonInfo() {
        /*
        Storage.get('personInfoResult').then((value) => {

            if (value) {
                this.setState({
                    driverName: this.props.verifiedState == 1202 ? value.driverName : this.state.driverName,
                });
            } else {
                this.fetchData(this.getPersonInfoSuccessCallback);
            }
        });
        */
        this.fetchData(this.getPersonInfoSuccessCallback);

    }

    // 获取个人信息 网络请求
    fetchData(getPersonInfoSuccessCallback) {
        Storage.get('userInfo').then((userInfo) => {
            if (userInfo) {
                currentTime = new Date().getTime();
                this.props.getPersonInfoAction({
                    mobilePhone: userInfo.result.phone,
                }, getPersonInfoSuccessCallback);
            }
        });
    }

    // 获取个人信息 成功回调
    getPersonInfoSuccessCallback(result) {

        if (result) {
            Storage.save('personInfoResult', result);

            this.setState({
                driverName: this.props.verifiedState == 1202 ? result.idCardName ? result.idCardName : this.state.driverName : this.state.driverName,
            });
        }
    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch(e => {
            console.log(e, 'error');
        });
    }

    /*资质认证请求*/
    certificationState() {

        this.setState({
            userPlateNumber: this.props.plateNumber,
        });

        // this.getQualificationsStatus(this.props.plateNumber, this.getQualificationsStatusSuccessCallBack);

    }


    /*实名认证请求*/
    verifiedState() {
        // this.getRealNameStatus(this.getRealNameStatusSuccessCallBack);
    }

    pushToSetting() {
        this.props.navigation.navigate('Setting');
    }

    pushToMsgList() {
        this.props.router.redirect(RouteType.MSGLIST_PAGE);
    }

    getQualificationsStatus(plate, getQualificationsStatusSuccessCallBack) {

        if (this.props.userInfo.phone) {

            let obj = {};
            if (plate) {
                obj = {
                    phoneNum: this.props.userInfo.phone,
                    plateNumber: plate,
                }
            } else {
                obj = {phoneNum: this.props.userInfo.phone};
            }

             
            this.props.getQualificationsStatus({
                body: obj
            }, getQualificationsStatusSuccessCallBack);
        }
    }

    getQualificationsStatusSuccessCallBack(result) {
        console.log('资质认证状态：', result);
        // this.setState({
        //     qualifications: result,
        // })
        this.props.setCertificationState(result);
        if (result === '1202') {
            DeviceEventEmitter.emit('bindUserCar',this.props.plateNumber);


        }
    };

    getRealNameStatus(getRealNameStatusSuccessCallBack) {
        currentTime = new Date().getTime();
        if (this.props.userInfo.result) {
            if (this.props.userInfo.result.phone) {

                this.props.getRealNameStatus({
                    url: API.API_AUTH_REALNAME_STATUS + this.props.userInfo.result.phone,
                    body: {
                        phoneNum: this.props.userInfo.result.phone,
                    }
                }, getRealNameStatusSuccessCallBack);
            }
        }
    }

    getRealNameStatusSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('资质认证状态查询', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '我的页面');
        console.log('实名认证状态：', result)

        // this.setState({
        //     realName: result,
        // });
        this.props.setVerifiedState(result);

        /*重新获取个人信息*/
        this.getPeresonInfo();

    };

    queryUserAvatar(photoRefNo, queryUserAvatarSuccessCallBack) {
        currentTime = new Date().getTime();
        this.props.queryAvatar({
            url: API.API_QUERY_USER_AVATAR,
            body: {
                photoRefNo: photoRefNo,
                userId: global.userId,
                userName: global.userName ? global.userName : this.state.phoneNum,
            }
        }, queryUserAvatarSuccessCallBack);
    }

    queryUserAvatarSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('查询头像', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '我的页面');
        console.log("成功的路径", result);
        if (result == null) {

        } else {
            this.setState({
                avatarSource: {uri: result},
            });
        }

    }


    /*选择 拍照  相册*/
    callbackSelected(i){
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
                }else
                    this.selectCamera();

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
    selectCamera(){
        ImagePicker.launchCamera(options, (response)=>{
            this.imageProcess(response);
        })
    }
    selectPhoto(){
        ImagePicker.launchImageLibrary(options, (response) =>{
            this.imageProcess(response);
        })
    }

    imageProcess(response){
        if (response.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (response.error) {
            console.log('ImagePicker Error: ', response.error);

        }
        else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);

        }
        else {
            let source = {uri: response.uri};

            this.setState({
                avatarSource: source
            })

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {
                uri: response.uri,
                type: 'multipart/form-data',
                name: 'image.png'
            };   //这里的key(uri和type和name)不能改变,
            console.log('response.fileName', response.fileName, 'file', file)

            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('userId', global.userId);
            formData.append('userName', global.userName ? global.userName : this.state.phoneNum);
            formData.append('fileName', response.fileName);

            this.upLoadImage(API.API_CHANGE_USER_AVATAR, formData);

        }
    }


    upLoadImage(url, data) {

        upLoadImageManager(url,
            data,
            () => {
                console.log('开始请求数据');
            },
            (respones) => {
                console.log(respones);

                if (respones.code === 200) {

                    Storage.save(PHOTOREFNO, respones.result);
                    global.photoRefNo = respones.result;

                    Storage.save('NewPhotoRefNo', respones.result);

                    // this.queryUserAvatar(respones.result, this.queryUserAvatarSuccessCallBack)
                } else {
                    Toast.showShortCenter('图片上传失败，请重新选择上传');
                }

            },
            (error) => {
                Toast.showShortCenter('图片上传失败，请重新选择上传');

            });
    }
    changeAppLoading(appLoading) {
    this.props.changeAppLoading(appLoading);
}

    render() {
        const navigator = this.props.navigation;
        const {user, result, certificationState, verifiedState} = this.props;
        const {qualifications, realName} = this.state
        const userInfo = user.get('userInfo');
        const statusRender =
            certificationState == '1202' && verifiedState == '1202' ?
                <View
                    style={{
                        height: 18,
                        width: 50,
                        borderRadius: 10,
                        borderWidth: 1,
                        marginLeft: 10,
                        borderColor: 'transparent',
                        backgroundColor: '#f6bd0e',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: 12,
                            color: '#ffffff',
                        }}
                    >已认证</Text>
                </View> :
                <View
                    style={{
                        height: 18,
                        width: 50,
                        borderRadius: 10,
                        borderWidth: 1,
                        marginLeft: 10,
                        borderColor: 'transparent',
                        backgroundColor: 'rgba(0,37,105,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: 12,
                            color: '#bbcfe8',
                        }}
                    >未认证</Text>
                </View>
        const changeCarView = this.props.userCarList && this.props.userCarList.length > 1 ?
            <TouchableOpacity onPress={() => {
                Storage.get('userCarList').then((value) => {
                    this.props.router.redirect(RouteType.CHANGECAR_PAGE, {
                        carList: value,
                        currentCar: this.props.plateNumber,
                        flag: false,
                    });
                });
            }}>
                <View
                    style={{
                        height: 28,
                        width: 85,
                        borderRadius: 18,
                        borderWidth: 1,
                        marginLeft: 16,
                        borderColor: 'transparent',
                        backgroundColor: 'rgba(0,37,105,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                    }}>
                    <Text
                        style={{
                            fontSize: 13,
                            color: 'white',
                        }}
                    >切换车辆</Text>
                </View>
            </TouchableOpacity> : null;
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#ffffff',
            }}>
                <NavigationBar

                    navigator={navigator}
                    leftButtonHidden={true}
                    rightButtonConfig={{
                        type: 'image',
                        image: this.props.jpushIcon == true ? MessageNew : Message,
                        onClick: () => {
                            this.props.setMessageListIcon(false);
                            Storage.save('newMessageFlag', '0');
                            this.pushToMsgList();
                        },
                    }}
                />
                <View style={{flex: 1}}>
                    <View>
                        <Image style={styles.headerImage} source={CenterHeaderIcon}>
                            <View style={styles.headerView}>
                                <TouchableOpacity onPress={() => {
                                    DeviceEventEmitter.emit('choosePhoto');
                                }}>
                                    <View style={styles.iconOutView}>
                                        {
                                            this.state.avatarSource != '' ?
                                                <Image
                                                    style={styles.driverIcon}
                                                    source={this.state.avatarSource}/>
                                                :
                                                <Image
                                                    style={styles.driverIcon}
                                                    source={CenterLoginAvatar}/>
                                        }

                                    </View>
                                </TouchableOpacity>
                                <View style={styles.informView}>
                                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                                color: '#FFFFFF',
                                                fontSize: 14,
                                                backgroundColor: 'transparent',
                                                alignItems: 'center',
                                            }}
                                        >{this.state.driverName}</Text>

                                        {statusRender}
                                    </View>

                                    <Text
                                        style={{
                                            marginTop: 5,
                                            marginBottom: 10,
                                            backgroundColor: 'transparent',
                                            color: '#FFFFFF',
                                            fontSize: 13
                                        }}>


                                        {
                                            this.props.plateNumber && certificationState == 1202 ? '车辆：' + this.props.plateNumber : ''
                                        }

                                    </Text>

                                </View>


                            </View>
                            {changeCarView}
                        </Image>

                        <View style={styles.contentPostionView}>
                            <View style={styles.numberView}/>
                            <View style={styles.contentView}>
                                <SettingCell
                                    leftIcon="&#xe62a;"
                                    content={'个人信息'}
                                    showBottomLine={true}
                                    clickAction={() => {
                                        ClickUtil.resetLastTime();
                                        if (ClickUtil.noDoubleClick()) {
                                            if (verifiedState == '1202' || verifiedState == '1200') {
                                                this.props.router.redirect(RouteType.PERSON_INFO_PAGE);
                                            } else if (verifiedState == '1201') {
                                                Alert.alert('提示', '实名认证中');
                                            } else if (verifiedState == '1203') {
                                                Alert.alert('提示', '实名认证被驳回');
                                            }
                                        }
                                    }}
                                />
                                <SettingCell
                                    leftIcon="&#xe62b;"
                                    content={'车辆信息'}
                                    showBottomLine={false}
                                    clickAction={() => {
                                        ClickUtil.resetLastTime();
                                        if (ClickUtil.noDoubleClick()) {
                                            if (certificationState == '1202' || certificationState == '1200') {
                                                if (this.props.plateNumberObj) {
                                                    if (this.props.plateNumberObj.carStatus && this.props.plateNumberObj.carStatus === 20) {
                                                        this.props.router.redirect(RouteType.CAR_INFO_PAGE);
                                                    } else {
                                                        this.props.router.redirect(RouteType.CAR_DISABLE_PAGE);
                                                    }
                                                }
                                                // this.props.router.redirect(RouteType.CAR_INFO_PAGE);
                                            } else if (certificationState === '1201') {
                                                Alert.alert('提示', '资质认证中');
                                            } else if (certificationState === '1203') {
                                                Alert.alert('提示', '资质认证被驳回');
                                            }
                                        }
                                    }}
                                />
                                <View style={styles.separateView}/>

                                {
                                    verifiedState != '1202' ?
                                        <SettingCell
                                            leftIcon="&#xe636;"
                                            content={'实名认证'}
                                            authenticationStatus={verifiedState}
                                            showBottomLine={true}
                                            clickAction={() => {
                                        ClickUtil.resetLastTime();
                                        if (ClickUtil.noDoubleClick()) {
                                            // this.changeAppLoading(true);

                                            if (verifiedState == '1200') {
                                                // 未认证

                                                Storage.get('changePersonInfoResult').then((value) => {

                                                    if (value){
                                                        this.props.router.redirect(RouteType.VERIFIED_PAGE,{
                                                            resultInfo: value,
                                                        });
                                                    }else {
                                                        this.props.router.redirect(RouteType.VERIFIED_PAGE);

                                                    }
                                                });


                                            } else {
                                                // 认证中，认证驳回，认证通过
                                                this.props.router.redirect(RouteType.MINE_VERIFIED_END_STATE, {
                                                    qualifications: verifiedState,
                                                });
                                            }

                                            // setTimeout(()=>{
                                            //     this.changeAppLoading(false);
                                            //
                                            // }, 500);
                                        }
                                    }}
                                        /> : null
                                }

                                {
                                    certificationState != '1202' ?
                                        <SettingCell
                                            leftIcon="&#xe635;"
                                            content={'资质认证'}
                                            authenticationStatus={certificationState}
                                            showBottomLine={false}
                                            clickAction={() => {
                                        ClickUtil.resetLastTime();
                                        if (ClickUtil.noDoubleClick()) {
                                            // this.changeAppLoading(true);

                                            //this.props.router.redirect(RouteType.MINE_VERIFIED_CERFICATION_END_STATE);
                                            if (certificationState) {
                                                if (certificationState == '1200') {
                                                    // 未认证

                                                    Storage.get('changeCarInfoResult').then((value) => {
                                                    if (value){
                                                        this.props.router.redirect(RouteType.CERTIFICATION_PAGE, {
                                                            resultInfo: value,
                                                        });
                                                    }else {
                                                        this.props.router.redirect(RouteType.CERTIFICATION_PAGE);
                                                    }
                                                });
                                                } else {
                                                    // 认证中，认证驳回，认证通过
                                                    this.props.router.redirect(RouteType.MINE_VERIFIED_CERFICATION_END_STATE, {
                                                        qualifications: certificationState,
                                                    });
                                                }
                                            }

                                            // setTimeout(()=>{
                                            //     this.changeAppLoading(false);
                                            //     // ClickUtil.resetLastTime();
                                            // },500)
                                        }
                                    }}
                                        /> : null
                                }
                                {
                                    verifiedState != '1202' && certificationState != '1202' ? <View style={styles.separateView}/> : null
                                }

                                <SettingCell
                                    leftIcon="&#xe62e;"
                                    content={'修改密码'}
                                    showBottomLine={false}
                                    clickAction={() => {
                                        ClickUtil.resetLastTime();
                                        if (ClickUtil.noDoubleClick()) {
                                            navigator.navigate('ChangePwd');
                                        }
                                    }}
                                />

                                <View style={styles.separateView}/>

                                <SettingCell
                                    leftIcon="&#xe630;"
                                    content={'关于我们'}
                                    showBottomLine={true}
                                    clickAction={() => {
                                        ClickUtil.resetLastTime();
                                        if (ClickUtil.noDoubleClick()) {
                                            navigator.navigate('AboutUs');
                                        }
                                    }}
                                />
                                <SettingCell
                                    leftIcon="&#xe637;" content={'设置'} clickAction={() => {
                                        ClickUtil.resetLastTime();
                                        if (ClickUtil.noDoubleClick()) {
                                            this.pushToSetting();
                                        }
                                }}
                                />
                                <View style={{
                                    height,
                                    backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
                                }}/>

                            </View>
                        </View>
                    </View>
                </View>

                {
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }
}

Mine.propTypes = {
    router: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired,
    loadUserFromLocal: React.PropTypes.func.isRequired,
    // receiveOrRefuseOrderCountAction: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    result: React.PropTypes.number,
};

function mapStateToProps(state) {

    console.log('mapStateToProps：= state', state);
    console.log('mapStateToProps：= state========', state.app.get('plateNumber'));


    return {
        mine: state.mine,
        user: state.user,
        userInfo: state.user.get('userInfo'),
        result: state.mine.get('shippedCount'),
        jpushIcon: state.jpush.get('jpushIcon'),
        getQualifications: state.user.get('getQualificationsStatus'),
        plateNumber: state.app.get('plateNumber'),
        userCarList: state.app.get('userCarList'),
        verifiedState: state.jpush.get('verifiedState'),
        certificationState: state.jpush.get('certificationState'),
        appLoading: state.app.get('appLoading'),
        plateNumberObj: state.app.get('plateNumberObj'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeAppLoading: (appLoading) => {
            dispatch(changeAppLoadingAction(appLoading));
        },
        loadUserFromLocal: (userInfo) => {
            dispatch(loadUserFromLocalAction(userInfo));
        },
        // receiveOrRefuseOrderCountAction: (params) => {
        //     dispatch(receiveOrRefuseOrderCountAction({
        //         url: API.API_NEW_QUERY_BOL_COUNT + params.phoneNum,
        //     }));
        // },
        setMessageListIcon: (data) => {
            dispatch(setMessageListIconAction(data));
        },
        getQualificationsStatus: (params, getQualificationsStatusSuccessCallBack) => {
            dispatch(getQualificationsStatusAction({
                url: API.API_AUTH_QUALIFICATIONS_STATUS,
                successCallBack: (response) => {
                    getQualificationsStatusSuccessCallBack(response.result);
                    // dispatch(getQualificationsStatusSuccessAction(response));
                },
                failCallBack: () => {

                },
                ...params,
            }));
        },
        getRealNameStatus: (params, getRealNameStatusSuccessCallBack) => {
            dispatch(getRealNameStatusAction({
                successCallBack: (response) => {
                    getRealNameStatusSuccessCallBack(response.result);
                    // dispatch(getRealNameStatusSuccessAction(response));
                },
                failCallBack: () => {

                },
                ...params,
            }));
        },
        queryAvatar: (params, queryUserAvatarSuccessCallBack) => {
            dispatch(queryUserAvatarAction({
                successCallBack: (response) => {
                    queryUserAvatarSuccessCallBack(response.result)
                },
                failCallBack: () => {

                },
                ...params,
            }));
        },
        changeAvatar: (params) => {
            dispatch(changeUserAvatarAction({
                successCallBack: (response) => {

                },
                failCallBack: () => {

                },
                ...params,
            }));
        },
        setVerifiedState: (data) => {
            dispatch(setVerifiedAction(data));
        },
        setCertificationState: (data) => {
            dispatch(setCertificationAction(data));
        },
        setCarNumState: (data) => {

            dispatch(setCarNumAction(data));
        },
        // getPersonInfoAction: (params, getPersonInfoSuccessCallback) => {
        //     dispatch(getPersonInfoAction({
        //         url: API.API_AUTH_REALNAME_DETAIL + params.mobilePhone,
        //         body: {
        //             phoneNum: params.mobilePhone,
        //         },
        //         successCallBack: (response) => {
        //             getPersonInfoSuccessCallback(response.result);
        //         },
        //         failCallBack: () => {
        //             dispatch(changeAppLoadingAction(false));
        //         },
        //     }));
        // },

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Mine);
