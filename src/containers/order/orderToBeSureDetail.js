/**
 * Created by mymac on 2017/4/13.
 */
import React, {Component} from 'react';

import {
    View,
    ScrollView,
    Dimensions,
    Platform,
    Text,

} from 'react-native';

import DetailsCell from '../../common/source/detailsCell';
import DetailsUserCell from '../../common/source/detailsUserCell';
import DetailsRedUserCell from '../../common/source/detailsRedUserCell';
import DetailsOrdersCell from '../../common/source/detailsOrdersCell';
import TitlesCell from '../../common/source/titlesCell';
import TotalsItemCell from '../../common/source/totalsItemCell';
import ProductShowItem from '../../common/source/OrderDetailProShowItemCell';
import * as StaticColor from '../../constants/staticColor';
import * as ConstValue from '../../constants/constValue';

const space = 10;
const topSpace = 10;
const topHeight = 40;
const bottomSpace = 10;

const screenWidth = Dimensions.get('window').width - space * 2;
const screenHeight = Dimensions.get('window').height;


export default class orderToBeSureDetail extends Component {

    constructor(props) {
        super(props);
        console.log('log', '');
        this.state = {
            showGoodList: false,
        };
    }
    showGoodInfoList(value) {
        this.setState({
            showGoodList: value,
        });
    }

    render() {
        const {deliveryInfo, goodsInfoList, taskInfo, time,
            transCode, vol, weight , signer, index} = this.props;
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
                        ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height - bottomSpace},
                        android:{height: screenHeight - topHeight - 73 - bottomSpace}
                    }),
                }}
            >

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        backgroundColor: 'white',
                        ...Platform.select({
                            ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height - bottomSpace},
                            android:{height: screenHeight - topHeight - 73 - bottomSpace}
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

                    <TitlesCell title="配送信息" />
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
            </View>
        );
    }
}

orderToBeSureDetail.propTypes = {
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
