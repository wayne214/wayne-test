import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    DeviceEventEmitter,
    Platform,
    InteractionManager,
} from 'react-native';
import moment from 'moment';
import NavigationBar from '../../common/navigationBar/navigationBar';
import EntryTest from './goodsSouceDetails';
import * as API from '../../constants/api';
import Loading from '../../utils/loading';
import ChooseButtonCell from './component/chooseButtonCell';
import EmptyView from '../../common/emptyView/emptyView';
import PreventDoubleClickUtil from '../../utils/prventMultiClickUtil';
import Toast from '@remobile/react-native-toast';

import CountdownWithText from './component/countdownWithText';
import HTTPRequest from '../../utils/httpRequest';


import {
    mainPressAction,
} from '../../action/app';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

let transOrderInfo = [];

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

class entryGoodsDetail extends Component {

    constructor(props) {
        super(props);
        // 获取上个页面传递的值
        const params = this.props.navigation.state.params;
        console.log('entryGoodsDetail.params',params);

        this.state = {
            datas: [],
            current: 1,
            transOrderList: params.transOrderList, // 运单号
            scheduleCode: params.scheduleCode,
            scheduleStatus: params.scheduleStatus,
            loading: false, // 加载框
            isShowEmptyView: false,
            allocationModel: params.allocationModel,
            bidEndTime: params.bidEndTime !== null && params.bidEndTime !== '' ? params.bidEndTime : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            bidStartTime: params.bidStartTime !== null && params.bidStartTime !== '' ? params.bidStartTime : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            show: (Date.parse(new Date(params.bidStartTime && params.bidStartTime !== '' ? params.bidStartTime.replace(/-/g,"/") : new Date())) - Date.parse(new Date)) <= 0 ? false : true,
            idBiddingModel: params.allocationModel && params.allocationModel !== '10' ,
            refPrice: params.refPrice && params.refPrice !== '' ? params.refPrice : 0,
        };

        this.onScrollEnd = this.onScrollEnd.bind(this);
        this.jumpAddressPage = this.jumpAddressPage.bind(this);

        // 订单详情
        this.getOrderDetailInfo = this.getOrderDetailInfo.bind(this);
        this.getOrderDetailInfoFailCallBack = this.getOrderDetailInfoFailCallBack.bind(this);
        this.getOrderDetailInfoSuccessCallBack = this.getOrderDetailInfoSuccessCallBack.bind(this);

        // 接单
        this.receiveGoodsAction = this.receiveGoodsAction.bind(this);
        this.receiveGoodsSuccessCallBack = this.receiveGoodsSuccessCallBack.bind(this);
        this.receiveGoodsFailCallBack = this.receiveGoodsFailCallBack.bind(this);

        // 拒单
        this.refusedGoodsAction = this.refusedGoodsAction.bind(this);
        this.refusedGoodsSuccessCallBack = this.refusedGoodsSuccessCallBack.bind(this);
        this.refusedGoodsFailCallBack = this.refusedGoodsFailCallBack.bind(this);

        this.isShowEmptyView = this.isShowEmptyView.bind(this);
        this.emptyView = this.emptyView.bind(this);
        this.contentView = this.contentView.bind(this);
        this.changeOrderTab = this.changeOrderTab.bind(this);

    }

    componentWillUnmount() {
        transOrderInfo = [];
    }

    // 切换订单tab
    changeOrderTab(orderTab) {
        this.props.changeOrderTab(orderTab);
    }

    componentDidMount() {
        this.getCurrentPosition();
        this.getOrderDetailInfo(
            this.getOrderDetailInfoSuccessCallBack,
            this.getOrderDetailInfoFailCallBack,
        );
    }
// 获取当前位置
    getCurrentPosition(){
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
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
    }

