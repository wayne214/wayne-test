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
import StaticImage from '../../../../constants/staticImage';
import bankIconUtil from '../../../../utils/bankIconUtil';

const {height,width} = Dimensions.get('window');
const styles = StyleSheet.create({});

export default class BankCardCell extends Component {
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

        const bgColor = Math.floor(Math.random()*10)%4 === 0 ? {backgroundColor: '#1C4BE8'} :
            Math.floor(Math.random()*10)%4 === 1 ? {backgroundColor:'#3D8A78'} :
                Math.floor(Math.random()*10)%4 === 2 ? {backgroundColor: '#DF5551'} :{backgroundColor: '#D99B0C'};

        return (
            <TouchableOpacity
                onPress={() => {
                    clickAction();
                }} activeOpacity={0.6}
            >

                <View>
                    <View style={[{
                        flexDirection: 'row',
                        marginTop: 10,
                        marginHorizontal: 10,
                    }]}>
                        <Image style={{position: 'absolute'}} source={StaticImage.Car_yellow}/>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                backgroundColor: 'white',
                                borderRadius: 25,
                                marginLeft: 10,
                                marginTop: 15,
                                width: 50,
                                height: 50
                            }}>
                                {
                                    bankIconUtil.show(accountBank)
                                }
                            </View>

                            <View style={{marginLeft: 10, marginTop:20}}>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        color:'#fff',
                                        backgroundColor: 'transparent'
                                    }}>
                                    {accountBank}
                                </Text>

                                <Text
                                    style={{
                                        marginTop: 10,
                                        color: '#fff',
                                        fontSize: 13,
                                        backgroundColor: 'transparent'
                                    }}>
                                    {bankCarType}
                                </Text>

                                <Text
                                    style={{
                                        marginTop: 20,
                                        color: '#fff',
                                        fontSize: 13,
                                        marginBottom: 20,
                                        backgroundColor: 'transparent'
                                    }}>
                                    {bankAccount}
                                </Text>
                            </View>
                        </View>

                        <View style={{flexDirection: 'row'}}>
                            {
                                isDefault == 1 ?
                                    <View style={{
                                        height: 20,
                                        width: 40,
                                        marginTop: 10,
                                        marginRight: 10,
                                        justifyContent: 'center',
                                    }}>

                                        <View style={{ height: 20,
                                        width: 40,backgroundColor: 'black', opacity: 0.3, borderRadius: 3, flex: 1, position: 'absolute'}}>
                                        </View>
                                        <Text style={{backgroundColor: 'transparent', fontSize: 13, textAlign: 'center', color: '#fff'}}>默认</Text>

                                    </View>
                                    : null
                            }

                        </View>


                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

