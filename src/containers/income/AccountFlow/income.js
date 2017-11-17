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
import * as StaticColor from '../../../constants/staticColor';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import HTTPRequest from '../../../utils/httpRequest';
import StaticImage from '../../../constants/staticImage';
import * as ConstValue from '../../../constants/constValue';

const {height, width} = Dimensions.get('window');
let currentTime = 0;
let lastTime = 0;
let locationData = '';
let imageHeight = width *255 / 375;

const styles = StyleSheet.create({
    allContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        ...Platform.select({
            ios: {
                height: ConstValue.NavigationBar_StatusBar_Height,
            },
            android: {
                height: 50,
            },
        }),
        backgroundColor: 'transparent',
        width: width,
    },
    titleContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: ConstValue.StatusBar_Height,
            },
            android: {
                paddingTop: 0,
            },
        }),
        flexDirection: 'row',
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    centerContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7,
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        color: StaticColor.WHITE_COLOR,
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
        // 标题布局
        const TitleView =
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <View style={styles.leftContainer}>
                    </View>
                    <View style={styles.centerContainer}>
                        <Text style={styles.title}>我的收入</Text>
                    </View>
                    <View style={styles.rightContainer}>
                    </View>
                </View>
            </View>;
        return (
            <View style={styles.allContainer}>
                <ImageBackground style={{height: imageHeight, width}} source={StaticImage.IncomeBgimage}>
                    {TitleView}
                    <Text style={{
                            fontSize: 18,
                            color: StaticColor.WHITE_COLOR,
                            marginLeft: 10,
                            backgroundColor: 'transparent',
                            marginTop: imageHeight - ConstValue.NavigationBar_StatusBar_Height - 100,
                            height: 20
                        }}>账户余额(元)</Text>
                    <Text style={{
                            fontSize: 58,
                            color: StaticColor.WHITE_COLOR,
                            marginLeft: 10,
                            marginTop: 10,
                            backgroundColor: 'transparent',
                            height: 70
                        }}>{accountMoney}</Text>
                </ImageBackground>
                <View style={styles.allContainer}>
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
                    {/*<View style={{marginTop: 1}}/>*/}
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




