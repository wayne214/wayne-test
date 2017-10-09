/**
 * Created by xizhixin on 2017/5/8.
 * 调度单搜索结果
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    Platform,
    ListView,
    TouchableOpacity,
    DeviceEventEmitter,
    InteractionManager,
} from 'react-native';

import * as API from '../../../constants/api';
import Storage from '../../../utils/storage';
import HTTPRequest from '../../../utils/httpRequest';

import CommonListItem from '../../goodSource/goodListItem/commonListItem';

import Toast from '@remobile/react-native-toast';
import StaticImage from '../../../constants/staticImage';

import {
    GRAY_TITLE_COLOR,
    GRAY_TEXT_COLOR,
    COLOR_VIEW_BACKGROUND,
    WHITE_COLOR,
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
                // height:40,
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
    text: {
        fontSize: 16,
        color: LIGHT_BLACK_TEXT_COLOR,
        alignItems: 'center',
    },
});

class SearchResultForSchedule extends Component {
    constructor(props) {
        super(props);

        // 得到上一级传过来的值，把值放进state中，this.state.xxx取值
        const params = this.props.navigation.state().params;

        // 绑定点击事件
        this.goBack = this.goBack.bind(this);
        this.searchTransCode = this.searchTransCode.bind(this);
        this.searchScheduleCode = this.searchScheduleCode.bind(this);
        this.getOrderSuccessCallBack = this.getOrderSuccessCallBack.bind(this);
        this.getScheduleSuccessCallBack = this.getScheduleSuccessCallBack.bind(this);
        this.saveSearchList = this.saveSearchList.bind(this);

        // 初始化listView
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            transCode: '',
            dataSource: ds.cloneWithRows(params),
            plateNumber: '',
            loading: false,
        };
    }

    componentDidMount() {
        Storage.get('plateNumber').then((value) =>{
            if (value) {
                console.log('value=' + value);
                this.setState({
                    plateNumber: value,
                });
            }
        });
    }

    componentWillUnmount() {
        const current = this.props.routes[this.props.routes.length-1];
        if (this.props.navigation && this.props.routes.length > 1) {
            if (current.routeName === 'Scan') { // 上一个界面为扫描，发监听开启扫描动画
                DeviceEventEmitter.emit('startAni');
                console.log('startAni',current.routeName);
            }else if (current.routeName === 'Search') { // 上一个界面为搜索，发监听刷新历史数据
                DeviceEventEmitter.emit('searchHistory');
                console.log('searchHistory',current.routeName);
            }
        }
    }

    // 获取调度单成功回调
    getScheduleSuccessCallBack(result) {
        console.log('============= getSchedule success call back ', result);
        if (result) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result),
            });
            this.saveSearchList();
        }
    }

    // 获取订单成功回调
    getOrderSuccessCallBack(result) {
        console.log('============= getOrder success call back ', result);
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


    // 搜索订单
    searchTransCode(transCode) {
        console.log('transCode=', transCode);
        if (transCode === '') {
            Toast.showShortCenter('单号不能为空！');
            return;
        }
        this.setState({
            transCode,
        });
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
        console.log('scheduleCode=', scheduleCode);
        if (scheduleCode === '') {
            Toast.showShortCenter('单号不能为空！');
            return;
        }
        this.setState({
            transCode: scheduleCode,
        });
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

    renderRow(rowData, selectionID, rowID) {
        return (
            <CommonListItem
                time={rowData.pushTime}
                transCode={rowData.dispatchCode}
                distributionPoint={rowData.distributionPoint != null ? `${rowData.distributionPoint}个` : ''}
                arriveTime={rowData.arrivalTime}
                weight={rowData.totalWeight != null ? `${rowData.totalWeight}Kg` : ''}
                vol={rowData.totalVolume != null ? `${rowData.totalVolume}方` : ''}
                allocationModel={rowData.allocationModel}
                // showRejectIcon={this.state.goodStatus == '1' ? false : true}
                onSelect={() => {
                    const orderIDs = [];
                    rowData.transOrderList.map((item, index) => {
                        orderIDs.push(item.transOrder);
                    });
                    if (rowData.dispatchStatus === 1) {
                        // 待发运，跳转到  ORDER_ENTRY_TO_BE_SHIPPED
                        this.props.navigation.navigate('SearchResultForToBeShipped', {
                            transOrderList: orderIDs,
                            scheduleCode: rowData.dispatchCode,
                            successCallBack: () => {
                                // 刷新
                                // InteractionManager.runAfterInteractions(() => {
                                    let shipListData = [];
                                    this.setState({
                                        dataSource: this.state.dataSource.cloneWithRows(shipListData)
                                    });
                                    DeviceEventEmitter.emit('updateShippedData');
                                    // this.props.navigator.pop();
                                // });
                            },
                        });
                    } else {
                        // 其他的都跳转到  ORDER_ENTRY_TO_BE_SIGNIN
                        this.props.navigation.navigate('SearchResultForSignIn', {
                            transOrderList: orderIDs,
                        });
                    }
                }}
            />
        );
    }

    renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View
                key={`{sectionID}-${rowID}`}
                style={{
                    height: 10,
                    backgroundColor: COLOR_VIEW_BACKGROUND,
                }}
            />
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
                                        if (this.state.transCode.indexOf('DP') > -1) {
                                            this.searchScheduleCode(this.state.transCode);
                                        } else {
                                            this.searchTransCode(this.state.transCode);
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
                        <Text style={styles.text}>
                            搜索结果
                        </Text>
                    </View>
                    <ListView
                        style={styles.listView}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        renderSeparator={this.renderSeparator}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        routes: state.nav.routes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultForSchedule);

