import React, {Component} from 'react';
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
    Text,
    TouchableOpacity,
} from 'react-native';
import * as API from '../../../constants/api';
import Storage from '../../../utils/storage';
import HTTPRequest from '../../../utils/httpRequest';
import Loading from '../../../utils/loading';
import NavigationBar from '../../../common/navigationBar/navigationBar';

import AddressLineItem from './comment/addressListItem';
import InfoItem from './comment/bussnessInfoItem';
import HeaderItem from './comment/bussnessHeaderItem';
import HeaderRequire from './comment/bussnessRequier';
import TypeItem from './comment/typeItem';
import Toast from '@remobile/react-native-toast';
import EmptyView from '../../../common/emptyView/emptyView';
import * as ConstValue from '../../../constants/constValue';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';
let pageNO = 1; // 第一页
const pageSize = 10; // 每页显示的数量
let list = [];
let searchType = [];
let isLoadMore = false;
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    listView: {
        backgroundColor: '#F5F5F5',
    },

});

class detailsPage extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            isRefresh: true,
            requires:[],
            isShowType: false,
            loading: false,
            dataLength: 1,
            topHeight: 0,
        };

        this.onRefresh = this.onRefresh.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.getData = this.getData.bind(this);
        this.chooseType = this.chooseType.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();

        this.onRefresh();
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

    /*查询账户角色*/
    InquireAccountRole() {
        HTTPRequest({
            url: API.API_INQUIRE_ACCOUNT_ROLE + global.phone,
            params: {},
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (responseData) => {
                console.log('===收入responseData', responseData);
                let result = responseData.result;
                if (result) {
                    if (result.length == 1) {
                        if(result[0].owner == 2) {
                            // 司机查余额
                            this.getData('1');
                        } else if (result[0].owner = 1) {
                            // 车主查余额
                            this.getData('2');
                        }
                    } else {
                        // 司机、车主余额
                        this.getData('2')
                    }
                }
            },
            error: (errorInfo) => {
                this.setState({
                    loading: false,
                });
            },
            finish: () => {
                this.setState({
                    loading: false,
                });
            }
        });
    }


    // 获取数据
    getData(type) {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_BUSSNESS_DETAIL,
            params: {
                page: pageNO,
                pageSize: pageSize,
                phoneNum: global.phone, //   13312345678
                searchType: searchType,
                roleType: type,
            },
            loading: ()=>{

            },
            success: (responseData)=>{
                this.setState({
                    loading: false,
                }, ()=>{
                    lastTime = new Date().getTime();
                    ReadAndWriteFileUtil.appendFile('获取业务明细', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                        locationData.district, lastTime - currentTime, '业务明细页面');
                    const result = responseData.result;
                    if (!result) {
                        Toast.showShortCenter('暂无数据');
                        this.setState({
                            isRefresh: false,
                            dataLength: 0
                        });
                        return;
                    }

                    if (result.length < pageSize) {
                        isLoadMore = false;
                    } else {
                        isLoadMore = true;
                    }

                    if (pageNO === 1) {
                        list = [];
                    }

                    list = list.concat(responseData.result);

                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(list),
                        dataLength: list.length
                    });
                });

            },
            error: (errorInfo)=>{

            },
            finish: ()=>{
                this.setState({
                    isRefresh: false,
                });
            }
        });

    }


    // 刷新
    onRefresh() {
        list = [];
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
            isRefresh: true,
        }, ()=>{
            // 请求刷新接口
            // this.getData();
            this.InquireAccountRole();
        });

    }

    // 加载更多
    loadMoreData() {
        if (isLoadMore){
            pageNO++;
            // this.getData();
            this.InquireAccountRole();
        }else {
            if (pageNO !== 1){
                Toast.showShortCenter('没有更多了');
            }
        }
    }


    // listView的分割线
    renderSeparator() {
        return (
            <View
                style={{height: 10, backgroundColor: '#F5F5F5'}}
            />
        );
    }


    /*row*/
    renderRow(rowData, sectionID, rowID) {

        return (
            <View>
                <AddressLineItem cities={rowData.lineName ? rowData.lineName : []}/>
                <InfoItem rowData={rowData}/>
            </View>
        );
    }

    /*筛选*/
    chooseType(){

        if (this.state.isShowType){
            // 隐藏
            this.setState({
                topHeight: 0
            })
        }else{
            // 显示
            this.setState({
                topHeight: 55
            })
        }

        this.setState({
            isShowType: !this.state.isShowType,
        });

    }
    render() {
        const navigator = this.props.navigation;

        const requireView = this.state.requires.length === 0 ? null :
            <View style={{height: 55}}>
                <HeaderRequire datas={this.state.requires}
                               deleteAction={(index)=>{
                                   console.log('删除的是=',index);

                                   let datas = this.state.requires;
                                   datas.splice(index,1);

                                   this.setState({
                                       requires: datas,
                                   });

                                   searchType = [];
                                   pageNO = 1;
                                   datas.map((item, index)=>{
                                      
                                      if (item === '已付款'){
                                          searchType.push('1');
                                      }
                                      if (item === '待付款'){
                                          searchType.push('2');
                                      }
                                      if (item === '待核实发票'){
                                          searchType.push('3');
                                      }
                                   });
                                   this.onRefresh();

                               }}
                               deleteAllAction={()=>{
                                   console.log('删除全部');
                                   this.setState({
                                       requires: [],
                                   });
                                   searchType = [];
                                   pageNO = 1;
                                   this.onRefresh();

                               }}
                />
            </View>;

                const typeView = this.state.isShowType ?
                    <TypeItem
                              onCancel={()=>{

                                  this.setState({
                                      isShowType: false,
                                  })
                              }}
                              onChoose={(value)=>{

                                  this.setState({
                                      isShowType: false,
                                  });

                                  let datas = [];
                                   searchType = [];
                                   pageNO = 1;
                                  for (let i = 0; i < value.length; i++){
                                      if (value[i] === '1'){
                                          datas.push('待付款');
                                          searchType.push('2');
                                      }
                                      if (value[i] === '2'){
                                          datas.push('已付款');
                                          searchType.push('1');
                                      }
                                      if (value[i] === '3'){
                                          datas.push('待核实发票');
                                          searchType.push('3');
                                      }
                                  }
                                  this.setState({
                                      requires: datas,
                                  });
                                 
                                  this.onRefresh();

                              }}/> : null;

        return (
            <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
                <NavigationBar
                    title={'业务明细'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    rightButtonConfig={{
                        type: 'string',
                        title: '筛选',
                        onClick: () => {
                            this.chooseType();
                        },
                    }}
                />
                <View style={{height: 50}}>
                    <HeaderItem />
                </View>
                {requireView}
                <View>
                {
                    this.state.dataLength > 0 ? <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow}
                            style={[styles.listView, {height: screenHeight - ConstValue.NavigationBar_StatusBar_Height - ConstValue.Tabbar_Height - this.state.topHeight}]}
                            renderSeparator={this.renderSeparator}
                            onEndReached={this.loadMoreData}
                            onEndReachedThreshold={100}
                            enableEmptySections={true}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                      refreshing={this.state.isRefresh}
                                      onRefresh={this.onRefresh}
                                      tintColor="#CCC"
                                      colors={['#43B8FF', '#309DED', '#008dcf']}
                                      progressBackgroundColor="#CCC"
                                />
                            }/> : <EmptyView />
                }
                </View>
                {typeView}

                {
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }


}


function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        requestDetailData: (params, getDataSuccessCallBack, getDataFailCallBack, pageNo = 1) => {
            dispatch(getBusinessDetailsAction({
                url: API.API_BUSSNESS_DETAIL,
                body: params,
                successCallBack: (response) => {
                    getDataSuccessCallBack(response.result);
                },
                failCallBack: () => {
                    getDataFailCallBack();
                },
                ...params,

            }));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(detailsPage);
