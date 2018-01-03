/**
 * 道路异常界面
 * Created by xizhixin on 2017/12/13.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    Dimensions,
    TouchableOpacity,
    Alert,
    Platform,
    DeviceEventEmitter
} from 'react-native';

import Video from 'react-native-video';
import NavigationBar from '../../common/navigationBar/navigationBar';
import * as StaticColor from '../../constants/staticColor';
import OrdersItemCell from '../order/components/ordersItemCell';
import DialogSelected from '../../common/alertSelected';
import Loading from '../../utils/loading';
import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';
import Toast from '@remobile/react-native-toast';
import UniqueUtil from '../../utils/unique';
import {
    updateImages
} from '../../action/order';
import {
    clearVideoAction
} from '../../action/app';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import {upLoadImageManager} from '../../utils/upLoadImageToVerified';
const {width, height} = Dimensions.get('window');
let selectedArr = ["拍照", "视频"];
let title = '请选择照片或视频';
const ImageWH = (width - 70) / 4;
import HTTPRequest from '../../utils/httpRequest';
import * as API from '../../constants/api';

// let result = {
//     pushTime: '2017-12-12 12:12',
//     scheduleCode: 'DP17121100012',
//     scheduleRoutes: '北京-深圳',
//     distributionPoint: '2',
//     arrivalTime: '2017-12-12 12:12',
//     weight: '200',
//     vol: '202',
//     transCodeNum: '4',
//     goodTypesName: ['其他'],
//
// };

let currentTime = 0;
let lastTime = 0;
let locationData = '';

let enclosureList = [];

var url = '';

class uploadAbnormal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            location: '',
            result: {},
            content: '',
        };
        this.submit = this.submit.bind(this);
        this.takePhoto = this.takePhoto.bind(this);
        this.recordVideo = this.recordVideo.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.clickImage = this.clickImage.bind(this);
        this.clickVideo = this.clickVideo.bind(this);
        this.createAddItem = this.createAddItem.bind(this);
        this.getItemContent = this.getItemContent.bind(this);
        this.getCurrentPosition = this.getCurrentPosition.bind(this);

    }
    componentDidMount() {
        this.getCurrentPosition();
        this.getItemContent();

    }

    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =', JSON.stringify(data));
            this.setState({
                location: data.address,
            });
        }).catch(e => {
            console.log(e, 'error');
        });
    }

    // 获取调度单数据
    getItemContent() {
        currentTime = new Date().getTime();
        // 传递参数
        HTTPRequest({
            url: API.API_NEW_APP_UPLOAD_DISPATCH_ORDER + '?plateNum=' + global.plateNumber,
            params: {},
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                this.setState({
                    result: responseData.result,
                });
            },
            error: (errorInfo)=>{},
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
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
                console.log('response',response);
                console.log('uploadCode===',response.code);
                console.log('uploadResult===',response.result);
                this.setState({
                    loading: false,
                });
                if (response.code === 200){

                    // lastTime = new Date().getTime();
                    // ReadAndWriteFileUtil.appendFile('上传回单', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    //     locationData.district, lastTime - currentTime, '上传回单页面');
                    // // Toast.showShortCenter('上传回单成功');
                    // DeviceEventEmitter.emit('changeStateReceipt');
                    // this.goBackForward();
                    const list = response.result;
                    let adArray = [];
                    if (list && list.indexOf(',') > -1) {
                        adArray=list.split(',');
                    } else {
                        adArray.push(list);
                    }
                    console.log('adArray', adArray);
                    // this.uploadAbnormalException(adArray);

                }else {
                    Toast.showShortCenter('上传失败，请重新上传');
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
    uploadAbnormalException(enclosureList) {
        const {videoList} = this.props;
        // 传递参数
        HTTPRequest({
            url: API.API_NEW_APP_UPLOAD_SAVE_EXCEPTIONINFO,
            params: {
                address: this.state.location,
                content: this.state.content,
                driverPhoneNum: global.phone,
                enclosureList: enclosureList,
                mediaType: videoList && videoList.size > 0 ? 1 : 0,
                plateNum: global.plateNumber,
                scheduleCode: this.state.result.scheduleCode,
                userId: global.userId,
                userName: global.userName
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (responseData) => {

            },
            error: (errorInfo) => {
            },
            finish: () => {
                this.setState({
                    loading: false,
                });
            }
        });
    }
    // 提交道路异常
    submit() {
        const {videoList} = this.props;
        let formData = new FormData();
        if (videoList.size > 0) {
            videoList.map((i)=> {
                console.log('video',i);
                if (Platform.OS === 'ios'){
                    if(i.uri.indexOf('file://') === -1){
                        i.uri = 'file://' + i.uri;
                    }
                }
                let file = {uri: i.uri, type: 'multipart/form-data', name: i.id + '.mp4'};
                console.log('filePath===',file.uri);
                formData.append('photo', file);
            });
            url = API.API_UPLOAD_VIDEO_FILE;
        } else {
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
            url = API.API_UPLOAD_FILE;
        }
        formData.append('userId', global.userId);
        formData.append('userName', global.userName);
        this.uploadImage(url, formData);
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

    showAlertSelected(){
        this.dialog.show(title, selectedArr, '#333333', this.callbackSelected);
    }

    callbackSelected(i){
        switch (i){
            case 0: // 拍照
                if (Platform.OS === 'ios') {
                    PermissionsManager.cameraPermission().then(data => {
                        this.takePhoto();
                    }).catch(err=>{
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
            case 1: // 视频
                if (Platform.OS === 'ios') {
                    PermissionsManager.cameraPermission().then(data => {
                        this.recordVideo();
                    }).catch(err=>{
                        Alert.alert(null,err.message)
                    });
                }else{
                    PermissionsManagerAndroid.cameraPermission().then((data) => {
                        this.recordVideo();
                    }, (err) => {
                        Alert.alert('提示','请到设置-应用-授权管理设置相机权限');
                    });
                }
                break;
        }
    }

    // 打开相机
    takePhoto() {
        this.props.navigation.navigate('TakePhoto');
    }
    // 打开视频
    recordVideo() {
        this.props.navigation.navigate('RecordVideo');
    }

    clickImage(index) {
        console.log('---==index==---',index);
        const {imageList} = this.props;
        this.props.navigation.navigate(
            'ReceiptPhotoShow',
            {
                image: imageList.toArray(),
                num: index,
            },
        );
    }

    clickVideo(index) {
        console.log('---==index==---',index);
        const {videoList} = this.props;
        this.props.navigation.navigate(
            'VideoShow',
            {
                video: videoList.toArray(),
                num: index,
            },
        );
    }

    render() {
        const {imageList, videoList} = this.props;
        if (imageList.size === 0) {
            selectedArr = ['拍照', '视频'];
            title = '请选择照片或视频';
        }else if (imageList.size > 0) {
            selectedArr = ['拍照'];
            title = '请选择照片';
        }
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
        const imageLayout = <View style={styles.imageLayout}>
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
        </View>;
        const videoView = videoList.map((video, index) => {
            return  (
                <View key={index}>
                    <TouchableOpacity onPress={() => {this.clickVideo(index)}} style={styles.imageBorder}>
                        <Video
                            source={{uri: video.uri}}   // Can be a URL or a local file.
                            ref={(ref) => {
                                this.player = ref
                            }}                                      // Store reference
                            rate={0}                                // 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
                            volume={1.0}                            // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
                            muted={false}                           // true代表静音，默认为false.
                            paused={false}                          // Pauses playback entirely.
                            resizeMode="cover"                      // 视频的自适应伸缩铺放行为
                            repeat={false}                           // 是否重复播放
                            playInBackground={false}                // 当应用程序输入背景音频时，音频继续播放
                            playWhenInactive={false}                // [iOS] 当显示控制或通知中心时，视频继续播放
                            ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                            progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
                            onLoadStart={() => {console.log('开始加载')}}            //  当视频开始加载时的回调函数
                            onEnd={() => {console.log('播放完毕')}}                      // 当视频播放完毕后的回调函数
                            style={styles.imageItem}
                        />
                    </TouchableOpacity>
                </View>
            );
        });
        const  videoLayout = <View style={styles.imageLayout}>
            <View style={[styles.imageView, { paddingBottom: 10, }]}>
                {videoView}
            </View>
        </View>;
        const orderDetailTypeList = this.state.result.ofcOrderDetailTypeDtoList;
        let goodTypesTemp = [];
        let goodTypesName = [];
        if(orderDetailTypeList && orderDetailTypeList.length > 0) {
            let good = '';
            for (let i = 0; i < orderDetailTypeList.length; i++) {
                good = orderDetailTypeList[i];
                goodTypesTemp = goodTypesTemp.concat(good.goodsTypes);
            }
            // 去重
            goodTypesName = UniqueUtil.unique(goodTypesTemp);
        } else {
            goodTypesName.push('其他');
        }
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'道路异常'}
                    navigator={navigator}
                    leftButtonConfig={{
                        type: 'string',
                        title: '取消',
                        onClick: () => {
                            Alert.alert('','退出此次编辑？',[
                                {
                                    text: '取消',
                                    onPress: () => {}
                                },
                                {
                                    text: '退出',
                                    onPress: () => {
                                        this.props.dispatch(updateImages());
                                        this.props.dispatch(clearVideoAction());
                                        navigator.goBack();
                                    }
                                },
                            ], {cancelable: true});
                        },
                    }}
                    rightButtonConfig={{
                        type: 'string',
                        title: '提交',
                        titleStyle: {color: StaticColor.BLUE_CONTACT_COLOR},
                        onClick: () => {
                            this.submit();
                        }
                    }}
                />
                <View>
                    <View style={styles.topView}>
                        <TextInput
                            style={styles.input}
                            placeholder={'请输入备注信息...'}
                            placeholderTextColor={'#999'}
                            multiline={true}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) => {
                                this.setState({
                                    content: text,
                                });
                            }}
                        />
                        {
                            videoList.size > 0 ? videoLayout : imageLayout
                        }
                        <View style={styles.divideLine}/>
                        <View style={styles.locationStyle}>
                            <Text style={styles.locationIcon}>&#xe677;</Text>
                            <Text
                                style={styles.locationText}>{this.state.location ? this.state.location : '定位失败'}</Text>
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 0,
                                }}
                                onPress={() => {
                                    this.getCurrentPosition(0);
                                }}
                            >
                                <Text style={styles.icon}>&#xe66b;</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bottomView}>
                        <OrdersItemCell
                            time={this.state.result.time ? this.state.result.time.replace(/-/g,'/').substring(0, this.state.result.time.length - 3) : ''}
                            scheduleCode={this.state.result.scheduleCode}
                            scheduleRoutes={this.state.result.scheduleRoutes}
                            distributionPoint={this.state.result.distributionPoint}
                            arrivalTime={this.state.result.arrivalTime ? this.state.result.arrivalTime.replace(/-/g,'/').substring(0, this.state.result.arrivalTime.length - 3) : ''}
                            weight={this.state.result.weight}
                            vol={this.state.result.vol}
                            temperature={this.state.result.temperature ? `${this.state.result.temperature}℃` : ''}
                            goodsCount={this.state.result.num}
                            goodKindsNames={goodTypesName} // 货品种类
                            transCodeNum={this.state.result.transCodeNum}
                            currentStatus={this.props.currentStatus}
                            onSelect={() => {}}
                        />
                    </View>
                </View>
                <DialogSelected ref={(dialog)=>{
                    this.dialog = dialog;
                }} />
                {this.state.loading ? <Loading /> : null}
            </View>
        );
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND
    },
    topView: {
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    input: {
        width: width,
        height: 75,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 15,
        marginTop: 10,
        marginBottom: 12,
    },
    imageLayout: {
        marginLeft: 10,
        marginRight: 10,
    },
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
        borderColor: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoText: {
        fontSize: 23,
        fontFamily: 'iconfont',
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        marginBottom: -5,
    },
    divideLine: {
        height: 1,
        width: width,
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
        marginTop: 5,
    },
    locationIcon:{
        fontFamily: 'iconfont',
        fontSize: 16,
        color: StaticColor.GRAY_TEXT_COLOR,
        padding: 5,
    },
    icon: {
        fontFamily: 'iconfont',
        fontSize: 16,
        color: StaticColor.REFRESH_COLOR,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },
    locationStyle: {
        padding: 10,
        flexDirection: 'row',
    },
    locationText: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginLeft: 5,
        paddingTop: 5,
        paddingBottom: 5,
        marginRight: 50,
    },
    bottomView: {
        width,
        height: 210,
        marginTop: 15
    },
});

function mapStateToProps(state){
    return {
        videoList: state.app.get('videoList'),
        imageList: state.order.get('imageList'),
        maxNum: state.order.get('maxNum'),
        routes: state.nav.routes,
        currentStatus: state.user.get('currentStatus'),
    };
}

function mapDispatchToProps (dispatch){
    return {
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(uploadAbnormal);
