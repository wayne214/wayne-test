/**
 * Created by xizhixin on 2017/9/20.
 * 货源界面
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    ListView,
    Platform,
    RefreshControl,
    InteractionManager,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';
import moment from 'moment';
import { NavigationActions } from 'react-navigation';
import BaseContainer from '../base/baseContainer';
import * as StaticColor from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';
import DropdownMenu from './component/dropdownMenu';
import EmptyView from '../../common/emptyView/emptyView';
import * as API from '../../constants/api';
import HTTPRequest from '../../utils/httpRequest';
import CommonListItem from './goodListItem/commonListItem';
let pageNO = 1; // 第一页
const pageSize = 10; // 每页显示的数量
let list = [];
let startRow = 1;
const screenHeight = Dimensions.get('window').height;

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    listView: {
        backgroundColor: '#F5F5F5',
        paddingTop: 10,
        height: screenHeight - 64 - 49,
    },
    dropDown: {
        ...Platform.select({
            ios: {
                height: 64,
                marginTop: 20,
            },
            android: {
                height: 64,
            },
        }),
    },
});

class GoodSource extends BaseContainer{
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            goodStatus: '1',
            dataSource: ds,
            isLoadMore: true,

            isRefresh: false,
            goodsListLength: 1,
        };

        this.resetParams = this.resetParams.bind(this);

        this.getData = this.getData.bind(this);
        this.getDataSuccessCallBack = this.getDataSuccessCallBack.bind(this);
        this.getDataFailCallBack = this.getDataFailCallBack.bind(this);
    }
    componentDidMount(){
        pageNO = 1;
        if (pageNO === 1) {
            this.setState({
                isRefresh: true,
            });
        }
        this.getDataAndCallBack(this.state.goodStatus, this.state.date, pageNO);
        this.listener = DeviceEventEmitter.addListener('resetgood', () => {
            this.receiveEventAndFetchData();
        });
    }
    componentWillUnmount() {
        this.listener.remove();
    }
    // 刷新
    onRefresh() {
        if (pageNO === 1) {
            this.setState({
                isRefresh: true,
            });
        }

        this.resetParams();
        this.getDataAndCallBack(this.state.goodStatus, this.state.date, pageNO);
    }
    // 获取数据
    getData(status, beginTime, getDataSuccessCallBack, getDataFailCallBack, pageNo) {
        currentTime = new Date().getTime();
        // const beginTimeTemp = this.getPreMonth(moment(new Date()).format('YYYY-MM-DD'));
        const plateNumber = this.props.userPlateNumber;
        console.log('global phone',global.phone);
        HTTPRequest({
            url: API.API_NEW_GET_SOURCE_BY_DATE,
            params: {
                beginTime: '2017-06-01 00:00:00',
                endTime: beginTime,
                pageNum: pageNo,
                pageSize,
                driverPhone: global.phone,
                status,
                plateNumber: plateNumber,
            },
            loading: ()=>{

            },
            success: (responseData)=>{
                console.log('success',responseData);
                this.setState({
                    loading: false,
                }, ()=>{
                    lastTime = new Date().getTime();
                    getDataSuccessCallBack(responseData.result);
                });

            },
            error: (errorInfo)=>{
                this.setState({
                    loading: false,
                });
                getDataFailCallBack();
            },
            finish: ()=>{
            }
        });
    }
    // 成功回调
    getDataSuccessCallBack(result) {
        lastTime = new Date().getTime();
        // ReadAndWriteFileUtil.appendFile('根据时间查询调度单', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
        //     locationData.district, lastTime - currentTime, '货源页面');
        startRow = result.startRow + pageSize;
        console.log('....startRow', startRow);
        if (result.total <= startRow || result.total === 0) {
            this.setState({
                isLoadMore: false,
                goodsListLength: result.list.length,
            });
        } else {
            this.setState({
                isLoadMore: true,
                goodsListLength: result.list.length,
            });
        }

        if (pageNO === 1) {
            list = [];
        }

        list = list.concat(result.list);
        console.log('goooododisfiodojif---list,', list);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
            isRefresh: false,
        });
        // this.getTotalProduct(result.total);
    }
    // 失败回调
    getDataFailCallBack() {
        this.setState({
            isRefresh: false,
            goodsListLength: 0,
        });
    }
    getDataAndCallBack(goodStatus, date, pageNo) {
        this.getData(goodStatus, date, this.getDataSuccessCallBack, this.getDataFailCallBack, pageNo);
    }
    // 重置数据
    resetParams() {
        list = [];
        pageNO = 1;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
        });
    }
    // 收到监听后进行网络请求
    receiveEventAndFetchData() {
        this.resetParams();
        if (pageNO === 1) {
            this.setState({
                isRefresh: true,
            });
        }
        const resetDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        this.getDataAndCallBack('1', resetDate, pageNO);
        this.setState({
            goodStatus: '1',
            date: resetDate,
        });
    }
    // 加载更多
    loadMoreData() {
        if (!this.state.isLoadMore) {
            return;
        }
        pageNO = parseInt(startRow / pageSize, 10) + 1;
        this.getDataAndCallBack(this.state.goodStatus, this.state.date, pageNO);
    }
    // 到达底部的时候会自动触发此方法
    toEnd() {
        // ListView滚动到底部，根据是否正在加载更多 是否正在刷新 是否已加载全部来判断是否执行加载更多
        if (!this.state.isLoadMore || this.state.isRefresh || this.state.goodsListLength === 0) {
            return;
        }
        InteractionManager.runAfterInteractions(() => {
            console.log('触发加载更多 toEnd() --> ');
            this.loadMoreData();
        });
    }
    // listView的分割线
    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`{sectionID}-${rowID}`}
                style={{height: 10, backgroundColor: '#F5F5F5'}}
            />
        );
    }
    renderRow(dataRow) {
        console.log('doadfdfa=====', dataRow);
        return (
            <CommonListItem
                time={dataRow.pushTime}
                transCode={dataRow.dispatchCode}
                distributionPoint={dataRow.distributionPoint !== null ? `${dataRow.distributionPoint}个` : ''}
                arriveTime={dataRow.arrivalTime}
                weight={dataRow.weight !== null ? `${dataRow.totalWeight}Kg` : ''}
                vol={dataRow.vol !== null ? `${dataRow.totalVolume}方` : ''}
                showRejectIcon={this.state.goodStatus !== '1'}
                allocationModel={dataRow.allocationModel}
                onSelect={() => {
                    this.props.navigation.navigate('GoodsDetailPage',{
                        transOrderList: dataRow.transOrderList,
                        scheduleCode: dataRow.dispatchCode,
                        scheduleStatus: this.state.goodStatus,
                        allocationModel: dataRow.allocationModel,
                        bidEndTime: dataRow.bidEndTime,
                        bidStartTime: dataRow.bidBeginTime,
                        refPrice: dataRow.refPrice,
                        getOrderSuccess: () => {
                            // 刷新
                            InteractionManager.runAfterInteractions(() => {
                                this.onRefresh();
                            });
                        },
                    })
                }}
            />
        );
    }
    render() {
        const data = [['待处理', '拒绝']];
        return (
            <View style={styles.container}>
                <DropdownMenu
                    style={styles.dropDown}
                    arrowImg={StaticImage.open}
                    checkImage={StaticImage.radioButton}
                    bgColor={'#1B82D1'}
                    tintColor={'white'}
                    selectItemColor={'black'}
                    data={data}
                    handler={(selection, row) => {
                        this.resetParams();
                        data[selection][row] === '待处理' ?
                            this.getDataAndCallBack('1', this.state.date, pageNO)
                            : this.getDataAndCallBack('2', this.state.date, pageNO);

                        data[selection][row] === '待处理' ?
                            this.setState({goodStatus: '1'})
                            : this.setState({goodStatus: '2'});
                    }
                    }
                    preferences={() => {
                        this.props.navigation.navigate('GoodsPreferencePage');
                    }}
                >
                    <View>
                        {
                            this.state.goodsListLength > 0 ?
                                <ListView
                                    dataSource={this.state.dataSource}
                                    renderRow={this.renderRow.bind(this)}
                                    style={styles.listView}
                                    renderSeparator={this.renderSeparator}
                                    // onEndReached={this.toEnd.bind(this)}
                                    onEndReachedThreshold={100}
                                    enableEmptySections={true}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.isRefresh}
                                            onRefresh={this.onRefresh.bind(this)}
                                            tintColor="#CCC"
                                            colors={['#43B8FF', '#309DED', '#008dcf']}
                                            progressBackgroundColor="#CCC"
                                        />
                                    }
                                />
                                : <EmptyView />
                        }
                    </View>
                </DropdownMenu>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        userPlateNumber: state.app.get('plateNumber'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GoodSource);
