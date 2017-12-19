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
        alignItems: 'center',
        textAlign: 'center',
        top: 50,
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

});

export default class takeCameraV extends Component {

    constructor(props){
        super(props);

        this.close = this.close.bind(this);
        this.takePicture = this.takePicture.bind(this);

        /*
         * 2=强险
         * 3=车头
         * */

        let showTitle='';
        switch (this.props.navigation.state.params.cameraType){

            case 2 :
                showTitle='请放正车辆强制保险，并调整好光线';
                break;
            case 3 :
                showTitle='车牌号要清晰，车头要完整';
                break;
            case 4 :
                showTitle='请放正营业执照，并调整好光线';
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
        Toast.showShortCenter('正在处理');
        //jpegQuality 1-100, 压缩图片
        const options = {jpegQuality: 50};

        this.camera.capture({options})

            .then((data) =>{
                console.log(data);

                this.props.navigation.navigate('TakeCameraVEndPage', {
                    imagePath: data.path,
                })

            })
            .catch(err => console.error(err));

    }
    render() {

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
                    orientation={Camera.constants.Orientation.portrait}

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


                    <TouchableOpacity
                        style={styles.closeStyle}
                        onPress={()=>{

                            this.close();
                            }}>
                        <Image style={{margin: 10}} source={TakeClose}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.takeCameraStyle}
                        onPress={()=>{
                            this.takePicture();
                             }}>
                        <Image source={TakeCamera}/>
                    </TouchableOpacity>

                </Camera>


            </View>
        );
    }
}
