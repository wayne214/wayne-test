/*
 * @author:  wangl
 * @description:  货源详情 运货单界面
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image,
    ListView,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import Button from 'apsl-react-native-button';
import arrow from '../../../../assets/order/receive_bottom_arrow.png';
import upArrow from '../../../../assets/order/upArrow.png';
import * as StaticColor from '../../../constants/staticColor';
import Communications from 'react-native-communications';

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#ffffff',
    },
    orderDeatailAll: {
        width,
        marginRight: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9F9F9',
    },
    orderDetailText: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
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
        fontSize: 14,
    }

});

class GoodBatchCell extends Component {
    static propTypes = {
        style: View.propTypes.style,
        receiveContact: React.PropTypes.string,
        receiveAddress: React.PropTypes.string,
        receiveContactName: React.PropTypes.string,
        ordersNum: React.PropTypes.number,
        phoneNum: React.PropTypes.string,
        transCodeList: React.PropTypes.array,
        isDisabled: React.PropTypes.bool,
        onSelect: React.PropTypes.func,
        onButton: React.PropTypes.func,
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = ({
            isUnfolded: true,
        })
    }

    componentDidMount() {

    }

    renderList(list) {
        return list.map((item, i) => this.renderItem(item, i));
    }

    renderItem(item, i) {
        return (
            <View key={i}>
                <View style={styles.orderDetailCell}>
                    <Text
                        style={styles.textSizeNum}>单号：{item.customerOrderCode ? item.customerOrderCode : item.transCode}</Text>
                    {
                        item.weight ?
                            <Text style={styles.textSizeWeight}>  {item.weight}Kg</Text>
                            :
                            <Text style={styles.textSizeWeight}>  {item.weight}</Text>
                    }
                </View>
            </View>
        );
    }

    render() {
        const {receiveContact, receiveAddress, receiveContactName, ordersNum, transCodeList, onSelect, onButton, phoneNum, isDisabled} = this.props;

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
                            <Text style={{fontSize: 16, color: '#333333', fontWeight: 'bold',}}>{receiveContact}</Text>
                            <Text style={{fontSize: 14, color: '#999999', marginRight: 20}}>共{ordersNum}单</Text>
                        </View>
                        <View style={{height: 1, width, backgroundColor: '#e8e8e8', marginLeft: 20}}/>
                        <View style={{
                            flexDirection: 'row',
                            height: 40,
                            alignItems: 'center',
                        }}>
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
                            <Text style={{
                                color: '#666666',
                                marginLeft: 10,
                                fontSize: 14,
                                marginRight: 40
                            }}>{receiveAddress}</Text>
                        </View>


                        {
                            this.state.isUnfolded ?
                                <View style={styles.orderDeatailAll}>

                                    <View style={styles.orderDetailText}>
                                        <View style={styles.orderDetailCell}>
                                            <Text
                                                style={styles.textSizeNum}>单号：{transCodeList[0].customerOrderCode ? transCodeList[0].customerOrderCode : transCodeList[0].transCode}</Text>
                                            {
                                                transCodeList[0].weight ?
                                                    <Text
                                                        style={styles.textSizeWeight}>  {transCodeList[0].weight}Kg</Text>
                                                    :
                                                    <Text
                                                        style={styles.textSizeWeight}>  {transCodeList[0].weight}</Text>

                                            }

                                        </View>
                                        <View style={styles.orderDetailCell}>
                                            <Text
                                                style={styles.textSizeNum}>单号：{transCodeList[1].customerOrderCode ? transCodeList[1].customerOrderCode : transCodeList[1].transCode}</Text>
                                            {
                                                transCodeList[1].weight ?
                                                    <Text
                                                        style={styles.textSizeWeight}>  {transCodeList[1].weight}Kg</Text>
                                                    :
                                                    <Text
                                                        style={styles.textSizeWeight}>  {transCodeList[1].weight}</Text>

                                            }
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={{
                                            height: 45,
                                            justifyContent: 'center',
                                            paddingLeft: 15
                                        }}
                                        onPress={() => {
                                            this.setState({
                                                isUnfolded: false
                                            });
                                            console.log('this.state', this.state.isUnfolded)
                                        }}>
                                        <Image
                                            style={{
                                                marginRight: 20
                                            }}
                                            source={arrow}
                                        />
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.orderDeatailAll}>

                                    <View style={styles.orderDetailText}>
                                        {this.renderList(transCodeList)}
                                    </View>

                                    <TouchableOpacity
                                        style={{
                                            height: 45,
                                            justifyContent: 'center',
                                            paddingLeft: 15
                                        }}
                                        onPress={() => {
                                            this.setState({
                                                isUnfolded: true
                                            })
                                            console.log('this.state', this.state.isUnfolded)
                                    }}>
                                        <Image
                                            style={{
                                                marginRight: 20
                                            }}
                                            source={upArrow}
                                        />
                                    </TouchableOpacity>
                                </View>

                        }

                        <TouchableOpacity
                            onPress={() => {
                                Communications.phonecall(phoneNum, true);
                            }}
                        >
                            <View style={{
                                width: width - 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginLeft: 20,
                                height: 40,
                            }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: '#333333',
                                    fontSize: 14
                                }}>联系人：{receiveContactName}</Text>
                                <Text style={{
                                    fontFamily: 'iconfont',
                                    color: '#1b82d2',
                                    fontSize: 16,
                                    marginRight: 20,
                                }}>&#xe66f;</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{height: 1, width, backgroundColor: '#e8e8e8', marginLeft: 20}}/>
                        {
                            isDisabled ? null :
                                <Button
                                    style={{
                                        backgroundColor: '#1b82d2',
                                        marginTop: 10,
                                        marginLeft: 20,
                                        marginRight: 20,
                                        borderWidth: 0,
                                        height: 32,
                                        borderRadius: 5,
                                        marginBottom: 10,
                                    }}
                                    isDisabled={isDisabled}
                                    textStyle={{
                                        fontSize: 16,
                                        color: '#FFFFFF',
                                    }}
                                    onPress={() => {
                                        Alert.alert('您确认要批量签收吗？', '如果批量签收则不能做异常签收',
                                            [
                                                {
                                                    text: '取消',
                                                    onPress: () => {

                                                    },
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
                                    批量签收
                                </Button>
                        }

                    </View>
                </TouchableOpacity>
                <View style={{height: 10, backgroundColor: '#F5F5F5'}} />
            </View>
        );
    }
}

export default GoodBatchCell;
