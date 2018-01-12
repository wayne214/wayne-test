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
    Platform,
    Alert,
    Modal,
} from 'react-native';
import Storage from '../../utils/storage';
import * as StaticColor from '../../constants/staticColor';
import {PHOTOREFNO} from '../../constants/setting';
import SettingCell from '../../containers/mine/cell/settingCell';
import Toast from '@remobile/react-native-toast';
import ClickUtil from '../../utils/prventMultiClickUtil';
import * as API from '../../constants/api';
import {upLoadImageManager} from '../../utils/upLoadImageToVerified';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import HTTPRequest from '../../utils/httpRequest';
import Loading from '../../utils/loading';
import StorageKey from '../../constants/storageKeys';
import StaticImage from '../../constants/staticImage';
import * as ConstValue from '../../constants/constValue';
import AlertSheetItem from '../../common/alertSelected';
// import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';
// import DeviceInfo from 'react-native-device-info';
import {
    setDriverCharacterAction,
    setOwnerCharacterAction,
} from '../../action/user';

let currentTime = 0;
let lastTime = 0;
let locationData = '';
const selectedArr = ["拍照", "从手机相册选择"];
const {height, width} = Dimensions.get('window');
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
const styles = StyleSheet.create({
    headerImage: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerView: {
        width: width - 92,
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        marginTop: 100
    },
    contentPostionView: {
        position: 'absolute',
        top: 180,
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
        borderRadius: 30,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
        overflow: 'visible'

    },
    driverIcon: {
        width: 60,
        height: 60,
        resizeMode: 'stretch',
        borderRadius: 30,
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
    container: {
        ...Platform.select({
            ios: {
                height: ConstValue.NavigationBar_StatusBar_Height,
            },
            android: {
                height: 50,
            },
        }),
        backgroundColor: 'transparent',
        width: width,
    },
    titleContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: ConstValue.StatusBar_Height,
            },
            android: {
                paddingTop: 0,
            },
        }),
        flexDirection: 'row',
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    centerContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7,
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        color: StaticColor.WHITE_COLOR,
    },
    allContainer: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    scrollViewHeight: {
        ...Platform.select({
            ios: {
                height: height - ConstValue.NavigationBar_StatusBar_Height - 70 - ConstValue.Tabbar_Height,
            },
            android: {
                height: height - 170,
            },
        }),
    }
});