    /*
     * 获取列表详情调用接口
     *
     */
    getOrderDetailInfo(getOrderDetailInfoSuccessCallBack, getOrderDetailInfoFailCallBack) {
        currentTime = new Date().getTime();
        // 传递参数
        console.log('transOrderList', this.state.transOrderList);
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
                console.log('success',responseData);
                this.setState({
                    loading: false,
                }, ()=>{
                    getOrderDetailInfoSuccessCallBack(responseData.result);
                });

            },
            error: (errorInfo)=>{
                this.setState({
                    loading: false,
                });
                getOrderDetailInfoFailCallBack();
            },
            finish: ()=>{
            }
        });
    }

    // 获取数据成功回调
    getOrderDetailInfoSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('订单详情',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '货源详情页面');
        const array = [];
        transOrderInfo = [];
        for (let i = 0; i < result.length; i++) {
            const obj = result[i];
            array.push(obj);
            // 默认发运数据
            const goodsInfoList = [];
            for (let j = 0; j < obj.goodsInfo.length; j++) {
                const goods = obj.goodsInfo[j];
                goodsInfoList.push({
                    goodsId: goods.goodsId,
                    shipmentNums: goods.shipmentNum,
                });
            }
            transOrderInfo.push({
                transCode: obj.transCode,
                goodsInfo: goodsInfoList,
            });
        }
        this.setState({
            datas: array,
            isShowEmptyView: false,

        });
    }

    // 获取数据失败回调
    getOrderDetailInfoFailCallBack() {
        this.setState({
            isShowEmptyView: true,
        });
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

        this.props.navigation.navigate('BaiduMap', {
            sendAddr: item.deliveryInfo.departureAddress,
            receiveAddr: item.deliveryInfo.receiveAddress,
            clickFlag: typeString,
        });
    }

    /*
     * 点击接单调用接口
     * */
    receiveGoodsAction(receiveGoodsSuccessCallBack, receiveGoodsFailCallBack) {
        currentTime = new Date().getTime();
        console.log('this.props.ownerName', this.props.ownerName);
        if(this.props.currentStatus == 'driver'){
            // 传递参数
            HTTPRequest({
                url: API.API_NEW_DRIVER_RECEIVE_ORDER,
                params: {
                    userId: global.userId,
                    userName: global.userName,
                    plateNumber: this.props.plateNumber,
                    dispatchCode: this.state.scheduleCode,
                },
                loading: ()=>{
                    this.setState({
                        loading: true,
                    });
                },
                success: (responseData)=>{
                    console.log('success',responseData);
                    this.setState({
                        loading: false,
                    }, ()=>{
                        receiveGoodsSuccessCallBack(responseData.result);
                    });

                },
                error: (errorInfo)=>{
                    this.setState({
                        loading: false,
                    }, () => {
                        receiveGoodsFailCallBack();
                    });
                },
                finish: ()=>{
                }
            });
        }else {
            if(this.props.ownerName){
                // 传递参数
                HTTPRequest({
                    url: API.API_NEW_CARRIER_RECEIVE_ORDER,
                    params: {
                        userId: '',
                        userName: this.props.ownerName,
                        carrierCode: this.props.carrierCode,
                        dispatchNo: this.state.scheduleCode,
                    },
                    loading: ()=>{
                        this.setState({
                            loading: true,
                        });
                    },
                    success: (responseData)=>{
                        console.log('success',responseData);
                        this.setState({
                            loading: false,
                        }, ()=>{
                            receiveGoodsSuccessCallBack(responseData.result);
                        });

                    },
                    error: (errorInfo)=>{
                        this.setState({
                            loading: false,
                        }, () => {
                            receiveGoodsFailCallBack();
                        });
                    },
                    finish: ()=>{
                    }
                });
            }else {
                Toast.showShortCenter('接单失败!');
            }
        }
    }

    // 获取数据成功回调
    receiveGoodsSuccessCallBack() {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('接单',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '货源详情页面');
        Toast.showShortCenter('接单成功!');
        DeviceEventEmitter.emit('refreshHome');
        if (this.props.navigation.state.params.getOrderSuccess) {
            this.props.navigation.state.params.getOrderSuccess();
        }
        DeviceEventEmitter.emit('reloadOrderAllAnShippt');
        this.props.navigation.goBack();
        this.props.navigation.navigate('Order');
        this.changeOrderTab(1);
        DeviceEventEmitter.emit('changeOrderTabPage', 1);

    }

    // 获取数据失败回调
    receiveGoodsFailCallBack() {
        Toast.showShortCenter('接单失败!');
    }

    /*
     * 点击拒单调用接口
     * */
    refusedGoodsAction(refusedGoodsSuccessCallBack, refusedGoodsFailCallBack) {
        currentTime = new Date().getTime();
        // 传递参数
        HTTPRequest({
            url: this.props.currentStatus == 'driver' ? API.API_NEW_DRIVER_REFUSE_ORDER : API.API_NEW_CARRIER_REFUSE_ORDER,
            params: this.props.currentStatus == 'driver' ? {
                userId: global.userId,
                userName: global.userName,
                plateNumber: this.props.plateNumber,
                dispatchCode: this.state.scheduleCode,
            } : {
                userId: global.userId,
                userName: global.userName,
                carrierCode: this.props.carrierCode,
                dispatchNo: this.state.scheduleCode,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                console.log('success',responseData);
                this.setState({
                    loading: false,
                }, ()=>{
                    refusedGoodsSuccessCallBack(responseData.result);
                });

            },
            error: (errorInfo)=>{
                this.setState({
                    loading: false,
                }, () => {
                    refusedGoodsFailCallBack();
                });
            },
            finish: ()=>{
            }
        });
    }

    // 获取数据成功回调
    refusedGoodsSuccessCallBack() {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('拒单', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '货源详情页面');
        Toast.showShortCenter('拒单成功!');
        DeviceEventEmitter.emit('refreshHome');
        DeviceEventEmitter.emit('resetGood');
        if (this.props.navigation.state.params.getOrderSuccess) {
            this.props.navigation.state.params.getOrderSuccess();
        }
        // 返回上一个页面
        this.props.navigation.goBack();
    }

    // 获取数据失败回调
    refusedGoodsFailCallBack() {
        Toast.showShortCenter('拒单失败!');
    }

    // 返回到根界面
    popToTop() {
        const routes = this.props.routes;
        let key = routes[1].key;
        this.props.navigation.goBack(key);
    }

    /*
     *  ...Platform.select({
     ios:{top: 200},
     android:{top: 50}
     }),*/

    isShowEmptyView(navigator) {
        return (
            this.state.isShowEmptyView ? this.emptyView(navigator) : this.contentView(navigator)
        );
    }

    emptyView(navigator) {
        return (
            <View>
                <NavigationBar
                    title={'订单详情'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    backIconClick={() => {
                        navigator.goBack();
                        DeviceEventEmitter.emit('resetGood');
                    }}
                />
                <EmptyView />
            </View>
        );
    }

    contentView(navigator) {
        const aa = this.state.datas.map((item, index) => {
            return (
                <EntryTest
                    key={index}
                    style={{overflow: 'hidden'}}
                    deliveryInfo={item.deliveryInfo}
                    goodsInfoList={item.goodsInfo}
                    taskInfo={item.taskInfo}
                    time={item.time}
                    transCode={item.transCode}
                    transOrderStatus={item.transOrderStatsu}
                    customerOrderCode={item.customerOrderCode}
                    vol={item.vol}
                    weight={item.weight}
                    index={index}
                    addressMapSelect={(indexRow, type) => {
                        this.jumpAddressPage(indexRow, type, item);
                    }}
                    chooseResult={(indexRow, obj) => {
                        transOrderInfo[indexRow] = obj;
                    }}
                    isFullScreen={this.state.scheduleStatus === '2'}
                />
            );
        });
        return (
            <View style={{
                // position: 'absolute',
                // width: screenWidth,
                // height: screenHeight,
                // top: 0,
                // left: 0,
                flex: 1
            }}>
                <NavigationBar
                    title={'订单详情'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                />
                <View style={{height: 20, marginTop: 10, width: screenWidth,}}>
                    <Text style={{textAlign: 'center', fontSize: 16, color:'#666'}}>
                        {this.state.datas.length}/{this.state.current}
                    </Text>
                </View>
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
                    {aa}
                </ScrollView>
                {
                    this.state.scheduleStatus === '2' ?
                        null : this.state.allocationModel === '10' || this.state.allocationModel === '' || this.state.allocationModel === null ?
                            <ChooseButtonCell
                                leftClick={() => {
                                    if (PreventDoubleClickUtil.onMultiClick()) {
                                        this.refusedGoodsAction(this.refusedGoodsSuccessCallBack, this.refusedGoodsFailCallBack,);
                                    }
                                }}
                                rightClick={() => {
                                    if (PreventDoubleClickUtil.onMultiClick()) {
                                        this.receiveGoodsAction(this.receiveGoodsSuccessCallBack, this.receiveGoodsFailCallBack,);
                                    }
                                }}
                            /> : this.state.show ? <CountdownWithText
                                style={{borderRadius: 0,
                                    height: 45,
                                    marginRight: 0,
                                    marginLeft: 0,}}
                                idEnded={(Date.parse(new Date(this.state.bidStartTime.replace(/-/g,"/"))) - Date.parse(new Date)) <= 0}
                                onReachTime={true}
                                endTime={this.state.bidStartTime}
                                onClick={() => {}}
                                onEnded={() => {
                                    this.setState({
                                        show: false,
                                    });
                                }}
                            /> : null
                }
                {
                    !this.state.show && this.state.idBiddingModel ? <CountdownWithText
                            style={{borderRadius: 0,
                                height: 45,
                                marginRight: 0,
                                marginLeft: 0,}}
                            onReachTime={false}
                            idEnded={(Date.parse(new Date(this.state.bidEndTime.replace(/-/g,"/"))) - Date.parse(new Date)) <= 0}
                            endTime={this.state.bidEndTime}
                            showReviewText={(Date.parse(new Date(this.state.bidEndTime.replace(/-/g,"/"))) - Date.parse(new Date)) <= 0}
                            onClick={() => {
                                this.props.navigation.navigate('GoodsBiddingPage', {
                                    bidScheduleCode: this.state.scheduleCode,
                                    endTime: this.state.bidEndTime,
                                    refPrices: this.state.refPrice,
                                });
                            }}
                            onEnded={() => {
                                this.setState({
                                    show: false,
                                });
                                // 竞单时间结束后，发送监听刷新货源列表
                                DeviceEventEmitter.emit('resetGood');
                            }}
                        /> : null
                }
                {
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.isShowEmptyView(navigator)}
            </View>
        );
    }
}


function mapStateToProps(state) {
    return {
        plateNumber: state.user.get('plateNumber'),
        routes: state.nav.routes,
        currentStatus: state.user.get('currentStatus'),
        carrierCode: state.user.get('companyCode'),
        ownerName: state.user.get('ownerName'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeOrderTab: (orderTab) => {
            dispatch(mainPressAction(orderTab));
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(entryGoodsDetail);
