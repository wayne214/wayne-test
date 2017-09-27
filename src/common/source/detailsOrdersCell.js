/*
 * @author:  wangl
 * @description:  货源详情 运货单界面
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

import * as StaticColor from '../../constants/staticColor';
import TaskInfoCell from '../../containers/goodSource/component/taskInfoCell';

const styles = StyleSheet.create({
    // itemTitle: {
    //     fontSize: 15,
    //     color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
    // },
    // item: {
    //     fontSize: 15,
    //     color: '#FF6600',
    // },
    container: {
        height: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
        marginBottom: 10,
    },
    priceStyle: {
        fontSize: 15,
        color: '#FF6600',
    },
});
class DetailsOrdersCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersPayment: '',
            ordersFreight: '',
            carrFeePayer: '',
            paymentWay: '',
            ifReceipt: '',
            receiptStyle: '',
            arrivalTime: '',
        };
    }

    render() {
        const {ordersPayment, ordersFreight, carrFeePayer, paymentWay, ifReceipt, receiptStyle, arrivalTime} = this.props;
        const freightView = (carrFeePayer === '收货方' && paymentWay === '现金') ?
            <TaskInfoCell itemName="代收运费" content={`${ordersFreight}元`} contentColorStyle={styles.priceStyle}/>
            : null;
        const goodsView = ordersPayment > 0 ?
            <TaskInfoCell itemName="代收货款" content={`${ordersPayment}元`} contentColorStyle={styles.priceStyle}/>
            : null;
        const timeView = arrivalTime !== '' ? <TaskInfoCell itemName="要求到达时间" content={arrivalTime} />
            : null;
        const payView = carrFeePayer === '收货方' ? <TaskInfoCell itemName="是否需要代收款项" content='需要' />
            : <TaskInfoCell itemName="是否需要代收款项" content='不需要' />;
        const payWayView = carrFeePayer === '收货方' ? <TaskInfoCell itemName="支付方式" content={paymentWay} />
            : null;
        const huiWayView = ifReceipt === '是' ? <View>
                <TaskInfoCell itemName="签单返回" content={ifReceipt} />
                <TaskInfoCell itemName="回单方式" content={receiptStyle} />
            </View> : <View>
                <TaskInfoCell itemName="签单返回" content={ifReceipt} />
            </View>;

        return (
            <View style={{backgroundColor: StaticColor.WHITE_COLOR, paddingLeft: 20}}>

                <Text style={{fontSize: 16, color:'#333', marginBottom: 15, marginTop: 15}}>任务信息</Text>

                <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />

                <View style={{paddingTop: 15, paddingRight: 20}}>
                    {goodsView}
                    {freightView}
                    {payView}
                    {payWayView}
                    {huiWayView}
                    {timeView}
                </View>
            </View>
        );
    }
}


DetailsOrdersCell.propTypes = {
    ordersPayment: React.PropTypes.number,
    ordersFreight: React.PropTypes.number,
    carrFeePayer: React.PropTypes.string,
    paymentWay: React.PropTypes.string,
    ifReceipt: React.PropTypes.string,
    receiptStyle: React.PropTypes.string,
    arrivalTime: React.PropTypes.string,
};

export default DetailsOrdersCell;