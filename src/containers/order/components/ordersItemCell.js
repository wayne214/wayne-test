/*
 * @author:  wangl
 * @description:  货源详情 运货单界面
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


const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
        // marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
        borderBottomColor: '#d9d9d9'
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
        color: '#FA5741',
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
    icon: {
        fontFamily: 'iconfont',
        fontSize: 16,
        color: StaticColor.CALENDER_ICON_COLOR,
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
        flex: 3,
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
        marginTop: 23,
    }
});

class OrdersItemCell extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
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
            dispatchLine,
            goodKindsNames
        } = this.props;
        const goodIcon = goodKindsNames && goodKindsNames.length === 1 ? goodKindsNames[0] : '其他';

        const statusView = <Text style={styles.stateText}>{stateName}</Text>;

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
                                <Text style={styles.dispatchLineStyle}>{dispatchLine ? dispatchLine : '北京-天津-上海-苏州-南京-广州-海南'}</Text>

                                <Text style={[styles.arriveTimeStyle, {marginTop: 8}]}>到仓时间: {arrivalTime}</Text>
                                <View style={{flexDirection: 'row', flexWrap: 'wrap',}}>
                                    {
                                        goodKindsNames.map((item, index) => {
                                            return (
                                                <CommonLabelCell content={item}/>
                                            )
                                        })
                                    }
                                    <CommonLabelCell content={'订单1单'} containerStyle={{backgroundColor: '#E6F2FF'}} textStyle={{color: '#59ABFD'}}/>
                                    <CommonLabelCell content={`配送点${distributionPoint}`} containerStyle={{backgroundColor: '#E1F5ED'}} textStyle={{color: '#33BE85'}}/>
                                </View>
                                <View style={styles.goodsTotal}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={[styles.arriveAndGoodsText]}>{weight}</Text>
                                        <Text style={[styles.arriveAndGoodsText, {color: '#2A2A2A', fontSize: 14, marginTop: 2}]}>Kg</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                        <Text style={[styles.arriveAndGoodsText, {marginLeft: 10}]}>{vol}</Text>
                                        <Text style={[styles.arriveAndGoodsText, {color: '#2A2A2A', fontSize: 14, marginTop: 2}]}>方</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.stateView}>
                                {orderStatus === 0 ? statusView : null}
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
