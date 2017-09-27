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
// import NavigatorBar from '../../../../common/navigationBar';
import NavigationBar from '../../common/navigationBar/navigationBar';
import EntryTest from './goodsSouceDetails';
import * as API from '../../constants/api';
// import {getOrderDetaiInfoSuccess, receiveGoods, refusedGoods} from '../../action/order';
import Loading from '../../utils/loading';
// import {changeAppLoadingAction} from '../../action/app';
import Storage from '../../utils/storage';
import ChooseButtonCell from './component/chooseButtonCell';
import EmptyView from '../../common/emptyView/emptyView';
// import noDataIcon from '../../../../../assets/img/nodata.png';
import prventDoubleClickUtil from '../../utils/prventMultiClickUtil';
import Toast from '@remobile/react-native-toast';

import CountdownWithText from './component/countdownWithText';
import HTTPRequest from '../../utils/httpRequest';


// import {
//     mainPressAction,
//     changeTabBarAction,
// } from '../../action/app';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

let transOrderInfo = [];
let userID = '';
let userName = '';
let plateNumber = '';

// import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

class entryGoodsDetail extends Component {

    constructor(props) {
        super(props);

        // const params = this.props.router.getCurrentRoute().params;
        const params = this.props.navigation.state;
        console.log('******6666====666',params.bidEndTime,params.bidStartTime);

        this.state = {
            datas: [],
            current: 1,
            transOrderList: params.transOrderList,
            scheduleCode: params.scheduleCode,
            scheduleStatus: params.scheduleStatus,

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

        this.changeAppLoading = this.changeAppLoading.bind(this);
        this.isShowEmptyView = this.isShowEmptyView.bind(this);
        this.emptyView = this.emptyView.bind(this);
        this.contentView = this.contentView.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.changeOrderTab = this.changeOrderTab.bind(this);

    }

    componentWillUnmount() {
        transOrderInfo = Array();
    }

    changeTab(tab) {
        this.props.changeTab(tab);
    }

    // 切换订单tab
    changeOrderTab(orderTab) {
        this.props.changeOrderTab(orderTab);
    }

    componentDidMount() {
        // this.getCurrentPosition();
        InteractionManager.runAfterInteractions(() => {
            this.getOrderDetailInfo(
                this.getOrderDetailInfoSuccessCallBack,
                this.getOrderDetailInfoFailCallBack,
            );
        });

        Storage.get('userInfo').then((userInfo) => {
            userID = userInfo.result.userId;
            userName = userInfo.result.userName;
        });
        Storage.get('plateNumber').then((plate) => {
            plateNumber = plate;
        });
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
        // this.changeAppLoading(true);
        console.log('fafjdoifijoe', this.state.transOrderList);
        // this.props.getOrderDetaiInfoSuccess({
        //     transCodeList: this.state.transOrderList
        // }, getOrderDetailInfoSuccessCallBack, getOrderDetailInfoFailCallBack);
        HTTPRequest({
            url: API.API_NEW_GET_GOODS_SOURCE,
            params: {
                transCodeList: this.state.transOrderList,
            },
            loading: ()=>{

            },
            success: (responseData)=>{
                console.log('success',responseData);
                this.setState({
                    loading: false,
                }, ()=>{
                    lastTime = new Date().getTime();
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
        // this.changeAppLoading(false);
        const array = [];
        transOrderInfo = Array();
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
        // Toast.showShortCenter('获取订单详情失败!');
        this.changeAppLoading(false);

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

        this.props.router.redirect(
            RouteType.MAP_PAGE,
            {
                sendAddr: item.deliveryInfo.departureAddress,
                receiveAddr: item.deliveryInfo.receiveAddress,
                clickFlag: typeString,
            },
        );
    }

    changeAppLoading(appLoading) {
        this.props.changeAppLoading(appLoading);
    }

    /*
     * 点击接单调用接口
     * */
    receiveGoodsAction(receiveGoodsSuccessCallBack, receiveGoodsFailCallBack) {
        currentTime = new Date().getTime();
        // 传递参数
        this.changeAppLoading(true);

        this.props.receiveGoods({
            userId: userID,
            userName,
            plateNumber,
            scheduleCode: this.state.scheduleCode,
        }, receiveGoodsSuccessCallBack, receiveGoodsFailCallBack);

    }

    // 获取数据成功回调
    receiveGoodsSuccessCallBack() {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('接单',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '货源详情页面');
        Toast.showShortCenter('接单成功!');
        this.changeAppLoading(false);

        if (this.props.router.getCurrentRoute().params.getOrderSuccess) {
            this.props.router.getCurrentRoute().params.getOrderSuccess();
        }
        // DeviceEventEmitter.emit('refreshHome');


        this.props.navigator.popToTop();

        DeviceEventEmitter.emit('reloadOrderAllAnShippt');
        this.changeTab('order');
        this.changeOrderTab(1);
    }

    // 获取数据失败回调
    receiveGoodsFailCallBack() {
        Toast.showShortCenter('接单失败!');
        this.changeAppLoading(false);
    }

    /*
     * 点击拒单调用接口
     * */
    refusedGoodsAction(refusedGoodsSuccessCallBack, refusedGoodsFailCallBack) {
        currentTime = new Date().getTime();
        // 传递参数
        this.changeAppLoading(true);

        this.props.refusedGoods({
            userId: userID,
            userName,
            plateNumber,
            scheduleCode: this.state.scheduleCode,
        }, refusedGoodsSuccessCallBack, refusedGoodsFailCallBack);
    }

    // 获取数据成功回调
    refusedGoodsSuccessCallBack() {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('拒单', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '货源详情页面');
        Toast.showShortCenter('拒单成功!');
        this.changeAppLoading(false);

        if (this.props.router.getCurrentRoute().params.getOrderSuccess) {
            this.props.router.getCurrentRoute().params.getOrderSuccess();
        }
        // DeviceEventEmitter.emit('refreshHome');
        this.props.navigator.popToTop();
    }

    // 获取数据失败回调
    refusedGoodsFailCallBack() {
        Toast.showShortCenter('拒单失败!');
        this.changeAppLoading(false);
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
                        // this.props.navigator.popToTop();
                        // DeviceEventEmitter.emit('resetgood');
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
                    transOrderStatsu={item.transOrderStatsu}
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
                        {this.state.datas.length}-{this.state.current}
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
                                toRefuse={() => {
                                    if (prventDoubleClickUtil.noDoubleClick()) {
                                        this.refusedGoodsAction(this.refusedGoodsSuccessCallBack, this.refusedGoodsFailCallBack,);
                                    }
                                }}
                                getorders={() => {
                                    if (prventDoubleClickUtil.noDoubleClick()) {
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
                                this.props.router.redirect(RouteType.GOODS_BIDDING_PAGE, {
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
                                DeviceEventEmitter.emit('resetgood');
                            }}
                        /> : null
                }
                <Loading />
            </View>
        );
    }

    render() {

        const {navigator} = this.props;

        return (
            <View style={styles.container}>
                {this.isShowEmptyView(navigator)}
            </View>
        );
    }
}

entryGoodsDetail.propTypes = {
    refusedGoods: React.PropTypes.func,
    receiveGoods: React.PropTypes.func,
    getOrderDetaiInfoSuccess: React.PropTypes.func,
    changeAppLoading: React.PropTypes.func,
    appLoading: React.PropTypes.bool,
    router: React.PropTypes.object,
    navigator: React.PropTypes.object,
};
function mapStateToProps(state) {
    return {
        appLoading: state.app.get('appLoading'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeAppLoading: (appLoading) => {
            dispatch(changeAppLoadingAction(appLoading));
        },
        // 订单详情
        getOrderDetaiInfoSuccess: (params, getOrderSuccessCallBack, getOrderFailCallBack) => {
            dispatch(getOrderDetaiInfoSuccess({
                url: API.API_NEW_GET_GOODS_SOURCE,
                body: {
                    transCodeList: params.transCodeList,
                },
                successCallBack: (response) => {
                    getOrderSuccessCallBack(response.result);
                },
                failCallBack: () => {
                    getOrderFailCallBack();
                    dispatch(changeAppLoadingAction(false));
                },
            }));
        },

        // 接单
        receiveGoods: (params, receiveGoodsSuccessCallBack, receiveGoodsFailCallBack) => {
            dispatch(receiveGoods({
                url: API.API_NEW_DRIVER_RECEIVE_ORDER,
                body: {
                    userId: params.userId,
                    userName: params.userName,
                    plateNumber: params.plateNumber,
                    dispatchCode: params.scheduleCode,
                },
                successCallBack: () => {
                    receiveGoodsSuccessCallBack();
                },
                failCallBack: () => {
                    receiveGoodsFailCallBack();
                },
            }));
        },

        // 拒单
        refusedGoods: (params, refusedGoodsSuccessCallBack, refusedeGoodsFailCallBack) => {
            dispatch(refusedGoods({
                url: API.API_NEW_DRIVER_REFUSE_ORDER,
                body: {
                    userId: params.userId,
                    userName: params.userName,
                    plateNumber: params.plateNumber,
                    dispatchCode: params.scheduleCode,
                },
                successCallBack: () => {
                    refusedGoodsSuccessCallBack();
                },
                failCallBack: () => {
                    refusedeGoodsFailCallBack();
                },
            }));
        },

        // changeTab: (tab) => {
        //     dispatch(changeTabBarAction(tab));
        // },
        //
        // changeOrderTab: (orderTab) => {
        //     dispatch(mainPressAction(orderTab));
        // },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(entryGoodsDetail);
