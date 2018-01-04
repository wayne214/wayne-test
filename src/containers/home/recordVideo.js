/**
 * 视频录制界面
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
    DeviceEventEmitter,
    Platform,
} from 'react-native';

import * as Progress from 'react-native-progress';
import Camera from 'react-native-camera';
import * as StaticColor from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';
const {width, height} = Dimensions.get('window');

let seconds = 0;
class recordVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openFlash: false,
            progress: 0,
        };
        this.startRecord = this.startRecord.bind(this);
        this.stopRecord = this.stopRecord.bind(this);
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('updateProgress',() => {
            this.setState({
                progress: 0,
            });
            seconds = 0;
        })
    }

    countDown() {
        this.timer = setInterval(() => {
            seconds += 0.1;
            console.log(seconds);
            console.log('---',this.state.progress);
            if(seconds <= 15){
                this.setState({
                    progress: seconds / 15,
                });
            }
            if(seconds > 15){
                this.timer && clearInterval(this.timer);
                this.stopRecord();
            }
        },100);
    }

    componentWillUnmount() {
        seconds = 0;
        this.listener.remove();
    }

    startRecord() {
        const options = {totalSeconds: 15};
        //options.location = ...
        this.camera.capture({metadata: options})
            .then((data) => {
                console.log('video===',data);
                this.props.navigation.navigate('RecordVideoFinished', {
                    videoPath: data.path,
                    mediaType: 'video',
                });
            })
            .catch(err => console.error(err));
    }

    stopRecord() {
        this.camera.stopCapture();
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
                    captureMode={Camera.constants.CaptureMode.video}
                    captureQuality={"480p"}
                    captureTarget={Camera.constants.CaptureTarget.disk}
                    // mirrorImage={false}
                    aspect={Camera.constants.Aspect.fill}
                >
                    <View style={styles.bottomView}>
                        <Text style={styles.text}>按住摄像</Text>
                        <View style={styles.photoView}>
                            <View style={{width: width / 2 - 42,}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigator.goBack();
                                    }}
                                >
                                    <Text style={styles.backIcon}>&#xe678;</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.circleView}>
                                <Progress.Circle
                                    style={{
                                        borderRadius: 42,
                                        width: 84,
                                        height: 84
                                    }}
                                    size={84}
                                    progress={this.state.progress}
                                    unfilledColor="rgba(255,255,255,0.5)"
                                    color={"#008aff"}
                                    thickness={6}
                                    strokeCap="round"
                                    direction="clockwise"
                                    borderWidth={0}
                                    children={
                                        <View style={{
                                            position: 'absolute',
                                            top: 6,
                                            left: 6,
                                        }}>
                                        <TouchableOpacity
                                            activeOpacity={0.75}
                                            onPressIn={() => {
                                                console.log("onPressIn");
                                                this.countDown();
                                                this.startRecord();
                                            }}
                                            onPressOut={() => {
                                                console.log("onPressOut");
                                                this.timer && clearInterval(this.timer);
                                                this.stopRecord();
                                            }}
                                            onPress={() => {}}
                                            onLongPress={() => console.log("onLongPress")}
                                        >
                                            <Image
                                            style={{width:72,height:72}}
                                                source={StaticImage.solidCircle}
                                            />
                                        </TouchableOpacity>
                                        </View>
                                    }
                                >
                                </Progress.Circle>
                            </View>
                        </View>
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
        marginLeft: 50,
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
    },
    circleView:{
        justifyContent: 'center',
        alignItems: 'center',
    },
});

function mapStateToProps(state){
    return {};
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(recordVideo);
