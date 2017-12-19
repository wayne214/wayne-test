import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    ListView,
    StyleSheet,
    RefreshControl,
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
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    subContainer: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    tabBarUnderLine: {
        backgroundColor: StaticColor.BLUE_CONTACT_COLOR,
        height: 2,
    },
    tab: {
        paddingLeft: 5,
        paddingRight: 5,
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
let receiptListData = []; // 待回单数据
// let endReceiptListData = []; // 已回单数据

let allPage = 1; // 全部页数
let shipPage = 1; // 待发运页数
let signPage = 1; // 待签收页数
let receiptPage = 1; // 待回单页数
// let endReceiptPage = 1; // 已回单页数

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
        this.getReceiveOrderDetailAction = this.getReceiveOrderDetailAction.bind(this);
        this.getOrderDetailAction = this.getOrderDetailAction.bind(this);
        this.getOrderTransportDetail = this.getOrderTransportDetail.bind(this);
        this.loadData = this.loadData.bind(this);
        this.toEnd = this.toEnd.bind(this);

        this.getTransPorting = this.getTransPorting.bind(this);
        this.getWaitForSignList = this.getWaitForSignList.bind(this);
        this.transportBatchSign = this.transportBatchSign.bind(this);

        this.transportsList = this.transportsList.bind(this);
        this.orderCodeList = this.orderCodeList.bind(this);
        this.transportStatus = this.transportStatus.bind(this);

        this.submit = this.submit.bind(this);

        const dsAll = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dsShip = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dsSign = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dsReceipt = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // const dsEndReceipt = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            ScrollablePages: 0,
            dataSourceAll: dsAll,
            dataSourceShip: dsShip,
            dataSourceSign: dsSign,
            dataSourceReceipt: dsReceipt,
            // dataSourceEndReceipt: dsEndReceipt,

            isLoadallMore: true,
            isLoadshipMore: true,
            isLoadsignMore: true,
            isLoadreceiptMore: true,
            // isLoadendReceiptMore: true,

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


        // 刷新待回单列表数据
        this.listener1 = DeviceEventEmitter.addListener('changeStateReceipt', () => {
            this.refs.ScrollableTabView.goToPage(3);
            setTimeout(() => {
                allListData = [];
                allPage = 1;

                shipListData = [];
                shipPage = 1;

                receiptListData = [];
                receiptPage = 1;

                this.setState({
                    isLoadallMore: true,
                    isLoadsignMore: true,
                    isLoadreceiptMore: true,
                });

                pageNum = signPage;

                selectPage = 3;

                this.loadData(3, pageNum);
            }, 1000);

        });

        // 刷新待签收列表数据
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
                    dataSourceAll: this.state.dataSourceAll.cloneWithRows(allListData),
                    dataSourceShip: this.state.dataSourceShip.cloneWithRows(shipListData),
                    dataSourceSign: this.state.dataSourceSign.cloneWithRows(signListData),
                });

                selectPage = 2;
                  
                this.loadData(2, pageNum);
            }, 1000);

        });

        // 刷新待发运列表数据
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
                
                this.loadData(1, pageNum);
            }, 1000);

        });

        //切换车辆后清空数据
        this.updateOrderListListener = DeviceEventEmitter.addListener('updateOrderList', () => {
            allListData = []; // 全部数据
            shipListData = []; // 待发运数据
            signListData = []; // 待签收数据
            receiptListData = []; // 待回单数据

            allPage = 1; // 全部页数
            shipPage = 1; // 待发运页数
            signPage = 1; // 待签收页数
            receiptPage = 1; // 待回单页数
            this.setState({
                isLoadallMore: true,
                isLoadshipMore: true,
                isLoadsignMore: true,
                isLoadreceiptMore: true,
            });
              
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
        receiptListData = []; // 待回单数据
        // endReceiptListData = []; // 已回单数据

        allPage = 1; // 全部页数
        shipPage = 1; // 待发运页数
        signPage = 1; // 待签收页数
        receiptPage = 1; // 待回单页数
        // endReceiptPage = 1; // 已回单页数
        this.setState({
            isLoadallMore: true,
            isLoadshipMore: true,
            isLoadsignMore: true,
            isLoadreceiptMore: true,
            // isLoadendReceiptMore: true,
        });
        // Storage.save('arrLength','0');
    }

    // 刷新
    onRefresh() {
  
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
                receiptListData = [];
                receiptPage = 1;
                pageNum = receiptPage;
                this.setState({
                    isLoadreceiptMore: true,
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
                receiptPage++;
                pageNum = receiptPage;
            }
                break;

            default :
                break;
        }

        this.loadData(selectPage, pageNum);
    }

    // 获取网络数据 对页面进行填充
    loadData(pageIndex, pageNum) {
        switch (pageIndex) {
            case 0:
                console.log('订单全部界面', pageIndex);
                this.getOrderDetailAction( 'AAA', pageNum, pageSize);
                break;
            case 1:
                console.log('订单待发运界面', pageIndex);
                this.getOrderDetailAction( 'BBB', pageNum, pageSize);
                break;
            case 2:
                console.log('订单待签收界面', pageIndex);
                if(1===1) {
                    this.getWaitForSignList('CCC',pageNum, pageSize);
                }else {
                    this.getTransPorting();
                }
                break;
            case 3:
                console.log('订单待回单界面', pageIndex);
                this.getReceiveOrderDetailAction('CCC', pageNum, pageSize);
                break;
            default:
                break;
        }

    }

    // 获取待回单订单列表
    getReceiveOrderDetailAction(queryType, pageNum, pageSize) {
        currentTime = new Date().getTime();
        if (pageNum === 1) {
            this.setState({
                isRefresh: true,
            })
        }

        HTTPRequest({
            url: API.API_NEW_GET_RECEIVE_ORDER_LIST,
            params: {
                page: pageNum,
                pageSize,
                phone: global.phone,
                plateNumber: global.plateNumber,
                queryType,
            },
            loading: () => {

            },
            success: (responseData) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取待回单订单列表', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '订单页面');
                if (!responseData.result.list) {

                    return;
                }
                if (pageNum === 1) {
                    receiptListData = [];
                }
                receiptListData = receiptListData.concat(responseData.result.list);

                if (receiptListData.length === responseData.result.total) {
                    this.setState({
                        isLoadreceiptMore: false,
                        allCount: receiptListData.length,
                    });
                }
                this.setState({
                    dataSourceReceipt: this.state.dataSourceReceipt.cloneWithRows(receiptListData),
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
    getOrderDetailAction(queryType, pageNum, pageSize) {
        currentTime = new Date().getTime();
        if (pageNum === 1) {
            this.setState({
                isRefresh: true,
            })
        }
        if (global.plateNumber) {
            HTTPRequest({
                url: API_URL,
                params: {
                    page: pageNum,
                    pageSize,
                    phone: global.phone,
                    plateNumber: global.plateNumber,
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
                    switch (queryType) {
                        case 'AAA' : {
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
                        case 'BBB' : {
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
        const phoneNum = userInfo.phone;
        const userId = userInfo.userId;
        const userName = userInfo.userName;

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
                if (receiptListData.length === 0 || receiptListData.length < 5) {
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
        this.props.navigation.navigate('Search');
    }

    // 跳转扫描界面
    scan() {
        if (Platform.OS === 'ios') {
            PermissionsManager.cameraPermission().then(data => {
                this.props.navigation.navigate('Scan');
            }).catch(err => {
                Alert.alert(null, err.message)
            });
        } else {
            PermissionsManagerAndroid.cameraPermission().then((data) => {
                this.props.navigation.navigate('Scan');
            }, (err) => {
                Alert.alert('提示', '请到设置-应用-授权管理设置相机权限，以使用扫描功能');
            });
        }
    }

     // 车主获取待签收订单列表
     getWaitForSignList(queryType, pageNum, pageSize) {
         currentTime = new Date().getTime();
         if (pageNum === 1) {
             this.setState({
                 isRefresh: true,
             })
         }

         HTTPRequest({
             url: API.API_NEW_GET_RECEIVE_ORDER_LIST,
             params: {
                 page: pageNum,
                 pageSize,
                 phone: global.phone,
                 plateNumber: global.plateNumber,
                 queryType,
             },
             loading: () => {

             },
             success: (responseData) => {
                 lastTime = new Date().getTime();
                 ReadAndWriteFileUtil.appendFile('车主获取待签收订单列表', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                     locationData.district, lastTime - currentTime, '订单页面');
                 if (!responseData.result.list) {
                     return;
                 }
                 if (pageNum === 1) {
                     signListData = [];
                 }
                 signListData = signListData.concat(responseData.result.list);

                 if (signListData.length === responseData.result.total) {
                     this.setState({
                         isLoadsignMore: false,
                         allCount: signListData.length,
                     });
                 }
                 this.setState({
                     dataSourceSign: this.state.dataSourceReceipt.cloneWithRows(signListData),
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
                let result = responseData.result;
                if (this.props.isResetCity) {
                    if (pageNum === 1) {
                        signListData = [];
                    }
                    signListData = signListData.concat(result.list);
                    console.log('result123=======',result.list);
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
                        this.setState({
                            dataSourceSign: this.state.dataSourceSign.cloneWithRows(signListData),
                        });
                    }
                    signListData = signListData.concat(result.list);
                    console.log('result456=======',result.list);
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
                orderCodeList: this.orderCodeList(dataRow),
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
                console.log('errorInfo=', errorInfo);
                if(errorInfo.code === 800){
                    Alert.alert('批量签收前请先完成收款');
                }
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
                    number === 3 ? this.state.dataSourceSign : this.state.dataSourceReceipt}
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
        if (1===1) {
            const pushTime = dataRow.time ? dataRow.time.replace(/-/g,'/').substring(0, dataRow.time.length - 3) : '';
            const arrivalTime = dataRow.arrivalTime ? dataRow.arrivalTime.replace(/-/g,'/').substring(0, dataRow.arrivalTime.length - 5) : '';
            // 货品类型
            const orderDetaiTypeList = dataRow.ofcOrderDetailTypeDtoList;
            let goodTepesTemp = [];
            let goodTypesName = [];
            if(orderDetaiTypeList.length > 0) {
                let good = '';
                for (let i = 0; i < orderDetaiTypeList.length; i++) {
                    good = orderDetaiTypeList[i];
                    goodTepesTemp = goodTepesTemp.concat(good.goodsTypes);
                }
                // 去重
                goodTypesName = UniqueUtil.unique(goodTepesTemp);
            } else {
                goodTypesName.push('其他');
            }
            return (
                <OrdersItemCell
                    time={pushTime}
                    scheduleCode={dataRow.scheduleCode}
                    scheduleRoutes={dataRow.scheduleRoutes}
                    distributionPoint={dataRow.distributionPoint}
                    arrivalTime={arrivalTime}
                    weight={dataRow.weight}
                    vol={dataRow.vol}
                    stateName={dataRow.stateName}
                    dispatchStatus={dataRow.dispatchStatus}
                    orderStatus={selectPage}
                    goodKindsNames={goodTypesName} // 货品种类
                    waitBeSureOrderNum={dataRow.waitBeSureOrderNum}
                    beSureOrderNum={dataRow.beSureOrderNum}
                    transCodeNum={dataRow.transCodeNum}
                    goodsCount={200}
                    temperature={2}
                    onSelect={() => {
                        if (dataRow.distributionPoint === 0) {
                            Toast.showShortCenter('暂无详情');
                            return;
                        }
                        // 其他的都跳转到  ORDER_ENTRY_TO_BE_SIGNIN
                        this.props.navigation.navigate('EntryToBeSignIn', {
                            transOrderList: dataRow.transOrderList,
                        });
                    }}
                />
            );
        }else {
            if ( dataRow.transCodeNum !== 0) {
                return (
                    <OrderTransportCell
                        receiveContact={dataRow.receiveContact ? dataRow.receiveContact : ''}
                        transCodeList={dataRow.transports}
                        ordersNum={dataRow.transCodeNum}
                        receiveAddress={dataRow.receiveAddress}
                        receiveContactName={dataRow.receiveContactName ? dataRow.receiveContactName : ''}
                        phoneNum={dataRow.phoneNum}
                        isBatchSign={dataRow.transports.length > 1}
                        orderSignNum={dataRow.orderSignNum}
                        onSelect={() => {
                            this.props.navigation.navigate('EntryToBeSignIn', {
                                transOrderList: this.transportsList(dataRow),
                            })
                        }}
                        onButton={() => {
                            this.transportBatchSign(dataRow);
                        }}
                    />
                );
            }else {
                return null;
            }
        }
    }
     // 运单号集合
     transportsList(dataRow) {
         let list = [];
         for (let i = 0; i < dataRow.transports.length; i++) {
            list.push(dataRow.transports[i].transCode);
         }
         return list;
     }

     // 订单号集合
     orderCodeList(dataRow) {
         let list = [];
         for (let i = 0; i < dataRow.transports.length; i++) {
             list.push(dataRow.transports[i].orderCode);
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
        const pushTime = dataRow.time ? dataRow.time.replace(/-/g,'/').substring(0, dataRow.time.length - 3) : '';
        const arrivalTime = dataRow.arrivalTime ? dataRow.arrivalTime.replace(/-/g,'/').substring(0, dataRow.arrivalTime.length - 5) : '';
        // 货品类型
        const orderDetaiTypeList = dataRow.ofcOrderDetailTypeDtoList;
        let goodTepesTemp = [];
        let goodTypesName = [];
        if(orderDetaiTypeList.length > 0) {
            let good = '';
            for (let i = 0; i < orderDetaiTypeList.length; i++) {
                good = orderDetaiTypeList[i];
                goodTepesTemp = goodTepesTemp.concat(good.goodsTypes);
            }
            // 去重
            goodTypesName = UniqueUtil.unique(goodTepesTemp);
        } else {
            goodTypesName.push('其他');
        }
        return (
            <OrdersItemCell
                time={pushTime}
                scheduleCode={dataRow.scheduleCode}
                scheduleRoutes={dataRow.scheduleRoutes}
                distributionPoint={dataRow.distributionPoint}
                arrivalTime={arrivalTime}
                weight={dataRow.weight}
                vol={dataRow.vol}
                stateName={dataRow.stateName}
                dispatchStatus={dataRow.dispatchStatus}
                orderStatus={selectPage}
                goodKindsNames={goodTypesName} // 货品种类
                waitBeSureOrderNum={dataRow.waitBeSureOrderNum}
                beSureOrderNum={dataRow.beSureOrderNum}
                transCodeNum={dataRow.transCodeNum}
                goodsCount={200}
                temperature={2}
                onSelect={() => {
                    if (dataRow.distributionPoint === 0) {
                        Toast.showShortCenter('暂无详情');
                        return;
                    }
                    if (selectPage === 0) {
                        if (dataRow.stateName === '待发运') {
                            // 待发运
                            this.props.navigation.navigate('EntryToBeShipped', {
                                transOrderList: dataRow.transOrderList,
                                scheduleCode: dataRow.scheduleCode,
                                successCallBack: () => {
                                    // 刷新
                                    setTimeout(() => {
                                        this.onRefresh();
                                    }, 500);
                                },
                            });
                        } else {
                            // 待签收、待回单、已完成
                            this.props.navigation.navigate('EntryToBeSignIn', {
                                transOrderList: dataRow.transOrderList,
                            });
                        }

                    } else if (selectPage === 1) {
                        // 待发运，跳转到 待发运
                        this.props.navigation.navigate('EntryToBeShipped', {
                            transOrderList: dataRow.transOrderList,
                            scheduleCode: dataRow.scheduleCode,
                            successCallBack: () => {
                                // 刷新
                                // InteractionManager.runAfterInteractions(() => {
                                    //setTimeout(()=>{
                                     // this.onRefresh();
                                     // allListData = [];
                                     // allPage =1;
                                     // this.setState({
                                     // isLoadallMore: true,
                                     // });
                                    delete shipListData[rowID];
                                    this.setState({
                                        dataSourceShip: this.state.dataSourceShip.cloneWithRows(shipListData)
                                    });
                                    //},500);
                                // });
                            },
                        });
                    } else {
                        // 其他的都跳转到  ORDER_ENTRY_TO_BE_SIGNIN
                        this.props.navigation.navigate('EntryToBeSignIn', {
                            transOrderList: dataRow.transOrderList,
                        });
                    }
                }}
            />
        );
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'订单'}
                    navigator={navigator}
                    leftButtonHidden={true}
                    // leftIconFont="&#xe618;"
                    // leftButtonConfig={{
                    //     type: 'font',
                    //     onClick: () => {
                    //         this.scan();
                    //     },
                    // }}
                    // rightIconFont="&#xe619;"
                    // rightButtonConfig={{
                    //     type: 'font',
                    //     onClick: () => {
                    //         this.search();
                    //     },
                    // }}
                />
                <ScrollableTabView
                    style={{backgroundColor: '#e8e8e8'}}
                    ref="ScrollableTabView"
                    initialPage={0}
                    scrollWithoutAnimation={false}
                    //page={this.props.orderTab}
                    tabBarUnderlineStyle={styles.tabBarUnderLine}
                    // prerenderingSiblingsNumber={0}
                    locked={true}
                    renderTabBar={() =>
                        <ScrollableTabBar
                            activeTextColor={StaticColor.BLUE_CONTACT_COLOR}
                            inactiveTextColor={StaticColor.LIGHT_BLACK_TEXT_COLOR}
                            underlineHeight={0}
                            textStyle={{fontSize: 14}}
                            backgroundColor={StaticColor.WHITE_COLOR}
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
                                    dataSourceSign: this.state.dataSourceSign.cloneWithRows(signListData),
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
                                    dataSourceReceipt: this.state.dataSourceReceipt.cloneWithRows(receiptListData),
                                });
                                if (receiptListData.length > 0) {
                                    this.setState({
                                        allCount: receiptListData.length,
                                    });
                                    return;
                                } else {
                                    this.setState({
                                        allCount: 1,
                                    });
                                }
                                pageNum = receiptPage;
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
                            this.state.allCount > 0 ? this.listView(1) : <EmptyView />
                        }
                    </View>
                    <View
                        tabLabel="待发运"
                        style={styles.subContainer}
                    >
                        {
                            this.state.allCount > 0 ? this.listView(2) : <EmptyView />
                        }
                    </View>
                    <View
                        tabLabel="待签收"
                        style={styles.subContainer}
                    >
                        {
                            this.state.allCount > 0 ? this.listView(3) : <EmptyView />
                        }
                    </View>
                    <View
                        tabLabel="待回单"
                        style={styles.subContainer}
                    >
                        {
                            this.state.allCount > 0 ? this.listView(4) : <EmptyView />
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
