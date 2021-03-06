import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    ImageBackground,
} from 'react-native';

import NavigatorBar from '../../../../common/navigationBar/navigationBar';
import EntryTest from '../../orderToBeShippedDetails';
import * as API from '../../../../constants/api';
import Loading from '../../../../utils/loading';
import Storage from '../../../../utils/storage';
import EmptyView from '../../../../common/emptyView/emptyView';
import prventDoubleClickUtil from '../../../../utils/prventMultiClickUtil'
import HTTPRequest from '../../../../utils/httpRequest';
import Toast from '@remobile/react-native-toast';
import {isReSetCity} from '../../../../action/order';
import StorageKey from '../../../../constants/storageKeys';
import * as StaticColor from '../../../../constants/staticColor';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../../utils/readAndWriteFileUtil';
import BottomButton from '../../components/bottomButtonComponent';
import ChooseButton from '../../../goodSource/component/chooseButtonCell';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    text: {
        marginLeft: 10,
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        paddingBottom: 14,
        paddingTop: 14,

    },
    carrierView: {
        flexDirection: 'row',
        backgroundColor: StaticColor.WHITE_COLOR,
        alignItems: 'center'
    }

});
let transOrderInfo = [];
let userID = '';
let userName = '';
let plateNumber = '';
let currentTime = 0;
let lastTime = 0;
let locationData = '';
let bindGPSType = '';
let isBindGPS = false;

