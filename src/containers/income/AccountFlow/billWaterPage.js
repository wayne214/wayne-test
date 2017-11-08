/**
 * Created by wangl on 2017/7/5.
 * 账户流水界面
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ListView,
    Text,
    Dimensions,
    TouchableOpacity,
    RefreshControl,
    Platform,
    Image,
} from 'react-native';
import BillWaterCell from './cell/billWaterCell';
import * as API from '../../../constants/api';
import EmptyView from '../../../common/emptyView/emptyView';
import StaticImage from '../../../constants/staticImage';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import HTTPRequest from '../../../utils/httpRequest'
import DropdownMenu from './cell/downMenu';
import * as ConstValue from '../../../constants/constValue';

let currentTime = 0;
let lastTime = 0;
let locationData = '';
let type = 1; // 1 全部   2  收入   3  支出
let listResult = [];

const styles = StyleSheet.create({

    dropDown: {
        ...Platform.select({
            ios: {
                height: ConstValue.NavigationBar_StatusBar_Height,
                marginTop: 20,
            },
            android: {
                height: ConstValue.NavigationBar_StatusBar_Height,
            },
        }),
    },
});
export default class BillWaterPage extends Component {
    static propTypes = {
        content: PropTypes.string,
        clickAction: PropTypes.func,
        showBottomLine: PropTypes.bool,
        leftIcon: PropTypes.string,
        rightIcon: PropTypes.string,
    };

    // 构造
    constructor(props) {
        super(props);

        this.acAccountFlow = this.acAccountFlow.bind(this);
        this.acAccountFlowSuccessCallBack = this.acAccountFlowSuccessCallBack.bind(this);
        this.acAccountFlowFailCallBack = this.acAccountFlowFailCallBack.bind(this);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // 初始状态
        this.state = {
            dataSource: ds,
            refreshing:false,
            page:1,
            loadMore:false,
            dataLength: 0,
        };
    }

    componentDidMount() {
        this.getCurrentPosition();
        this.acAccountFlow();
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
    acAccountFlow() {
        currentTime = new Date().getTime();
        this.setState({
            refreshing:true,
        });

        HTTPRequest({
            url: API.API_AC_ACCOUNT_FLOW,
            params: {
                page: this.state.page,
                pageSize: 20,
                phoneNum: '13312345678',  //13312345678   global.phone
                status: String(type)
            },
            loading: () => {

            },
            success: (response) => {
                this.acAccountFlowSuccessCallBack(response.result);
            },
            error: (err) => {
                this.acAccountFlowFailCallBack();
            },
            finish: () => {

            },
        })
    }
    acAccountFlowSuccessCallBack(result){
        console.log('result',result, result.length)
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取账户流水', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '账户流水页面');
        console.log('acAccountFlowSuccessCallBack',result)
        const datalenth = result.length;
        this.setState({
            refreshing:false,
            dataLength: datalenth,
        });

        if (this.state.page == 1 && datalenth < 20){

            this.setState({
                loadMore:false,
            });
            listResult = result;
        } else {
            listResult=listResult.concat(result);
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(listResult),
        })
    }

    acAccountFlowFailCallBack(){
        this.setState({
            refreshing:false,
        })
    }

    listView() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                onEndReached={this.onEndReached.bind(this)}
                onEndReachedThreshold={100}
                enableEmptySections={true}
                renderRow={(rowData,section,index) =>
                    <BillWaterCell
                        billState={rowData.costType}
                        billTime={rowData.time}
                        billMoney={rowData.operateAmount}
                        billStatus={rowData.status}
                        onClick={()=>{
                            {/*this.props.navigation.navigate('IncomeListDetail',{*/}
                                {/*type: '收入', // 收入、支出*/}
                            {/*});*/}
                        }}
                    />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }
            />
        );
    }
    //下拉刷新
    onRefresh(){
        listResult = [];
        this.setState({
            page:1,
            dataSource: this.state.dataSource.cloneWithRows(listResult),
        }, ()=>{
            this.acAccountFlow(this.acAccountFlowSuccessCallBack);
        });
    }
    //上拉加载
    onEndReached(){

        if (this.state.loadMore){
            this.setState({
                page:this.state.page + 1,
            }, ()=>{
                this.acAccountFlow(this.acAccountFlowSuccessCallBack);
            });

        }
    }

    render() {
        const navigator= this.props.navigation;
        const data = [['全部', '收入', '支出']];

        const topStyle = ConstValue.is_iPhoneX ? {marginTop: 18} : {marginTop: 2};
        return (
            <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <DropdownMenu
                    style={styles.dropDown}
                    arrowImg={StaticImage.IncomeOpen}
                    checkImage={StaticImage.radioButton}
                    bgColor={'white'}
                    tintColor={'black'}
                    selectItemColor={'black'}
                    data={data}
                    handler={(selection, row) => {
                        console.log(row);
                        //0=全部、1=收入、2=支出

                        type = row + 1;

                        this.onRefresh();

                    }}
                >
                    <TouchableOpacity style={{position: 'absolute', marginTop: 30, height: 54, width: 44}} onPress={()=>{
                        navigator.goBack();
                    }}>
                        <Image style={[{marginLeft: 10}, topStyle]} source={StaticImage.backIcon} />
                    </TouchableOpacity>
                    <View style={{marginTop: 10}}>
                        {
                            this.state.dataLength == 0 && this.state.page == 1 ?  <EmptyView
                                    emptyImage={StaticImage.NoIncome}
                                    content={'暂无收入记录'}
                                /> : this.listView()
                        }
                    </View>
                </DropdownMenu>

            </View>
        );
    }
}


