/**
 * Created by wangl on 2017/7/4.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    DeviceEventEmitter,
    Image,
    ImageBackground,
    Platform,
    StyleSheet
} from 'react-native';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import IncomeCell from './cell/incomeCell';
import * as API from '../../../constants/api';
import Storage from '../../../utils/storage';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import HTTPRequest from '../../../utils/httpRequest';
import StaticImage from '../../../constants/staticImage';

const {height, width} = Dimensions.get('window');
let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    title: {
        ...Platform.select({
            ios: {
                marginTop: 44,
            },
            android: {
                marginTop: 20,
            },
        }),
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 18,
        backgroundColor: 'transparent',
    },
});

export default class Income extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountMoney: 0,
        };
        this.acBalance = this.acBalance.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        this.acBalance();
        //点击收入页面进行刷新
        this.incomeListener = DeviceEventEmitter.addListener('refreshIncome', () => {
            this.acBalance();
        });
    }

    componentWillUnmount() {
        this.incomeListener.remove();
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

    acBalance() {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_AC_BALANCE + global.phone,
            params: {},
            loading: () => {

            },
            success: (response) => {
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取账户余额', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '收入页面');
                this.setState({
                    accountMoney: response.result
                })
            },
            error: (err) => {

            },
            finish: () => {

            },

        })

    }


    render() {
        const navigator = this.props.navigation;
        const {accountMoney} = this.state;

        return (
            <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>

                <ImageBackground style={{height: height / 3 + 10, width}} source={StaticImage.IncomeBgimage}>

                    <Text style={styles.title}>我的收入</Text>
                    <Text style={{
                            fontSize: 18,
                            color: '#FFFFFF',
                            marginLeft: 10,
                            backgroundColor: 'transparent',
                            marginTop: 70,
                        }}>账户余额(元)</Text>
                    <Text style={{
                            fontSize: 58,
                            color: '#FFFFFF',
                            marginLeft: 10,
                            marginTop: 10,
                            backgroundColor: 'transparent',
                        }}>{accountMoney}</Text>

                </ImageBackground>

                <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                    <View style={{marginTop: 10}}/>

                    <IncomeCell leftIcon="&#xe622;" content={'业务明细'} clickAction={() => {
                        navigator.navigate('BusinessDetail');
                    }}/>

                    <View style={{marginTop: 1}}/>
                    <IncomeCell leftIcon="&#xe625;" content={'账户流水'} clickAction={() => {
                        navigator.navigate('BillWaterPage')
                    }}/>


                    <View style={{marginTop: 10}}/>

                    {/*<IncomeCell leftIcon="&#xe623;" content={'提现'}*/}
                                {/*clickAction={() => {*/}
                                    {/*// 先判断有没有添加银行卡，如果没有，则跳转到添加银行卡页面。*/}
                                    {/*navigator.navigate('Withdrawals')*/}
                    {/*}}/>*/}
                    <View style={{marginTop: 1}}/>

                    <IncomeCell leftIcon="&#xe624;" content={'我的银行卡'}
                    iconColor="rgb(250,128,10)"
                    clickAction={() => {
                        navigator.navigate('MyBankCard')
                    }}/>


                </View>
            </View>
        );
    }


}




