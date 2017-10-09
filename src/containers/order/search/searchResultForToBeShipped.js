/**
 * Created by xizhixin on 2017/5/8.
 * 待发运界面
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    ScrollView,
    Dimensions,
    DeviceEventEmitter,
    StyleSheet,
    Platform,
    Text,
} from 'react-native';

import * as StaticColor from '../../../constants/staticColor';
import NavigatorBar from '../../../common/navigationBar/navigationBar';
import DetailsCell from '../../../common/source/detailsCell';
import DetailsUserCell from '../../../common/source/detailsUserCell';
import DetailsOrdersCell from '../../../common/source/detailsOrdersCell';
import TitlesCell from '../../../common/source/titlesCell';
import TotalsItemCell from '../../../common/source/totalsItemCell';
import OrderProductInfo from '../components/orderProductItemInfo';
import DetailsRedUserCell from '../../../common/source/detailsRedUserCell';


const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
    dividingLine: {
        height: 10,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    scrollView: {
        ...Platform.select({
            ios: {
                height: height - 64,
            },
            android: {
                height: height - 73,
            },
        }),
    },
    bottomView: {
        height: 10,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    total: {
        flexDirection: 'row',
        height: 50,
    },
});

class searchResultForToBeShipped extends Component {

    constructor(props) {
        super(props);
        // 得到上一级传过来的值，把值放进state中，this.state.xxx取值
        const params = this.props.navigation.state.params.productResult;

        this.state = {
            deliveryInfo: params.deliveryInfo,
            goodsInfoList: params.goodsInfo,
            taskInfo: params.taskInfo,
            time: params.time,
            transCode: params.transCode,
            vol: params.vol,
            weight: params.weight,
        };
    }


    componentWillUnmount() {
        const current = this.props.routes[this.props.routes.length-1];
        if (this.props.navigation && this.props.routes.length > 1) {
            if (current.routeName === 'Scan') { // 上一个界面为扫描，发监听开启扫描动画
                DeviceEventEmitter.emit('startAni');
            }
        }
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'订单详情'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollView}
                >
                    <View style={{height: 2}} />
                    <Text style={{fontSize: 17, marginHorizontal: 20,marginVertical: 10, fontWeight: 'bold'}}>
                        {this.state.deliveryInfo.receiveContact}
                    </Text>
                    <View style={styles.dividingLine} />
                    <DetailsOrdersCell
                        ordersPayment={this.state.taskInfo.collectMoney}
                        ordersFreight={this.state.taskInfo.carrFee}
                        carrFeePayer={this.state.taskInfo.carrFeePayer}
                        paymentWay={this.state.taskInfo.paymentWay}
                        ifReceipt={this.state.taskInfo.isReceipt}
                        receiptStyle={this.state.taskInfo.receiptWay}
                        arrivalTime={this.state.taskInfo.committedArrivalTime}
                    />
                    <View style={styles.dividingLine} />
                    <TitlesCell title="配送信息" />
                    <View style={{height: 1, backgroundColor: '#F5F5F5', marginLeft: 20}}/>
                    <DetailsUserCell
                        deliveryInfo={this.state.deliveryInfo}
                        onSelectAddr={() => {
                            if (this.state.deliveryInfo.departureAddress
                                && this.state.deliveryInfo.receiveAddress) {
                                this.props.navigation.navigate(
                                    'BaiduMap',
                                    {
                                        sendAddr: this.state.deliveryInfo.departureAddress,
                                        receiveAddr: this.state.deliveryInfo.receiveAddress,
                                        clickFlag: 'send',
                                    },
                                );
                            }
                        }}
                    />
                    <DetailsRedUserCell
                        deliveryInfo={this.state.deliveryInfo}
                        onSelectAddr={() => {
                            if (this.state.deliveryInfo.receiveAddress
                                && this.state.deliveryInfo.departureAddress) {
                                this.props.navigation.navigate(
                                    'BaiduMap',
                                    {
                                        sendAddr: this.state.deliveryInfo.departureAddress,
                                        receiveAddr: this.state.deliveryInfo.receiveAddress,
                                        clickFlag: 'receiver',
                                    },
                                );
                            }
                        }}
                    />
                    <View style={styles.dividingLine} />
                    <TitlesCell title="货品信息" />
                    {
                        this.state.goodsInfoList.map((item, index) => {
                            return (
                                <OrderProductInfo
                                    key={index}
                                    componentID={item.goodsId}
                                    title={item.goodsName}
                                    Specifications={item.goodsSpce}
                                    unit={item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.goodsUnit : 'Kg'}
                                    receiveNum={item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.arNums : item.arNums }
                                    _index={index}
                                    receiveAllNum={(componentID, number, _index) => {
                                    }}
                                    disabled={true}
                                    edit={false}
                                />
                            );
                        })
                    }
                    <View style={styles.bottomView} />
                    <View style={styles.total}>
                        <TotalsItemCell
                            totalTons={this.state.weight}
                            totalSquare={this.state.vol}
                        />
                    </View>
                    <View style={styles.dividingLine} />

                    <DetailsCell
                        transportNO_={this.state.transCode}
                        transportTime={this.state.time}
                    />
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        routes: state.nav.routes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(searchResultForToBeShipped);

