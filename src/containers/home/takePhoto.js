/**
 * 拍照界面
 * Created by xizhixin on 2017/12/14.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';
import Camera from 'react-native-camera';
import * as StaticColor from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';

const {width, height} = Dimensions.get('window');

class takePhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openFlash: false,
        };
        this.takePicture = this.takePicture.bind(this);
    }
    componentDidMount() {

    }

    /*
     * 点击拍照
     * */
    takePicture() {
        // jpegQuality 1-100, 压缩图片
        const options = {jpegQuality: 50};
        this.camera.capture({options})
            .then((data) =>{
                console.log(data);
                this.props.navigation.navigate('TakePhotoFinished', {
                    imagePath: data.path,
                    mediaType: 'photo',
                });
            })
            .catch(err => console.error(err));

    }
    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={styles.cameraStyle}
                    captureTarget={Camera.constants.CaptureTarget.disk}
                    mirrorImage={false}
                    //"high" (default),"medium",  "low",  "photo", "1080p",  "720p",  "480p".
                    captureQuality="medium"
                    orientation={Camera.constants.Orientation.portrait}
                >
                    <View style={styles.bottomView}>
                        <Text style={styles.text}>轻触拍照</Text>
                        <View style={styles.photoView}>
                            <Image
                                style={styles.hollowCircle}
                                source={StaticImage.hollowCircle}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => {
                                        this.takePicture();
                                    }}
                                >
                                    <Image
                                        style={{width: 54,height: 54,}}
                                        source={StaticImage.solidCircle}
                                    />
                                </TouchableOpacity>
                            </Image>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                navigator.goBack();
                            }}
                        >
                            <Text style={styles.backIcon}>&#xe678;</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            </View>
        );
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    cameraStyle: {
        alignSelf: 'center',
        width,
        height,
    },
    bottomView: {
        width: width,
        position: 'absolute',
        left: 0,
        bottom: 0,
        marginBottom: 40,
    },
    backIcon: {
        fontFamily: 'iconfont',
        fontSize: 20,
        color: StaticColor.WHITE_COLOR,
        position: 'absolute',
        left: 50,
        bottom: 25,
    },
    hollowCircle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: StaticColor.WHITE_COLOR,
        fontSize: 15,
        alignSelf: 'center'
    },
    photoView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
        justifyContent: 'center',
    }
});

function mapStateToProps(state){
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(takePhoto);
