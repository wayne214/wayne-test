import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
} from 'react-native';

import {
    COLOR_LIGHT_GRAY_TEXT,
    LIGHT_GRAY_TEXT_COLOR,
    LIGHT_BLACK_TEXT_COLOR,
    COLOR_VIEW_BACKGROUND,
} from '../../constants/staticColor';

import GoodInfoCell from './goodInfoCell';

const style = StyleSheet.create({
    // 名称style
    titleStyle: {
        fontSize: 15,
        color: COLOR_LIGHT_GRAY_TEXT,
        marginTop: 15,
        fontWeight: 'bold',
    },
    subTitleStyle: {
        fontSize: 15,
        color: COLOR_LIGHT_GRAY_TEXT,
    },
    subViewStyle: {
        flexDirection: 'row', // 确保水平布局
        justifyContent: 'space-between', // 确保水平布局间距一样
        marginTop: 15,
        marginRight: -20,
    },
    // 分隔线
    SeparationStyle: {
        backgroundColor: LIGHT_GRAY_TEXT_COLOR,
        height: 0.5,
        marginLeft: 20,
    },
    text: {
        justifyContent: 'center',
        fontSize: 15,
        color: COLOR_LIGHT_GRAY_TEXT,
        marginTop: 15,
    },
    shipText: {
        justifyContent: 'flex-start',
        fontSize: 15,
        color: COLOR_LIGHT_GRAY_TEXT,
    },
    containerView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    view: {
        height: 1,
        backgroundColor: COLOR_VIEW_BACKGROUND,
        marginLeft: 20,
    },
});

class OrderDetailProShowItemCell extends Component {

    showReason(orderInfo) {
        return (
            <View style={style.containerView}>
                <Text style={style.subTitleStyle}>拒签原因</Text>
                <Text style={{fontSize: 15, marginRight: -20, color: LIGHT_BLACK_TEXT_COLOR}}>{orderInfo.refuseReason ? orderInfo.refuseReason : '无'}</Text>
            </View>
        );
    }
    showLine() {
        return (
            <View style={{height: 0, backgroundColor: '#F5F5F5', marginTop: 10}} />
        );
    }
    // 子组件
    subComponent(orderInfo, isSign, isLast) {

        const showReason = isSign ? this.showLine(orderInfo) : this.showReason(orderInfo);
        const signView = isSign ? null :
            <GoodInfoCell title="签收" num={orderInfo.signNum} unit={orderInfo.arNums && orderInfo.arNums !== '' &&  orderInfo.arNums !== '0' ? orderInfo.goodsUnit : 'Kg'} />;
        const notSignView = isSign ? null :
            <GoodInfoCell
                title="拒收" num={orderInfo.refuseNum}
                unit={orderInfo.arNums && orderInfo.arNums !== '' &&  orderInfo.arNums !== '0' ? orderInfo.goodsUnit : 'Kg'}
                style={{width: 127}}
            />;
        const showSignView = isSign ? null : <View>
            <View style={{marginTop: 10}}>
                {signView}
            </View>
            <View style={{marginTop: 10}}>
                {notSignView}
            </View>
        </View> ;
        return (
            <View style={{marginRight:20}}>
                <View style={{marginHorizontal: 20}}>
                    <View style={style.subViewStyle}>
                        <Text style={style.subTitleStyle}>名称</Text>
                        <Text style={{fontSize: 15, color: LIGHT_BLACK_TEXT_COLOR, marginLeft: 20}}>{orderInfo.goodsName}</Text>
                    </View>
                    <View style={style.subViewStyle}>
                        <Text style={style.subTitleStyle}>规格</Text>
                        <Text style={{fontSize: 15, color: LIGHT_BLACK_TEXT_COLOR, marginLeft: 20}}>{orderInfo.goodsSpce}</Text>
                    </View>
                    <View style={{marginTop: 10}}>
                        {
                            orderInfo.arNums && orderInfo.arNums !== '' &&  orderInfo.arNums !== '0'?
                                <GoodInfoCell title="应收" num={orderInfo.arNums} unit={orderInfo.goodsUnit} /> :
                                <GoodInfoCell title="应收" num={orderInfo.weight} unit={'Kg'} />

                        }
                    </View>
                    <View style={{marginTop: 10}}>
                        {
                            orderInfo.arNums && orderInfo.arNums !== '' &&  orderInfo.arNums !== '0'?
                                <GoodInfoCell title="发运" num={orderInfo.shipmentNum} unit={orderInfo.goodsUnit} style={{width: 127}}/> :
                                <GoodInfoCell title="发运" num={orderInfo.shipmentNum} unit={'Kg'} style={{width: 127}}/>
                        }
                    </View>
                    {showSignView}
                    {showReason}
                </View>
                {isLast ? null : <View style={style.view}/>}
            </View>
        );
    }

    render() {
        const {orderInfo, isSign, isLast} = this.props;
        return (
            <View>
                {this.subComponent(orderInfo, isSign, isLast)}
            </View>
        );
    }
}

OrderDetailProShowItemCell.propTypes = {
    orderInfo: React.PropTypes.object.isRequired,
};

export default OrderDetailProShowItemCell;
