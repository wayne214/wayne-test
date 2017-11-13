/**
 * Created by wangl on 2017/7/5.
 * 我的银行卡主页
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
    ListView,
    DeviceEventEmitter
} from 'react-native';
import HTTPRequest from '../../utils/httpRequest';
import NavigationBar from '../../common/navigationBar/navigationBar';
import BankCardCell from '../../containers/income/AccountFlow/cell/bankCardCell'
import * as API from '../../constants/api';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import * as ConstValue from '../../constants/constValue';
import Swipeout from 'react-native-swipeout';


const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({});
let currentTime = 0;
let lastTime = 0;
let locationData = '';


export default class MyBankCard extends Component {
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

        this.bankCardList = this.bankCardList.bind(this);
        this.bankCardBundingCallBack = this.bankCardBundingCallBack.bind(this);
        this.unBankCardBunding = this.unBankCardBunding.bind(this);
        this.unBankCardBundingCallBack = this.unBankCardBundingCallBack.bind(this);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            isEmpty: true,
            sectionID: null,
            rowID: null,
        };
    }

    componentDidMount() {
        this.getCurrentPosition();
        this.bankCardList(this.bankCardBundingCallBack);

        this.listListener = DeviceEventEmitter.addListener('BankCardList', () => {
            this.bankCardList(this.bankCardBundingCallBack);
        });
    }

    componentWillUnmount() {
        this.listListener.remove();
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
    bankCardList(bankCardBundingCallBack) {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_BANK_CARD_LIST + global.phone,
            params: {},
            loading: () => {

            },
            success: (response) => {
                this.bankCardBundingCallBack(response.result);
            },
            error: (err) => {

            },
            finish: () => {

            },
        })
    }

    bankCardBundingCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取银行卡列表', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '我的银行卡页面');
        console.log('result', result);
        if (result.length == 0) {
            this.setState({
                isEmpty: true,
                dataSource: this.state.dataSource.cloneWithRows(result),
            })
        } else {
            this.setState({
                isEmpty: false,
                dataSource: this.state.dataSource.cloneWithRows(result),
            })
        }
    }

    /*删除银行卡*/
    unBankCardBunding(bankAccount ,unBankCardBundingCallBack) {

        HTTPRequest({
            url: API.API_BANK_CARD_UNBUNDING,
            params: {
                bankCardNumber: bankAccount,
                phoneNum: global.phone,
                userId: global.userId,
                userName: global.userName,
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (response) => {
                unBankCardBundingCallBack(response.result);
            },
            error: (err) => {
                this.setState({
                    loading: false,
                });
            },
            finish: () => {
                this.setState({
                    loading: false,
                });
            },
        })
    }

    unBankCardBundingCallBack(result) {
        this.setState({
            sectionID: null,
            rowID: null,
        });
        this.bankCardList(this.bankCardBundingCallBack);
    }

    render() {
        const navigator = this.props.navigation;
        const {dataSource, isEmpty} = this.state;

        return (

            <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <NavigationBar
                    title={'我的银行卡'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />


                <View style={{
                    width,
                    height:height - 58 - ConstValue.NavigationBar_StatusBar_Height - ConstValue.Tabbar_marginBottom
                }}>
                    {
                        isEmpty ?
                            <View style={{
                                width,
                                height: 400,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Image source={require('../../../assets/income/bankCardEmpty.png')}/>

                                <Text style={{
                                    color: "#999999",
                                    fontSize: 16,
                                    marginTop: 10
                                }}>您还没有添加银行卡哦~</Text>
                            </View>
                            :
                            <ListView
                                dataSource={dataSource}
                                renderRow={(rowData, sectionID, rowID) =>
                                    <Swipeout
                                        close={!(this.state.sectionID === sectionID && this.state.rowID === rowID)}
                                        right={[
                                            {
                                                //text: '删除',
                                                backgroundColor: 'transparent',
                                                //color: 'white',
                                                component: [<View style={{justifyContent: 'center', height: 130}}>
                                                    <View style={{backgroundColor: 'white', width: 40, height: 40, justifyContent: 'center', marginLeft: 15, borderRadius: 20}}>
                                                        <Text style={{backgroundColor: 'transparent' ,fontFamily: 'iconfont', color: '#E66D65', textAlign: 'center'}}>&#xe641;</Text>
                                                    </View>
                                                </View>],
                                                onPress: ()=>{
                                                    this.unBankCardBunding(rowData.bankAccount, this.unBankCardBundingCallBack);
                                                },

                                            }
                                        ]}
                                        rowID={rowID}
                                        sectionID={sectionID}
                                        onOpen={(sectionID, rowID) => {
                                            this.setState({
                                                sectionID,
                                                rowID,
                                            });
                                        }}
                                        onClose={() => console.log('===close') }
                                        scroll={event => console.log('scroll event') }
                                    >
                                        <BankCardCell
                                            accountBank={rowData.accountBank}
                                            bankCarType={rowData.bankCarType}
                                            bankAccount={rowData.bankAccount}
                                            isDefault={rowData.isDefault}
                                            clickAction={
                                                () => {
                                                    navigator.navigate('BankCardDeatil',
                                                        {
                                                            bank: rowData.accountBank,
                                                            bankType: rowData.bankCarType,
                                                            bankAccount: rowData.bankAccount,
                                                            default: rowData.isDefault,
                                                            bankCityName: rowData.city,
                                                            bankCityCode: rowData.cityCode,
                                                            bankProvinceName: rowData.province,
                                                            bankProvinceCode: rowData.provinceCode,
                                                            bankBranchName: rowData.branchBank,
                                                            bankBranchCode: rowData.branchBankCode
                                                        })
                                                }}
                                        />
                                    </Swipeout>
                                }
                            />
                    }
                </View>
                <TouchableOpacity onPress={() => {
                    navigator.navigate('AddBankCard');
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        <Image source={require('../../../assets/income/addBankCar.png')}/>
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
}
