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
import ClickUtil from '../../utils/prventDoubleClickUtil';

import * as API from '../../constants/api';
import ImagePicker from 'react-native-image-picker';
import {upLoadImageManager} from '../../utils/upLoadImageToVerified';
// import {getPersonInfoAction} from '../../action/mine';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import PermissionsManager from '../../utils/permissionManager';
import HTTPRequest from '../../utils/httpRequest';
import Loading from '../../utils/loading';
import StorageKey from '../../constants/storageKeys';

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
            avatarSource: '',
            loading: false,
            certificationState: '1200', // 资质认证
            verifiedState: '1200', // 实名认证

        };
        this.pushToSetting = this.pushToSetting.bind(this);
        this.pushToMsgList = this.pushToMsgList.bind(this);
        this.queryUserAvatar = this.queryUserAvatar.bind(this);
        this.certificationState = this.certificationState.bind(this);
        this.verifiedState = this.verifiedState.bind(this);


    }


    componentDidMount() {
        this.getCurrentPosition();

        /*消息推送，有新的消息，有上角显示新的图片*/
        Storage.get('newMessageFlag').then((value) => {
            console.log('newMessageFlag');
            if (value === '1') {

                // 右上角图片改变

            }
        });

        /*获取头像具体的地址，*/
        Storage.get('NewPhotoRefNo').then((value) => {

            if (value) {
                this.queryUserAvatar(value)
            }
        });


        /*点击我，刷新认证状态*/
        this.mineListener = DeviceEventEmitter.addListener('refreshMine', () => {
            this.certificationState();
            this.verifiedState();
        });


        /*资质认证状态请求*/
        this.certificationState();
        /*实名认证状态请求*/
        this.verifiedState();


        /*资质认证提交成功，刷新状态*/
        this.cerlistener = DeviceEventEmitter.addListener('certificationSuccess', () => {

            this.certificationState();
        });

        /*实名认证提交成功，刷新状态*/
        this.verlistener = DeviceEventEmitter.addListener('verifiedSuccess', () => {

            this.verifiedState();
        });

        /*点击上传图片*/
        this.imglistener = DeviceEventEmitter.addListener('imageCallBack', (response) => {
            this.imageProcess(response);
        });
    }


    componentWillUnmount() {
        this.mineListener.remove();
        this.cerlistener.remove();
        this.verlistener.remove();
        this.imglistener.remove();
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

    /*实名认证状态请求*/
    verifiedState() {
        currentTime = new Date().getTime();

        if (this.props.userInfo) {
            if (this.props.userInfo.phone) {

                HTTPRequest({
                    url: API.API_AUTH_REALNAME_STATUS + this.props.userInfo.phone,
                    params: {
                        phoneNum: this.props.userInfo.phone,
                    },
                    loading: () => {

                    },
                    success: (responseData) => {

                        lastTime = new Date().getTime();
                        ReadAndWriteFileUtil.appendFile('实名认证状态查询', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                            locationData.district, lastTime - currentTime, '我的页面');

                        this.setState({
                            verifiedState: responseData.result,
                        })
                    },
                    error: (errorInfo) => {

                    },
                    finish: () => {
                    }
                });
            }
        }
    }

    /*资质认证状态请求*/
    certificationState() {

        if (this.props.userInfo.phone) {

            let obj = {};
            if (this.props.plateNumber) {
                obj = {
                    phoneNum: this.props.userInfo.phone,
                    plateNumber: this.props.plateNumber,
                }
            } else {
                obj = {phoneNum: this.props.userInfo.phone};
            }


            HTTPRequest({
                url: API.API_AUTH_QUALIFICATIONS_STATUS,
                params: obj,
                loading: () => {

                },
                success: (responseData) => {
                    this.setState({
                        certificationState: responseData.result,
                    });
                    if (responseData.result === '1202') {
                        /*资质认证成功，绑定当前车牌号*/
                        DeviceEventEmitter.emit('bindUserCar', this.props.plateNumber);
                    }
                },
                error: (errorInfo) => {

                },
                finish: () => {
                }
            });

        }
    }


    /*跳转到设置*/
    pushToSetting() {
        this.props.navigation.navigate('Setting');
    }

    /*跳转到消息列表*/
    pushToMsgList() {
        this.props.navigation.navigate('MsgList');
    }


    /*查询头像地址*/
    queryUserAvatar(photoRefNo) {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_QUERY_USER_AVATAR,
            params: {
                photoRefNo: photoRefNo,
                userId: global.userId,
                userName: global.userName ? global.userName : this.state.phoneNum,
            },
            loading: () => {

            },
            success: (responseData) => {
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
            },
            error: (errorInfo) => {

            },
            finish: () => {
            }
        });
    }


    /*获取头像数据*/
    imageProcess(response) {
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


    /*上传头像*/
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

                } else {
                    Toast.showShortCenter('图片上传失败，请重新选择上传');
                }

            },
            (error) => {
                Toast.showShortCenter('图片上传失败，请重新选择上传');

            });
    }

    render() {
        const navigator = this.props.navigation;
        const statusRender =
            this.state.certificationState == '1202' && this.state.verifiedState == '1202' ?
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
                {/*Storage.get('userCarList').then((value) => {*/}
                    {/*this.props.router.redirect(RouteType.CHANGECAR_PAGE, {*/}
                        {/*carList: value,*/}
                        {/*currentCar: this.props.plateNumber,*/}
                        {/*flag: false,*/}
                    {/*});*/}
                {/*});*/}
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
                                        >
                                            {
                                                this.state.verifiedState == 1202 ? this.props.userName : this.props.userInfo.phone
                                            }
                                        </Text>

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
                                            this.state.certificationState == 1202 ? '车辆：' + this.props.plateNumber : ''
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
                                            if (this.state.verifiedState == '1202' || this.state.verifiedState == '1200') {
                                                navigator.navigate('PersonInfo');
                                            } else if (this.state.verifiedState == '1201') {
                                                Alert.alert('提示', '实名认证中');
                                            } else if (this.state.verifiedState == '1203') {
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
                                            if (this.state.certificationState == '1202' || this.state.certificationState == '1200') {
                                                if (this.props.plateNumberObj) {
                                                    if (this.props.plateNumberObj.carStatus && this.props.plateNumberObj.carStatus === 20) {
                                                        navigator.navigate('CarInfo');
                                                        //this.props.router.redirect(RouteType.CAR_INFO_PAGE);
                                                    } else {
                                                        navigator.navigate('CarDisablePage');
                                                        //this.props.router.redirect(RouteType.CAR_DISABLE_PAGE);
                                                    }
                                                }
                                                // this.props.router.redirect(RouteType.CAR_INFO_PAGE);
                                            } else if (this.state.certificationState === '1201') {
                                                Alert.alert('提示', '资质认证中');
                                            } else if (this.state.certificationState === '1203') {
                                                Alert.alert('提示', '资质认证被驳回');
                                            }
                                        }
                                    }}
                                />
                                <View style={styles.separateView}/>

                                {
                                    this.state.verifiedState != '1202' ?
                                        <SettingCell
                                            leftIcon="&#xe636;"
                                            content={'实名认证'}
                                            authenticationStatus={this.state.verifiedState}
                                            showBottomLine={true}
                                            clickAction={() => {
                                        ClickUtil.resetLastTime();
                                        if (ClickUtil.noDoubleClick()) {

                                            if (this.state.verifiedState == '1200') {
                                                // 未认证

                                                Storage.get(StorageKey.changePersonInfoResult).then((value) => {

                                                    if (value){
                                                         this.props.navigation.navigate('VerifiedPage', {
                                                             resultInfo: value,
                                                         });
                                                    }else {
                                                        this.props.navigation.navigate('VerifiedPage');
                                                    }
                                                });


                                            } else {
                                                // 认证中，认证驳回，认证通过

                                                 this.props.navigation.navigate('VerifiedStatePage', {
                                                     qualifications: this.state.verifiedState,
                                                 });
                                            }
                                        }
                                    }}
                                        /> : null
                                }

                                {
                                    this.state.certificationState != '1202' ?
                                        <SettingCell
                                            leftIcon="&#xe635;"
                                            content={'资质认证'}
                                            authenticationStatus={this.state.certificationState}
                                            showBottomLine={false}
                                            clickAction={() => {
                                                ClickUtil.resetLastTime();
                                                if (ClickUtil.noDoubleClick()) {
                                                    if (this.state.certificationState) {
                                                        if (this.state.certificationState == '1200') {
                                                            // 未认证

                                                            Storage.get(StorageKey.changeCarInfoResult).then((value) => {

                                                            if (value){
                                                                this.props.navigation.navigate('CertificationPage', {
                                                                    resultInfo: value,
                                                                 });

                                                            }else {
                                                                this.props.navigation.navigate('CertificationPage');                                                    }
                                                            });
                                                        } else {
                                                            // 认证中，认证驳回，认证通过
                                                                this.props.navigation.navigate('CerifiedStatePage', {
                                                                qualifications: this.state.certificationState,
                                                            });
                                                        }
                                                    }

                                                }
                                            }}
                                        /> : null
                                }

                                {
                                    this.state.verifiedState == '1202' && this.state.certificationState == '1202' ?
                                        null : <View style={styles.separateView}/>
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

function mapStateToProps(state) {

    return {
        userInfo: state.user.get('userInfo'),
        userName: state.user.get('userName'),
        plateNumber: state.user.get('plateNumber'),
        userCarList: state.user.get('userCarList'),
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Mine);
