/**
 * Created by xizhixin on 2017/5/8.
 * 待回单页面
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    DeviceEventEmitter,
    Platform,
    StyleSheet,
} from 'react-native';

import NavigationBar from '../../../common/navigationBar/navigationBar';
import DetailsCell from '../../../common/source/detailsCell';
import DetailsUserCell from '../../../common/source/detailsUserCell';
import DetailsOrdersCell from '../../../common/source/detailsOrdersCell';
import TitlesCell from '../../../common/source/titlesCell';
import TotalsItemCell from '../../../common/source/totalsItemCell';
import ProductShowItem from '../../../common/source/OrderDetailProShowItemCell';
import DetailsRedUserCell from '../../../common/source/detailsRedUserCell';

import * as StaticColor from '../../../constants/staticColor';


import Loading from '../../../utils/loading';
import EmptyView from '../../../common/emptyView/emptyView';


const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    dividingLine: {
        height: 10,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    scrollView: {
        ...Platform.select({
            ios: {
                height: height - 64 - 54 - 10 - 10,
            },
            android: {
                height: height - 73 - 54 - 10 - 10,
            },
        }),
    },
    text: {
        color: StaticColor.WHITE_COLOR,
        fontSize: 16,
    },
});

class searchResultForToBeWaitSure extends Component {

    constructor(props) {
        super(props);
        // 得到上一级传过来的值，把值放进state中，this.state.xxx取值
        const params = this.props.navigation.state.params.productResult;
        console.log('-----params-----',params);
        this.state = {
            data: params,
            buttonTitle: '回单',
            buttonBgColor: StaticColor.COLOR_MAIN,
            buttonDisable: false,
            showGoodList: false,
            loading: false,
        };
        this.uploadReceipt = this.uploadReceipt.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        const current = this.props.routes[this.props.routes.length-1];
        if (this.props.navigation && this.props.routes.length > 1) {
            if (current.routeName === 'Scan') { // 上一个界面为扫描，发监听开启扫描动画
                DeviceEventEmitter.emit('startAni');
            }
        }
    }

    // 底部组件
    subBottomComponent(buttonStyle) {
        return (
            <TouchableOpacity
                disabled={this.state.buttonDisable}
                style={buttonStyle}
                onPress={() => {
                        this.uploadReceipt();
                    }}
            >
                <Text style={styles.text}>{this.state.buttonTitle}</Text>
            </TouchableOpacity>
        );
    }
    // 上传回单界面
    uploadReceipt() {
        this.props.navigation.navigate('UploadReceipt',{
            transCode: this.state.data.transCode
        });
    }

    showGoodInfoList(value) {
        this.setState({
            showGoodList: value,
        });
    }
    render() {
        const navigator = this.props.navigation;
        const result = this.state;
        const bgColor = this.state.buttonBgColor;
        const buttonStyle = {
            justifyContent: 'center',
            backgroundColor: bgColor,
            alignItems: 'center',
            height: 44,
            margin: 10,
            borderRadius: 5,
        };
        const ResultView = result.data ? <View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                <View style={{height: 2}} />
                <Text style={{fontSize: 17, marginHorizontal: 20,marginVertical: 10, fontWeight: 'bold'}}>
                    {result.data.deliveryInfo.receiveContact}
                </Text>
                <View style={styles.dividingLine} />
                <DetailsOrdersCell
                    ordersPayment={result.data.taskInfo.collectMoney}
                    ordersFreight={result.data.taskInfo.carrFee}
                    carrFeePayer={result.data.taskInfo.carrFeePayer}
                    paymentWay={result.data.taskInfo.paymentWay}
                    ifReceipt={result.data.taskInfo.isReceipt}
                    receiptStyle={result.data.taskInfo.receiptWay}
                    arrivalTime={result.data.taskInfo.committedArrivalTime}
                />
                <View style={styles.dividingLine} />
                <TitlesCell title="配送信息" />
                <View style={{height: 1, backgroundColor: '#F5F5F5', marginLeft: 20}}/>
                <DetailsUserCell
                    deliveryInfo={result.data.deliveryInfo}
                    onSelectAddr={() => {
                        if (result.data.deliveryInfo.departureAddress
                            && result.data.deliveryInfo.receiveAddress) {
                            this.props.navigation.navigate(
                                'BaiduMap',
                                {
                                    sendAddr: result.data.deliveryInfo.departureAddress,
                                    receiveAddr: result.data.deliveryInfo.receiveAddress,
                                    clickFlag: 'send',
                                },
                            );
                        }
                    }}
                    isShowContactAndPhone={true}
                />
                <DetailsRedUserCell
                    deliveryInfo={result.data.deliveryInfo}
                    onSelectAddr={() => {
                        if (result.data.deliveryInfo.receiveAddress
                            && result.data.deliveryInfo.departureAddress) {
                            this.props.navigation.navigate(
                                'BaiduMap',
                                {
                                    sendAddr: result.data.deliveryInfo.departureAddress,
                                    receiveAddr: result.data.deliveryInfo.receiveAddress,
                                    clickFlag: 'receiver',
                                },
                            );
                        }
                    }}
                    isShowContactAndPhone={true}
                />
                <View style={styles.dividingLine} />
                <TitlesCell title="货品信息" showArrowIcon={true} onPress={(value) => { this.showGoodInfoList(value); }} />
                {
                    this.state.showGoodList ? result.data.goodsInfo.map((item, index) => {
                        return (
                            <ProductShowItem
                                key={index}
                                orderInfo={item}
                                isLast={index === result.data.goodsInfo.length - 1}
                            />
                        );
                    }) : null
                }
                <View style={styles.dividingLine} />
                <TotalsItemCell
                    totalTons={result.data.weight}
                    totalSquare={result.data.vol}
                />
                <View style={styles.dividingLine} />

                <DetailsCell
                    transportNO_={result.data.transCode}
                    transportTime={result.data.time}
                />
            </ScrollView>
                <View style={styles.dividingLine} />

                { result.data.taskInfo.isReceipt === '是' ? this.subBottomComponent(buttonStyle) : null}

        </View> : <EmptyView />;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'订单详情'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                {ResultView}
                {this.state.loading ? <Loading /> : null}
            </View>
        );
    }

}

function mapStateToProps(state) {
    return {
        userInfo: state.user.get('userInfo'),
        routes: state.nav.routes,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(searchResultForToBeWaitSure);
