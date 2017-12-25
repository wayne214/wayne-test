/**
 * 添加车辆
 * by：wl
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as API from '../../../../constants/api';
import HTTPRequest from '../../../../utils/httpRequest';

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
import BaseContainer from '../../../base/baseContainer';
import * as ConstValue from '../../../../constants/constValue';
import StaticImage from '../../../../constants/staticImage';
import Toast from '@remobile/react-native-toast';

const {height, width} = Dimensions.get('window');

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

class AddDriverPage extends BaseContainer {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.onChanegeTextKeyword.bind(this);
        this.queryPhoneOrName = this.queryPhoneOrName.bind(this);
        this.bindDriverToApp = this.bindDriverToApp.bind(this);
        this.state = {
            NumberArr: '',
            driverOne: [
                ],
            text: '',
            index: null,
            line: true,
            clickLine: 'a',
        }
    }

    queryPhoneOrName(text) {
        HTTPRequest({
            url: API.API_QUERY_DRIVERS_ALL,
            params: {
                phoneNumOrDriverName: text,
            },
            loading: () => {

            },
            success: (responseData) => {
                this.setState({
                    driverOne: responseData.result,
                });
            },
            error: (errorInfo) => {

            },
            finish: () => {

            }
        });
    }
    // 绑定司机
    bindDriverToApp(driverId,driverPhone) {
        HTTPRequest({
            url: API.API_COMPANION_RELATION,
            params: {
                driverId: driverId,
                driverPhone: driverPhone,
                phoneNum: global.phone,
            },
            loading: () => {

            },
            success: (responseData) => {
                Toast.show('添加成功');
            },
            error: (errorInfo) => {

            },
            finish: () => {

            }
        });
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
                    driverOne: this.state.NumberArr,
                });
                return;
            } else {
                this.setState({
                    driverOne: [],
                });
                for (var i = 0; i < this.state.NumberArr.length; i++) {
                    if (this.state.NumberArr[i].branchBank.indexOf(text) > -1) {
                        this.setState({
                            driverOne: this.state.driverOne.concat(this.state.NumberArr[i]),
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
        this.bindDriverToApp(item.id,item.driverPhone);
    }

    //列表的每一行
    renderItemView({item, index}) {

        return (
                <TouchableOpacity onPress={() => {

                }}>
                    <View style={{paddingLeft: 10, backgroundColor: '#ffffff'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                style={{height: 36, width: 36}}
                                source={StaticImage.DriverAvatar}></Image>
                            <View>
                                <Text style={{
                                    marginLeft: 10,
                                    color: '#333333',
                                    fontSize: 16,
                                    height: 27,
                                    marginTop: 15
                                }}>{item.driverName}</Text>
                                <Text style={{
                                    marginLeft: 10,
                                    color: '#666666',
                                    fontSize: 16,
                                    height: 27,
                                    marginBottom:5,
                                }}>{item.driverPhone.substr(0, 3) + '*****' + item.driverPhone.substr(8, 3)}
                                </Text>

                            </View>
                            {item.carStatus != '禁用' ?
                                <TouchableOpacity onPress={() => {
                                    this.cityClicked(item);
                                }}>
                                    <View
                                        style={{
                                            height: 30,
                                            width: 75,
                                            marginLeft: width - 250,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 20,
                                            borderColor: '#0071FF',
                                            borderWidth: 0.5,
                                        }}>
                                        < Text style={{color: '#0071FF'}}>+添加</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                            }

                        </View>
                        {item.carStatus == '禁用' ?
                            <Text style={{
                                marginLeft: 46,
                                color: '#CCCCCC',
                                fontSize: 12,
                                height: 22,
                            }}>平台已禁用此司机，有疑问请联系平台客服人员。</Text>
                            : null}
                        <View style={{backgroundColor: '#E8E8E8', height: 1}}/>
                    </View>
                </TouchableOpacity>
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
                            blurOnSubmit = {true}
                            onSubmitEditing={(event) => {
                                this.queryPhoneOrName(event.nativeEvent.text);
                            }}
                            placeholder={'手机号/姓名'}
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
                <View style={{backgroundColor:'#F4F4F4',height:45,justifyContent: 'center',}}>
                    <Text style={{color: '#666666', fontsize: 15,marginLeft:10}}>添加司机</Text>
                </View>
                <FlatList
                    style={{backgroundColor: '#F4F4F4', flex: 1}}
                    data={this.state.driverOne}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddDriverPage);


