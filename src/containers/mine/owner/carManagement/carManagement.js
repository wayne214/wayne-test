/**
 * 车辆管理
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

class CarManagement extends BaseContainer {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.onChanegeTextKeyword.bind(this);
        this.queryCarList = this.queryCarList.bind(this);
        this.unBindRelieveCar = this.unBindRelieveCar.bind(this);
        this.queryCarOne = this.queryCarOne.bind(this);
        this.queryCarList();
        this.state = {
            NumberArr: '',
            carList: [
                // {
                //     carNum: '京A12345',
                //     certificationStatus: '1202',
                //     carStatus: '20',
                //     drivers: '张三2，李四，王五，张柳，问问，的我，问问去，驱蚊器'
                // }
            ],
            text: '',
            index: null,
            line: true,
            clickLine: 'a',
        }
    }

    componentDidMount() {
        this.bindDriverListener = DeviceEventEmitter.addListener('bindDriverPage', () => {
            this.queryCarList();
        });
        this.addCarListener = DeviceEventEmitter.addListener('addCarPage', () => {
            this.queryCarList();
        });
    }

    componentWillUnmount() {
        this.bindDriverListener.remove();
        this.addCarListener.remove();
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
                    carList: this.state.NumberArr,
                });
                return;
            } else {
                this.setState({
                    carList: [],
                });
                for (var i = 0; i < this.state.NumberArr.length; i++) {
                    if (this.state.NumberArr[i].branchBank.indexOf(text) > -1) {
                        this.setState({
                            carList: this.state.carList.concat(this.state.NumberArr[i]),
                        });
                        // return;
                    } else {

                    }
                }
            }
        }, 500);

    }

    queryCarList() {
        HTTPRequest({
            url: API.API_QUERY_CAR_LIST_BY_COMPANIONINFO,
            params: {
                carNum: '',
                carStatus: '',
                companionPhone: global.phone,
            },
            loading: () => {

            },
            success: (responseData) => {
                console.log('carManagement', responseData)
                this.setState({
                    carList: responseData.result,
                });
            },
            error: (errorInfo) => {

            },
            finish: () => {

            }
        });
    }

    queryCarOne(carNum) {
        HTTPRequest({
            url: API.API_QUERY_CAR_LIST_BY_COMPANIONINFO,
            params: {
                carNum: carNum,
                carStatus: '',
                companionPhone: global.phone,
            },
            loading: () => {

            },
            success: (responseData) => {
                this.setState({
                    carList: responseData.result,
                })
            },
            error: (errorInfo) => {

            },
            finish: () => {

            }
        });
    }

    /* 解除车辆绑定 */
    unBindRelieveCar(item) {
        HTTPRequest({
            url: API.API_BIND_RELIEVE_CAR_COMPANION,
            params: {
                bindRelieveFlag: 2, // 1是绑定  其余是解除
                carId: item.carId,
                carNum: item.carNum,
                companionId: item.companionId,
                companionPhone: global.phone, //车主手机号
                driverIds: [],
                driverPhone: '' // 司机时手机号
            },
            loading: () => {

            },
            success: (responseData) => {
                console.log('unBindRelieveCar', responseData)
                this.queryCarList();
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
        this.props.navigation.navigate('BindDriverPage', {
            carId: item.carId
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
                    this.unBindRelieveCar(item);
                },

            }
        ];
        const driverList = item.drivers && item.drivers.split(',');
        console.log('=====driverList', driverList);
        let driverContent = '';
        if(driverList) {
            if (driverList.length > 1) {
                for (let i = 0; i < driverList.length; i++) {
                    if (i < driverList.length - 1) {
                        driverContent = driverContent.concat(driverList[i]+'、');
                    } else {
                        driverContent = driverContent.concat(driverList[i]);
                    }
                }
            } else {
                driverContent = driverContent.concat(...driverList);
            }
        }

        console.log('=====driverList', driverContent.length, width);
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
                    {/*phone: item.carPhone,*/}
                        {/*plateNumber:item.carNum*/}
                    this.props.navigation.navigate('CerifiedStatePage', {
                         phone: '18725836920',
                        plateNumber:'黑NE5286'
                    });
                }}>

                    <View style={{paddingLeft: 10, backgroundColor: '#ffffff'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image
                                    style={{height: 36, width: 36}}
                                    source={StaticImage.CarAvatar}/>
                                <Text style={{marginLeft: 10, color: '#333333', fontSize: 14}}>{item.carNum}</Text>
                            </View>
                            <View style={{
                                justifyContent: 'center',
                                width: 90,
                                alignItems: 'center',
                            }}>
                            {item.carStatus == 10 ?
                                <Text style={{fontSize: 14, color: '#FA5741'}}>
                                    禁用
                                </Text> :
                                item.certificationStatus == '1202' ?
                                    <Text style={{marginLeft: width - 190, fontSize: 14, color: '#0071FF'}}>

                                        认证通过
                                    </Text>
                                    : item.certificationStatus == '1201' ?
                                    <Text style={{fontSize: 14, color: '#0071FF'}}>
                                        认证中
                                    </Text>
                                    : item.certificationStatus == '1203' ?
                                        <Text style={{marginLeft: width - 190, fontSize: 14, color: '#0071FF'}}>

                                            认证驳回
                                        </Text>
                                        :
                                        <Text style={{fontSize: 14, color: '#FA5741'}}>
                                            禁用
                                        </Text>
                            }
                            </View>
                        </View>
                        <View style={{marginLeft: 45}}>
                            {this.state.line && this.state.clickLine == index ?
                                <Text
                                    style={{fontSize: 14, lineHeight: 24, color: '#3F3F3F'}}
                                >
                                    关联司机：{driverContent}</Text>
                                : <Text
                                    numberOfLines={1}
                                    style={{
                                        fontSize: 14,
                                        lineHeight: 24,
                                        color: '#3F3F3F'
                                    }}>关联司机：{driverContent}</Text>
                            }

                            {driverContent.length * (17 * width / 375) < (width - 95) ? null :this.state.line && this.state.clickLine == index ?
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
                            {item.carStatus != '10' ?
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
                                        <Text style={{color: 'black', fontSize: 14}}>绑定司机</Text>
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
                    <TouchableOpacity
                        onPress={()=>{
                            navigator.goBack();
                        }}>
                        <Text
                            style={{
                                marginLeft: 10,
                                fontFamily: 'iconfont',
                                fontSize: 16,
                                color: '#999999'
                            }}>&#xe662;
                        </Text>
                    </TouchableOpacity>
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
                            returnKeyLabel={'search'}
                            returnKeyType={'search'}
                            blurOnSubmit={true}
                            onSubmitEditing={(event) => {
                                // this.queryCarOne(event.nativeEvent.text);
                            }}
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
                        this.queryCarOne(this.state.text);
                    }}>
                        <Text
                            style={{color: '#0071FF', fontSize: 16, width: 49, textAlign: 'center'}}
                        >搜索
                        </Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={{backgroundColor: '#F4F4F4', flex: 1, paddingTop: 10}}
                    data={this.state.carList}
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
                        this.props.navigation.navigate('AddCarPage');
                    }}
                >
                    添加车辆
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

export default connect(mapStateToProps, mapDispatchToProps)(CarManagement);


