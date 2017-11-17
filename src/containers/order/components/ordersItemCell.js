/**
 * @author:  wangl
 * 订单列表中全部、待发运、待回单item
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    Image,
} from 'react-native';

import * as StaticColor from '../../../constants/staticColor';
import GoodKindUtil from '../../../utils/goodKindUtil';
import CommonLabelCell from '../../../common/commonLabelCell';
import OrderStateNumView from './orderStateNumView';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: StaticColor.WHITE_COLOR,
        borderBottomColor: StaticColor.COLOR_SEPARATE_LINE,
    },
    timeText: {
        fontSize: 14,
        color: StaticColor.GRAY_TEXT_COLOR,
        marginTop: 8,
    },
    transCodeText: {
        fontSize: 14,
        color: StaticColor.GRAY_TEXT_COLOR,
    },
    arriveAndGoodsText: {
        fontSize: 16,
        color: StaticColor.READ_NUMBER_COLOR,
    },
    separateLine: {
        height: 0.5,
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
        marginLeft: 10,
    },
    cellStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rejectImg: {
        position: 'absolute',
        marginTop: 10,
        marginLeft: width - 100,
        alignItems: 'flex-end',
    },
    rightArrow: {
        height: 15,
        width: 8,
        marginRight: 20,
    },
    goodsTotal: {
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 8,
    },
    content: {
        paddingLeft: 10,
        paddingTop: 15,
        paddingBottom: 5,
    },
    title: {
        flexDirection: 'row',
    },
    text: {
        padding: 10,
    },
    rightContainer: {
        paddingTop: 20,
        flex: 1,
        marginLeft: 20
    },
    itemFlag: {
        position: 'absolute',
        top: 0,
        right: 10,
    },
    itemFlagText: {
        position: 'absolute',
        color: StaticColor.WHITE_COLOR,
        backgroundColor: 'transparent',
        top: 14,
        right: 2,
        fontSize: 16,
        fontWeight: 'bold',
        transform: [{rotateZ: '45deg'}],
    },
    goodKindStyle: {
        marginLeft: 10,
        marginTop: 20,
    },
    dispatchLineStyle: {
        fontSize: 17,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    arriveTimeStyle: {
        fontSize: 12,
        color: StaticColor.GRAY_TEXT_COLOR,
    },
    stateText: {
        fontSize: 14,
        color: StaticColor.BLUE_TEXT_COLOR,
        textAlign: 'right',
    },
    stateView: {
        flex: 1,
        marginRight: 10,
        marginTop: 3,
    },
    orderNumView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    wrapView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    centerView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    flexDirection: {
        flexDirection: 'row',
    },
    flex: {
        flex: 1,
    }
});

class OrdersItemCell extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showStatus: this.props.orderStatus,
        };
    }

    render() {
        const {
            time,
            scheduleCode,
            distributionPoint,
            arrivalTime,
            weight,
            vol,
            onSelect,
            dispatchStatus,
            stateName,
            orderStatus,
            goodKindsNames,
            scheduleRoutes,
            waitBeSureOrderNum,
            beSureOrderNum,
            transCodeNum
        } = this.props;
        const goodIcon = goodKindsNames && goodKindsNames.length === 1 ? goodKindsNames[0] : '其他';
        const statusView = <Text style={styles.stateText}>{stateName}</Text>;
        const orderNumView = <View style={styles.orderNumView}>
            <OrderStateNumView
                fontText={'待回'}
                num={waitBeSureOrderNum}
                unit={'单'}
            />
            <OrderStateNumView
                style={{marginLeft: 5}}
                fontText={'已回'}
                num={beSureOrderNum}
                unit={'单'}
            />
        </View>;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        onSelect();
                    }}
                    underlayColor={StaticColor.COLOR_SEPARATE_LINE}
                >
                    <View>
                        <View style={styles.title}>
                            <View style={styles.goodKindStyle}>
                                {
                                    GoodKindUtil.show(goodIcon)
                                }
                            </View>
                            <View style={styles.rightContainer}>
                                <View style={styles.flexDirection}>
                                    <View style={styles.flex}>
                                        <Text
                                            style={styles.dispatchLineStyle}
                                            numberOfLines={2}
                                        >
                                            {scheduleRoutes ? scheduleRoutes : ''}
                                        </Text>
                                    </View>
                                    <View style={styles.stateView}>
                                        {orderStatus === 0 ? statusView : null}
                                        {orderStatus === 3 ? orderNumView : null}
                                    </View>
                                </View>
                                <Text style={[styles.arriveTimeStyle, {marginTop: 8}]}>到仓时间: {arrivalTime}</Text>
                                <View style={styles.wrapView}>
                                    {
                                        goodKindsNames.map((item, index) => {
                                            return (
                                                <CommonLabelCell
                                                    content={item}
                                                    key={index}
                                                />
                                            )
                                        })
                                    }
                                    <CommonLabelCell
                                        content={`订单${transCodeNum}单`}
                                        containerStyle={{backgroundColor: StaticColor.BLUE_ORDER_NUMBER_COLOR}}
                                        textStyle={{color: StaticColor.BLUE_ORDER_TEXT_COLOR}}
                                    />
                                    <CommonLabelCell
                                        content={`配送点${distributionPoint}`}
                                        containerStyle={{backgroundColor: StaticColor.GREEN_POINTER_COLOR}}
                                        textStyle={{color: StaticColor.GREEN_POINTER_TEXT_COLOR}}
                                    />
                                </View>
                                <View style={styles.goodsTotal}>
                                    <View style={styles.flexDirection}>
                                        <Text style={[styles.arriveAndGoodsText]}>{weight}</Text>
                                        <Text style={[styles.arriveAndGoodsText, {color: StaticColor.READ_UNIT_COLOR, fontSize: 14, marginTop: 2}]}>Kg</Text>
                                    </View>
                                    <View style={styles.centerView}>
                                        <Text style={[styles.arriveAndGoodsText, {marginLeft: 10}]}>{vol}</Text>
                                        <Text style={[styles.arriveAndGoodsText, {color: StaticColor.READ_UNIT_COLOR, fontSize: 14, marginTop: 2}]}>方</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.separateLine} />
                        <View style={styles.text}>
                            <Text style={styles.transCodeText}>调度单号：{scheduleCode}</Text>
                            <Text style={styles.timeText}>调度时间：{time}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default OrdersItemCell;
