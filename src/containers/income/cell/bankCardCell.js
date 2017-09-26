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
import StaticImage from '../../../constants/staticImage';
import bankIconUtil from '../../../utils/bankIconUtil'

const {height,width} = Dimensions.get('window');
const styles = StyleSheet.create({});

class BankCardCell extends Component {
    static propTypes = {
        accountBank: PropTypes.string,
        bankCarType: PropTypes.string,
        bankAccount: PropTypes.string,
        isDefault: PropTypes.number,
        clickAction: PropTypes.func,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};

    }

    render() {
        const {
            accountBank, bankCarType, bankAccount, isDefault, clickAction
        } = this.props;


        return (
            <TouchableOpacity
                onPress={() => {
                    clickAction();
                }} activeOpacity={0.6}
            >
                <View>
                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginTop: 10,
                        backgroundColor:'#ffffff',
                        height:84,
                    }}>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            {
                                bankIconUtil.show(accountBank)
                            }

                            <View style={{marginLeft: 10}}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color:'#333333'
                                    }}>
                                    {accountBank}
                                </Text>

                                <Text
                                    style={{
                                        marginTop: 5,
                                        color: '#666666',
                                        fontSize: 14
                                    }}>
                                    {bankCarType}
                                </Text>

                                <Text
                                    style={{
                                        marginTop: 5,
                                        color: '#999999',
                                        fontSize: 14
                                    }}>
                                    {bankAccount}
                                </Text>
                            </View>
                        </View>

                        <View style={{flexDirection: 'row'}}>
                            {
                                isDefault == 1 ?
                                    <Text
                                        style={{
                                            color: '#999999',
                                            fontSize: 14,
                                            marginRight: 10
                                        }}
                                    >默认</Text>
                                    : null
                            }

                            <Image
                                style={{
                                    width: 15,
                                    height: 15,
                                    marginRight: 10
                                }}
                                source={StaticImage.rightArrow}/>
                        </View>


                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default BankCardCell;
