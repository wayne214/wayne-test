/**
 * 添加车辆
 * by：wl
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    TextInput,
    FlatList,
    TouchableOpacity,
    Platform,
} from 'react-native';
import BaseContainer from '../../base/baseContainer';
import BankCode from '../../../utils/ZJBankCode'
import * as ConstValue from '../../../constants/constValue';
import StaticImage from '../../../constants/staticImage'
import Swipeout from 'react-native-swipeout';

const {height, width} = Dimensions.get('window');
const NumberArr = BankCode.searchCode();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    icon: {
        height: 22,
        width: 22,
        resizeMode: 'contain'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    textInputStyle: {
        flex: 1,
        marginLeft: 5,
        fontSize: 13,
        color: '#666666',
        ...Platform.select({
            ios: {},
            android: {
                padding: 0,
            },
        }),
    },
});

class AddCarPage extends BaseContainer {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.onChanegeTextKeyword.bind(this)
        this.state = {
            NumberArr: '',
            branchList: [
                {
                    carNum: '京A12345',
                    Disabled: 'true',
                },
                {
                    carNum: '京B12345',
                    Disabled: 'true',
                },
                {
                    carNum: '京A12345',
                    Disabled: '禁用',
                },
                {
                    carNum: '京A12345',
                    Disabled: 'true',
                }],
            text: '',
            index: null,
            line: true,
            clickLine: 'a',
        }
    }

    //改变搜索的文本
    onChanegeTextKeyword(text) {
        this.timeA(text);
    }

    //利用防抖方式防止数据过大造成卡顿现象
    timeA(text) {
        if (this.time) {
            clearTimeout(this.time)
        }

        this.time = setTimeout(() => {
            if (text === '') {
                this.setState({
                    branchList: this.state.NumberArr,
                });
                return;
            } else {
                this.setState({
                    branchList: [],
                });
                for (var i = 0; i < this.state.NumberArr.length; i++) {
                    if (this.state.NumberArr[i].branchBank.indexOf(text) > -1) {
                        this.setState({
                            branchList: this.state.branchList.concat(this.state.NumberArr[i]),
                        });
                        // return;
                    } else {

                    }
                }
            }
        }, 500);

    }

    //点击城市cell
    cityClicked(item) {
        console.log('item', item);
        // this.props.navigation.goBack();
    }

    //列表的每一行
    renderItemView({item, index}) {
        // Buttons
        const swipeoutBtns = [
            {
                text: '删除',
                backgroundColor: 'red',
                onPress: () => {

                },

            }
        ];

        return (

            <Swipeout
                autoClose={false}
                close={!(this.state.index === index)}
                right={swipeoutBtns}
                rowID={index}
                sectionID={index}
                onOpen={(index) => {
                    this.setState({
                        index,
                    });
                }}
                onClose={() => console.log('===close')}
                scroll={event => console.log('scroll event')}
            >
                <TouchableOpacity onPress={() => {

                }}>

                    <View style={{paddingLeft: 10, backgroundColor: '#ffffff',flexDirection: 'row',alignItems:'center',paddingTop:15,paddingBottom:15}}>
                        <Image
                            style={{height: 36, width: 36}}
                            source={StaticImage.CarAvatar}></Image>

                        <View style={{flexDirection: 'column'}}>
                            <View style={{flexDirection: 'row',alignItems:'center',}}>

                                <Text style={{
                                    marginLeft: 10,
                                    color: '#333333',
                                    fontSize: 16,
                                    height: 24,
                                }}>{item.carNum}</Text>

                                {item.Disabled != '禁用' ?
                                    <TouchableOpacity onPress={() => {
                                        this.cityClicked(item);
                                    }}>
                                        <View
                                            style={{
                                                height: 30,
                                                width: 75,
                                                marginLeft: width - 220,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 20,
                                                borderColor: '#0071FF',
                                                borderWidth: 1,
                                            }}>
                                            < Text style={{color: '#0071FF'}}>+添加</Text>
                                        </View>
                                    </TouchableOpacity>
                                    : null
                                }
                            </View>
                            {item.Disabled == '禁用' ?
                                <Text style={{
                                    marginLeft:10,
                                    color: '#CCCCCC',
                                    fontSize: 12,
                                    height: 18,
                                    marginTop:3,
                                }}>平台已禁用此司机，有疑问请联系平台客服人员。</Text>
                                : null}
                        </View>

                    </View>

                    <View style={{backgroundColor: '#E8E8E8', height: 1}}/>

                </TouchableOpacity>

            </Swipeout>
        );
    }

    //去除警告
    extraUniqueKey(item, index) {
        return index + item;
    }


    render() {
        const navigator = this.props.navigation;
        const {params} = this.props.navigation.state;
        const {text} = this.state;
        console.log('params', params)

        return (
            <View style={styles.container}>

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: ConstValue.StatusBar_Height,
                        marginBottom: 7,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#F4F4F4',
                        marginLeft: 10,
                        flex: 1,
                        height: 30,
                        alignItems: 'center',
                    }}>
                        <Text
                            style={{
                                marginLeft: 10,
                                fontFamily: 'iconfont',
                                fontSize: 16,
                                color: '#999999'
                            }}>&#xe619;
                        </Text>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            maxLength={20}
                            value={text}
                            placeholder={'车牌号'}
                            onChangeText={(text) => {
                                this.setState({
                                    text: text
                                })
                                this.onChanegeTextKeyword(text)
                            }}>
                        </TextInput>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                text: ''
                            })
                        }}>
                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontFamily: 'iconfont',
                                    fontSize: 16,
                                    marginRight: 10,
                                    color: '#CCCCCC'
                                }}>&#xe66a;
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity onPress={() => {
                        navigator.goBack();
                    }}>
                        <Text
                            style={{color: '#0071FF', fontSize: 16, width: 49, textAlign: 'center'}}
                        >取消
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={{color: '#666666', fontsize: 15, margin: 10}}>添加车辆</Text>

                <FlatList
                    style={{backgroundColor: 'white', flex: 1}}
                    data={this.state.branchList}
                    renderItem={this.renderItemView.bind(this)}
                    keyExtractor={this.extraUniqueKey}//去除警告
                >
                </FlatList>

            </View>

        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCarPage);


