import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Platform,
} from 'react-native';

import Camera from 'react-native-camera';
import Toast from '@remobile/react-native-toast';

const TakeCamera = require('./images/takeCameraButton.png');
const TakeClose = require('./images/takeClose.png');
const TakeBold = require('./images/takeCameraBord.png');

const Takeheader = require('./images/takeCameraIDFont.png');
const TakeGuoHui = require('./images/takeCameraIDBack.png');
const TakeDriverFont = require('./images/takeCameraDriverFont.png');
const TakeDriverBack = require('./images/takeCameraDriverBack.png');


const leftSpace = 45;
const topSpace = 80;
const rightSpace = 45;
const bottomSpace = 135;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    takeCameraStyle: {
        alignItems: 'center',
        position: 'absolute',
        width: 65,
        height: 65,
        bottom: 40,
    },
    takeBackStyle: {
        position: 'absolute',
        width: 75,
        height: 75,
        bottom: 35,
        left: 50,
    },
    takeNextStyle: {
        position: 'absolute',
        width: 75,
        height: 75,
        bottom: 35,
        right: 50,
    },

    closeStyle:{
        width: 40,
        height: 40,
        position: 'absolute',
        top: 25,
        right: 25,
    },
    topViewStyle:{
        position: 'absolute',
        width: width,
        height: topSpace,
        backgroundColor: 'white',
        opacity: 0.6,
        top: 0,
    },
    leftViewStyle:{
        position: 'absolute',
        width: leftSpace,
        height: height,
        backgroundColor: 'white',
        opacity: 0.6,
        top: topSpace,
        left: 0,
    },
    rightViewStyle:{
        position: 'absolute',
        width: rightSpace,
        height: height,
        backgroundColor: 'white',
        opacity: 0.6,
        top: topSpace,
        right: 0,
    },
    bottomViewStyle:{
        position: 'absolute',
        width: width - leftSpace - rightSpace,
        height: bottomSpace,
        backgroundColor: 'white',
        opacity: 0.6,
        bottom: 0,
        right: rightSpace,
        left: leftSpace
    },
    textStyle:{
        flex: 1,
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        position: 'absolute',
        top: 200,
        right: -175,
        width: 400,
        alignItems: 'center',
        textAlign: 'center',
        transform:[{translate:[0,100,0]}, {rotateZ: '90deg'}],
        backgroundColor: 'transparent'
    },
    topLeftImageStyle: {
        position: 'absolute',
        left: leftSpace,
        top: topSpace,
    },
    topRightImageStyle: {
        position: 'absolute',
        right: rightSpace,
        top: topSpace,
        transform: [{rotateZ: '90deg'}]
    },
    bottomRightImageStyle: {
        position: 'absolute',
        right: rightSpace,
        bottom: bottomSpace,
        transform: [{rotateZ: '180deg'}]
    },
    bottomLeftImageStyle: {
        position: 'absolute',
        left: leftSpace,
        bottom: bottomSpace,
        transform: [{rotateZ: '270deg'}]
    },
    imageStyle: {
        position: 'absolute',
        left: leftSpace,
        top: topSpace,
        right: rightSpace,
        bottom: bottomSpace,
        backgroundColor: 'green',
    },
    // 身份证正面
    headerImageStyle: {
        position: 'absolute',
        right: rightSpace+60,
        bottom: bottomSpace+30,
        transform: [{rotateZ: '90deg'}]
    },
    // 身份证反面
    headerTurnImageStyle: {
        position: 'absolute',
        right: leftSpace+30,
        top: topSpace+30,
        transform: [{rotateZ: '90deg'}]
    },
    // 驾驶证正面
    driverFontImageStyle: {
        position: 'absolute',
        left: leftSpace+30,
        top: topSpace+30,
        transform: [{rotateZ: '90deg'}]
    },
    // 驾驶证反面
    driverBackImageStyle: {
        position: 'absolute',
        left: -20,
        bottom: bottomSpace+135,
        transform: [{rotateZ: '90deg'}]
    },

});

export default class takeCamera extends Component {

