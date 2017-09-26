/**
 * Created by xizhixin on 2017/9/20.
 * 货源界面
 */
import React, {Component, PropTypes} from 'react';
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
import BaseContainer from '../base/baseContainer';
import * as StaticColor from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';
import DropdownMenu from './component/dropdownMenu';
import EmptyView from '../../common/emptyView/emptyView';
import * as API from '../../constants/api';

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

        // this.getData = this.getData.bind(this);
        // this.getDataSuccessCallBack = this.getDataSuccessCallBack.bind(this);
        // this.getDataFailCallBack = this.getDataFailCallBack.bind(this);
    }
    componentDidMount(){
    }
    // 获取数据
    // getData(status, beginTime, getDataSuccessCallBack, getDataFailCallBack, pageNo) {
    //     currentTime = new Date().getTime();
    //     // const beginTimeTemp = this.getPreMonth(moment(new Date()).format('YYYY-MM-DD'));
    //     const plateNumber = this.props.userPlateNumber;
    //     Storage.get('userInfo').then((value) => {
    //         if (value) {
    //             this.props.requestGoodsSourceData({
    //                 beginTime: '2017-06-01 00:00:00',
    //                 endTime: beginTime,
    //                 page: pageNO,
    //                 pageSize,
    //                 driverPhone: value.result.phone,
    //                 status,
    //                 plateNumber: plateNumber,
    //             }, getDataSuccessCallBack, getDataFailCallBack, pageNo);
    //         }
    //     });
    // }
    resetParams() {
        list = [];
        pageNO = 1;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
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
                    // this.props.router.redirect(RouteType.GOODS_SOURCE_DETAILS, {
                    //     transOrderList: dataRow.transOrderList,
                    //     scheduleCode: dataRow.dispatchCode,
                    //     scheduleStatus: this.state.goodStatus,
                    //     allocationModel: dataRow.allocationModel,
                    //     bidEndTime: dataRow.bidEndTime,
                    //     bidStartTime: dataRow.bidBeginTime,
                    //     refPrice: dataRow.refPrice,
                    //     getOrderSuccess: () => {
                    //         // 刷新
                    //         InteractionManager.runAfterInteractions(() => {
                    //             this.onRefresh();
                    //         });
                    //     },
                    // });
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
                        // data[selection][row] === '待处理' ?
                        //     this.getDataAndCallBack('1', this.state.date, pageNO)
                        //     : this.getDataAndCallBack('2', this.state.date, pageNO);
                        //
                        // data[selection][row] === '待处理' ?
                        //     this.setState({goodStatus: '1'})
                        //     : this.setState({goodStatus: '2'});
                    }
                    }
                    preferences={() => {
                        // this.props.router.redirect(RouteType.GOODS_SOURCE_PREFERENCES_PAGE);
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
                                    // refreshControl={
                                    //     <RefreshControl
                                    //         refreshing={this.state.isRefresh}
                                    //         onRefresh={this.onRefresh.bind(this)}
                                    //         tintColor="#CCC"
                                    //         colors={['#43B8FF', '#309DED', '#008dcf']}
                                    //         progressBackgroundColor="#CCC"
                                    //     />
                                    // }
                                />
                                : <EmptyView />
                        }
                    </View>
                </DropdownMenu>
            </View>
        )
    }
}

export default GoodSource;
