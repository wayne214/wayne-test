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
    DeviceEventEmitter,
} from 'react-native';
import BaseContainer from '../../../base/baseContainer';
import * as ConstValue from '../../../../constants/constValue';
import StaticImage from '../../../../constants/staticImage'
import Swipeout from 'react-native-swipeout';
import Button from 'apsl-react-native-button';
import * as API from '../../../../constants/api';
import HTTPRequest from '../../../../utils/httpRequest';

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

class DriverManagement extends BaseContainer {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.onChanegeTextKeyword.bind(this);
        this.queryDriverList = this.queryDriverList.bind(this);
        this.queryDriverOne = this.queryDriverOne.bind(this);
        this.unBindRelieveDriver = this.unBindRelieveDriver.bind(this);
        this.queryDriverList();
        this.state = {

            NumberArr: '',
            driverList: [
                //     {
                //     driverName: '车车1',
                //     certificationStatus: 'null',
                //     stauts: '20',
                //     carNums: '京A12345，京B12345，京A12345，京B12345，京A12345，京B12345，京A12345，京B12345'
                // }
            ],
            text: '',
            index: null,
            line: true,
            clickLine: 'a',
        }
    }

    componentDidMount() {
        this.bindCarListener = DeviceEventEmitter.addListener('bindCarPage', () => {
            this.queryDriverList();
        });
        this.addDriverListener = DeviceEventEmitter.addListener('addDriverPage', () => {
            this.queryDriverList();
        });
    }

    componentWillUnmount() {
        this.bindCarListener.remove();
        this.addDriverListener.remove();
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
                    driverList: this.state.NumberArr,
                });
                return;
            } else {
                this.setState({
                    driverList: [],
                });
                for (var i = 0; i < this.state.NumberArr.length; i++) {
                    if (this.state.NumberArr[i].branchBank.indexOf(text) > -1) {
                        this.setState({
                            driverList: this.state.driverList.concat(this.state.NumberArr[i]),
                        });
                        // return;
                    } else {

                    }
                }
            }
        }, 500);

    }

    queryDriverList() {
        HTTPRequest({
            url: API.API_QUERY_CAR_LIST_BY_PHONE_NUM,
            params: {
                driverName: '',
                phoneNum: global.phone
            },
            loading: () => {

            },
            success: (responseData) => {
                console.log('queryDriverList', responseData)
                this.setState({
                    driverList: responseData.result,
                });

            },
            error: (errorInfo) => {

            },
            finish: () => {

            }
        });
    }

    queryDriverOne(text) {
        HTTPRequest({
            url: API.API_QUERY_CAR_LIST_BY_PHONE_NUM,
            params: {
                driverName: text,
                // phoneNum: '13120382724'
                phoneNum: global.phone
            },
            loading: () => {

            },
            success: (responseData) => {
                this.setState({
                    driverList: responseData.result,
                });

            },
            error: (errorInfo) => {

            },
            finish: () => {

            }
        });
    }

    /* 解除司机绑定 */
    unBindRelieveDriver(item) {
        HTTPRequest({
            url: API.API_DEL_DRIVER_COMPANION_RELATION,
            params: {
                driverId: item.id,
                driverPhone: '',
                phoneNum: global.phone
            },
            loading: () => {

            },
            success: (responseData) => {
                this.queryDriverList();
            },
            error: (errorInfo) => {

            },
            finish: () => {

            }
        });
    }

    //点击城市cell
    cityClicked(item) {
        console.log('item', item);
        // this.props.navigation.goBack();
        this.props.navigation.navigate('BindCarPage', {
            drManID: item.id
        });
    }

    //列表的每一行
    renderItemView({item, index}) {
        // Buttons
        const swipeoutBtns = [
            {
                text: '删除',
                backgroundColor: 'red',
                onPress: () => {
                    this.unBindRelieveDriver(item);
                },

            }
        ];

        return (
            item.companyType == 0 ?
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
                        <View style={{flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image
                                    style={{height: 36, width: 36}}
                                    source={StaticImage.DriverAvatar}></Image>
                                <Text style={{marginLeft: 10, color: '#333333', fontSize: 14}}>{item.driverName}</Text>
                            </View>
                            <View style={{
                                justifyContent: 'center',
                                width: 90,
                                alignItems: 'center',
                            }}>
                                {item.status == 10 ?
                                    <Text style={{fontSize: 14, color: '#FA5741'}}>
                                        禁用
                                    </Text> :
                                    item.certificationStatus == '1202' ?
                                        <Text style={{fontSize: 14, color: '#0071FF'}}>
                                            认证通过
                                        </Text>
                                        : item.certificationStatus == '1201' ?
                                        <Text style={{fontSize: 14, color: '#0071FF'}}>
                                            认证中
                                        </Text>
                                        : item.certificationStatus == '1203' ?
                                            <Text style={{fontSize: 14, color: '#0071FF'}}>
                                                认证驳回
                                            </Text>
                                            :
                                            <Text style={{fontSize: 14, color: '#0071FF'}}>
                                                未认证
                                            </Text>
                                }
                            </View>
                        </View>
                        <View style={{marginLeft: 45}}>
                            {this.state.line && this.state.clickLine == index ?
                                <Text
                                    style={{fontSize: 14, lineHeight: 24, color: '#3F3F3F'}}
                                >
                                    关联车辆：{item.carNums}</Text>
                                : <Text
                                    numberOfLines={1}
                                    style={{fontSize: 14, lineHeight: 24, color: '#3F3F3F'}}>关联车辆：{item.carNums}</Text>
                            }

                            {this.state.line && this.state.clickLine == index ?
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        clickLine: 'a',
                                    })
                                }}>
                                    <Text style={{color: '#008AFF', fontSize: 12, lineHeight: 24}}>收起</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        clickLine: index,
                                    })
                                }}>
                                    <Text style={{color: '#008AFF', fontSize: 12, lineHeight: 24}}>全部</Text>
                                </TouchableOpacity>

                            }
                        </View>
                        <View style={{marginBottom: 10,}}>
                            {item.status != '10' ?
                                <TouchableOpacity onPress={() => {
                                    this.cityClicked(item);
                                }}>
                                    <View
                                        style={{
                                            height: 30,
                                            width: 85,
                                            marginTop: 1,
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
                :

                <View style={{paddingLeft: 10, backgroundColor: '#ffffff'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image
                                    style={{height: 36, width: 36}}
                                    source={StaticImage.DriverAvatar}></Image>
                                <Text style={{marginLeft: 10, color: '#333333', fontSize: 14}}>{item.driverName}</Text>
                            </View>
                            <View style={{
                                justifyContent: 'center',
                                width: 90,
                                alignItems: 'center',
                            }}>
                                {item.status == 10 ?
                                    <Text style={{fontSize: 14, color: '#FA5741'}}>
                                        禁用
                                    </Text> :
                                    item.certificationStatus == '1202' ?
                                        <Text style={{fontSize: 14, color: '#0071FF'}}>
                                            认证通过
                                        </Text>
                                        : item.certificationStatus == '1201' ?
                                        <Text style={{fontSize: 14, color: '#0071FF'}}>
                                            认证中
                                        </Text>
                                        : item.certificationStatus == '1203' ?
                                            <Text style={{fontSize: 14, color: '#0071FF'}}>
                                                认证驳回
                                            </Text>
                                            :
                                            <Text style={{fontSize: 14, color: '#0071FF'}}>
                                                未认证
                                            </Text>
                                }
                            </View>
                        </View>
                        <View style={{marginLeft: 45}}>
                            {this.state.line && this.state.clickLine == index ?
                                <Text
                                    style={{fontSize: 14, lineHeight: 24, color: '#3F3F3F'}}
                                >
                                    关联车辆：{item.carNums}</Text>
                                : <Text
                                    numberOfLines={1}
                                    style={{fontSize: 14, lineHeight: 24, color: '#3F3F3F'}}>关联车辆：{item.carNums}</Text>
                            }

                            {this.state.line && this.state.clickLine == index ?
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        clickLine: 'a',
                                    })
                                }}>
                                    <Text style={{color: '#008AFF', fontSize: 12, lineHeight: 24}}>收起</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        clickLine: index,
                                    })
                                }}>
                                    <Text style={{color: '#008AFF', fontSize: 12, lineHeight: 24}}>全部</Text>
                                </TouchableOpacity>

                            }
                        </View>
                        <View style={{marginBottom: 10,}}>
                            {item.status != '10' ?
                                <TouchableOpacity onPress={() => {
                                    this.cityClicked(item);
                                }}>
                                    <View
                                        style={{
                                            height: 30,
                                            width: 85,
                                            marginTop: 1,
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
                            returnKeyLabel={'search'}
                            returnKeyType={'search'}
                            blurOnSubmit={true}
                            onSubmitEditing={(event) => {
                                this.queryDriverOne(event.nativeEvent.text);
                            }}
                            placeholder={'司机姓名'}
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
                    style={{backgroundColor: '#F4F4F4', flex: 1, paddingTop: 10}}
                    data={this.state.driverList}
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
                        borderRadius: 0,
                        borderWidth: 0,
                        borderColor: '#0083FF',
                    }}
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