    constructor(props){
        super(props);

        this.close = this.close.bind(this);
        this.takePicture = this.takePicture.bind(this);

        /*
         * 0=身份证正面
         * 1=身份证反面
         * 2=驾驶证主页
         * 3=驾驶证副页
         * 4=手持身份证
         * 5=行驶证主页
         * 6=行驶证副页
         * */

        let showTitle='';
        switch (this.props.navigation.state.params.cameraType){
            case 0 :
            showTitle='请将人像面放到框内，并调整好光线';
            break;
            case 1 :
                showTitle='请将国徽面放到框内，并调整好光线';
                break;
            case 2 :
                showTitle='请将主页的公章放到框内，并调整好光线';
                break;
            case 3 :
                showTitle='请将副页的条形码放到框内，并调整好光线';
                break;
            case 4 :
                showTitle='请手持身份证，保持面部与证件信息清晰';
                break;
            case 5 :
                showTitle='行驶证号要清晰，图片要完整';
                break;
            case 6 :
                showTitle='行驶证号要清晰，图片要完整';
                break;

        }



        this.state={
            cameraType: this.props.navigation.state.params.cameraType,
            showTitle: showTitle,
        }



    }

    /*关闭*/
    close(){
        this.props.navigation.goBack();
    }

    /*
     * 点击拍照
     * */
    takePicture() {

        //jpegQuality 1-100, 压缩图片
        const options = {jpegQuality: 50};

        this.camera.capture({options})

            .then((data) =>{
                console.log(data);

                this.props.navigation.navigate('TakeCameraEndPage', {
                    imagePath: data.path,
                    verifiedType: this.props.navigation.state.params.verifiedType,
                });

            })
            .catch(err => console.error(err));

    }
    render() {

        const imageView = this.state.cameraType === 0 ?
            <Image style={styles.headerImageStyle} source={Takeheader}/>
            : this.state.cameraType === 1 ?
                <Image style={styles.headerTurnImageStyle} source={TakeGuoHui}/>
                : this.state.cameraType === 2 ?
                    <Image style={styles.driverFontImageStyle} source={TakeDriverFont}/>
                    : this.state.cameraType === 3 ?
                        <Image style={styles.driverBackImageStyle} source={TakeDriverBack}/>
                        : this.state.cameraType === 4 ?
                            null
                            : this.state.cameraType === 5 ?
                                <Image style={styles.driverFontImageStyle} source={TakeDriverFont}/>
                                : <Image style={styles.driverBackImageStyle} source={TakeDriverBack}/>;


        return (
            <View style={styles.container}>

                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    // Camera.constants.CaptureTarget.cameraRoll (default), 相册
                    // Camera.constants.CaptureTarget.disk, 本地
                    // Camera.constants.CaptureTarget.temp  缓存
                    // 很重要的一个属性，最好不要使用默认的，使用disk或者temp，
                    // 如果使用了cameraRoll，则返回的path路径为相册路径，图片没办法显示到界面上
                    captureTarget={Camera.constants.CaptureTarget.disk}
                    mirrorImage={false}
                    //"high" (default),"medium",  "low",  "photo", "1080p",  "720p",  "480p".
                    captureQuality="medium"
                    style={styles.preview}
                    //aspect={Camera.constants.Aspect.fill}
                    //AVCaptureVideoOrientationPortrait           = 1,
   // AVCaptureVideoOrientationPortraitUpsideDown = 2,
   // AVCaptureVideoOrientationLandscapeRight     = 3,
   // AVCaptureVideoOrientationLandscapeLeft      = 4,
                    orientation={Camera.constants.Orientation.portrait }

                >
                    <View style={styles.topViewStyle}>

                    </View>
                    <View style={styles.leftViewStyle}>

                    </View>
                    <View style={styles.rightViewStyle}>

                    </View>
                    <View style={styles.bottomViewStyle}>

                    </View>

                    <Text
                        style={styles.textStyle}>
                        {this.state.showTitle}
                    </Text>


                    <Image style={styles.topLeftImageStyle} source={TakeBold}/>
                    <Image style={styles.topRightImageStyle} source={TakeBold}/>
                    <Image style={styles.bottomRightImageStyle} source={TakeBold}/>
                    <Image style={styles.bottomLeftImageStyle} source={TakeBold}/>

                    {imageView}


                    <TouchableOpacity
                        style={styles.takeCameraStyle}
                        onPress={()=>{
                                    this.takePicture();
                                }}>
                        <Image source={TakeCamera}/>
                    </TouchableOpacity>




                </Camera>
                <TouchableOpacity
                    style={styles.closeStyle}
                    onPress={()=>{
                                    this.close();
                                }}>
                    <Image style={{margin: 10}} source={TakeClose}/>
                </TouchableOpacity>

            </View>
        );
    }


}