class entryToBeShipped extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            datas: [],
            current: 1,
            transOrderList: params.transOrderList,
            scheduleCode: params.scheduleCode,
            isShowEmptyView: true,
            loading: false,
            carrierName: params.carrierName,
            carrierPlateNum: params.carrierPlateNum,
            isCompany: params.isCompany,
        };

        this.onScrollEnd = this.onScrollEnd.bind(this);

        this.getOrderDetailInfo = this.getOrderDetailInfo.bind(this);
        this.getOrderDetailInfoFailCallBack = this.getOrderDetailInfoFailCallBack.bind(this);
        this.getOrderDetailInfoSuccessCallBack = this.getOrderDetailInfoSuccessCallBack.bind(this);

        this.sendOrder = this.sendOrder.bind(this);
        this.sendOderFailCallBack = this.sendOderFailCallBack.bind(this);
        this.sendOderSuccessCallBack = this.sendOderSuccessCallBack.bind(this);

        this.cancelOrderAction = this.cancelOrderAction.bind(this);
        this.cancelOderSuccessCallBack = this.cancelOderSuccessCallBack.bind(this);
        this.cancelOderFailCallBack = this.cancelOderFailCallBack.bind(this);

        this.jumpAddressPage = this.jumpAddressPage.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        this.popToTop = this.popToTop.bind(this);

        this.isShowEmptyView = this.isShowEmptyView.bind(this);
        this.emptyView = this.emptyView.bind(this);
        this.contentView = this.contentView.bind(this);

    }

    componentDidMount() {
        this.getCurrentPosition();
        this.getOrderDetailInfo();
        Storage.get(StorageKey.USER_INFO).then((userInfo) => {
            if(userInfo) {
                console.log('Storage userId=', userInfo.userId);
                console.log('Storage userName=', userInfo.userName);
                userID = userInfo.userId;
                userName = userInfo.userName;
            }
        });
        Storage.get(StorageKey.PlateNumber).then((plate) => {
            if(plate) {
                plateNumber = plate;
            }
        });
        this.listener = DeviceEventEmitter.addListener('refreshShippedDetails',() => {
            this.getOrderDetailInfo();
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
    componentWillUnmount() {
        transOrderInfo = Array();
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
    getOrderDetailInfo() {
        currentTime = new Date().getTime();
        // 传递参数
        HTTPRequest({
            url: API.API_NEW_GET_GOODS_SOURCE,
            params: {
                transCodeList: this.state.transOrderList,
                plateNumber: this.props.plateNumber
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                console.log('==responseData',responseData);
                this.getOrderDetailInfoSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
                this.getOrderDetailInfoFailCallBack();
            },
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
    }

    // 获取数据成功回调
    getOrderDetailInfoSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取订单详情', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '待发运订单详情页面');
        const array = [];
        transOrderInfo = Array();
        for (let i = 0; i < result.length; i++) {
            let obj = result[i];
            let goodsInfo = [];
            for (let i = 0; i < obj.goodsInfo.length; i++) {
                let object = obj.goodsInfo[i];
                let oo = {
                    arNums: object.arNums,
                    goodsId: object.goodsId,
                    goodsName: object.goodsName,
                    goodsSpce: object.goodsSpce,
                    goodsUnit: object.goodsUnit,
                    refuseNum: object.refuseNum,
                    refuseReason: object.refuseReason,
                    shipmentNum: object.shipmentNum,
                    signNum: object.signNum,
                    weight: object.weight,
                    paasLineNo: object.paasLineNo
                };
                if (oo.shipmentNum === '0' || !oo.shipmentNum || oo.shipmentNum === 0) {
                    oo.shipmentNum = oo.arNums;
                }
                if (!oo.arNums || oo.arNums === '0' || oo.arNums === '') {
                    oo.shipmentNum = oo.weight;
                }
                goodsInfo.push(oo);
            }
            obj.goodsInfo = goodsInfo;
            array.push(obj);
            // 默认发运数据
            const goodsInfoList = [];
            for (let j = 0; j < obj.goodsInfo.length; j++) {
                const goods = obj.goodsInfo[j];
                goodsInfoList.push({
                    goodsId: goods.goodsId,
                    shipmentNums: goods.arNums === '' || goods.arNums === '0' ? goods.weight : goods.arNums,
                    refuseDetail: [
                        {
                            detailNum: goods.refuseNum,
                            refuseType: '',
                        },
                    ],
                    refuseNum: goods.refuseNum,
                    signNum: goods.signNum,
                    paasLineNo: goods.paasLineNo,
                });
            }
            transOrderInfo.push({
                transCode: obj.transCode,
                goodsInfo: goodsInfoList,
            });
        }
        console.log(JSON.stringify(transOrderInfo));
        this.setState({
            datas: array,
            isShowEmptyView: false,
        });
    }

    // 获取数据失败回调
    getOrderDetailInfoFailCallBack() {
        // Toast.showShortCenter('获取订单详情失败!');
        this.setState({
            isShowEmptyView: true,
        });
    }

    /*
     * 点击发运调用接口
     * */

    sendOrder() {

        currentTime = new Date().getTime();
        const goodInfo = transOrderInfo[0].goodsInfo;

        for (let i = 0; i < goodInfo.length; i++){
            let obj = goodInfo[i];
            if (!obj.shipmentNums || obj.shipmentNums === '') {
                Toast.showShortCenter('发运数量不能为空');
                return;
            }
        }

        // 传递参数
        console.log('transOrderInfo: ' + JSON.stringify(transOrderInfo));

        HTTPRequest({
            url: API.API_NEW_DESPATCH,
            params: {
                userId: userID,
                userName,
                scheduleCode: this.state.scheduleCode,
                transOrderInfo,
                plateNum: global.plateNumber,
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
    sendOderSuccessCallBack() {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('发运',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '待发运订单详情页面');
        Toast.showShortCenter('发运成功!');

        if (this.props.navigation.state.params.successCallBack) {
            this.props.navigation.state.params.successCallBack();
        }
        // 发运成功后，更新货源偏好出发城市
        this.resetCityAction(true);
        DeviceEventEmitter.emit('resetCityLIST');
        this.props.navigation.goBack();
    }

    // 获取数据失败回调
    sendOderFailCallBack() {
        // Toast.showShortCenter('发运失败!');
    }


    /*
     * 点击取消调用接口
     * */
    cancelOrderAction() {
        currentTime = new Date().getTime();
        // 传递参数
        HTTPRequest({
            url: this.props.currentStatus == 'driver' ? API.API_NEW_DRIVER_CANCEL_ORDER : API.API_NEW_CARRIER_REFUSE_ORDER,
            params: this.props.currentStatus == 'driver' ? {
                userId: userID,
                userName,
                plateNumber,
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
                this.cancelOderSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
                this.cancelOderFailCallBack();
            },
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
    }

    // 获取数据成功回调
    cancelOderSuccessCallBack() {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('取消接单',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '待发运订单详情页面');
        Toast.showShortCenter('取消成功!');

        if (this.props.navigation.state.params.successCallBack) {
            this.props.navigation.state.params.successCallBack();
        }
        // 返回top
        // 取消接单后，刷新货源列表
        DeviceEventEmitter.emit('resetGood');
        this.props.navigation.goBack();
    }

    // 获取数据失败回调
    cancelOderFailCallBack() {
        Toast.showShortCenter('取消失败!');
    }

    resetCityAction(data) {
        this.props.resetCityListAction(data);
    }
    // 返回到根界面
    popToTop() {
        const routes = this.props.routes;
        let key = routes[1].key;
        this.props.navigation.goBack(key);
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

    // 安排车辆
    arrangeCar() {
        this.props.navigation.navigate('ArrangeCarList',{
            dispatchCode: this.state.scheduleCode,
        });
    }

    cancelOrder() {

        if (this.state.isShowEmptyView) {
            return;
        }
        Alert.alert(
            null,
            '您确认取消本次运输吗？',
            [
                {
                    text: '取消',
                },
                {
                    text: '确认',
                    onPress: () => {
                        if (prventDoubleClickUtil.onMultiClick()) {
                            this.cancelOrderAction();
                        }
                    },
                },
            ],
            {cancelable: false},
        );
    }

    isShowEmptyView(navigator) {
        return (
            this.state.isShowEmptyView ? this.emptyView(navigator) : this.contentView(navigator)
        );
    }

    emptyView(navigator) {
        return (
            <View>
                <NavigatorBar
                    title={'订单详情'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <EmptyView/>
            </View>
        );
    }

    contentView(navigator) {
        const aa = this.state.datas.map((item, index) => {
            isBindGPS = item.isBindGPS;
            bindGPSType = item.bindGPSType;
            return (
                <EntryTest
                    key={index}
                    style={{ overflow: 'hidden' }}
                    deliveryInfo={item.deliveryInfo}
                    goodsInfoList={item.goodsInfo}
                    taskInfo={item.taskInfo}
                    time={item.time}
                    dispatchTime={item.dispatchTime}
                    transCode={item.transCode}
                    customerOrderCode={item.customerOrderCode}
                    transOrderStatus={item.transOrderStatsu}
                    transOrderType={item.transOrderType}
                    scheduleTime={item.scheduleTime}
                    scheduleTimeAgain={item.twoScheduleTime}
                    vol={item.vol}
                    weight={item.weight}
                    index={index}
                    currentStatus={this.props.currentStatus}
                    addressMapSelect={(indexRow, type) => {
                        this.jumpAddressPage(indexRow, type, item);
                    }}
                    chooseResult={(indexRow, obj) => {
                        transOrderInfo[indexRow] = obj;
                    }}
                />
            );
        });
        const carrierView = <View style={styles.carrierView}>
            <View style={{backgroundColor: StaticColor.BLUE_TAB_BAR_COLOR, width: 3, height: 16,}}/>
            <Text style={styles.text}>承运者：{this.state.carrierName}</Text>
            <Text style={styles.text}>{this.state.carrierPlateNum}</Text>
        </View>;
        const carrierBottomView = <BottomButton
            onClick={() => {
                if (prventDoubleClickUtil.onMultiClick()) {
                    this.arrangeCar();
                }
            }}
            text="安排车辆"
        /> ;
        const bottomView = isBindGPS && bindGPSType ?
            <ChooseButton
                leftContent={'查看GPS设备'}
                rightContent={'发运'}
                leftClick={() => {
                    this.props.navigation.navigate('GPSDetails');
                }}
                rightClick={() => {
                    if (prventDoubleClickUtil.onMultiClick()) {
                        this.sendOrder();
                    }
                }}
            /> : <ChooseButton
                leftContent={'绑定GPS设备'}
                rightContent={'发运'}
                leftClick={() => {
                    this.props.navigation.navigate('ScanGPS');
                }}
                rightClick={() => {
                    if (prventDoubleClickUtil.onMultiClick()) {
                        this.sendOrder();
                    }
                }}
            />;

        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'订单详情'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                    rightButtonConfig={
                        this.props.currentStatus == 'driver' && this.state.isCompany && this.state.isCompany == '1' ? {} : {
                        type: 'string',
                        title: '取消接单',
                        onClick: this.cancelOrder,
                    }}
                />
                {
                    this.props.currentStatus == 'driver' ? null : carrierView
                }
                <Text style={{textAlign: 'center', marginTop: 10, height: 20, fontSize: 16, color: StaticColor.COLOR_LIGHT_GRAY_TEXT}}>
                    {this.state.current}/{this.state.datas.length}
                </Text>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    style={styles.container}
                    horizontal={true}
                    pagingEnabled={true}
                    onMomentumScrollEnd={this.onScrollEnd}
                    onScrollEndDrag={this.onScrollEnd}
                >
                    {aa}
                </ScrollView>
                {
                    this.props.currentStatus == 'driver' ? bottomView : carrierBottomView
                }
                {this.state.loading ? <Loading /> : null }
            </View>
        );
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                {
                    //this.state.isShowEmptyView ? this.emptyView(navigator) : this.contentView(navigator)
                    this.contentView(navigator)
                }

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        routes: state.nav.routes,
        plateNumber: state.user.get('plateNumber'),
        currentStatus: state.user.get('currentStatus'),
        carrierCode: state.user.get('companyCode'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // 刷新城市列表
        resetCityListAction: (data) => {
            dispatch(isReSetCity(data));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(entryToBeShipped);
