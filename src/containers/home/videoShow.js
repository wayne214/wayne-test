/**
 * 视频预览及删除界面
 * Created by xizhixin on 2017/12/18.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    Dimensions,
    Animated,
    Platform,
} from 'react-native';

import Video from 'react-native-video';
import StyleSheet from '../../utils/xeStyleSheet';
import NavigationBar from '../../common/navigationBar/navigationBar';
import {deleteVideoAction} from '../../action/app';
import DialogSelected from '../../common/alertSelected';

const {width, height} = Dimensions.get('window');
const selectedArr = ["删除"];

class videoShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoIndex: 1,
            totalVideo: 1,
            isOpen: false,
            opacity: new Animated.Value(0),
            isRemind: false,
        };
        this.deleteVideo = this.deleteVideo.bind(this);
        this.renderRemindView = this.renderRemindView.bind(this);
        this.remindAnimate = this.remindAnimate.bind(this);
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
    }

    componentWillMount() {
        const params = this.props.navigation.state.params;
        const pageNum = params.num;
        const video = params.video;
        this.setState({
            imageIndex: pageNum + 1,
            totalImage: video.length,
        });
    }
    componentDidMount() {

    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        this.timer1 && clearTimeout(this.timer1);
    }

    deleteVideo() {
        const {
            dispatch,
            videoList,
        } = this.props;
        const navigator = this.props.navigation;
        this.setState({
            isOpen: false,
            remindIsOpen: true,
        });
        if (videoList && videoList.size > 0) {
        }
        this.remindAnimate();
        console.log('===totalVideo===', this.state.totalVideo);
        if (this.state.totalVideo === 1) {
            dispatch(deleteVideoAction(this.state.videoIndex - 1));

            this.timer = setTimeout(() => {
                navigator.goBack();
            }, 2000);
            return;
        }
        console.log('===test==');
        const indexNeedChange = this.state.videoIndex > (this.state.totalVideo - 1);
        dispatch(deleteVideoAction(this.state.videoIndex - 1));
        console.log('===num===', this.state.totalVideo, this.state.videoIndex, indexNeedChange);
        if (indexNeedChange) {
            this.setState({
                videoIndex: this.state.videoIndex - 1,
            });
        }
        this.setState({
            totalVideo: this.state.totalVideo - 1,
        });
        this.timer1 = setTimeout(() => {
            this.setState({
                remindIsOpen: false,
            });
        }, 3000);
    }

    remindAnimate() {
        this.setState({isRemind: true});
        Animated.sequence([
            Animated.timing(
                this.state.opacity, {
                    toValue: 1,
                    duration: 500,
                    delay: 0,
                },
            ),
            Animated.delay(1000),
            Animated.timing(
                this.state.opacity, {
                    toValue: 0,
                    duration: 500,
                    delay: 0,
                },
            ),
        ]).start(() => {
            console.log('==over==');
            this.setState({isRemind: false});
        });
    }

    renderRemindView() {
        if (!this.state.isRemind) {
            return null;
        }
        console.log('==renderRemindView==');
        return (
            <Animated.View
                style={[styles.remindModal, {opacity: this.state.opacity}]}
            >
                <View>
                    <Text style={styles.rightIcon}>&#xe629;</Text>
                    <Text style={styles.remindText}>已删除</Text>
                </View>
            </Animated.View>
        );
    }

    showAlertSelected(){
        this.dialog.show("要删除此视频吗？", selectedArr, '#e62323', this.callbackSelected);
    }

    callbackSelected(i){
        switch (i){
            case 0: // 删除
                this.deleteVideo();
                break;
        }
    }
    render() {
        const {videoList} = this.props;
        const navigator = this.props.navigation;
        const videoView = videoList.map((video, index) => {
            console.log('==', video);
            return (
                <Video source={{uri: video.uri}}   // Can be a URL or a local file.
                       ref={(ref) => {
                           this.player = ref
                       }}                                      // Store reference
                       rate={1.0}                              // 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
                       volume={1.0}                            // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
                       muted={false}                           // true代表静音，默认为false.
                       paused={false}                          // Pauses playback entirely.
                       resizeMode="cover"                      // 视频的自适应伸缩铺放行为
                       repeat={true}                           // 是否重复播放
                       playInBackground={false}                // 当应用程序输入背景音频时，音频继续播放
                       playWhenInactive={false}                // [iOS] 当显示控制或通知中心时，视频继续播放
                       ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                       progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
                       onLoadStart={() => {console.log('开始加载')}}            //  当视频开始加载时的回调函数
                       onLoad={() => {console.log('加载完毕')}}               // 当视频加载完毕时的回调函数
                       onEnd={() => {console.log('播放完毕')}}                      // 当视频播放完毕后的回调函数
                       onError={() => {console.log('视频出错')}}               // 当视频不能加载，或出错后的回调函数
                       style={styles.backgroundVideo}
                />
            );
        });
        const navBarTitle = `${this.state.totalVideo}-${this.state.videoIndex}`;
        return (
            <View style={styles.outView}>
                <NavigationBar
                    title={navBarTitle}
                    navigator={navigator}
                    leftButtonHidden={false}
                    rightIconFont="&#xe641;"
                    rightButtonConfig={{
                        type: 'font',
                        onClick: () => {
                            this.showAlertSelected();
                        },
                    }}
                />
                <View style={styles.container}>
                    {videoView}
                </View>
                <DialogSelected ref={(dialog)=>{
                    this.dialog = dialog;
                }} />
                {this.renderRemindView()}
            </View>
        );
    }
}

const styles =StyleSheet.create({
    outView: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#000',
    },
    backgroundVideo: {
        flex: 1,
    },
    remindModal: {
        alignItems: 'center',
        height: 106,
        width: 106,
        position: 'absolute',
        backgroundColor: '#0006',
        left: (width - 106) / 2,
        top: (height - 106) / 2,
        borderRadius: 5,
    },
    rightIcon: {
        marginTop: 17,
        fontSize: 42,
        color: '#ffffff',
        fontFamily: 'iconfont',
    },
    remindText: {
        marginTop: 5,
        fontSize: 14,
        color: '#ffffff',
    },

});

function mapStateToProps(state){
    return {
        videoList: state.app.get('videoList'),
    };
}

function mapDispatchToProps (dispatch){
    return {
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(videoShow);

