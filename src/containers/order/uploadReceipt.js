/**
 * Created by xizhixin on 2017/6/30.
 * 上传回单界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    DeviceEventEmitter,
    Platform,
    Alert,
    ImageBackground,
} from 'react-native';

import NavigationBar from '../../common/navigationBar/navigationBar';
import CommonCell from "../../containers/mine/cell/commonCell";
import DialogSelected from '../../common/alertSelected';
import ImagePicker from 'react-native-image-crop-picker';
import Button from 'apsl-react-native-button';
import ClickUtil from '../../utils/prventMultiClickUtil';
import Toast from '@remobile/react-native-toast';
import {upLoadImageManager} from '../../utils/upLoadImageToVerified';
import StorageKey from '../../constants/storageKeys';
import StaticImage from '../../constants/staticImage';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

import {
    addImage,
    updateImages,
} from '../../action/order';
import * as API from '../../constants/api';
import Loading from '../../utils/loading';
import Storage from '../../utils/storage';
import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';
import * as StaticColor from '../../constants/staticColor';

const {width, height} = Dimensions.get('window');
const selectedArr = ["拍照", "从手机相册选择"];
const ImageWH = (width - 70) / 4;
let maxNum = 9;

let userID = '';
let userName = '';
let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles =StyleSheet.create({
    iconStyle: {
        width: 100,
        height: 100,
    },
    imageItem: {
        width: ImageWH,
        height: ImageWH,
    },
    imageView: {
        flexDirection: 'row',
        backgroundColor: StaticColor.WHITE_COLOR,
        paddingBottom: 10,
    },
    imageTitle: {
        marginTop: 10,
    },
    imageBorder: {
        marginTop: 10,
        marginLeft: 10,
        width: ImageWH,
        height: ImageWH,
        borderWidth: 1,
        borderColor: StaticColor.DEVIDE_LINE_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoText: {
        fontSize: 23,
        fontFamily: 'iconfont',
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        marginBottom: -5,
    },
    imageLayout: {
        marginLeft: 10,
        marginRight: 10,
    },
    uploadButton: {
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 0,
        backgroundColor: 'transparent',
        borderRadius: 5,
    },
    container: {
        flex: 1,
        backgroundColor:StaticColor.COLOR_VIEW_BACKGROUND,
    },
    buttonBackground: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        height: 44,
    },
});

class UploadReceipt extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            data:[],
            transCode: params.transCode,
            loading: false,
        };
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.createAddItem = this.createAddItem.bind(this);
        this.pickMultiple = this.pickMultiple.bind(this);
        this.takePhoto = this.takePhoto.bind(this);
        this.clickImage = this.clickImage.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.popToTop = this.popToTop.bind(this);
        this.goBackForward = this.goBackForward.bind(this);

    }
    componentDidMount() {
        this.getCurrentPosition();
        Storage.get(StorageKey.USER_INFO).then((userInfo) => {
            if(userInfo) {
                userID = userInfo.userId;
                userName = userInfo.userName;
            }
        });
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(updateImages());
        // DeviceEventEmitter.emit('changeStateReceipt');
    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }

    callbackSelected(i){
        switch (i){
            case 0: // 拍照
                if (Platform.OS === 'ios') {
                    PermissionsManager.cameraPermission().then(data => {
                        this.takePhoto();
                    }).catch(err=>{
                        // Toast.showShortCenter(err.message);
                        Alert.alert(null,err.message)

                    });
                }else{
                    PermissionsManagerAndroid.cameraPermission().then((data) => {
                        this.takePhoto();
                    }, (err) => {
                        Alert.alert('提示','请到设置-应用-授权管理设置相机权限');
                    });
                }
                break;
            case 1: // 图库
                if (Platform.OS === 'ios') {
                    // 图库
                    PermissionsManager.photoPermission().then(data=>{
                        this.pickMultiple();
                    }).catch(err=>{
                        // Toast.showShortCenter(err.message);
                        Alert.alert(null,err.message)
                    });
                }else{
                    this.pickMultiple();
                }
                break;
        }
    }
    // 选择照片
    pickMultiple() {
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            hideBottomControls: true,
            enableRotationGesture: true,
            maxFiles: this.props.maxNum,
            compressImageMaxWidth: 500,
            compressImageMaxHeight: 500,
            mediaType: 'photo',
        }).then(images => {
            let totalLen = this.props.imageList.size + images.length;
            let arr = images;
            if (totalLen > 9) {
                arr.splice(images.length - 1 - totalLen - 9, totalLen - 9);
                Toast.showShortCenter('最多可上传9张照片');
            }
            this.setState({
                data: arr.map(i => {
                    console.log('received image', i);
                    return {uri: i.path, width: i.width, height: i.height, mime: i.mime, id: new Date().getTime()};
                }),
            });
            console.log('-----------',this.state.data.length);
            this.props.dispatch(addImage(this.state.data));
            // maxNum = this.props.maxNum;
            console.log('maxNum', this.props.maxNum);
        }).catch(e => console.log(e));
    }

    // 打开相机
    takePhoto(){
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: false,
            compressImageMaxWidth: 500,
            compressImageMaxHeight: 500,
        }).then(image => {
            console.log(image);
            this.setState({
                data: [{uri: image.path, width: image.width, height: image.height, mime: image.mime, id: new Date().getTime()}],
            });
            this.props.dispatch(addImage(this.state.data));
        });
    }

    showAlertSelected(){
        this.dialog.show("请选择照片", selectedArr, '#333333', this.callbackSelected);
    }

    createAddItem(type) {
        const {imageList} = this.props;
        let addItem;
        if ((type === 1 && imageList.size < 4) || (type === 2 && imageList.size >= 4 && imageList.size < 8) || (type ===3 && imageList.size === 8)) {
            addItem = (
                <TouchableOpacity onPress={() => {this.showAlertSelected();}}>
                    <View style={styles.imageBorder}>
                        <Text style={styles.photoText}>&#xe632;</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return addItem;
    }

    clickImage(index) {
        const {imageList} = this.props;
        this.props.navigation.navigate(
            'ReceiptPhotoShow',
            {
                image: imageList.toArray(),
                num: index,
            },
        );
    }

    uploadImage(url, data){
        upLoadImageManager(url,
            data,
            ()=>{
                this.setState({
                    loading: true,
                });
            },
            (response)=>{
                console.log('uploadCode===',response.code);
                console.log('uploadResult===',response.result);
                this.setState({
                    loading: false,
                });
                if (response.code === 200){

                    lastTime = new Date().getTime();
                    ReadAndWriteFileUtil.appendFile('上传回单', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                        locationData.district, lastTime - currentTime, '上传回单页面');
                    Toast.showShortCenter('上传回单成功');
                    DeviceEventEmitter.emit('changeStateReceipt');
                    this.goBackForward();

                }else {
                    Toast.showShortCenter('图片上传失败，请重新上传');
                }
            },
            (error)=>{
                console.log('uploadError===',error);
                this.setState({
                    loading: false,
                });
                // Toast.showShortCenter('上传回单失败');
            });
    }

    // 返回到根界面
    popToTop() {
        const routes = this.props.routes;
        let rootKey = routes[1].key;
        this.props.navigation.goBack(rootKey);
    }

    goBackForward() {
        const routes = this.props.routes;
        let routeKey = routes[routes.length - 2].key;
        this.props.navigation.goBack(routeKey);
    }

    render() {
        const {imageList} = this.props;
        const navigator = this.props.navigation;
        const imagesView = imageList.map((picture, index) => {
            console.log('---imageList--',picture);
            if (index > 3) {
                return null;
            }
            return (
                <View key={index}>
                    <TouchableOpacity onPress={() => {this.clickImage(index)}} style={styles.imageBorder}>
                        <Image style={styles.imageItem} source={{uri:picture.uri}} />
                    </TouchableOpacity>
                </View>
            );
        });
        const imagesViewSecond = imageList.map((picture, index) => {
            if (index < 4 || index > 7) {
                return null;
            }
            return (
                <View key={index}>
                    <TouchableOpacity onPress={() => {this.clickImage(index)}} style={styles.imageBorder}>
                        <Image style={styles.imageItem} source={{uri:picture.uri}} />
                    </TouchableOpacity>
                </View>
            );
        });
        const imagesViewThird = imageList.map((picture, index) => {
            if (index < 8) {
                return null;
            }
            return (
                <View key={index}>
                    <TouchableOpacity onPress={() => {this.clickImage(index)}} style={styles.imageBorder}>
                        <Image style={styles.imageItem} source={{uri:picture.uri}} />
                    </TouchableOpacity>
                </View>
            );
        });
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'回单'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    backIconClick={() => {
                        const routes = this.props.routes;
                        const forward = routes[routes.length - 2];
                        if (navigator && routes.length > 1) {
                            navigator.goBack();
                        }
                    }}
                />
                <View style={{marginTop: 10, marginBottom: 10}}>
                    <CommonCell itemName="回单类型" content={'纸质回单'} hideBottomLine={true}/>
                </View>
                <View style={{backgroundColor: StaticColor.WHITE_COLOR}}>
                    <CommonCell itemName="上传回单" content={''} />
                    <View style={styles.imageLayout}>
                        <View style={[styles.imageView, { paddingBottom: 0, }]}>
                            {imagesView}
                            {this.createAddItem(1)}
                        </View>
                        <View style={[styles.imageView, { paddingBottom: 0 }]}>
                            {imagesViewSecond}
                            {this.createAddItem(2)}
                        </View>
                        <View style={styles.imageView}>
                            {imagesViewThird}
                            {this.createAddItem(3)}
                        </View>
                    </View>
                </View>
                <ImageBackground style={styles.buttonBackground} source ={StaticImage.BlueButtonArc}>
                    <Button
                        isDisabled={imageList.size <= 0}
                        style={styles.uploadButton}
                        textStyle={{color: StaticColor.WHITE_COLOR, fontSize: 16}}
                        onPress={() => {
                            if (ClickUtil.onMultiClick()) {
                                let formData = new FormData();
                                this.props.imageList.map(i => {
                                    if (Platform.OS === 'ios'){
                                        if(i.uri.indexOf('file://') === -1){
                                            i.uri = 'file://' + i.uri;
                                        }
                                    }
                                    let file = {uri: i.uri, type: 'multipart/form-data', name: i.id + '.jpg'};
                                    console.log('filePath===',file.uri);
                                    formData.append('photo', file);
                                });
                                formData.append('userId', userID);
                                formData.append('userName', userName);
                                formData.append('transCode', this.state.transCode);
                                formData.append('receiptType', '纸质回单');
                                const url = API.API_NEW_RETURN_TRANSPORT_ORDER_V2;
                                this.uploadImage(url, formData);
                            }
                        }}
                    >
                        提交
                    </Button>
                </ImageBackground>
                <DialogSelected ref={(dialog)=>{
                    this.dialog = dialog;
                }} />
                {this.state.loading ? <Loading /> : null}
            </View>
        );
    }
}

function mapStateToProps(state){
    return {
        imageList: state.order.get('imageList'),
        maxNum: state.order.get('maxNum'),
        userInfo: state.user.get('userInfo'),
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {
        dispatch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadReceipt);

