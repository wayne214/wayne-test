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
import Communications from 'react-native-communications';


const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    titleContainer: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        height: 46
    },
    subContainer: {
        paddingLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    contact: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    // 分割线
    separateLine: {
        height: 1,
        backgroundColor: '#e8e8e8',
        marginLeft: 20,
    },
    icon: {
        fontSize: 16,
        fontFamily: 'iconfont',
        color: '#1b82d2',
        alignSelf: 'center'
    },
    orderDetailText: {
        flexDirection: 'column',
        marginTop: 13,
        marginBottom: 13
    },
    orderDetailCell: {
        flexDirection: 'row',
        height: 24,
        marginLeft: 20,
        alignItems: 'center',
    },
    textSizeNum: {
        color: '#333333',
        fontSize: 14,
        width: 220,
    },
    textSizeWeight: {
        color: '#333333',
        fontSize: 14
    },
    orderDeatailAll: {
        width,
        marginRight: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9F9F9'
    },
});

class OrdersItemCell extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const {title, receiveAddress, contact, onSelect, phoneNum, transCodeList,ordersNum} = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    underlayColor={StaticColor.COLOR_SEPARATE_LINE}
                    onPress={() => {
                        onSelect();
                    }}
                >
                    <View>

                        <View style={{
                            width: width - 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginLeft: 20,
                            height: 40,
                        }}>
                            <Text style={{fontSize: 16, color: '#333333', fontWeight: 'bold',}}>{title}</Text>
                            <Text style={{fontSize: 14, color: '#999999', marginRight: 20}}>共{ordersNum}单</Text>
                        </View>
                        <View style={styles.separateLine}/>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                height:46,
                                paddingRight: 40,
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 3,
                                    borderWidth: 1,
                                    marginLeft: 20,
                                    width: 18,
                                    height: 18,
                                    borderColor: '#ff7e23',
                                    backgroundColor: '#ff7e23',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color: 'white',
                                        fontWeight: 'bold',
                                    }}
                                >终</Text>
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
                                    marginLeft: 10,
                                    marginRight: 10,
                                }}
                            >
                                {receiveAddress}
                            </Text>
                        </View>

                        <View style={styles.orderDeatailAll}>
                            <View style={styles.orderDetailText}>
                                <View style={styles.orderDetailCell}>
                                    <Text style={styles.textSizeNum}>单号：{transCodeList[0].customerOrderCode ? transCodeList[0].customerOrderCode : transCodeList[0].transCode}</Text>
                                    {
                                        transCodeList[0].weight ?
                                            <Text
                                                style={styles.textSizeWeight}>  {transCodeList[0].weight}Kg</Text>
                                            :
                                            <Text
                                                style={styles.textSizeWeight}>  {transCodeList[0].weight}</Text>

                                    }
                                </View>
                            </View>
                        </View>


                        <View style={styles.subContainer}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
                                    paddingTop: 15,
                                    paddingBottom: 15,
                                }}>联系人: {contact}</Text>
                            <TouchableOpacity
                                style={{
                                    padding: 15,
                                }}
                                onPress={() => {
                                    Communications.phonecall(phoneNum, true);
                                }}
                            >
                                <Text style={styles.icon}>&#xe666;</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{height: 10, backgroundColor: '#F5F5F5'}} />
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
    transCodeList: React.PropTypes.array,
    ordersNum: React.PropTypes.number,
};

export default OrdersItemCell;
