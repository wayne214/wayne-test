/**
 * @author:  xizhixin
 * @description: 待签收列表item
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    Image,
    Alert,
} from 'react-native';

import * as StaticColor from '../../../constants/staticColor';
import StaticImage from '../../../constants/staticImage';
import Communications from 'react-native-communications';
import OrderStateNumView from './orderStateNumView';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    subContainer: {
        paddingLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    contactView:{
        fontSize: 15,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        paddingTop: 15,
        paddingBottom: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    // 分割线
    separateLine: {
        height: 1,
        backgroundColor: '#e8e8e8',
        marginLeft: 20,
    },
    contactText: {
        fontSize: 14,
        color: StaticColor.BLUE_TEXT_COLOR,
        alignSelf: 'center',
        marginLeft: 3,
    },
    orderDetailText: {
        flexDirection: 'column',
        marginTop: 13,
        marginBottom: 13
    },
    orderDetailCell: {
        flexDirection: 'row',
        height: 24,
        marginLeft: 15,
        alignItems: 'center',
    },
    textSizeNum: {
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 14,
    },
    textSizeWeight: {
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 14,
        marginLeft: 35,
    },
    orderDeatailAll: {
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FAFAFA',
    },
    orderNumView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10,
        paddingTop: 13,
        paddingBottom: 13,
    },
    titleIcon:{
        fontFamily: 'iconfont',
        color: '#A0A0A0',
        fontSize: 18,
        alignSelf: 'center',
    },
    titleText: {
        fontSize: 18,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        alignSelf: 'center',
        marginLeft: 8,
    },
    flexDirection: {
        flexDirection: 'row',
    },
    addressView: {
        flexDirection: 'row',
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 10,
        paddingLeft: 11,
    },
    addressText: {
        fontSize: 14,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        marginLeft: 10,
        marginRight: 15,
        lineHeight: 21,
    },
    divideLine: {
        height: 10,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    batchSignView: {
        borderRadius: 15,
        borderColor: StaticColor.GRAY_TEXT_COLOR,
        borderWidth: 0.5,
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 14,
        paddingRight: 14,
        height: 30,
    },
    batchSignContainer: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingRight: 10,
        alignItems: 'flex-end',
    },
    arrowStyle:{
        height: 45,
        justifyContent: 'center',
        paddingLeft: 15,
    }
});

class OrdersItemCell extends Component {

    static propTypes = {
        style: View.propTypes.style,
        receiveContact: React.PropTypes.string,
        receiveAddress: React.PropTypes.string,
        receiveContactName: React.PropTypes.string,
        ordersNum: React.PropTypes.number,
        phoneNum: React.PropTypes.string,
        transCodeList: React.PropTypes.array,
        onSelect: React.PropTypes.func,
        onButton: React.PropTypes.func,
        isBatchSign: React.PropTypes.bool,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isUnfolded: this.props.isBatchSign,
        };
    }

    renderList(list) {
        return list.map((item, i) => this.renderItem(item, i));
    }

    renderItem(item, i) {
        console.log('item.customerOrderCode',item.customerOrderCode);
        console.log('item.transCode',item.transCode);
        return (
            <View key={i}>
                <View style={styles.orderDetailCell}>
                    <Text
                        style={styles.textSizeNum}>单号：{item.customerOrderCode ? item.customerOrderCode : item.transCode}</Text>
                    {
                        item.weight ?
                            <Text style={styles.textSizeWeight}>{item.weight}Kg</Text> :
                            <Text style={styles.textSizeWeight}>{item.weight}</Text>
                    }
                </View>
            </View>
        );
    }

    render() {
        const {
            receiveContact,
            receiveAddress,
            receiveContactName,
            onSelect,
            phoneNum,
            transCodeList,
            ordersNum,
            isBatchSign,
            onButton,
            orderSignNum
        } = this.props;
        let transport = transCodeList[0];
        let transport1;
        if(ordersNum > 1){
            transport1 = transCodeList[1];
            console.log('transport1',transport1);
            console.log('transport1.customerOrderCode',transport1.customerOrderCode);
            console.log('transport1.transCode',transport1.transCode);
        }
        console.log('transport',transport);
        console.log('transport.customerOrderCode',transport.customerOrderCode);
        console.log('transport.transCode',transport.transCode);
        const batchSignView = <View>
                <View style={styles.separateLine}/>
                <View style={styles.batchSignContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert('您确认要批量签收吗？', '如果批量签收则不能做异常签收',
                                [
                                    {
                                        text: '取消',
                                        onPress: () => {},
                                    },
                                    {
                                        text: '确认',
                                        onPress: () => {
                                            onButton();
                                        },
                                    },
                                ], {cancelable: false});
                        }}
                    >
                        <View style={styles.batchSignView}>
                            <Text style={styles.textSizeNum}>批量签收</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>;
        const transOrderView = <View style={styles.orderDeatailAll}>
            <View style={styles.orderDetailText}>
                <View style={styles.orderDetailCell}>
                    <Text style={styles.textSizeNum}>单号：{transport.customerOrderCode ? transport.customerOrderCode : transport.transCode}</Text>
                    {
                        transport.weight ?
                            <Text style={styles.textSizeWeight}>{transport.weight}Kg</Text> :
                            <Text style={styles.textSizeWeight}>{transport.weight}</Text>

                    }
                </View>
            </View>
        </View>;
        const transOrderViews = this.state.isUnfolded ?
            <View style={styles.orderDeatailAll}>
                <View style={styles.orderDetailText}>
                    <View style={styles.orderDetailCell}>
                        <Text style={styles.textSizeNum}>单号：{transport.customerOrderCode ? transport.customerOrderCode : transport.transCode}</Text>
                        {
                            transport.weight ?
                                <Text style={styles.textSizeWeight}>{transport.weight}Kg</Text> :
                                <Text style={styles.textSizeWeight}>{transport.weight}</Text>

                        }
                    </View>
                    <View style={styles.orderDetailCell}>
                        <Text style={styles.textSizeNum}>单号：{transport1.customerOrderCode ? transport1.customerOrderCode : transport1.transCode}</Text>
                        {
                            transport1.weight ?
                                <Text style={styles.textSizeWeight}>{transport1.weight}Kg</Text> :
                                <Text style={styles.textSizeWeight}>{transport1.weight}</Text>
                        }
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.arrowStyle}
                    onPress={() => {
                        this.setState({
                            isUnfolded: false
                        });
                        console.log('this.state', this.state.isUnfolded)
                    }}>
                    <Image source={StaticImage.receiveBottomArrow} />
                </TouchableOpacity>
            </View> : <View style={styles.orderDeatailAll}>
                <View style={styles.orderDetailText}>
                    {this.renderList(transCodeList)}
                </View>
                <TouchableOpacity
                    style={styles.arrowStyle}
                    onPress={() => {
                        this.setState({
                            isUnfolded: true
                        });
                        console.log('this.state', this.state.isUnfolded)
                    }}>
                    <Image source={StaticImage.upArrow} />
                </TouchableOpacity>
            </View>;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    underlayColor={StaticColor.COLOR_SEPARATE_LINE}
                    onPress={() => {
                        onSelect();
                    }}
                >
                    <View>
                        <View style={styles.titleView}>
                            <View style={styles.flexDirection}>
                                <Text style={styles.titleIcon}>&#xe66d;</Text>
                                <Text style={styles.titleText}>{receiveContact}</Text>
                            </View>
                            <View style={styles.orderNumView}>
                                <OrderStateNumView
                                    fontText={'共'}
                                    num={ordersNum}
                                    unit={'单'}
                                />
                                <OrderStateNumView
                                    style={{marginLeft: 5}}
                                    fontText={'已签'}
                                    num={orderSignNum}
                                    unit={'单'}
                                />
                            </View>
                        </View>
                        <View style={styles.separateLine}/>
                        <View style={styles.addressView}>
                            <Image source={StaticImage.locationRedIcon}/>
                            <Text style={styles.addressText}>
                                {receiveAddress}
                            </Text>
                        </View>
                        {ordersNum > 1 ? transOrderViews : transOrderView}
                        <View style={styles.subContainer}>
                            <Text style={styles.contactView}>联系人: {receiveContactName}</Text>
                            <TouchableOpacity
                                style={{
                                    paddingTop: 15,
                                    paddingBottom: 15,
                                }}
                                onPress={() => {
                                    Communications.phonecall(phoneNum, true);
                                }}
                            >
                                <View style={styles.flexDirection}>
                                    <Image source={StaticImage.Contact}/>
                                    <Text style={styles.contactText}>联系对方</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {isBatchSign ? batchSignView : null}
                </TouchableOpacity>
                <View style={styles.divideLine} />
            </View>
        );
    }
}

export default OrdersItemCell;
