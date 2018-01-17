/**
 * Created by xizhixin on 2017/7/5.
 * 上传回单照片预览及删除界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    Image,
    Animated,
    ScrollView,
    Platform,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';

import StyleSheet from '../../utils/xeStyleSheet';
import NavigationBar from '../../common/navigationBar/navigationBar';
import {deleteImage} from '../../action/order';
import DialogSelected from '../../common/alertSelected';

const {width, height} = Dimensions.get('window');
const selectedArr = ["删除"];


const styles = StyleSheet.create({
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
    image: {
        height: height,
        width: width,
    },
    imagesView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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

class ImageViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 1,
            totalImage: 1,
            isOpen: false,
            opacity: new Animated.Value(0),
            isRemind: false,
        };
        this.imageViewScroll = this.imageViewScroll.bind(this);
        this.deleteImg = this.deleteImg.bind(this);
        this.renderRemindView = this.renderRemindView.bind(this);
        this.remindAnimate = this.remindAnimate.bind(this);
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
    }

    componentWillMount() {
        const params = this.props.navigation.state.params;
        const pageNum = params.num;
        const images = params.image;
        this.setState({
            imageIndex: pageNum + 1,
            totalImage: images.length,
        });
    }

    componentDidMount() {
        const params = this.props.navigation.state.params;
        const pageNum = params.num;
        setTimeout(() => {
            this.refs.scrollView.scrollTo({x: width * pageNum, y: 0, animated: false})
        },0);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        this.timer1 && clearTimeout(this.timer1);
    }

    deleteImg() {
        const {
            dispatch,
            imageList,
        } = this.props;
        const navigator = this.props.navigation;
        this.setState({
            isOpen: false,
            remindIsOpen: true,
        });
        if (imageList && imageList.size > 0) {
        }
        this.remindAnimate();
        console.log('===totalImage===', this.state.totalImage);
        if (this.state.totalImage === 1) {
            dispatch(deleteImage(this.state.imageIndex - 1));

            this.timer = setTimeout(() => {
                navigator.goBack();
            }, 2000);
            return;
        }
        console.log('===test==');
        const indexNeedChange = this.state.imageIndex > (this.state.totalImage - 1);
        dispatch(deleteImage(this.state.imageIndex - 1));
        console.log('===num===', this.state.totalImage, this.state.imageIndex, indexNeedChange);
        if (indexNeedChange) {
            this.setState({
                imageIndex: this.state.imageIndex - 1,
            });
        }
        this.setState({
            totalImage: this.state.totalImage - 1,
        });
        this.timer1 = setTimeout(() => {
            this.setState({
                remindIsOpen: false,
            });
        }, 3000);

    }

    imageViewScroll(e) {
        this.refresh = false;
        const scrollX = parseInt(e.nativeEvent.contentOffset.x, 10);
        const windowW = parseInt(width, 10);
        console.log('=imageIndex=', parseInt(scrollX / windowW, 10));
        this.setState({
            imageIndex: parseInt((scrollX / windowW) + 0.5, 10) + 1,
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

    showAlertSelected(){
        this.dialog.show("要删除这张照片吗？", selectedArr, '#e62323', this.callbackSelected);
    }
    callbackSelected(i){
        switch (i){
            case 0: // 删除
                this.deleteImg();
                break;
        }
    }

    render() {
        const {imageList} = this.props;
        const navigator = this.props.navigation;
        const imagesView = imageList.map((picture, index) => {
            console.log('==', picture);
            return (
                <Image
                    style={styles.image}
                    source={{uri: picture.uri}}
                    resizeMode="contain"
                    key={index}
                />
            );
        });
        const navBarTitle = `${this.state.totalImage}-${this.state.imageIndex}`;
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
                    <ScrollView
                        ref="scrollView"
                        horizontal={true}
                        pagingEnabled={true}
                        onScroll={(e) => this.imageViewScroll(e)}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.imagesView}>
                            {imagesView}
                        </View>
                    </ScrollView>
                </View>
                <DialogSelected ref={(dialog)=>{
                    this.dialog = dialog;
                }} />
                {this.renderRemindView()}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        imageList: state.order.get('imageList'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ImageViewer);
