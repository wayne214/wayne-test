/**
 * Created by xizhixin on 2017/5/8.
 * 待签收页面
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
    StyleSheet,
    Platform,
    InteractionManager,
    Alert,
} from 'react-native';

import * as StaticColor from '../../../constants/staticColor';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import DetailsCell from '../../../common/source/detailsCell';
import DetailsUserCell from '../../../common/source/detailsUserCell';
import DetailsOrdersCell from '../../../common/source/detailsOrdersCell';
import TitlesCell from '../../../common/source/titlesCell';
import TotalsItemCell from '../../../common/source/totalsItemCell';
import ProductShowItem from '../../../common/source/OrderDetailProShowItemCell';
import DetailsRedUserCell from '../../../common/source/detailsRedUserCell';
import * as ConstValue from '../../../constants/constValue';


import Loading from '../../../utils/loading';
import EmptyView from "../../../common/emptyView/emptyView";


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
                height: height - ConstValue.NavigationBar_StatusBar_Height - 54 - 10,
            },
            android: {
                height: height - 73 - 54 - 10,
            },
        }),
    },
    text: {
        color: StaticColor.WHITE_COLOR,
        fontSize: 16,
    },
});

class searchResultForToBeSignIn extends Component {

    constructor(props) {
        super(props);
        // 得到上一级传过来的值，把值放进state中，this.state.xxx取值
        const params = this.props.navigation.state().params.productResult;

        this.state = {
            data: params,
            buttonTitle: '签收',
            buttonBgColor: StaticColor.BLUE_CONTACT_COLOR,
            buttonDisabled: false,
            showGoodList: false,
            loading: false,
        };
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
    subBottomComponent(buttonStyle, goodsInfoList, transCode, taskInfo) {
        return (
            <TouchableOpacity
                disabled={this.state.buttonDisabled}
                style={buttonStyle}
                onPress={() => {
                        if (goodsInfoList.length > 0) {
                            this.props.navigation.navigate('SignPage', {
                                transCode: transCode,
                                goodsInfoList: goodsInfoList,
                                taskInfo: taskInfo
                            });
                        } else {
                            Alert.alert('提示', '货品信息为空，无法签收');
                        }
                    }}
            >
                <Text style={styles.text}>{this.state.buttonTitle}</Text>
            </TouchableOpacity>
        );
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
                        if (result.data.deliveryInfo.departureAddress
                            && result.data.deliveryInfo.receiveAddress) {
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
                <TitlesCell title="货品信息" showArrowIcon={true} onPress={(value) => { this.showGoodInfoList(value); }}/>
                {
                    this.state.showGoodList ? result.data.goodsInfo.map((item, index) => {
                        return (
                            <ProductShowItem
                                key={index}
                                orderInfo={item}
                                isSign={true}
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
            {this.subBottomComponent(buttonStyle,result.data.goodsInfo,result.data.transCode, result.data.taskInfo)}
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
        routes: state.nav.routes,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(searchResultForToBeSignIn);
