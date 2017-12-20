/**
 * 司机管理
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
import Button from 'apsl-react-native-button';

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
        fontSize: 16,
        color: '#666666',
        ...Platform.select({
            ios: {},
            android: {
                padding: 0,
            },
        }),
    },
});

class DriverManagement extends BaseContainer {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.onChanegeTextKeyword.bind(this)
        this.state = {
            // NumberArr: params.branchList,
            // branchList:params.branchList,
            NumberArr: '',
            branchList: [{
                driverName: '车车1',
                status: '认证中',
                ifBind: 'true',
                carList: '京A12345，京B12345，京A12345，京B12345，京A12345，京B12345，京A12345，京B12345'
            },
                {
                    driverName: '车车2',
                    status: '认证中',
                    ifBind: 'true',
                    carList: '京A12345，京B12345，京A12345，京B12345，京A12345，京B12345，京A12345，京B12345'
                },
                {
                    driverName: '车车3',
                    status: '认证中',
                    ifBind: 'true',
                    carList: '京A12345，京B12345，京A12345，京B12345，京A12345，京B12345，京A12345，京B12345'
                },
                {
                    driverName: '车车4',
                    status: '禁用',
                    ifBind: 'true',
                    carList: '京A12345，京B12345，京A12345，京B12345，京A12345，京B12345，京A12345，京B12345'
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
        console.log('item',item);
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

                    <View style={{paddingLeft: 10, backgroundColor: '#ffffff'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
                            <Image
                                style={{height: 36, width: 36}}
                                source={StaticImage.DriverAvatar}></Image>
                            <Text style={{marginLeft: 10, color: '#333333', fontsize: 16}}>{item.driverName}</Text>
                            {item.certificationStatus == '认证通过' ?
                                <Text style={{marginLeft: width - 150, fontsize: 16, color: '#0071FF'}}>
                                    认证通过
                                </Text>
                                : item.certificationStatus == '认证中' ?
                                    <Text style={{marginLeft: width - 150, fontsize: 16, color: '#0071FF'}}>
                                        认证中
                                    </Text>
                                    : item.certificationStatus == '认证驳回' ?
                                        <Text style={{marginLeft: width - 150, fontsize: 16, color: '#0071FF'}}>
                                            认证驳回
                                        </Text>
                                        :
                                        <Text style={{marginLeft: width - 150, fontsize: 16, color: '#FA5741'}}>
                                            禁用
                                        </Text>
                            }

                        </View>
                        <View style={{marginLeft: 45}}>
                            {this.state.line && this.state.clickLine == index ?
                                <Text
                                    style={{fontsize: 18, lineHeight: 24,color:'#3F3F3F'}}
                                >
                                    关联车辆：{item.carList}</Text>
                                : <Text
                                    numberOfLines={1}
                                    style={{fontsize: 18, lineHeight: 24, color:'#3F3F3F'}}>关联车辆：{item.carList}</Text>
                            }

                            {this.state.line && this.state.clickLine == index ?
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        clickLine: 'a',
                                    })
                                }}>
                                    <Text style={{color: '#008AFF', fontsize: 12, lineHeight: 24}}>收起</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        clickLine: index,
                                    })
                                }}>
                                    <Text style={{color: '#008AFF', fontsize: 12, lineHeight: 24}}>全部</Text>
                                </TouchableOpacity>

                            }
                        </View>
                        <View style={{marginBottom: 10,}}>
                            {item.certificationStatus != '禁用' ?
                                <TouchableOpacity onPress={() => {
                                    this.cityClicked(item);
                                }}>
                                    <View
                                        style={{
                                            height: 30,
                                            width: 85,
                                            marginLeft: width - 100,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 20,
                                            borderColor: '#999999',
                                            borderWidth: 0.5,
                                        }}>
                                        < Text style={{color: 'black'}}>绑定车辆</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                        <View style={{backgroundColor: '#E8E8E8', height: 1}}/>
                    </View>
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
            <View style={{
                backgroundColor: '#FFFFFF',
                position: 'relative',
                flex: 1
            }}>

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
                            placeholder={'车牌号/姓名'}
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

                <FlatList
                    style={{backgroundColor: '#F4F4F4', flex: 1, paddingTop:10}}
                    data={this.state.branchList}
                    renderItem={this.renderItemView.bind(this)}
                    keyExtractor={this.extraUniqueKey}//去除警告
                >
                </FlatList>
                <Button
                    ref='button'
                    isDisabled={false}
                    style={{
                        backgroundColor: '#0083FF',
                        width: width,
                        marginBottom: 0,
                        height: 44,
                        borderRadius:0,
                        borderWidth: 0,
                        borderColor: '#0083FF',}}
                    textStyle={{color: 'white', fontSize: 18}}
                    onPress={() => {
                        this.props.navigation.navigate('AddDriverPage');
                    }}
                >
                    添加司机
                </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(DriverManagement);