class Mine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rightImageName: StaticImage.Message,
            avatarSource: '',
            loading: false,
            certificationState: '1200', // 资质认证
            verifiedState: '1200', // 实名认证
            modalVisible: false,
        };
        this.pushToSetting = this.pushToSetting.bind(this);
        this.pushToMsgList = this.pushToMsgList.bind(this);
        this.queryUserAvatar = this.queryUserAvatar.bind(this);
        this.certificationState = this.certificationState.bind(this);
        this.verifiedState = this.verifiedState.bind(this);

        this.selectCamera = this.selectCamera.bind(this);
        this.selectPhoto = this.selectPhoto.bind(this);
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.contentViewScroll = this.contentViewScroll.bind(this);
    }


    componentDidMount() {
        this.choosePhotoListener = DeviceEventEmitter.addListener('choosePhoto', () => {
            this.showAlertSelected();
        });
        this.getCurrentPosition();

        /*消息推送，有新的消息，有上角显示新的图片*/
        Storage.get('newMessageFlag').then((value) => {
            console.log('newMessageFlag');
            if (value === '1') {
                // 右上角图片改变

            }
        });

        /*获取头像具体的地址，*/
        Storage.get(StorageKey.PHOTO_REF_NO).then((value) => {
            if (value) {
                this.queryUserAvatar(value)
            }
        });


        /*点击我，刷新认证状态*/
        this.mineListener = DeviceEventEmitter.addListener('refreshMine', () => {
            if (this.props.currentStatus == 'driver') {
                this.verifiedState();
            } else {
                this.ownerVerifiedState();
            }
        });


        /*实名认证状态请求*/
        if (this.props.currentStatus == 'driver') {
            this.verifiedState();
            this.certificationState();
        }

        /*资质认证提交成功，刷新状态*/
        this.cerlistener = DeviceEventEmitter.addListener('certificationSuccess', () => {

            this.certificationState();
        });

        /*实名认证提交成功，刷新状态*/
        this.verlistener = DeviceEventEmitter.addListener('verifiedSuccess', () => {
            if (this.props.currentStatus == 'driver') {
                this.verifiedState();
            } else {
                this.ownerVerifiedState();
            }
        });

        /*点击上传图片*/
        this.imglistener = DeviceEventEmitter.addListener('imageCallBack', (response) => {
            this.imageProcess(response);
        });
        this.imgPhotoListener = DeviceEventEmitter.addListener('imagePhotoCallBack', (image) => {
            if (Platform.OS === 'ios') {
                this.imageCropProcess(image);
            } else {
                this.imageADCropProcess(image);
            }
        });
        this.imageCameralistener = DeviceEventEmitter.addListener('imageCameraCallBack', (image) => {
            if (Platform.OS === 'ios') {
                this.imageCropCameraProcess(image);
            } else {
                this.imageADCropCameraProcess(image);
            }

        });
        this.hideModuleListener = DeviceEventEmitter.addListener('hideModule', (response) => {
            this.setState({
                modalVisible: false,
            })
        });
    }


    componentWillUnmount() {
        this.mineListener.remove();
        this.imgPhotoListener.remove();
        this.cerlistener.remove();
        this.verlistener.remove();
        this.imglistener.remove();
        this.choosePhotoListener.remove();
        this.hideModuleListener.remove();
        this.imageCameralistener.remove();
    }

    /*点击弹出菜单*/
    showAlertSelected() {
        if (this.refs.choose)
            this.refs.choose.show("请选择照片", selectedArr, '#333333', this.callbackSelected);
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
                        // Toast.showShortCenter(err.message);
                        Alert.alert(null, err.message)
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

    selectCamera() {
        // ImagePicker.launchCamera(options, (response) => {
        //     // this.imageProcess(response);
        //     this.setState({
        //         modalVisible: false,
        //     });
        //     DeviceEventEmitter.emit('imageCallBack', response);
        // })

        ImageCropPicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log('照相机image',image);
            this.setState({
                modalVisible: false,
            });
            DeviceEventEmitter.emit('imageCameraCallBack', image);
        });
    }

    selectPhoto() {
        // ImagePicker.launchImageLibrary(options, (response) => {
        //     // this.imageProcess(response);
        //     this.setState({
        //         modalVisible: false,
        //     });
        //     DeviceEventEmitter.emit('imageCallBack', response);
        // })

        ImageCropPicker.openPicker({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log('图片image', image);
            this.setState({
                modalVisible: false,
            });
            DeviceEventEmitter.emit('imagePhotoCallBack', image);
        })
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
                        let result = responseData.result;
                        this.setState({
                            verifiedState: result,
                        });
                        // global.verifiedState = responseData.result;
                        // 首页状态

                        // result == '1201' ?
                        //     this.props.setDriverCharacterAction('1')
                        //     : result.certificationStatus == '1202' ?
                        //     this.props.setDriverCharacterAction('2') :
                        //     this.props.setDriverCharacterAction('3')
                        //

                        switch (result){
                            case '1201' || 1201:
                                this.props.setDriverCharacterAction('1');
                                break;
                            case '1202' || 1202:
                                this.props.setDriverCharacterAction('2');
                                break;
                            case '1203' || 1203:
                                this.props.setDriverCharacterAction('3');
                                break;
                        }


                    },
                    error: (errorInfo) => {

                    },
                    finish: () => {
                    }
                });
            }
        }
    }

    ownerVerifiedState() {
        currentTime = new Date().getTime();

        if (this.props.userInfo) {
            if (this.props.userInfo.phone) {

                HTTPRequest({
                    url: API.API_QUERY_COMPANY_INFO,
                    params: {
                        busTel: global.phone,
                        // companyNature: '个人'
                    },
                    loading: () => {

                    },
                    success: (responseData) => {
                        console.log('ownerVerifiedState==', responseData.result);
                        let result = responseData.result;
                        this.setState({
                            verifiedState: result && result.certificationStatus,
                        });
                        // 首页状态
                        if (result.companyNature == '个人') {
                            // 确认个人车主
                            result.certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('11')
                                : result.certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('12') :
                                this.props.setOwnerCharacterAction('13')
                        } else {
                            // 确认企业车主
                            result.certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('21')
                                : result.certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('22') :
                                this.props.setOwnerCharacterAction('23')
                        }
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
                    global.certificationState = responseData.result;
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
                const result = responseData.result;
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

    /*IOS获取头像照片数据*/
    imageCropProcess(image) {
        console.log('iamgeee',image)
        if (image.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (image.error) {
            console.log('ImagePicker Error: ', image.error);

        }
        else if (image.customButton) {
            console.log('User tapped custom button: ', image.customButton);

        }
        else {

            let source = {uri: image.path};

            this.setState({
                avatarSource: source
            })

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {
                uri: image.path,
                type: 'multipart/form-data',
                name: 'image.png'
            };   //这里的key(uri和type和name)不能改变,
            console.log('response.fileName', image.filename, 'file', file)
            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('userId', global.userId);
            formData.append('userName', global.userName ? global.userName : this.state.phoneNum);
            formData.append('fileName', image.filename);
            formData.append('mimeType', image.mime);
            this.upLoadImage(API.API_CHANGE_USER_AVATAR, formData);
        }
    }
    /*ANDROID获取头像照片数据*/
    imageADCropProcess(image) {
        if (image.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (image.error) {
            console.log('ImagePicker Error: ', image.error);

        }
        else if (image.customButton) {
            console.log('User tapped custom button: ', image.customButton);

        }
        else {

            let source = {uri: image.path};

            this.setState({
                avatarSource: source
            })

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {
                uri: image.path,
                type: 'multipart/form-data',
                name: 'image.png'
            };   //这里的key(uri和type和name)不能改变,
            console.log('response.fileName', 'abc.jpg', 'file', file)
            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('userId', global.userId);
            formData.append('userName', global.userName ? global.userName : this.state.phoneNum);
            formData.append('fileName', 'abc.jpg');
            formData.append('mimeType', image.mime);
            this.upLoadImage(API.API_CHANGE_USER_AVATAR, formData);
        }
    }

    /*获取头像拍摄数据*/
    imageCropCameraProcess(image) {

        if (image.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (image.error) {
            console.log('ImagePicker Error: ', image.error);

        }
        else if (image.customButton) {
            console.log('User tapped custom button: ', image.customButton);

        }
        else {

            let source = {uri: image.path};

            this.setState({
                avatarSource: source
            })

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {
                uri: image.path,
                type: 'multipart/form-data',
                name: 'image.png'
            };   //这里的key(uri和type和name)不能改变,
            console.log('response.fileName', image.filename, 'file', file)
            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('userId', global.userId);
            formData.append('userName', global.userName ? global.userName : this.state.phoneNum);
            formData.append('fileName', 'abc.jpg');
            formData.append('mimeType', image.mime);
            this.upLoadImage(API.API_CHANGE_USER_AVATAR, formData);
        }
    }
    /*获取头像拍摄数据*/
    imageADCropCameraProcess(image) {

        if (image.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (image.error) {
            console.log('ImagePicker Error: ', image.error);

        }
        else if (image.customButton) {
            console.log('User tapped custom button: ', image.customButton);

        }
        else {

            let source = {uri: image.path};

            this.setState({
                avatarSource: source
            })

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {
                uri: image.path,
                type: 'multipart/form-data',
                name: 'image.png'
            };   //这里的key(uri和type和name)不能改变,
            console.log('response.fileName', image.filename, 'file', file)
            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('userId', global.userId);
            formData.append('userName', global.userName ? global.userName : this.state.phoneNum);
            formData.append('fileName', 'abc.jpg');
            formData.append('mimeType', image.mime);
            this.upLoadImage(API.API_CHANGE_USER_AVATAR, formData);
        }
    }


    /*上传头像*/
    upLoadImage(url, data) {
        console.log('upLoadImage1',url);
        console.log('upLoadImage2',data);
        upLoadImageManager(url,
            data,
            () => {
                console.log('开始请求数据');
            },
            (respones) => {
                console.log('upLoadImage',respones);
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

    // 判断ScrollView滑动到底部
    contentViewScroll(e: Object) {
        var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        var contentSizeHeight = e.nativeEvent.contentSize.height - 300; //scrollView contentSize高度
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        console.log('fjafd===', ConstValue.NavigationBar_StatusBar_Height, ConstValue.Tabbar_Height,);
        console.log('滑动距离', offsetY, contentSizeHeight, oriageScrollHeight, height);
        if (offsetY + oriageScrollHeight >= contentSizeHeight) {
            console.log('scrollView', 'scrollView滑动到底部事件');
            this.scrollView.scrollTo({x: 0, y: 0, animated: true})
        }
    }

    render() {
        const navigator = this.props.navigation;
        const statusRender =
            this.state.verifiedState == '1202' ?
                <View
                    style={{
                        position: 'absolute',
                        height: 18,
                        width: 50,
                        borderRadius: 10,
                        borderWidth: 1,
                        marginLeft: 22,
                        marginTop:55,
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
                        position: 'absolute',
                        height: 18,
                        width: 50,
                        borderRadius: 10,
                        borderWidth: 1,
                        marginLeft: 22,
                        marginTop:55,
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
                </View>;

        const changeCarView = this.props.userCarList && this.props.userCarList.length > 1 ?
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('ChooseCar', {
                    carList: this.props.userCarList,
                    currentCar: this.props.plateNumber,
                    flag: false,
                });
            }}>
                <View
                    style={{
                        height: 28,
                        width: 87,
                        // right: 10,
                        // borderRadius: 18,
                        borderTopLeftRadius: 18,
                        borderBottomLeftRadius: 18,
                        borderWidth: 1,
                        borderColor: 'transparent',
                        backgroundColor: 'rgba(0,37,105,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // position: 'absolute',
                        // bottom: 20,
                    }}>
                    <Text
                        style={{
                            fontSize: 13,
                            color: 'white',
                        }}
                    >关联车辆</Text>
                </View>
            </TouchableOpacity> : null;
        // 标题布局
        const TitleView =
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <View style={styles.leftContainer}>
                    </View>
                    <View style={styles.centerContainer}>
                        <Text style={styles.title}>我的</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <TouchableOpacity
                            style={{paddingRight: 10}}
                            activeOpacity={1}
                            onPress={() => {
                                Storage.save(StorageKey.newMessageFlag, '0');
                                this.pushToMsgList();
                            }}
                        >
                            <Image
                                source={this.props.jpushIcon === true ? StaticImage.MessageNewMine : StaticImage.MessageMine}
                                style={{alignSelf: 'center', width: 17, height: 17}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>;
        return (
            <View style={styles.allContainer}>
                <View style={{flex: 1}}>
                    <View>
                        <Image source={StaticImage.CenterHeaderIcon} style={{width: width}} resizeMode={'stretch'}>
                            <View style={{
                                position: 'absolute',
                                height: ConstValue.NavigationBar_StatusBar_Height,
                                width,
                                justifyContent: 'center',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                {TitleView}
                            </View>
                            <View style={styles.headerView}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        modalVisible: true,
                                    }, () => {
                                        DeviceEventEmitter.emit('choosePhoto');
                                    });
                                }}>
                                    <View style={styles.iconOutView}>
                                        {
                                            this.state.avatarSource != '' ?
                                                <Image
                                                    resizeMode='stretch'
                                                    style={styles.driverIcon}
                                                    source={this.state.avatarSource}
                                                />
                                                :
                                                <Image
                                                    resizeMode='stretch'
                                                    style={styles.driverIcon}
                                                    source={StaticImage.CenterLoginAvatar}
                                                />
                                        }
                                    </View>
                                    {statusRender}
                                </TouchableOpacity>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={styles.informView}>
                                        <View style={{ }}>
                                            <Text
                                                style={{
                                                    fontWeight: 'bold',
                                                    color: '#FFFFFF',
                                                    fontSize: 18,
                                                    backgroundColor: 'transparent',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {
                                                    this.state.verifiedState == 1202 ? this.props.userName : this.props.userInfo.phone
                                                }
                                            </Text>
                                            <Text
                                                style={{
                                                    marginTop: 5,
                                                    marginBottom: 10,
                                                    backgroundColor: 'transparent',
                                                    color: '#FFFFFF',
                                                    fontSize: 13
                                                }}>
                                                {
                                                    this.props.currentStatus == 'driver' && this.state.certificationState == 1202 ? '车辆：' + this.props.plateNumber : ''
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{flex: 1}}/>
                                    {this.props.currentStatus == 'driver' ?
                                        changeCarView : null}
                                </View>
                            </View>
                        </Image>
                        <View style={styles.contentPostionView}>
                            <ScrollView onMomentumScrollEnd={
                                this.contentViewScroll
                                // this.scrollView.scrollTo({x: 0, y: 0, animated: true})
                            } style={styles.scrollViewHeight}
                                        ref={(scroll) => {
                                            this.scrollView = scroll
                                        }}
                            >
                                <View style={styles.numberView}/>
                                <View style={styles.contentView}>

                                    {this.props.currentStatus == 'driver' ?
                                        <View>
                                            <SettingCell
                                                style={{height: 36}}
                                                leftIcon="&#xe62a;"
                                                content={'个人信息'}
                                                showBottomLine={true}
                                                clickAction={() => {
                                                    ClickUtil.resetLastTime();
                                                    if (ClickUtil.onMultiClick()) {
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
                                                showBottomLine={true}
                                                clickAction={() => {
                                                    ClickUtil.resetLastTime();
                                                    if (ClickUtil.onMultiClick()) {
                                                        if (this.state.certificationState == '1202' || this.state.certificationState == '1200') {
                                                            if (this.props.plateNumberObj) {
                                                                if (this.props.plateNumberObj.size === 0 || this.props.plateNumberObj.carStatus && this.props.plateNumberObj.carStatus === 20 || this.props.plateNumberObj.carStatus === 0) {
                                                                    navigator.navigate('CarInfo');
                                                                } else {
                                                                    navigator.navigate('CarDisablePage');
                                                                }
                                                            }
                                                        } else if (this.state.certificationState === '1201') {
                                                            Alert.alert('提示', '资质认证中');
                                                        } else if (this.state.certificationState === '1203') {
                                                            Alert.alert('提示', '资质认证被驳回');
                                                        }
                                                    }
                                                }}
                                            />
                                            {
                                                this.state.verifiedState != '1202' ?
                                                    <SettingCell
                                                        leftIcon="&#xe672;"
                                                        iconFontColor={{color: '#F6BD0E'}}
                                                        content={'认证信息'}
                                                        showBottomLine={false}
                                                        clickAction={() => {
                                                            if (this.state.verifiedState == '1200') {
                                                                // 未认证
                                                                Storage.get(StorageKey.changePersonInfoResult).then((value) => {

                                                                    if (value) {
                                                                        this.props.navigation.navigate('VerifiedPage', {
                                                                            resultInfo: value,
                                                                        });
                                                                    } else {
                                                                        this.props.navigation.navigate('VerifiedPage');
                                                                    }
                                                                });
                                                            } else {
                                                                // 认证中，认证驳回，认证通过

                                                                this.props.navigation.navigate('VerifiedStatePage', {
                                                                    qualifications: this.state.verifiedState,
                                                                });
                                                            }
                                                        }}
                                                    /> : null
                                            }
                                        </View>
                                        :
                                        <View>
                                            <SettingCell
                                                leftIcon="&#xe62a;"
                                                content={'司机管理'}
                                                showBottomLine={false}
                                                clickAction={() => {
                                                    navigator.navigate('DriverManagement');
                                                }}
                                            />
                                            <SettingCell
                                                leftIcon="&#xe62b;"
                                                content={'车辆管理'}
                                                showBottomLine={false}
                                                clickAction={() => {
                                                    navigator.navigate('CarManagement');
                                                }}
                                            />
                                            {
                                                this.props.ownerStatus == '12' || this.props.ownerStatus == '22' ?
                                                    null : <SettingCell
                                                        leftIcon="&#xe672;"
                                                        iconFontColor={{color: '#F6BD0E'}}
                                                        content={'认证信息'}
                                                        showBottomLine={false}
                                                        clickAction={() => {
                                                            console.log("认证信息", this.props.ownerStatus);
                                                            // this.props.navigation.navigate('EnterpriseownerVerifiedStatePage', {
                                                            //     // qualifications: this.state.verifiedState,
                                                            // });
                                                            // 个人车主认证信息
                                                            if (this.props.ownerStatus == '11' || this.props.ownerStatus == '13') {
                                                                this.props.navigation.navigate('PersonownerVerifiedStatePage',
                                                                //     {
                                                                //     // qualifications: this.props.ownerStatus,
                                                                // }
                                                                );
                                                            }
                                                            // 企业车主认证信息
                                                            if (this.props.ownerStatus == '21' || this.props.ownerStatus == '23') {
                                                                this.props.navigation.navigate('EnterpriseownerVerifiedStatePage', {
                                                                    qualifications: this.props.ownerStatus,
                                                                });
                                                            }
                                                        }}
                                                    />
                                            }
                                        </View>

                                    }

                                    <View style={styles.separateView}/>
                                    {/*{*/}
                                    {/*this.state.verifiedState != '1202' ?*/}
                                    {/*<SettingCell*/}
                                    {/*leftIcon="&#xe673;"*/}
                                    {/*content={'实名认证'}*/}
                                    {/*authenticationStatus={this.state.verifiedState}*/}
                                    {/*showBottomLine={true}*/}
                                    {/*clickAction={() => {*/}
                                    {/*ClickUtil.resetLastTime();*/}
                                    {/*if (ClickUtil.onMultiClick()) {*/}
                                    {/*if (this.state.verifiedState == '1200') {*/}
                                    {/*// 未认证*/}
                                    {/*Storage.get(StorageKey.changePersonInfoResult).then((value) => {*/}

                                    {/*if (value){*/}
                                    {/*this.props.navigation.navigate('VerifiedPage', {*/}
                                    {/*resultInfo: value,*/}
                                    {/*});*/}
                                    {/*}else {*/}
                                    {/*this.props.navigation.navigate('VerifiedPage');*/}
                                    {/*}*/}
                                    {/*});*/}
                                    {/*} else {*/}
                                    {/*// 认证中，认证驳回，认证通过*/}

                                    {/*this.props.navigation.navigate('VerifiedStatePage', {*/}
                                    {/*qualifications: this.state.verifiedState,*/}
                                    {/*});*/}
                                    {/*}*/}
                                    {/*}*/}
                                    {/*}}*/}
                                    {/*/> : null*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*this.state.certificationState != '1202' ?*/}
                                    {/*<SettingCell*/}
                                    {/*leftIcon="&#xe672;"*/}
                                    {/*content={'资质认证'}*/}
                                    {/*authenticationStatus={this.state.certificationState}*/}
                                    {/*showBottomLine={false}*/}
                                    {/*clickAction={() => {*/}
                                    {/*ClickUtil.resetLastTime();*/}
                                    {/*if (ClickUtil.onMultiClick()) {*/}
                                    {/*if (this.state.certificationState) {*/}
                                    {/*if (this.state.certificationState == '1200') {*/}
                                    {/*// 未认证*/}

                                    {/*Storage.get(StorageKey.changeCarInfoResult).then((value) => {*/}

                                    {/*if (value){*/}
                                    {/*this.props.navigation.navigate('CertificationPage', {*/}
                                    {/*resultInfo: value,*/}
                                    {/*});*/}

                                    {/*}else {*/}
                                    {/*this.props.navigation.navigate('CertificationPage');                                                    }*/}
                                    {/*});*/}
                                    {/*} else {*/}
                                    {/*// 认证中，认证驳回，认证通过*/}
                                    {/*this.props.navigation.navigate('CerifiedStatePage', {*/}
                                    {/*qualifications: this.state.certificationState,*/}
                                    {/*});*/}
                                    {/*}*/}
                                    {/*}*/}

                                    {/*}*/}
                                    {/*}}*/}
                                    {/*/> : null*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*this.state.verifiedState == '1202' && this.state.certificationState == '1202' ?*/}
                                    {/*null : <View style={styles.separateView}/>*/}
                                    {/*}*/}
                                    <SettingCell
                                        leftIcon="&#xe62e;"
                                        iconFontColor={{color: StaticColor.RED_CHANGE_PWD_ICON_COLOR}}
                                        content={'修改密码'}
                                        showBottomLine={false}
                                        clickAction={() => {
                                            ClickUtil.resetLastTime();
                                            if (ClickUtil.onMultiClick()) {
                                                navigator.navigate('ChangePwd');
                                            }
                                        }}
                                    />
                                    {/*<SettingCell*/}
                                    {/*leftIcon="&#xe62f;"*/}
                                    {/*iconFontColor={{color: StaticColor.YELLOW_PAY_ICON_COLOR}}*/}
                                    {/*content={'支付密码'}*/}
                                    {/*showBottomLine={false}*/}
                                    {/*clickAction={() => {*/}
                                    {/*ClickUtil.resetLastTime();*/}
                                    {/*if (ClickUtil.onMultiClick()) {*/}
                                    {/*navigator.navigate('PayPassword');*/}
                                    {/*}*/}
                                    {/*}}*/}
                                    {/*/>*/}

                                    {/*<View style={styles.separateView}/>*/}
                                    <View style={styles.separateView}/>
                                    <SettingCell
                                        leftIcon="&#xe630;"
                                        content={'关于我们'}
                                        showBottomLine={true}
                                        clickAction={() => {
                                            ClickUtil.resetLastTime();
                                            if (ClickUtil.onMultiClick()) {
                                                navigator.navigate('AboutUs');
                                            }
                                        }}
                                    />
                                    <SettingCell
                                        leftIcon="&#xe637;" content={'设置'} clickAction={() => {
                                        ClickUtil.resetLastTime();
                                        if (ClickUtil.onMultiClick()) {
                                            this.pushToSetting();
                                        }
                                    }}
                                    />
                                    <View style={styles.separateView}/>
                                    {/*<SettingCell*/}
                                        {/*leftIcon="&#xe66e;" content={'版本号'} clickAction={() => {}}*/}
                                        {/*hideArrowIcon={true}*/}
                                        {/*versionName={`V${DeviceInfo.getVersion()}`}*/}
                                    {/*/>*/}
                                    <View style={{
                                        height,
                                        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
                                    }}/>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
                {
                    this.state.loading ? <Loading/> : null
                }
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}>
                    <AlertSheetItem ref="choose"/>
                </Modal>
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
        plateNumberObj: state.user.get('plateNumberObj'),
        driverStatus: state.user.get('driverStatus'),
        currentStatus: state.user.get('currentStatus'),
        ownerStatus: state.user.get('ownerStatus'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setDriverCharacterAction: (result) => {

            dispatch(setDriverCharacterAction(result));
        },
        setOwnerCharacterAction: (result) => {
            dispatch(setOwnerCharacterAction(result));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Mine);
