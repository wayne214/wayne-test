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


const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    main: {
        paddingLeft: 20,
    },
    times: {
        fontSize: 16,
        marginBottom: 5,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    times2: {
        fontSize: 15,
        marginBottom: 5,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    title: {
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 15,
    },
    margin: {
        fontSize: 15,
        color: StaticColor.GRAY_TEXT_COLOR,
        lineHeight: 20,
    },
    iconfont: {
        fontFamily: 'iconfont',
        fontSize: 16,
        color: StaticColor.GRAY_TEXT_COLOR,
        lineHeight: 20,
    },
    orderStyle: {
        fontSize: 13,
        color: StaticColor.GRAY_TEXT_COLOR,
        flex: 1,
    },
    imageStyle: {
        marginLeft: width - 50,
        position: 'absolute',
        marginTop: 5,
    },
    bottom: {
        height: 44,
        justifyContent: 'center',
        // fontSize: 14,
    },
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
        const {time, scheduleCode, distributionPoint, arrivalTime, weight, vol, onSelect, dispatchStatus, stateName, orderStatus} = this.props;

        const statusView = stateName && stateName == '已完成' ?
            <Text style={[styles.times2, {marginTop: 30, marginRight: 10, color: '#999999', textAlign: 'right'}]}>{stateName}</Text> :
            <Text style={[styles.times2, {marginTop: 30, marginRight: 10, color: '#1b82d1', textAlign: 'right'}]}>{stateName}</Text>;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    underlayColor={StaticColor.COLOR_SEPARATE_LINE}
                    onPress={() => {
                        onSelect();
                    }}
                >
                    <View style={styles.main}>
                        <View style={styles.title}>
                            <View style={{flex: 5}}>
                                <Text style={styles.times}>{time}</Text>
                                <Text style={styles.orderStyle}>{scheduleCode}</Text>
                            </View>

                            <View style={{flex: 3}}>
                                {orderStatus === 0 ? statusView : null}
                            </View>
                        </View>

                        <View style={{height: 1, backgroundColor: '#e8e8e8'}}/>

                        <View style={{marginTop: 15, marginBottom: 10, flex: 5}}>
                            <Text style={styles.times2}>配送点：{distributionPoint}个</Text>
                            <Text style={styles.times2}>到仓时间：{arrivalTime}</Text>
                            <Text style={styles.times2}>货品总计：{weight}Kg {vol}方</Text>
                        </View>

                    </View>

                </TouchableOpacity>
            </View>
        );
    }
}
OrdersItemCell.propTypes = {
    time: React.PropTypes.string,
    scheduleCode: React.PropTypes.string,
    distributionPoint: React.PropTypes.number,
    arrivalTime: React.PropTypes.string,
    weight: React.PropTypes.number,
    vol: React.PropTypes.number,
    onSelect: React.PropTypes.func,
};

export default OrdersItemCell;
