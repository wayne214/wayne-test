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

import NavigationBar from '../../common/navigationBar/navigationBar';
import DetailsCell from '../../common/source/detailsCell';
import DetailsUserCell from '../../common/source/detailsUserCell';
import DetailsRedUserCell from '../../common/source/detailsRedUserCell';
import DetailsOrdersCell from '../../common/source/detailsOrdersCell';
import TitlesCell from '../../common/source/titlesCell';
import TotalsItemCell from '../../common/source/totalsItemCell';
import ProductShowItem from '../../common/source/OrderDetailProShowItemCell';

import * as API from '../../constants/api';
import HTTPRequest from '../../utils/httpRequest';
import LoadingView from '../../utils/loading';
import EmptyView from '../../common/emptyView/emptyView';

import * as StaticColor from '../../constants/staticColor';

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
                height: height - 64 - 54 - 10,
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

class SearchResultOnly extends Component {

    constructor(props) {
        super(props);
        // 得到上一级传过来的值，把值放进state中，this.state.xxx取值
        const params = this.props.navigation.state.params.productResult;

        this.state = {
            transCode: params,
            data: '',
            buttonTitle: '',
            buttonBgColor: StaticColor.COLOR_MAIN,
            buttonDisabled: false,
            showGoodList: false,
            showIsSign: true,
            loading: false,
        };
        this.getOrderDetaiInfo = this.getOrderDetaiInfo.bind(this);
        this.getOrderSuccessCallBack = this.getOrderSuccessCallBack.bind(this);
        this.getOrderFailCallBack = this.getOrderFailCallBack.bind(this);
    }

    componentDidMount() {
        this.getOrderDetaiInfo();
    }

    componentWillUnmount() {

    }

    getOrderDetaiInfo() {
        HTTPRequest({
            url: API.API_NEW_GET_GOODS_SOURCE,
            params: {
                transCodeList: [this.state.transCode],
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                this.getOrderSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
                this.getOrderFailCallBack();
            },
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
    }

    getOrderSuccessCallBack(result) {
        this.setState({
            data: result[0]
        });
        if (result[0].transOrderStatsu == 3) {
            this.setState({
                buttonTitle: '签收',
                showIsSign: true,
            })
        } else {
            this.setState({
                buttonTitle: '回单',
                showIsSign: false,
            })
        }
    }

    getOrderFailCallBack() {

    }

    // 底部组件
    subBottomComponent(buttonStyle, goodsInfoList, transCode, taskInfo) {
        return (
            <TouchableOpacity
                disabled={this.state.buttonDisabled}
                style={buttonStyle}
                onPress={() => {
                    if (this.state.buttonTitle == '签收') {
                        if (goodsInfoList.length > 0) {
                            this.props.navigation.navigate('SignPage', {
                                transCode: transCode,
                                goodsInfoList: goodsInfoList,
                                taskInfo: taskInfo
                            });
                        } else {
                            Alert.alert('提示', '货品信息为空，无法签收');
                        }
                    } else {
                        this.props.navigation.navigate('UploadReceipt',{
                            transCode: this.state.data.transCode,
                        });
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
        const hideBottom = result.data && result.data.taskInfo.isReceipt === '否' && this.state.buttonTitle === '回单';

        const ResultView = result.data ? <View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    ...Platform.select({
                        ios: {
                            height: hideBottom ? height - 64 - 10 : height - 64 - 54 - 10,
                        },
                        android: {
                            height: hideBottom ? height - 73 - 10 : height - 73 - 54 - 10,
                        },
                    }),
                }}
            >
                <View style={{height: 2}}/>
                <Text style={{fontSize: 17, marginHorizontal: 20, marginVertical: 10, fontWeight: 'bold'}}>
                    {result.data.deliveryInfo.receiveContact}
                </Text>
                <View style={styles.dividingLine}/>
                <DetailsOrdersCell
                    ordersPayment={result.data.taskInfo.collectMoney}
                    ordersFreight={result.data.taskInfo.carrFee}
                    carrFeePayer={result.data.taskInfo.carrFeePayer}
                    paymentWay={result.data.taskInfo.paymentWay}
                    ifReceipt={result.data.taskInfo.isReceipt}
                    receiptStyle={result.data.taskInfo.receiptWay}
                    arrivalTime={result.data.taskInfo.committedArrivalTime}
                />
                <View style={styles.dividingLine}/>
                <TitlesCell title="配送信息"/>
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
                <View style={styles.dividingLine}/>
                <TitlesCell title="货品信息" showArrowIcon={true} onPress={(value) => {
                    this.showGoodInfoList(value);
                }}/>
                {
                    this.state.showGoodList ? result.data.goodsInfo.map((item, index) => {
                        return (
                            <ProductShowItem
                                key={index}
                                orderInfo={item}
                                isSign={this.state.showIsSign}
                                isLast={index === result.data.goodsInfo.length - 1}
                            />
                        );
                    }) : null
                }
                <View style={styles.dividingLine}/>
                <TotalsItemCell
                    totalTons={result.data.weight}
                    totalSquare={result.data.vol}
                />
                <View style={styles.dividingLine}/>

                <DetailsCell
                    transportNO_={result.data.transCode}
                    transportTime={result.data.time}
                />
            </ScrollView>
            {
                hideBottom ? null : this.subBottomComponent(buttonStyle, result.data.goodsInfo, result.data.transCode, result.data.taskInfo)
            }
        </View> : <View style={{backgroundColor:'#f5f5f5'}}>
            <View style={{height: height, paddingTop: 40}}>
                <EmptyView />
            </View>
        </View>;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'订单详情'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                {ResultView}
                {this.state.loading ? <LoadingView showLoading={this.props.appLoading}/> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultOnly);
