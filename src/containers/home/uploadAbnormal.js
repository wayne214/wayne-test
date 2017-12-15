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
} from 'react-native';

import NavigationBar from '../../common/navigationBar/navigationBar';
import * as StaticColor from '../../constants/staticColor';
import OrdersItemCell from '../order/components/ordersItemCell';
import DialogSelected from '../../common/alertSelected';
import Loading from '../../utils/loading';

import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';
const {width, height} = Dimensions.get('window');
let selectedArr = ["拍照", "视频"];
const ImageWH = (width - 70) / 4;

let result = {
    pushTime: '2017-12-12 12:12',
    scheduleCode: 'DP17121100012',
    scheduleRoutes: '北京-深圳',
    distributionPoint: '2',
    arrivalTime: '2017-12-12 12:12',
    weight: '200',
    vol: '202',
    transCodeNum: '4',
    goodTypesName: ['其他'],

};

class uploadAbnormal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            location: '',
            selectedArr: ["拍照", "视频"],
        };
        this.submit = this.submit.bind(this);
        this.takePhoto = this.takePhoto.bind(this);
        this.recordVideo = this.recordVideo.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.clickImage = this.clickImage.bind(this);
        this.createAddItem = this.createAddItem.bind(this);
        this.getItemContent = this.getItemContent.bind(this);

    }
    componentDidMount() {

    }
    // 获取调度单数据
    getItemContent() {

    }
    // 提交道路异常
    submit() {

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
        this.dialog.show("请选择照片或视频", selectedArr, '#333333', this.callbackSelected);
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


    render() {
        const {imageList} = this.props;
        if (imageList.size === 0) {
            selectedArr = ['拍照', '视频'];
        }else if (imageList.size > 0) {
            selectedArr = ['拍照'];
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
                        />
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
                            time={result.pushTime}
                            scheduleCode={result.scheduleCode}
                            scheduleRoutes={result.scheduleRoutes}
                            distributionPoint={result.distributionPoint}
                            arrivalTime={result.arrivalTime}
                            weight={result.weight}
                            vol={result.vol}
                            goodKindsNames={result.goodTypesName} // 货品种类
                            transCodeNum={result.transCodeNum}
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
    },
    bottomView: {
        width,
        height: 210,
        marginTop: 15
    }
});

function mapStateToProps(state){
    return {
        imageList: state.order.get('imageList'),
        maxNum: state.order.get('maxNum'),
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(uploadAbnormal);
