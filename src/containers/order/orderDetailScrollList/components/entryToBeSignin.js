import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    DeviceEventEmitter,
    InteractionManager,
} from 'react-native';

import NavigationBar from '../../../../common/navigationBar/navigationBar';
import EntryToBeSignIn from '../../orderToBeSignInDetail';
import EntryToBeSure from '../../orderToBeSureDetail';
import EntryToBeWaitSure from '../../orderToBeWaitSureDetail';
import * as API from '../../../../constants/api';
import Loading from '../../../../utils/loading';
import Storage from '../../../../utils/storage';
import HTTPRequest from '../../../../utils/httpRequest';
import Toast from '@remobile/react-native-toast';
import ImageViewer from 'react-native-image-zoom-viewer';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    count: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    countText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {
            width: 0, height: 0.5
        },
        textShadowRadius: 0
    }
});

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

class entryToBeSignin extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            datas: [],
            current: 1,
            transOrderList: params.transOrderList,
            isShowRightButton: false,
            showImages: [],
            loading: false,
        };
        this.onScrollEnd = this.onScrollEnd.bind(this);
        this.getOrderDetailInfo = this.getOrderDetailInfo.bind(this);
        this.sendOderFailCallBack = this.sendOderFailCallBack.bind(this);
        this.sendOderSuccessCallBack = this.sendOderSuccessCallBack.bind(this);
        this.jumpAddressPage = this.jumpAddressPage.bind(this);
        this.receiptPhoto = this.receiptPhoto.bind(this);
        this.renderTitle = this.renderTitle.bind(this);

        this.getOrderPictureList = this.getOrderPictureList.bind(this);
        this.getOrderPictureSuccessCallBack = this.getOrderPictureSuccessCallBack.bind(this);
        this.getOrderPictureFailCallBack = this.getOrderPictureFailCallBack.bind(this);

    }

    componentDidMount() {
        this.getOrderDetailInfo();
        DeviceEventEmitter.addListener('changeStateReceipt',() => {
            this.props.navigation.goBack();
        });
        // // 返回上一级
        // this.listener1 = DeviceEventEmitter.addListener('changeStateReceipt', () => {
        //     this.props.navigator.pop();
        // });
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
    }

    onScrollEnd(event) {
        // 得出滚动的位置
        const index = event.nativeEvent.contentOffset.x / screenWidth + 1;

        if (index < 1 || index > this.state.datas.length) {
            return;
        }
        this.setState({
            current: parseInt(index),
        });

        let position  = parseInt(index) - 1;
        this.renderTitle(position, this.state.datas);
    }

    renderTitle (index, array) {
        if (array[index].transOrderStatsu === '5') {
            this.setState({
                isShowRightButton: true
            });
        }else {
            this.setState({
                isShowRightButton: false
            });
        }
    }

    /*
     * 获取列表详情调用接口
     *
     */

    getOrderDetailInfo() {
        currentTime = new Date().getTime();
        // 传递参数
        HTTPRequest({
            url: API.API_NEW_GET_GOODS_SOURCE,
            params: {
                transCodeList: this.state.transOrderList,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                this.sendOderSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
                this.sendOderFailCallBack();
            },
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
    }
    // 获取数据成功回调
    sendOderSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取订单详情', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '待签收订单详情页面');
        const array = [];
        for (let i = 0; i < result.length; i++) {
            const obj = result[i];
            array.push(obj);
        }
        this.setState({
            datas: array,
        });
        this.renderTitle(0, array);
    }
    // 获取数据失败回调
    sendOderFailCallBack() {
        Toast.showShortCenter('获取订单详情失败!');
    }

    jumpAddressPage(index, type, item) {
        let typeString = '';
        if (type === 'departure') {
            // 发货方
            typeString = 'send';
        } else {
            // 收货方
            typeString = 'receiver';
        }

        this.props.navigation.navigate(
            'BaiduMap',
            {
                sendAddr: item.deliveryInfo.departureAddress,
                receiveAddr: item.deliveryInfo.receiveAddress,
                clickFlag: typeString,
            },
        );
    }
    // 回单照片
    receiptPhoto(){

        this.getOrderPictureList();

        /*
        this.props.router.redirect(RouteType.RECEIPT_PHOTO_PAGE,{
            transOrder: this.state.datas[this.state.current-1].transCode,
        });
        console.log('transCode========',this.state.datas[this.state.current-1].transCode);

        if (this.state.result) {
            this.props.router.redirect(
                RouteType.IMAGE_SHOW_PAGE,
                {
                    image: this.state.result,
                    num: parseInt(index),
                },
            );
        }
        */

    }

    getOrderPictureList() {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_ORDER_PICTURE_SHOW,
            params: {
                refNo: this.state.datas[this.state.current-1].transCode,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                this.getOrderPictureSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
                this.getOrderPictureFailCallBack();
            },
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
    }
    getOrderPictureSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取回单照片',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '回单照片页面');
        if (result) {
            if (result.urlList && result.urlList.length !== 0) {

                this.setState({
                    showImages : result.urlList.map(i => {
                        console.log('received image', i);
                        return {url: i ? i : ''};
                    }),
                });

                /*
                this.props.router.redirect(
                    RouteType.IMAGE_SHOW_PAGE,
                    {
                        image: result.urlList.map(i => {
                            console.log('received image', i);
                            return {url: i ? i : ''};
                        }),
                        num: 0,
                    },
                );
                */

            }else
                Toast.showShortCenter('暂无回单照片');
        }
    }
    getOrderPictureFailCallBack() {
    }


    render() {
        const navigator = this.props.navigation;
        const subOrderPage = this.state.datas.map((item, index) => {
            if (item.transOrderStatsu === '5') { // 已回单5
                return (
                    <EntryToBeSure
                        key={index}
                        style={{ overflow: 'hidden' }}
                        deliveryInfo={item.deliveryInfo}
                        goodsInfoList={item.goodsInfo}
                        taskInfo={item.taskInfo}
                        time={item.time}
                        transCode={item.transCode}
                        transOrderStatus={item.transOrderStatsu}
                        transOrderType={item.transOrderType}
                        vol={item.vol}
                        weight={item.weight}
                        signer={item.signer}
                        index={index}
                        addressMapSelect={(indexRow, type) => {
                            this.jumpAddressPage(indexRow, type, item);
                        }}
                    />
                );
            }

            if (item.transOrderStatsu === '4') { // 待回单4
                return (
                    <EntryToBeWaitSure
                        {...this.props}
                        key={index}
                        style={{ overflow: 'hidden' }}
                        deliveryInfo={item.deliveryInfo}
                        goodsInfoList={item.goodsInfo}
                        taskInfo={item.taskInfo}
                        time={item.time}
                        transCode={item.transCode}
                        transOrderStatus={item.transOrderStatsu}
                        transOrderType={item.transOrderType}
                        vol={item.vol}
                        weight={item.weight}
                        signer={item.signer}
                        index={index}
                        addressMapSelect={(indexRow, type) => {
                            this.jumpAddressPage(indexRow, type, item);
                        }}
                        recepitSuccess={()=>{
                            //this.props.navigator.pop();
                        }}
                    />
                );
            }

            if (item.transOrderStatsu === '3' || !item.transOrderStatsu) { // 待签收3
                return (
                    <EntryToBeSignIn
                        key={index}
                        style={{ overflow: 'hidden' }}
                        deliveryInfo={item.deliveryInfo}
                        goodsInfoList={item.goodsInfo}
                        taskInfo={item.taskInfo}
                        time={item.time}
                        transCode={item.transCode}
                        transOrderStatus={item.transOrderStatsu}
                        transOrderType={item.transOrderType}
                        vol={item.vol}
                        weight={item.weight}
                        settlementMode={2}
                        index={index}
                        addressMapSelect={(indexRow, type) => {
                            this.jumpAddressPage(indexRow, type, item);
                        }}
                        signIn={() => {
                            // 跳转到具体的签收页面
                            this.props.navigation.navigate('SignPage', {
                                transCode: item.transCode,
                                goodsInfoList: item.goodsInfo,
                                taskInfo: item.taskInfo
                            });
                        }}
                    />
                );
            }
            return null;
        });

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'订单详情'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    rightButtonConfig={this.state.isShowRightButton ? {
                        type: 'string',
                        title: '回单照片',
                        onClick: this.receiptPhoto,
                    } : {}}
                />
                <Text style={{textAlign: 'center', marginTop: 10, height: 20, fontSize: 16, color:'#666'}}>
                    {this.state.current}/{this.state.datas.length}
                </Text>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    style={styles.container}
                    horizontal={true}
                    pagingEnabled={true}
                    onScroll={() => {
                    }}
                    scrollEventThrottle={200}
                    onMomentumScrollEnd={this.onScrollEnd}
                    onScrollEndDrag={this.onScrollEnd}
                >
                    {subOrderPage}
                </ScrollView>
                {this.state.loading ? <Loading /> : null}

                {
                    this.state.showImages && this.state.showImages.length !==0 ?
                        <ImageViewer
                            style={{position: 'absolute', top: 0, left: 0, width: screenWidth, height: screenHeight}}
                            imageUrls={this.state.showImages}
                            enableImageZoom={true}
                            index={0}
                            renderIndicator={(currentIndex, allSize) => {
                                return React.createElement(View, { style: styles.count }, React.createElement(Text, { style: styles.countText }, allSize + '-' + currentIndex));
                            }}
                            onChange={(index) => {
                            }}
                            onClick={() => {
                                this.setState({
                                    showImages : [],
                                });
                            }}
                        /> : null
                }

            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(entryToBeSignin);
