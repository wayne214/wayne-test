/**
 * Created by mymac on 2017/4/13.
 */
import React, {Component} from 'react';

import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    DeviceEventEmitter,
    Platform,

} from 'react-native';

import DetailsCell from '../../common/source/detailsCell';
import DetailsUserCell from '../../common/source/detailsUserCell';
import DetailsRedUserCell from '../../common/source/detailsRedUserCell';
// import DetailsOrdersCell from '../../components/source/detailOrderOtherTypeCell';
import DetailsOrdersCell from '../../common/source/detailsOrdersCell';

import TitlesCell from '../../common/source/titlesCell';
import TotalsItemCell from '../../common/source/totalsItemCell';
import ProductShowItem from '../../common/source/OrderDetailProShowItemCell';
import * as StaticColor from '../../constants/staticColor';
import * as ConstValue from '../../constants/constValue';
const space = 10;
const topSpace = 10;
const topHeight = 40;


const screenWidth = Dimensions.get('window').width - space * 2;
const screenHeight = Dimensions.get('window').height;

export default class orderToBeSignInDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonTitle: '签收',
            buttonBgColor: '#1B82D1',
            buttonDisabled: false,
            showGoodList: false,
        };
        this.subBottomComponent = this.subBottomComponent.bind(this);
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    // 底部组件
    subBottomComponent(buttonStyle) {
        return (
            <TouchableOpacity
                disabled={this.state.buttonDisabled}
                style={buttonStyle}
                onPress={() => {
                    this.props.signIn();
                }}
            >
                <Text style={{color: StaticColor.WHITE_COLOR, fontSize: 16}}>
                    {this.state.buttonTitle}
                </Text>
            </TouchableOpacity>
        );
    }
    showGoodInfoList(value) {
        this.setState({
            showGoodList: value,
        });
    }
    render() {
        this.listener = DeviceEventEmitter.addListener('changeState', () => {
            this.setState({
                buttonBgColor: '#999999',
                buttonDisabled: true,
            });
        });

        const {deliveryInfo, goodsInfoList, taskInfo, time, transCode,
            vol, weight, index} = this.props;
        const bgColor = this.state.buttonBgColor;
        const buttonStyle = {
            justifyContent: 'center',
            backgroundColor: bgColor,
            alignItems: 'center',
            height: 44,
            marginTop: 10,
            marginBottom: 10,
            marginRight: 5,
            marginLeft: 5,
            borderRadius: 5,
        };

        return (
            <View
                style={{
                    backgroundColor: '#f5f5f5',
                    width: screenWidth,
                    marginLeft: space,
                    marginRight: space,
                    overflow: 'hidden',
                    marginTop: topSpace,
                    ...Platform.select({
                            ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height},
                            android:{height: screenHeight - topHeight - 73}
                    })
                }}
            >

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        backgroundColor: 'white',
                        ...Platform.select({
                            ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height},
                            android:{height: screenHeight - topHeight - 73}
                        }),
                        borderColor: 'white',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}
                >
                    <Text style={{fontSize: 17, marginHorizontal: 20,marginVertical: 10, fontWeight: 'bold'}}>
                        {deliveryInfo.receiveContact}
                    </Text>
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />

                    <DetailsOrdersCell
                        ordersPayment={taskInfo.collectMoney}
                        ordersFreight={taskInfo.carrFee}
                        carrFeePayer={taskInfo.carrFeePayer}
                        paymentWay={taskInfo.paymentWay}
                        ifReceipt={taskInfo.isReceipt}
                        receiptStyle={taskInfo.receiptWay}
                        arrivalTime={taskInfo.committedArrivalTime}
                    />

                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />

                    <TitlesCell title="配送信息"/>
                    <View style={{height: 1, backgroundColor: '#F5F5F5', marginLeft: 20}}/>
                    <DetailsUserCell
                        deliveryInfo={deliveryInfo}
                        onSelectAddr={() => {
                            this.props.addressMapSelect(index, 'departure');
                        }}
                        isShowContactAndPhone={true}
                    />

                    <DetailsRedUserCell
                        deliveryInfo={deliveryInfo}
                        onSelectAddr={() => {
                            this.props.addressMapSelect(index, 'receive');
                        }}
                        isShowContactAndPhone={true}
                    />
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />
                    <TitlesCell title="货品信息" showArrowIcon={true} onPress={(value) => { this.showGoodInfoList(value); }}/>
                    {
                        this.state.showGoodList ? goodsInfoList.map((item, indexRow) => {
                                return (
                                    <ProductShowItem
                                        key={indexRow}
                                        orderInfo={item}
                                        isSign={true}
                                        isLast={indexRow === goodsInfoList.length - 1}
                                    />
                                );
                            }) : null
                    }

                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />

                    <TotalsItemCell totalTons={weight} totalSquare={vol} />
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />

                    <DetailsCell transportNO_={transCode} transportTime={time} />

                </ScrollView>
                {this.subBottomComponent(buttonStyle)}

            </View>
        );
    }
}

orderToBeSignInDetail.propTypes = {
    signIn: React.PropTypes.func,
    index: React.PropTypes.number,
    deliveryInfo: React.PropTypes.object,
    transCode: React.PropTypes.string,
    vol: React.PropTypes.number,
    weight: React.PropTypes.number,
    taskInfo: React.PropTypes.object,
    time: React.PropTypes.string,
    goodsInfoList: React.PropTypes.array,
    addressMapSelect: React.PropTypes.func,
};
