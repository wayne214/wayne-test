import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    ListView,
    StyleSheet,
    RefreshControl,
    InteractionManager,
    DeviceEventEmitter,
    Platform,
    Alert,
} from 'react-native';

import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import * as StaticColor from '../../constants/staticColor';
import OrdersItemCell from './components/ordersItemCell';
import OrderTransportCell from './components/orderTransportCell';
import * as API from '../../constants/api';
import NavigationBar from '../../common/navigationBar/navigationBar';
import EmptyView from '../../common/emptyView/emptyView';
import Storage from '../../utils/storage';
import Toast from '@remobile/react-native-toast';
import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';
import GoodBatchCell from './components/goodBatchCell';
import ProvinceListJson from '../../../assets/data/province.json';
import UniqueUtil from '../../utils/unique';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import HTTPRequest from '../../utils/httpRequest';
import Loading from '../../utils/loading';
import StorageKey from '../../constants/storageKeys';
import {
    isReSetCity,
} from '../../action/order';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    subContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    tabBarUnderLine: {
        backgroundColor: StaticColor.COLOR_MAIN,
        height: 2,
    },
    tab: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 0,
    },
});

let selectPage = 0; // 当前选择的页面 0:全部，1：待发运，2：待签收，3：待回单，4：已回单
let pageNum = 1; // 第一页
const pageSize = 10;// 每页显示数量

let API_URL = API.API_NEW_APP_DISPATCH_DOC_WITH_PAGE;
let userID = '';
let transCodeList = [];

let allListData = []; // 全部数据
let shipListData = []; // 待发运数据
let signListData = []; // 待签收、待回单数据
// let receiptListData = []; // 待回单数据
let endReceiptListData = []; // 已回单数据

let allPage = 1; // 全部页数
let shipPage = 1; // 待发运页数
let signPage = 1; // 待签收页数
// let receiptPage = 1; // 待回单页数
let endReceiptPage = 1; // 已回单页数

let currentTime = 0;
let lastTime = 0;
let locationData = '';


let transCodeListData = [];
let transCodeListData2 = [];
let transCodeListData3 = [];

 class Order extends Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.scan = this.scan.bind(this);
        this.getFinishedOrderDetailAction = this.getFinishedOrderDetailAction.bind(this);
        this.getOrderDetailAction = this.getOrderDetailAction.bind(this);
        this.getOrderTransportDetail = this.getOrderTransportDetail.bind(this);
        this.loadData = this.loadData.bind(this);
        this.toEnd = this.toEnd.bind(this);

        this.getTransPorting = this.getTransPorting.bind(this);
        this.transportBatchSign = this.transportBatchSign.bind(this);

        this.transportsList = this.transportsList.bind(this);
        this.transportStatus = this.transportStatus.bind(this);

        this.submit = this.submit.bind(this);

        const dsAll = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dsShip = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dsSign = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // const dsReceipt = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dsEndReceipt = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            ScrollablePages: 0,
            dataSourceAll: dsAll,
            dataSourceShip: dsShip,
            dataSourceSign: dsSign,
            // dataSourceReceipt: dsReceipt,
            dataSourceEndReceipt: dsEndReceipt,

            isLoadallMore: true,
            isLoadshipMore: true,
            isLoadsignMore: true,
            // isLoadreceiptMore: true,
            isLoadendReceiptMore: true,


            allCount: 1,
            isRefresh: false,

            orderBy: '',
        };
    }

