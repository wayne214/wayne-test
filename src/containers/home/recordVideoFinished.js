/**
 * 视频预览界面
 * Created by xizhixin on 2017/12/15.
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
} from 'react-native';

import Video from 'react-native-video';
import * as StaticColor from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';
import {
    addVideoAction,
} from '../../action/app';

const {width, height} = Dimensions.get('window');

class recordVideoFinished extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            videoPath: params.videoPath,
            mediaType: params.mediaType,
        };
        this.next = this.next.bind(this);
        this.close = this.close.bind(this);
    }
    componentDidMount() {

    }

    // 返回
    close() {
        DeviceEventEmitter.emit('updateProgress');
        this.props.navigation.goBack();
    }
    // 完成
    next() {
        console.log('-----videoPath-------',this.state.videoPath);
        let data = [{uri: this.state.videoPath, id: new Date().getTime(), mediaType: this.state.mediaType}];
        this.props.dispatch(addVideoAction(data));

        const routes = this.props.routes;
        let routeKey = routes[routes.length - 2].key;
        this.props.navigation.goBack(routeKey);
    }

    render() {
        return (
            <View style={styles.container}>
                <Video source={{uri: this.state.videoPath}}   // Can be a URL or a local file.
                       ref={(ref) => {
                           this.player = ref
                       }}                                      // Store reference
                       rate={1.0}                              // 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
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
                       onLoad={() => {console.log('加载完毕')}}               // 当视频加载完毕时的回调函数
                       onEnd={() => {console.log('播放完毕')}}                      // 当视频播放完毕后的回调函数
                       onError={() => {console.log('视频出错')}}               // 当视频不能加载，或出错后的回调函数
                       style={styles.backgroundVideo} />
                <View style={styles.bottomView}>
                    <View style={styles.bottomInnerStyle}>
                        <TouchableOpacity
                            style={styles.bottomBackStyle}
                            onPress={()=>{
                                this.close();
                            }}>
                            <Image source={StaticImage.takeBack}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.bottomNextStyle}
                            onPress={()=>{
                                this.next();
                            }}>
                            <Image source={StaticImage.takeNext}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.BLACK_COLOR,
    },
    backgroundVideo: {
        flex: 1,
    },
    bottomView: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        marginBottom: 40,
        width: width,
    },
    bottomInnerStyle:{
        flexDirection: 'row',
        marginLeft: 56,
        marginRight: 56,
        justifyContent: 'space-between',
    }

});

function mapStateToProps(state){
    return {
        videoList: state.app.get('videoList'),
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {
        dispatch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(recordVideoFinished);
