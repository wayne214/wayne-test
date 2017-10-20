/**
 * 抢单报价页面
 * */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Platform,
    DeviceEventEmitter,
} from 'react-native';
import Toast from '@remobile/react-native-toast';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import SwitchItem from '../component/switchItem';
import CommonCell from '../../../containers/mine/cell/commonCell';
import CountdownWithText from '../component/countdownWithText';
import * as StaticColor from '../../../constants/staticColor';
import Storage from '../../../utils/storage';
import * as API from '../../../constants/api';

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import Validator from '../../../utils/validator';
import HTTPRequest from '../../../utils/httpRequest';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        marginTop: 10,
        backgroundColor: 'white',
    },
    separateLine: {
        height: 0.5,
        backgroundColor: StaticColor.COLOR_SEPARATE_LINE,
    },
    title: {
        fontSize: 16,
        marginTop: 20,
        marginLeft: 20,
    },
    priceContainer: {
        flexDirection: 'row',
        // height: 44,
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 10,
    },
    textInputStyle: {
        height: 44,
        backgroundColor: StaticColor.WHITE_COLOR,
        fontSize: 30,
        color: '#333333',
        fontWeight: 'bold',
        ...Platform.select({
            android: {
                padding: 0,
            },
        }),
    },
    iconStyle: {
        height: 44,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: StaticColor.WHITE_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconFont: {
        fontFamily: 'iconfont',
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        lineHeight: 20,
        fontSize: 16,
    },
});
class goodsBidding extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        console.log('==',Date.parse(new Date), Date.parse('2017-07-12 18:40:28'.replace(/-/g,"/")), this.props.userPlateNumber, this.props.userInfo.phone);
        this.state = {
            price: '',
            scheduleCode: params.bidScheduleCode,
            bidEndTime: params.endTime,
            isProvideInvoice: true,
            lastOffer: '', // 上次报价
            lastRank: '', // 上次排名
            referencePrice: '', // 参考价
            isClicked: true,
            plateNumber: this.props.userPlateNumber,
            phone: global.phone,
            showDeleteButton: false,
            refPrice: params.refPrices,
        };
        this.isProvideInvoice = this.isProvideInvoice.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.submitPrice = this.submitPrice.bind(this);
        this.submitQuoteSuccessCallBack = this.submitQuoteSuccessCallBack.bind(this);
        this.submitQuoteFailCallBack = this.submitQuoteFailCallBack.bind(this);
        this.queryRankSuccessCallBack = this.queryRankSuccessCallBack.bind(this);
        this.queryRankFailCallBack = this.queryRankFailCallBack.bind(this);
        this.queryRankPrice = this.queryRankPrice.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        this.queryRankPrice(this.queryRankSuccessCallBack, this.queryRankFailCallBack);
    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }
    // 是否提供发票
    isProvideInvoice(value) {
        console.log(value);
        this.setState({
            isProvideInvoice: value,
        });
    }
    clearInput() {
        this.setState({
            price: '',
            showDeleteButton: false,
        });
    }
    submitQuoteSuccessCallBack(result) {
        Toast.showShortCenter('  恭喜您报价成功！'+'\n竞拍期间可多次报价');
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('提交报价',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '提交报价页面');
        this.setState({
            isClicked: false,
        });
        this.queryRankPrice(this.queryRankSuccessCallBack, this.queryRankFailCallBack);
    }
    submitQuoteFailCallBack() {}
    submitPrice(submitQuoteSuccessCallBack, submitQuoteFailCallBack) {
        currentTime = new Date().getTime();
        const userId = global.userId;
        const userName = global.userName;
        if (this.state.price === '') {
            Toast.showShortCenter('您还没有填写报价');
            return;
        } else if (parseFloat(this.state.price).toFixed(2) > 999999.99) {
            Toast.showShortCenter('您的报价大于"999999.99"'+'\n'+'请重新填写');
            return;
        } else if (parseFloat(this.state.price).toFixed(2) < 1){
            Toast.showShortCenter('您的报价低于"1"'+'\n'+'请重新填写');
            return;
        } else if (!Validator.isFloat(this.state.price)) {
            Toast.showShortCenter('您的填写的报价含有非法字符'+'\n'+'请重新填写');
            return;
        } else if (this.state.price.startsWith('0')) {
            Toast.showLongCenter('报价不能以数字0开头，请重新填写');
            return;
        } else {
            HTTPRequest({
                url: API.API_NEW_SUBMIT_QUOTES,
                params: {
                    isProvideInvoice: this.state.isProvideInvoice,
                    plateNumber: this.state.plateNumber,
                    price: this.state.price,
                    scheduleCode: this.state.scheduleCode,
                    userId: userId,
                    userName: userName,
                    phoneNum: this.state.phone,
                },
                loading: ()=>{

                },
                success: (responseData)=>{
                    console.log('success',responseData);
                    this.setState({
                        loading: false,
                    }, ()=>{
                        submitQuoteSuccessCallBack(responseData.result);
                    });

                },
                error: (errorInfo)=>{
                    this.setState({
                        loading: false,
                    }, () => {
                        submitQuoteFailCallBack();
                    });
                },
                finish: ()=>{
                }
            });
        }
    }
    queryRankSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('查询竞价排名',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '提交报价页面');
        if (result) {
            this.setState({
                lastOffer: result.lastOffer,
                lastRank: result.lastRank,
                referencePrice: result.referencePrice,
                // isProvideInvoice: result.invoice === '' || result.invoice === null ? true : result.invoice,
                isClicked: true,
            });
        }
    }
    queryRankFailCallBack() {
        this.setState({
            isClicked: true,
        });
    }
    queryRankPrice(queryRankSuccessCallBack, queryRankFailCallBack) {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_NEW_QUERY_RANK,
            params: {
                plateNumber: this.state.plateNumber,
                phoneNum: this.state.phone,
                scheduleCode: this.state.scheduleCode,
            },
            loading: ()=>{

            },
            success: (responseData)=>{
                console.log('success',responseData);
                queryRankSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
                queryRankFailCallBack();
            },
            finish: ()=>{
            }
        });
    }
    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.outContainer}>
                <NavigationBar
                    title={'报价'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                />
                <ScrollView scrollEnabled={false}>
                    <View style={styles.container}>
                        <Text style={styles.title}>您的报价</Text>
                        <View style={styles.priceContainer}>
                            <Text style={{fontSize: 30}}>￥</Text>
                            <View style={{flex: 1, marginLeft: 1}}>
                                <TextInput
                                    // autoFocus={true}
                                    style={styles.textInputStyle}
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor="#CCCCCC"
                                    value={this.state.price}
                                    onChangeText={(price) => {
                                        if (price.length > 0) {
                                            this.setState({price, showDeleteButton: true});
                                        } else {
                                            this.setState({
                                                price,
                                                showDeleteButton: false,
                                            })
                                        }
                                    }}
                                />
                            </View>
                            {
                                this.state.showDeleteButton ? <TouchableOpacity onPress={() => this.clearInput()}>
                                    <View style={styles.iconStyle}>
                                        <Text style={styles.iconFont}> &#xe61e;</Text>
                                    </View>
                                </TouchableOpacity> : null
                            }
                        </View>
                        <View style={styles.separateLine}/>
                        <SwitchItem
                            defaultValue={this.state.isProvideInvoice}
                            itemTitle="提供发票"
                            onValueChange={(value) => {
                                this.isProvideInvoice(value);
                            }}
                        />
                        <CommonCell itemName="参考价" content={this.state.refPrice && this.state.refPrice !== null && this.state.refPrice !== 0 ? `￥${this.state.refPrice}` : ''} contentColorStyle={{color: '#FF6600'}}/>
                        <CommonCell itemName="上次报价" content={this.state.lastOffer && this.state.lastOffer !== null && this.state.lastOffer !== '' ? this.state.lastOffer + '' : ''} contentColorStyle={{color: '#FF6600'}}/>
                        <CommonCell itemName="报价排名" content={this.state.lastRank !== '' && this.state.lastRank !== null ? `第${this.state.lastRank}名` : ''} contentColorStyle={{color: '#333333'}} hideBottomLine={true}/>
                    </View>
                    <CountdownWithText
                        idEnded={(Date.parse(new Date(this.state.bidEndTime.replace(/-/g,"/"))) - Date.parse(new Date)) < 0}
                        endTime={this.state.bidEndTime}
                        isDisable={!this.state.showDeleteButton}
                        onClick={() => {
                            this.state.isClicked ? this.submitPrice(this.submitQuoteSuccessCallBack, this.submitQuoteFailCallBack) : console.log('查询报价排名中');
                        }}
                        onEnded={() => {
                            DeviceEventEmitter.emit('resetGood');
                        }
                        }
                    />
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userPlateNumber: state.user.get('plateNumber'),
        userInfo: state.user.get('userInfo'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(goodsBidding);

