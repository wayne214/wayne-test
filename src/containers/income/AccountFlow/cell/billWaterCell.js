/*
 * @author:  yinyongqian
 * @createTime:  2017-03-22, 11:18:32 GMT+0800
 * @description:  description
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';


const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({});

class BillWaterCell extends Component {
    static propTypes = {
        billState: PropTypes.string,
        billTime: PropTypes.string,
        billMoney: PropTypes.string,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const {
            billState, billTime, billMoney
        } = this.props;
        return (

            <TouchableOpacity onPress={()=>{
                this.props.onClick();
            }}>
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                    height: 70,
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        marginLeft:10
                    }}>

                        <Text
                            style={{
                                fontSize: 17,
                                color: '#333333'
                            }}>
                            {billState}
                        </Text>

                        <Text
                            style={{
                                marginTop: 5,
                                color: '#999999',
                                fontSize: 14
                            }}>
                            {billTime}
                        </Text>

                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        right:10,
                        position: 'absolute',
                        height: 70
                    }}>
                        <Text
                            style={{
                            marginTop: 15,
                            marginRight:10,
                            color: '#FF6600',
                            fontSize: 18,
                        }}>
                            {billMoney}元
                        </Text>
                        <Text
                            style={{
                            marginTop: 45,
                            right: 10,
                            color: '#666666',
                            position: 'absolute'
                        }}>
                            处理中
                        </Text>
                    </View>

                </View>
                <View
                    style={{
                        width,
                        height:1,
                    }}
                />

            </TouchableOpacity>

        );
    }
}

export default BillWaterCell;
