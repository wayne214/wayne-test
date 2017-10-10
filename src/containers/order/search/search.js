/**
 * Created by xizhixin on 2017/4/1.
 * 搜索界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    TextInput,
    Image,
    ListView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';

import * as API from '../../../constants/api';
import Storage from '../../../utils/storage';
import HTTPRequest from '../../../utils/httpRequest';

import Toast from '@remobile/react-native-toast';

import StaticImage from '../../../constants/staticImage';

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

import {
    GRAY_TITLE_COLOR,
    GRAY_TEXT_COLOR,
    COLOR_VIEW_BACKGROUND,
    WHITE_COLOR,
    DEVIDE_LINE_COLOR,
    LIGHT_BLACK_TEXT_COLOR,
} from '../../../constants/staticColor';

const styles = StyleSheet.create({
    allContainer: {
        flex: 1,
        backgroundColor: COLOR_VIEW_BACKGROUND,
    },
    container: {
        ...Platform.select({
            ios: {
                height: 64,
            },
            android: {
                height: 50,
            },
        }),
        backgroundColor: GRAY_TITLE_COLOR,
    },
    titleContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: 15,
            },
            android: {
                paddingTop: 0,
            },
        }),
        flexDirection: 'row',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15,
    },
    rightContainer: {
        flex: 0,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    searchBox: {
        flexDirection: 'row',
        borderRadius: 5,  // 设置圆角边
        backgroundColor: WHITE_COLOR,
        alignItems: 'center',
        height: 30,
        // flex:1,
        // marginTop:10,
        // marginBottom:10
    },
    backImg: {
        marginLeft: 10,
    },
    rightTitle: {
        color: LIGHT_BLACK_TEXT_COLOR,
        fontSize: 15,
        marginRight: 15,
        marginLeft: 15,
    },
    textInput: {
        color: GRAY_TEXT_COLOR,
        fontSize: 13,
        flex: 1,
        marginLeft: 10,
        ...Platform.select({
            ios: {
                height: 30,
            },
            android: {
                // height:30,
                paddingBottom: 5,
                lineHeight: 30,
                textAlignVertical: 'center',
                alignSelf: 'center',
            },
        }),
    },
    iconStyle: {
        paddingLeft: 5,
        paddingRight: 10,
        backgroundColor: WHITE_COLOR,
    },
    tip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginTop: 10,
    },
    listView: {
        backgroundColor: COLOR_VIEW_BACKGROUND,
    },
    row: {
        backgroundColor: WHITE_COLOR,
    },
    rowContent: {
        paddingTop: 10,
        paddingBottom: 10,
        // 设置item分割线
        borderBottomColor: DEVIDE_LINE_COLOR,
        borderBottomWidth: 0.5,
        marginLeft: 10,
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

});

class Search extends Component {
    constructor(props) {
        super(props);
        // 绑定点击事件
        this.goBack = this.goBack.bind(this);
        this.searchTransCode = this.searchTransCode.bind(this);
        this.searchScheduleCode = this.searchScheduleCode.bind(this);
        this.getOrderSuccessCallBack = this.getOrderSuccessCallBack.bind(this);
        this.getScheduleSuccessCallBack = this.getScheduleSuccessCallBack.bind(this);
        this.getSearchList = this.getSearchList.bind(this);
        this.saveSearchList = this.saveSearchList.bind(this);

        // 初始化listView
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            transCode: '',
            dataSource: ds,
            plateNumber: '',
            loading: false,
        };
    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }
    componentDidMount() {
        this.getCurrentPosition();
        this.getSearchList();
        Storage.get('plateNumber').then((value) =>{
            if (value) {
                console.log('value=' + value);
                this.setState({
                    plateNumber: value,
                });
            }
        });
        this.listener = DeviceEventEmitter.addListener('searchHistory', () => {
            console.log('============================');
            this.getSearchList();
        });
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    // 获取搜索历史
    getSearchList() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        Storage.get('searchList').then((value) => {
            if (value) {
                console.log('-- get value From Storage --', value);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(value),
                });
            } else {
                console.log('-- get Create New ds  --', ds);
                this.setState({
                    dataSource: ds,
                });
            }
        });
    }
    // 获取调度单成功回调
    getScheduleSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('搜索调度单',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '搜索页面');
        console.log('============= getSchedule success call back ', result);
        if (result) {
            this.setState({
                loading: false,
            });
            this.props.navigation.navigate('SearchResultForSchedule', {
                productResult: result,
            });
            this.saveSearchList();
        } else {
            Toast.showShortCenter('单号不存在！');
        }
    }

    // 获取订单成功回调
    getOrderSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('搜索运输单', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '搜索页面');
        console.log('============= getOrder success call back ', result);
        this.setState({
            loading: false,
        });
        if (result.length > 0) {
            const order = result[0];
            switch (order.transOrderStatsu) {
                case '3':
                    // 待签收
                    this.props.navigation.navigate('SearchResultForSignIn', {
                        productResult: order,
                    });
                    this.saveSearchList();
                    break;
                case '4':
                    // 待回单
                    this.props.navigation.navigate('SearchResultForToWaitSure', {
                        productResult: order,
                    });
                    this.saveSearchList();
                    break;
                case '5':
                    // 已回单
                    this.props.navigation.navigate('SearchResultForToSure', {
                        productResult: order,
                    });
                    this.saveSearchList();
                    break;
                default:
                    this.props.navigation.navigate('SearchResultForToBeShipped', {
                        productResult: order,
                    });
                    this.saveSearchList();
                    break;
            }
        } else {
            Toast.showShortCenter('单号不存在！');
        }

    }

    // 搜索订单
    searchTransCode(transCode) {
        if (transCode === '') {
            Toast.showShortCenter('单号不能为空！');
            return;
        }
        this.setState({
            transCode,
        });
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_NEW_GET_GOODS_SOURCE,
            params: {
                transCodeList: [ transCode ],
                plateNumber: this.state.plateNumber,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                this.getOrderSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
            },
            finish:()=>{
                this.setState({
                    loading: false,
                })
            }
        });
    }

    // 搜索调度单
    searchScheduleCode(scheduleCode) {
        if (scheduleCode === '') {
            Toast.showShortCenter('单号不能为空！');
            return;
        }
        this.setState({
            transCode: scheduleCode,
        });
        console.log('plateNumber=' + this.state.plateNumber);
        console.log('scheduleCode=' + scheduleCode);
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_NEW_GET_SCHEDULE_INFO_BY_CODE,
            params: {
                scheduleCode,
                plateNumber: this.state.plateNumber,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                this.getScheduleSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
            },
            finish:()=>{
                this.setState({
                    loading: false,
                })
            }
        });
    }

    // 保存历史记录
    saveSearchList() {
        Storage.get('searchList').then((value) => {
            if (value) {
                if (value.length >= 20) {
                    value.pop();
                }
                if (value.indexOf(this.state.transCode) < 0) {
                    value.unshift(this.state.transCode);
                }
                Storage.save('searchList', value);
                console.log('-- save SearchList From Storage --', value);
            } else {
                const searchList = [];
                searchList.unshift(this.state.transCode);
                Storage.save('searchList', searchList);
                console.log('-- save Create New SearchList  --', searchList);
            }
        });
        setTimeout(this.getSearchList, 200);
    }

    // 返回按钮点击事件
    goBack() {
        this.props.navigation.goBack();
    }

    // 删除输入框搜索关键字
    cancelSearch() {
        this.setState({
            transCode: '',
        });
    }

    // 清空历史搜索记录
    clearContent() {
        Storage.remove('searchList');
        this.getSearchList();
    }

    renderRow(rowData) {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (rowData.indexOf('DP') > -1) {
                        this.searchScheduleCode(rowData);
                    } else {
                        this.searchTransCode(rowData);
                    }
                }}
                activeOpacity={0.7}
            >
                <View style={styles.row}>
                    <View style={styles.rowContent}>
                        <View style={styles.title}>
                            <Image
                                source={StaticImage.timeIcon}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: LIGHT_BLACK_TEXT_COLOR,
                                    marginLeft: 10,
                                }}
                            >
                                {rowData}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const cancelView = this.state.transCode ?
            <TouchableOpacity onPress={() => this.cancelSearch()}>
                <View style={styles.iconStyle}>
                    <Image
                        resizeMode="cover"
                        source={StaticImage.closeIcon}
                    />
                </View>
            </TouchableOpacity> : null;
        return (
            <View style={styles.allContainer}>
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <View style={styles.centerContainer}>
                            <View style={styles.searchBox}>
                                <TextInput
                                    placeholder="请输入运单/调度单号查询"
                                    placeholderTextColor="#999999"
                                    value={this.state.transCode}
                                    style={styles.textInput}
                                    returnKeyLabel={'search'}
                                    returnKeyType={'search'}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(transCode) => {
                                        this.setState({transCode});
                                    }}
                                    onSubmitEditing={() => {
                                        if (this.state.transCode) {
                                            if (this.state.transCode.indexOf('DP') > -1) {
                                                this.searchScheduleCode(this.state.transCode);
                                            } else {
                                                this.searchTransCode(this.state.transCode);
                                            }
                                        } else {
                                            Toast.showShortCenter('请输入单号');
                                        }
                                    }}
                                />
                                {cancelView}
                            </View>
                        </View>
                        <View style={styles.rightContainer}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.rightContainer}
                                onPress={this.goBack}
                            >
                                <Text style={styles.rightTitle}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    <View style={styles.tip}>
                        <Text style={{fontSize: 16, color: LIGHT_BLACK_TEXT_COLOR, alignItems: 'center'}}>历史搜索</Text>
                        <Text
                            style={{fontSize: 14, color: GRAY_TEXT_COLOR, alignItems: 'center'}}
                            onPress={() => this.clearContent()}
                        >清空</Text>
                    </View>
                    <ListView
                        style={styles.listView}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                    />
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