// 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch(e => {
            console.log(e, 'error');
        });
    }

    componentDidMount() {
        this.getCurrentPosition();

        userID = global.userId;

        this.listener = DeviceEventEmitter.addListener('changeOrderTabPage', (page) => {

            console.log('changeOrderTabPagechangeOrderTabPage:' + page);

            this.refs.ScrollableTabView.goToPage(page);

            selectPage = page;
        });


        // 带签收成功，删除全部、带回单、已回单数据，刷新数据
        this.listener1 = DeviceEventEmitter.addListener('changeStateReceipt', () => {

            this.refs.ScrollableTabView.goToPage(2);

            setTimeout(() => {

                allListData = [];
                allPage = 1;

                endReceiptListData = [];
                endReceiptPage = 1;

                signListData = [];
                signPage = 1;

                this.setState({
                    isLoadallMore: true,
                    isLoadsignMore: true,
                    isLoadendReceiptMore: true,
                });

                pageNum = signPage;

                selectPage = 2;
                debugger
                this.loadData(2, pageNum);
            }, 1000);

        });


        // 发运成功，删除全部、待发运、待签收数据。跳转到待签收，加载待签收数据
        this.listener3 = DeviceEventEmitter.addListener('changeToWaitSign', () => {
            this.refs.ScrollableTabView.goToPage(2);

            setTimeout(() => {
                allListData = [];
                allPage = 1;

                shipListData = [];
                shipPage = 1;

                signListData = [];
                signPage = 1;

                pageNum = signPage;
                this.setState({
                    isLoadsignMore: true,
                    isLoadallMore: true,
                    isLoadshipMore: true,
                });

                selectPage = 2;
                debugger
                this.loadData(2, pageNum);
            }, 1000);

        });

        // 接单成功，删除全部、待发运数据，跳转到到发运
        this.listener2 = DeviceEventEmitter.addListener('reloadOrderAllAnShippt', () => {
            this.refs.ScrollableTabView.goToPage(1);

            setTimeout(() => {
                allListData = [];
                allPage = 1;


                shipListData = [];
                shipPage = 1;

                pageNum = shipPage;
                this.setState({
                    isLoadallMore: true,
                    isLoadshipMore: true,
                });

                selectPage = 1;
                debugger
                this.loadData(1, pageNum);
            }, 1000);

        });
        //切换车辆后清空数据
        this.updateOrderListListener = DeviceEventEmitter.addListener('updateOrderList', () => {
            allListData = []; // 全部数据
            shipListData = []; // 待发运数据
            signListData = []; // 待签收数据
            endReceiptListData = []; // 已回单数据

            allPage = 1; // 全部页数
            shipPage = 1; // 待发运页数
            signPage = 1; // 待签收页数
            endReceiptPage = 1; // 已回单页数
            this.setState({
                isLoadallMore: true,
                isLoadshipMore: true,
                isLoadsignMore: true,
                isLoadendReceiptMore: true,
            });
            debugger
            this.loadData(selectPage, 1);
        });

        this.updateShippedDataListener = DeviceEventEmitter.addListener('updateShippedData', () => {
            this.timeout = setTimeout(() => {
                this.onRefresh();
            }, 500);
        });

        setTimeout(() => {
            if (this.props.orderTab) {
                selectPage = this.props.orderTab;
            } else
                selectPage = 0;
            this.refs.ScrollableTabView.goToPage(selectPage);

        }, 100);

        // 默认加载全部第一页数据
        //this.getOrderDetailAction(this.getOrderDetailSuccessCallBack ,this.getOrderDetailFailCallBack, '1', allPage);

        this.resetCityListener = DeviceEventEmitter.addListener('resetCityLIST', () => {
            console.log('global.isBackTracking', global.isBackTracking);
            if (global.isBackTracking) {
                this.getTransPorting();
            }
        });
    }


    componentWillUnmount() {
        this.listener.remove();
        this.listener1.remove();
        this.listener2.remove();
        this.listener3.remove();
        this.updateOrderListListener.remove();
        this.updateShippedDataListener.remove();
        this.resetCityListener.remove();
        this.timeout && clearTimeout(this.timeout);
        allListData = []; // 全部数据
        shipListData = []; // 待发运数据
        signListData = []; // 待签收数据
        // receiptListData = []; // 待回单数据
        endReceiptListData = []; // 已回单数据

        allPage = 1; // 全部页数
        shipPage = 1; // 待发运页数
        signPage = 1; // 待签收页数
        // receiptPage = 1; // 待回单页数
        endReceiptPage = 1; // 已回单页数
        this.setState({
            isLoadallMore: true,
            isLoadshipMore: true,
            isLoadsignMore: true,
            // isLoadreceiptMore: true,
            isLoadendReceiptMore: true,
        });
        // Storage.save('arrLength','0');
    }

    // 刷新
    onRefresh() {
debugger
        switch (selectPage) {
            case 0 : {
                allListData = [];
                allPage = 1;
                pageNum = allPage;
                this.setState({
                    isLoadallMore: true,
                });
                break;
            }
            case 1 : {
                shipListData = [];
                shipPage = 1;
                pageNum = shipPage;
                this.setState({
                    isLoadshipMore: true,
                });
                break;
            }
            case 2 : {
                signListData = [];
                signPage = 1;
                pageNum = signPage;
                this.setState({
                    isLoadsignMore: true,
                });
                break;
            }
            case 3 : {
                endReceiptListData = [];
                endReceiptPage = 1;
                pageNum = endReceiptPage;
                this.setState({
                    isLoadendReceiptMore: true,
                });
                break;
            }
            default :
                break;
        }
        this.loadData(selectPage, pageNum);

    }

    // 加载更多
    loadMoreData() {
        debugger
        switch (selectPage) {
            case 0 : {
                if (!this.state.isLoadallMore) {
                    return;
                }
                allPage++;
                pageNum = allPage;
            }
                break;

            case 1 : {
                if (!this.state.isLoadshipMore) {
                    return;
                }
                shipPage++;
                pageNum = shipPage;
            }
                break;

            case 3 : {
                if (!this.state.isLoadendReceiptMore) {
                    return;
                }
                endReceiptPage++;
                pageNum = endReceiptPage;
            }
                break;

            default :
                break;
        }

        this.loadData(selectPage, pageNum);
    }

    // 获取网络数据 对页面进行填充
    loadData(pageIndex, pageNum) {
        if (pageIndex === 0 || pageIndex === 1) {
            API_URL = API.API_NEW_APP_DISPATCH_DOC_WITH_PAGE;
        } else if (pageIndex === 2) {
            API_URL = API.API_NEW_GET_ORDER_LIST_TRANSPORT;// 代签收、待回单
        } else {
            API_URL = API.API_NEW_GET_ORDER_LIST_V2;// 已回单
        }
        switch (pageIndex) {
            case 0:
                console.log('订单全部界面', pageIndex);
                this.getOrderDetailAction( '1', pageNum, pageSize);
                break;
            case 1:
                console.log('订单待发运界面', pageIndex);
                this.getOrderDetailAction( '2', pageNum, pageSize);
                break;
            case 2:
                console.log('订单运输中界面', pageIndex);
                this.getTransPorting();
                break;
            case 3:
                console.log('订单已完成界面', pageIndex);
                this.getFinishedOrderDetailAction( ['5'], pageNum, pageSize);
                break;
            default:
                break;
        }

    }

    // 获取已完成订单列表
    getFinishedOrderDetailAction(queryType, pageNum, pageSize) {
        currentTime = new Date().getTime();
        if (pageNum === 1) {
            this.setState({
                isRefresh: true,
            })
        }

        HTTPRequest({
            url: API.API_NEW_GET_ORDER_LIST_V2,
            params: {
                page: pageNum,
                pageSize,
                plateNumber: this.props.plateNumber,
                queryType,
            },
            loading: () => {

            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取已完成订单列表', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '订单页面');
                if (!responseData.result.list) {

                    return;
                }
                if (pageNum === 1) {
                    endReceiptListData = [];
                }
                endReceiptListData = endReceiptListData.concat(responseData.result.list);

                if (endReceiptListData.length === responseData.result.total) {
                    this.setState({
                        isLoadendReceiptMore: false,
                        allCount: endReceiptListData.length,
                    });
                }
                this.setState({
                    dataSourceEndReceipt: this.state.dataSourceEndReceipt.cloneWithRows(endReceiptListData),
                });
            },
            error: (errorInfo) => {

            },
            finish: () => {
                this.setState({
                    isRefresh: false,
                });
            }
        });

    }



    // 获取全部、待发运订单列表
    getOrderDetailAction( queryType, pageNum, pageSize) {

        currentTime = new Date().getTime();
        if (pageNum === 1) {
            this.setState({
                isRefresh: true,
            })
        }

        HTTPRequest({
            url: API_URL,
            params: {
                page: pageNum,
                pageSize,
                plateNumber: this.props.plateNumber,
                queryType,
            },
            loading: () => {

            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取订单列表', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '订单页面');
                if (!responseData.result.list) {

                    return;
                }
                switch (responseData.result.orderBy) {
                    case '1' : {
                        if (pageNum === 1) {
                            allListData = [];
                        }
                        allListData = allListData.concat(responseData.result.list);
                        if (allListData.length === responseData.result.total) {
                            this.setState({
                                isLoadallMore: false,
                                allCount: allListData.length,
                            });
                        }

                        this.setState({
                            dataSourceAll: this.state.dataSourceAll.cloneWithRows(allListData),
                        });

                        break;
                    }
                    case '2' : {
                        if (pageNum === 1) {
                            shipListData = [];
                        }
                        shipListData = shipListData.concat(responseData.result.list);

                        if (shipListData.length === responseData.result.total) {
                            this.setState({
                                isLoadshipMore: false,
                                allCount: shipListData.length,
                            })
                        }
                        this.setState({
                            dataSourceShip: this.state.dataSourceShip.cloneWithRows(shipListData),
                        });

                        break;
                    }
                    default :
                        break;
                }

            },
            error: (errorInfo) => {

            },
            finish: () => {
                this.setState({
                    isRefresh: false,
                });
            }
        });


    }


    getOrderTransportDetail(transCodeList) {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_NEW_GET_GOODS_SOURCE,
            params: {
                transCodeList: transCodeList,
            },
            loading: () => {

            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取列表', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '订单页面');
                this.resetCityAction(false);
                if (responseData.result && responseData.result.length > 0) {
                    const cityArray = [];
                    for (let i = 0; i < responseData.result.length; i++) {
                        cityArray.push(responseData.result[i].toCity);
                    }
                    const newArray = UniqueUtil.unique(cityArray);

                    const cityTempArray = [];
                    const provinces = ProvinceListJson.provinces;
                    for (let i = 0; i < provinces.length; i++) {
                        for (let j = 0; j < provinces[i].citys.length; j++) {
                            for (let m = 0; m < newArray.length; m++) {
                                if (newArray[m] === provinces[i].citys[j].departureCityArrayName) {
                                    let obj = provinces[i].citys[j];
                                    cityTempArray.push(obj);
                                    break;
                                }
                            }
                        }
                    }
                    console.log('cityArray', cityTempArray);
                    this.submit(null, null, null, '', cityTempArray, '');
                }

            },
            error: (errorInfo) => {

            },
            finish: () => {
                this.setState({
                    isRefresh: false,
                });
            }
        });



    }

    // 确认设置
    submit(isPlatformDispatch, isBidding, isBackTracking, departureCity, departureCityArray, appointmentTime) {
        currentTime = new Date();
        const {userInfo, plateNumber} = this.props;
        const phoneNum = userInfo.result.phone;
        const userId = userInfo.result.userId;
        const userName = userInfo.result.userName;

        HTTPRequest({
            url: API.API_SET_GOODSOURCE_PREFERENCE,
            params: {
                appointmentEndTime: '',
                appointmentStartTime: '',
                appointmentTime: appointmentTime,
                departureCity: '',
                departureCityArray: departureCityArray,
                isBackTracking: isBackTracking,
                isBidding: isBidding,
                isPlatformDispatch: isPlatformDispatch,
                phoneNum: phoneNum,
                plateNumber: plateNumber,
                userId: userId,
                userName: userName,
            },
            loading: () => {

            },
            success: (responseData) => {

            },
            error: (errorInfo) => {

            },
            finish: () => {
                this.resetCityAction(false);
            }
        });

    }

    resetCityAction(data) {
        this.props.resetCityListAction(data);
    }
    // 到达底部的自动调用
    toEnd() {

        switch (selectPage) {
            case 0 : {
                if (allListData.length === 0 || allListData.length < 5) {
                    return;
                }
            }
                break;

            case 1 : {
                if (shipListData.length === 0 || shipListData.length < 5) {
                    return;
                }
            }
                break;

            case 3 : {
                if (endReceiptListData.length === 0 || endReceiptListData.length < 5) {
                    return;
                }
            }
                break;

            default :
                break;
        }
        this.loadMoreData();
    }

    // 跳转搜索界面
    search() {
        //this.props.router.redirect(RouteType.SEARCH_PAGE);
    }

    // 跳转扫描界面
    scan() {
        /*
        if (Platform.OS === 'ios') {
            PermissionsManager.cameraPermission().then(data => {
                this.props.router.redirect(RouteType.SCAN_PAGE);
            }).catch(err => {
                Alert.alert(null, err.message)
            });
        } else {
            PermissionsManagerAndroid.cameraPermission().then((data) => {
                this.props.router.redirect(RouteType.SCAN_PAGE);
            }, (err) => {
                Alert.alert('提示', '请到设置-应用-授权管理设置相机权限，以使用扫描功能');
            });
        }
        */
    }

    //获取运输中订单列表数据
    getTransPorting() {

        HTTPRequest({
            url: API.API_NEW_GET_ORDER_LIST_TRANSPORT,
            params: {
                pageNum: 0,
                pageSize: 500,
                phoneNum: global.phone,
                plateNumber: this.props.plateNumber,
            },
            loading: () => {

            },
            success: (responseData) => {

                if (this.props.isResetCity) {
                    if (pageNum === 1) {
                        signListData = [];
                    }
                    signListData = signListData.concat(responseData.result.list);
                    this.setState({
                        isRefresh: false,
                        isLoadsignMore: false,
                        allCount: signListData.length,
                        dataSourceSign: this.state.dataSourceSign.cloneWithRows(signListData),
                    });

                    transCodeListData = [];
                    transCodeListData2 = [];
                    transCodeListData3 = [];
                    transCodeListData = transCodeListData.concat(result.list);
                    for (let i = 0; i < transCodeListData.length; i++) {
                        transCodeListData2 = transCodeListData2.concat(transCodeListData[i].transports);
                    }
                    for (let j = 0; j < transCodeListData2.length; j++) {
                        transCodeListData3.push(transCodeListData2[j].transCode);
                    }
                    this.getOrderTransportDetail(transCodeListData3);
                } else {
                    if (pageNum === 1) {
                        signListData = [];
                    }
                    signListData = signListData.concat(responseData.result.list);
                    this.setState({
                        isRefresh: false,
                        isLoadsignMore: false,
                        allCount: signListData.length,
                        dataSourceSign: this.state.dataSourceSign.cloneWithRows(signListData),
                    });
                }
            },
            error: (errorInfo) => {

            },
            finish: () => {
            }
        });
    }

    transportBatchSign(dataRow) {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_TRANSPORT_BATCH_SIGN,
            params: {
                lastOperator: global.userName,
                lastOperatorId: global.userId,
                phoneNum: global.phone,
                plateNumber: this.props.plateNumber,
                transCodeList: this.transportsList(dataRow),
            },
            loading: () => {

            },
            success: (responseData) => {

                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('批量签收', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '订单页面');
                selectPage = 2;
                this.onRefresh();
            },
            error: (errorInfo) => {

            },
            finish: () => {
            }
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

    listView(number) {

        return (
            <ListView
                dataSource={number === 1 ? this.state.dataSourceAll : number === 2 ? this.state.dataSourceShip :
                    number === 3 ? this.state.dataSourceSign : this.state.dataSourceEndReceipt}
                renderRow={number === 3 ? this.renderRowItem.bind(this) : this.renderRow.bind(this)}
                renderSeparator={number === 3 ? null : this.renderSeparator}
                enableEmptySections={true}
                onEndReached={number === 3 ? null : this.toEnd.bind(this)}
                onEndReachedThreshold={100}
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false}// 去掉右侧滚动指示条
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
        );
    }

    // 运输中item
    renderRowItem(dataRow) {
        // const contactInfo = dataRow.deliveryInfo;
        if ( dataRow.transCodeNum !== 0 && dataRow.transports.length === 1) {
            return (
                <OrderTransportCell
                    title={dataRow.receiveContact ? dataRow.receiveContact : ''}
                    transCodeList={dataRow.transports}
                    ordersNum={dataRow.transCodeNum}
                    receiveAddress={dataRow.receiveAddress}
                    contact={dataRow.receiveContactName ? dataRow.receiveContactName : ''}
                    phoneNum={dataRow.phoneNum}
                    onSelect={() => {
                        this.props.router.redirect(RouteType.SEARCH_RESULT_ONLY_PAGE, {
                            productResult: dataRow.transports[0].transCode,
                        });
                    }}
                />
            );
        } else if(dataRow.transCodeNum !== 0 && dataRow.transports.length > 1){
            return (
                <GoodBatchCell
                    receiveContact={dataRow.receiveContact}
                    receiveAddress={dataRow.receiveAddress}
                    receiveContactName={dataRow.receiveContactName}
                    ordersNum={dataRow.transCodeNum}
                    transCodeList={dataRow.transports}
                    phoneNum={dataRow.phoneNum}
                    isDisabled={this.transportStatus(dataRow)}
                    onButton={() => {
                        this.transportBatchSign(dataRow);
                    }}
                    onSelect={() => {
                        this.props.router.redirect(RouteType.ORDER_ENTRY_TO_BE_SIGNIN, {
                            transOrderList: this.transportsList(dataRow),
                        });
                    }}
                />
            );
        }else {
            return null;
        }
    }

    transportsList(dataRow) {
        let list = [];
        for (var i = 0; i < dataRow.transports.length; i++) {
            list.push(dataRow.transports[i].transCode);
        }
        return list;
    }

    // 根据返回的状态码判断批量签收按钮状态
    transportStatus(dataRow) {

        let transportStatusList = [];
        for (var i = 0; i < dataRow.transports.length; i++) {
            if (dataRow.transports[i].transOrderStatus == 20) {
                transportStatusList.push(1)
            }
        }
        if (transportStatusList.length > 0) {
            return false;
        } else {
            return true;
        }
    }


    renderRow(dataRow, sectionID, rowID) {
        return (
            <OrdersItemCell
                time={dataRow.time}
                scheduleCode={dataRow.scheduleCode}
                distributionPoint={dataRow.distributionPoint}
                arrivalTime={dataRow.arrivalTime}
                weight={dataRow.weight}
                vol={dataRow.vol}
                stateName={dataRow.stateName}
                dispatchStatus={dataRow.dispatchStatus}
                orderStatus={selectPage}
                onSelect={() => {

                    if (dataRow.distributionPoint === 0) {
                        Toast.showShortCenter('暂无详情');
                        return;
                    }
                    if (selectPage === 0) {
                        if (dataRow.dispatchStatus === '1') {
                            // 待发运
                            this.props.router.redirect(RouteType.ORDER_ENTRY_TO_BE_SHIPPED, {
                                transOrderList: dataRow.transOrderList,
                                scheduleCode: dataRow.scheduleCode,
                                successCallBack: () => {
                                    // 刷新
                                    InteractionManager.runAfterInteractions(() => {
                                        setTimeout(() => {
                                            this.onRefresh();
                                        }, 500);
                                    });
                                },
                            });
                        } else {
                            // 待签收、待回单、已回单
                            this.props.router.redirect(RouteType.ORDER_ENTRY_TO_BE_SIGNIN, {
                                transOrderList: dataRow.transOrderList,
                            });
                        }

                    } else if (selectPage === 1) {
                        // 待发运，跳转到 待发运
                        this.props.router.redirect(RouteType.ORDER_ENTRY_TO_BE_SHIPPED, {
                            transOrderList: dataRow.transOrderList,
                            scheduleCode: dataRow.scheduleCode,
                            successCallBack: () => {
                                // 刷新
                                InteractionManager.runAfterInteractions(() => {
                                    //setTimeout(()=>{
                                    /*
                                     this.onRefresh();
                                     allListData = [];
                                     allPage =1;
                                     this.setState({
                                     isLoadallMore: true,
                                     });

                                     */
                                    delete shipListData[rowID];
                                    this.setState({
                                        dataSourceShip: this.state.dataSourceShip.cloneWithRows(shipListData)
                                    });
                                    //},500);
                                });
                            },
                        });
                    } else {
                        // 其他的都跳转到  ORDER_ENTRY_TO_BE_SIGNIN
                        this.props.router.redirect(RouteType.ORDER_ENTRY_TO_BE_SIGNIN, {
                            transOrderList: dataRow.transOrderList,
                        });
                    }
                }}
            />
        );
    }

    render() {
        const {navigator} = this.props;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'订单'}
                    navigator={navigator}
                    leftIconFont="&#xe618;"
                    leftButtonConfig={{
                        type: 'font',
                        onClick: () => {
                            this.scan();
                        },
                    }}
                    rightIconFont="&#xe619;"
                    rightButtonConfig={{
                        type: 'font',
                        onClick: () => {
                            this.search();
                        },
                    }}
                />

                <ScrollableTabView
                    style={{backgroundColor: '#e8e8e8'}}
                    ref="ScrollableTabView"
                    initialPage={0}
                    scrollWithoutAnimation={false}
                    //page={this.props.orderTab}
                    tabBarUnderlineStyle={styles.tabBarUnderLine}
                    // prerenderingSiblingsNumber={0}
                    renderTabBar={() =>
                        <ScrollableTabBar
                            activeTextColor="#008dcf"
                            inactiveTextColor="#333333"
                            underlineHeight={0}
                            textStyle={{fontSize: 14}}
                            backgroundColor="#ffffff"
                            tabStyle={styles.tab}
                        />
                    }
                    onChangeTab={(object) => {
                        selectPage = object.i;

                        console.log('object:' + object.i);

                        console.log('selectPage:' + selectPage);

                        switch (selectPage) {
                            case 0 : {
                                this.setState({
                                    dataSourceAll: this.state.dataSourceAll.cloneWithRows(allListData),
                                    orderBy: 0,
                                });
                                if (allListData.length > 0) {
                                    this.setState({
                                        allCount: allListData.length,
                                    });
                                }
                                pageNum = allPage;

                            }
                                break;

                            case 1 : {
                                this.setState({
                                    dataSourceShip: this.state.dataSourceShip.cloneWithRows(shipListData),
                                    orderBy: 1,
                                });
                                if (shipListData.length > 0) {
                                    this.setState({
                                        allCount: shipListData.length,
                                    });
                                } else {
                                    this.setState({
                                        allCount: 1,
                                    });
                                }
                                pageNum = shipPage;

                            }
                                break;
                            case 2: {
                                this.setState({
                                    dataSourceSign: this.state.dataSourceEndReceipt.cloneWithRows(signListData),
                                });
                                if (signListData.length > 0) {
                                    this.setState({
                                        allCount: signListData.length,
                                    });
                                    return;
                                } else {
                                    this.setState({
                                        allCount: 1,
                                    });
                                }
                                pageNum = signPage;

                            }
                                break;
                            case 3 : {
                                this.setState({
                                    dataSourceEndReceipt: this.state.dataSourceEndReceipt.cloneWithRows(endReceiptListData),
                                });
                                if (endReceiptListData.length > 0) {
                                    this.setState({
                                        allCount: endReceiptListData.length,
                                    });
                                    return;
                                } else {
                                    this.setState({
                                        allCount: 1,
                                    });
                                }
                                pageNum = endReceiptPage;

                            }
                                break;

                            default :
                                break;
                        }

                             
                            this.loadData(selectPage, pageNum);

                    }}

                >
                    <View
                        tabLabel="全部"
                        style={styles.subContainer}
                    >
                        {
                            this.state.allCount > 0 ? this.listView(1) :
                                <EmptyView />
                        }
                    </View>
                    <View
                        tabLabel="待发运"
                        style={styles.subContainer}
                    >
                        {
                            this.state.allCount > 0 ? this.listView(2) :
                                <EmptyView />
                        }
                    </View>
                    <View
                        tabLabel="运输中"
                        style={styles.subContainer}
                    >
                        {
                            this.state.allCount > 0 ? this.listView(3) :
                                <EmptyView />
                        }
                    </View>
                    <View
                        tabLabel="已完成"
                        style={styles.subContainer}
                    >
                        {
                            this.state.allCount > 0 ? this.listView(5) :
                                <EmptyView />
                        }
                    </View>
                </ScrollableTabView>

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userInfo: state.user.get('userInfo'),
        plateNumber: state.user.get('plateNumber'),
        isResetCity: state.order.get('isResetCity'),
        orderTab: state.order.get('mainPress'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        //刷新城市列表
        resetCityListAction: (data) => {
            dispatch(isReSetCity(data));
        },
    };
}

 export default connect(mapStateToProps, mapDispatchToProps)(Order);
