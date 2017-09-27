import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
} from 'react-native';
import Picker from 'react-native-picker-custom'; // 时间弹窗
import Toast from '@remobile/react-native-toast';
import moment from 'moment'; // 时间格式化工具
import NavigationBar from '../../common/navigationBar';
import stylesCommon from '../../../assets/css/common';
import SwitchItem from '../../components/goods/switchItem';
import CommonCellWithArrow from '../../components/goods/commonCellWithArrow';
import {setGoodsPreference, queryGoodsPreference, preferenceSetResult} from '../../action/goods';
import {
    getOrderDetailAction,
    gotOrderDetailSuccAction,
    getOrderTransportDetailAction,
    isReSetCity,
    getTransPortingAction,
} from '../../action/order';
import * as API from '../../constants/api';
import * as RouteType from '../../constants/routeType';

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import ProvinceListJson from '../../../assets/data/province.json';
import UniqueUtil from '../../utils/unique';
import Storage from '../../utils/storage';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

let transCodeList = [];


let transCodeListData = [];
let transCodeListData2 = [];
let transCodeListData3 = [];

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        backgroundColor: 'white',
    },
    rightIcon: {
        marginLeft: 20,
    },
    cityAndTimeContainer: {
        height: 44,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
    },
    cityOrTimeText: {
        fontSize: 16,
        color: '#333333',
    },
});

class goodsPreferences extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlatformDispatch: true, // 派单模式
            isBidding: true, // 竞价抢单模式
            isBackTracking: true, // 返程
            departureCity: '', // 出发城市
            departureCityArray: [], // 出发城市列表
            appointmentTime: moment(new Date()).format('YYYY-MM-DD'), // 预约时间
            appointmentEndTime: moment(new Date()).add(6, 'days').format('YYYY-MM-DD'), // 预约时间
            appointmentStartTime: moment(new Date()).format('YYYY-MM-DD'), // 预约时间
            carNature: '',
        };
        this.setDispatchModel = this.setDispatchModel.bind(this);
        this.setBiddingModel = this.setBiddingModel.bind(this);
        this.setBackTracking = this.setBackTracking.bind(this);
        this.chooseCity = this.chooseCity.bind(this);
        this.chooseDate = this.chooseDate.bind(this);
        this.submit = this.submit.bind(this);
        this.setGoodsPreferenceSuccessCallback = this.setGoodsPreferenceSuccessCallback.bind(this);
        this.setGoodsPreferenceFailCallback = this.setGoodsPreferenceFailCallback.bind(this);
        this.queryPreferenceSuccessCallBack = this.queryPreferenceSuccessCallBack.bind(this);

        this.getOrderTransportDetail = this.getOrderTransportDetail.bind(this);
        this.getOrderTransportDetailSuccessCallBack = this.getOrderTransportDetailSuccessCallBack.bind(this);
        this.getOrderTransportDetailFailCallBack = this.getOrderTransportDetailFailCallBack.bind(this);

        this.getTransPorting = this.getTransPorting.bind(this);
        this.getTransPortingCallBack = this.getTransPortingCallBack.bind(this);
        this.getTransPortingFailCallBack = this.getTransPortingFailCallBack.bind(this);

    }

    componentDidMount() {
        // this.getCurrentPosition();
        const {userInfo, userPlateNumber, isResetCityList} = this.props;
        const phoneNum = userInfo.result.phone;
        console.log('是否返程开启', this.props.isResetCityList, this.state.isBackTracking);
        // this.getTransPorting(this.getTransPortingCallBack, this.getTransPortingFailCallBack);
        // 查询货源偏好设置
        this.queryGoodSourcePre(phoneNum, userPlateNumber, this.queryPreferenceSuccessCallBack);
        // if (!isResetCityList) {
        //     this.queryGoodSourcePre(phoneNum, userPlateNumber, this.queryPreferenceSuccessCallBack);
        // }
        // if (isResetCityList) {
        //     if (this.state.isBackTracking) {
        //         this.getTransPorting(this.getTransPortingCallBack, this.getTransPortingFailCallBack);
        //     }
        // }
    }

    componentWillUnmount() {
        transCodeList = [];
        transCodeListData = [];
        transCodeListData2 = [];
        transCodeListData3 = [];
    }

    resetCityAction(data) {
        this.props.resetCityListAction(data);
    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            if (data) {
                console.log('position =', JSON.stringify(data));
                locationData = data;
                const cityArray = [];
                const provinces = ProvinceListJson.provinces;
                for (let i = 0; i < provinces.length; i++) {
                    for (let j = 0; j < provinces[i].citys.length; j++) {
                        if (data.city === provinces[i].citys[j].departureCityArrayName) {
                            let obj = provinces[i].citys[j];
                            cityArray.push(obj);
                            break;
                        }
                    }
                }

                console.log('。。。。车发城市', cityArray);
                this.setState({
                    departureCityArray: cityArray,
                    departureCity: data.city,
                });
            }
        }).catch(e => {
            console.log(e, 'error');
        });
    }

    queryPreferenceSuccessCallBack(prefereceObj) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('偏好查询', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '偏好设置页面');
        if (prefereceObj) {
            Storage.save('prefereceObj', prefereceObj);
            let content = '';
            if (prefereceObj.departureCityArray && prefereceObj.departureCityArray.length > 0) {
                for (let i = 0; i < prefereceObj.departureCityArray.length; i++) {
                    const cityArray = prefereceObj.departureCityArray[i];
                    content += cityArray.departureCityArrayName;
                    if (i < prefereceObj.departureCityArray.length - 1) {
                        content += '、';
                    }
                }
            }
            console.log('=====content', content, prefereceObj.backTracking);
            this.setState({
                isPlatformDispatch: prefereceObj.platformSendMode, // 派单模式
                isBidding: prefereceObj.biddingGrabMode, // 竞价抢单模式
                isBackTracking: prefereceObj.backTracking, // 返程
                departureCity: prefereceObj.departureCityArray && prefereceObj.departureCityArray !== '' ? content : this.state.departureCity, // 出发城市
                appointmentTime: prefereceObj.appointmentTime && prefereceObj.appointmentTime !== '' ? prefereceObj.appointmentTime : this.state.appointmentTime, // 预约时间
                appointmentStartTime: prefereceObj.appointmentStartTime && prefereceObj.appointmentStartTime !== '' ? prefereceObj.appointmentStartTime : this.state.appointmentStartTime, // 预约开始时间
                appointmentEndTime: prefereceObj.appointmentEndTime && prefereceObj.appointmentEndTime !== '' ? prefereceObj.appointmentEndTime : this.state.appointmentEndTime, // 预约结束时间
                departureCityArray: prefereceObj.departureCityArray && prefereceObj.departureCityArray !== '' ? prefereceObj.departureCityArray : [], // 出发城市列表
                carNature: prefereceObj.carNature && prefereceObj.carNature !== '' ? prefereceObj.carNature : '',
            });
            // if (!prefereceObj.departureCityArray) {
            //     this.getOrderDetailAction(this.getOrderDetailSuccessCallBack, this.getOrderDetailFailCallBack);
            // }
            if (prefereceObj.departureCityArray === null || prefereceObj.departureCityArray === [] || prefereceObj.departureCityArray === '') {
                this.getCurrentPosition();
            }
        }
    }

    // 查询货源偏好设置
    queryGoodSourcePre(phone, plateNum, queryPreferenceSuccessCallBack) {
        currentTime = new Date().getTime();
        this.props.queryGoodsPreferenceAction({
            phoneNum: phone,
            plateNumber: plateNum,
        }, queryPreferenceSuccessCallBack);
    }

    // 设置平台派单模式
    setDispatchModel(value) {
        this.setState({
            isPlatformDispatch: value,
        });
        this.submit(value, this.state.isBidding, this.state.isBackTracking, '', this.state.departureCityArray, '');
    }

    // 设置抢单模式
    setBiddingModel(value) {
        this.setState({
            isBidding: value,
        });
        this.submit(this.state.isPlatformDispatch, value, this.state.isBackTracking, '', this.state.departureCityArray, '');
    }

    // 设置返程
    setBackTracking(value) {
        global.isBackTracking = value;
        this.setState({
            isBackTracking: value,
        });
        this.submit(this.state.isPlatformDispatch, this.state.isBidding, value, '', this.state.departureCityArray, '');
    }

    createDateData() {
        const date = [];
        for (let i = 1950; i < 2050; i++) {
            const month = [];
            for (let j = 1; j < 13; j++) {
                const day = [];
                if (j === 2) {
                    for (let k = 1; k < 29; k++) {
                        const dayNum = this.prefixInteger(k, 2);
                        day.push(dayNum);
                    }
                    // Leap day for years that are divisible by 4, such as 2000, 2004
                    if (i % 4 === 0) {
                        day.push(29);
                    }
                } else if (j in {1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1}) {
                    for (let k = 1; k < 32; k++) {
                        const dayNum = this.prefixInteger(k, 2);
                        day.push(dayNum);
                    }
                } else {
                    for (let k = 1; k < 31; k++) {
                        const dayNum = this.prefixInteger(k, 2);
                        day.push(dayNum);
                    }
                }
                const monthObj = {};
                const monNum = this.prefixInteger(j, 2);
                monthObj[monNum] = day;
                month.push(monthObj);
            }
            const dateObj = {};
            dateObj[i] = month;
            date.push(dateObj);
        }
        return date;
    }

    // 数字前面自动补0
    prefixInteger(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }

    showDatePicker(type) {
        let currentDate = '';
        if (type === 1) {
            currentDate = this.state.appointmentStartTime;
        } else {
            currentDate = this.state.appointmentEndTime;
        }
        const selectedValue = currentDate.split('-');
        console.log('======selectedValue', selectedValue);
        Picker.init({
            pickerData: this.createDateData(),
            pickerToolBarFontSize: 18,
            pickerFontSize: 21,
            pickerFontColor: [51, 51, 51, 1],
            pickerBg: [255, 255, 255, 1],
            selectedValue: selectedValue,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '请选择日期',
            pickerConfirmBtnColor: [0, 132, 255, 1],
            pickerCancelBtnColor: [102, 102, 102, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                // console.log('date', pickedValue, pickedIndex);
                const data = this.concatValue(pickedValue);
                console.log('date', data, pickedValue, pickedIndex);
                if (type === 1) {
                    this.setStartTime(data);
                } else {
                    this.setEndTime(data);
                }
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
                if (type === 1) {
                    this.setStartTime(currentDate);
                } else {
                    this.setEndTime(currentDate);
                }
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
            },
        });
        Picker.show();
    }

    // 设置预约起始时间
    setStartTime(data) {
        if (new Date(data).getTime() + 1000 * 60 * 60 * 24 < new Date().getTime()) {
            Toast.showShortCenter('预约开始时间不能小于当前时间');
            return;
        }
        const appointmentEndTime = this.state.appointmentEndTime;
        if (new Date(data).getTime() > new Date(appointmentEndTime).getTime()) {
            Toast.showShortCenter('预约开始时间不能大于预约终止时间');
            return;
        }
        this.setState({
            appointmentStartTime: data,
        });
        this.submit(this.state.isPlatformDispatch, '', '', '', [], data);
    }

    // 设置预约终止时间
    setEndTime(data) {
        const appointmentStartTime = this.state.appointmentStartTime;
        if (new Date(data).getTime() < new Date(appointmentStartTime).getTime()) {
            Toast.showShortCenter('预约终止时间不能小于预约开始时间');
            return;
        }
        this.setState({
            appointmentEndTime: data,
        });
        this.submit(this.state.isPlatformDispatch, '', '', '', [], data);
    }

    // 拼接字符串例如 2017-06-27
    concatValue(pickedValue) {
        let data = '';
        for (let i = 0; i < pickedValue.length; i++) {
            if (i > 0) {
                data += '-'.concat(pickedValue[i]);
            } else {
                data += pickedValue[i];
            }
        }
        return data;
    }

    // 选择城市
    chooseCity() {
        console.log('__departureCityArray___', this.state.departureCityArray);
        if (this.state.departureCityArray.length <= 5) {
            this.props.router.redirect(RouteType.CHOICE_CITYS_PAGE, {
                cityList: this.state.departureCityArray,
                selectedCityCallback: (data) => {
                    let content = '';
                    for (let i = 0; i < data.length; i++) {
                        if (typeof (data) === 'object') {
                            content += data[i].departureCityArrayName;
                        } else {
                            content += data[i];
                        }
                        if (i < data.length - 1) {
                            content += '、';
                        }
                    }
                    this.setState({
                        departureCity: content,
                        departureCityArray: data,
                    });
                    this.submit(this.state.isPlatformDispatch, this.state.isBidding, this.state.isBackTracking, '', data, '');
                },
            });
        } else {
            const deleteCount = this.state.departureCityArray.length - 5;
            this.state.departureCityArray.splice(0, deleteCount);
            this.props.router.redirect(RouteType.CHOICE_CITYS_PAGE, {
                cityList: this.state.departureCityArray,
                selectedCityCallback: (data) => {
                    let content = '';
                    for (let i = 0; i < data.length; i++) {
                        if (typeof (data) == 'object') {
                            content += data[i].departureCityArrayName;
                        } else {
                            content += data[i];
                        }
                        if (i < data.length - 1) {
                            content += '、';
                        }
                    }
                    this.setState({
                        departureCity: content,
                        departureCityArray: data,
                    });
                    this.submit(this.state.isPlatformDispatch, this.state.isBidding, this.state.isBackTracking, '', data, '');
                },
            });
        }
    }

    // 选择日期
    chooseDate(type) {
        this.showDatePicker(type);
    }

    setGoodsPreferenceSuccessCallback(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('设置偏好', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '偏好设置页面');
        console.log('result');
        this.resetCityAction(false);
    }

    setGoodsPreferenceFailCallback() {
        console.log('fail');
        this.resetCityAction(false);
    }

    // 确认设置
    submit(isPlatformDispatch, isBidding, isBackTracking, departureCity, departureCityArray, appointmentTime) {
        currentTime = new Date();
        const {userInfo, userPlateNumber} = this.props;
        const phoneNum = userInfo.result.phone;
        const userId = userInfo.result.userId;
        const userName = userInfo.result.userName;
        const plateNumber = userPlateNumber;
        const {appointmentEndTime, appointmentStartTime} = this.state;
        console.log('===departureCityArray===', departureCityArray);
        this.props.setGoodsPreference({
            appointmentEndTime: appointmentEndTime,
            appointmentStartTime: appointmentStartTime,
            appointmentTime: appointmentTime,
            departureCity: departureCity,
            departureCityArray: departureCityArray,
            isBackTracking: isBackTracking,
            isBidding: isBidding,
            isPlatformDispatch: isPlatformDispatch,
            phoneNum: phoneNum,
            plateNumber: plateNumber,
            userId: userId,
            userName: userName,
        }, this.setGoodsPreferenceSuccessCallback, this.setGoodsPreferenceFailCallback);
        console.log('preferencesss', appointmentTime, departureCity, isBackTracking, isBidding, isPlatformDispatch, phoneNum, userId, userName, plateNumber);
    }

    getTransPorting(getTransPortingCallBack, getTransPortingFailCallBack) {
        this.props.getTransPorting({
            url: API.API_NEW_GET_ORDER_LIST_TRANSPORT,
            body: {
                pageNum: 0,
                pageSize: 500,
                phoneNum: global.phone,
                plateNumber: this.props.userPlateNumber,
            }
        }, getTransPortingCallBack, getTransPortingFailCallBack)
    }

    getTransPortingCallBack(result) {
        console.log('result', result)
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
        console.log('transCodeListData3', transCodeListData3.length, transCodeListData3);

        this.getOrderTransportDetail(transCodeListData3, this.getOrderTransportDetailSuccessCallBack, this.getOrderTransportDetailFailCallBack);

    }

    getTransPortingFailCallBack(err) {

    }

    // 获取运输中订单详情
    getOrderTransportDetail(transCodeList, getOrderTransportDetailSuccessCallBack, getOrderTransportDetailFailCallBack) {
        this.props.getOrderTransportDetailAction({
            plateNumber: '',
            transCodeList: transCodeList,
        }, getOrderTransportDetailSuccessCallBack, getOrderTransportDetailFailCallBack);
    }

    // 获取运输中订单详情成功回调
    getOrderTransportDetailSuccessCallBack(result) {
        if (result && result.length > 0) {
            const cityArray = [];
            for (let i = 0; i < result.length; i++) {
                cityArray.push(result[i].toCity);
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
            let cityContent = '';
            for (let i = 0; i < newArray.length; i++) {
                cityContent += newArray[i];
                if (i < newArray.length - 1) {
                    cityContent += '、';
                }
            }
            console.log('cityContent', cityContent);
            this.setState({
                departureCity: cityContent,
                departureCityArray: cityTempArray,
            });
            Storage.get('prefereceObj').then((value) => {
                if (value) {
                    this.setState({
                        isPlatformDispatch: value.platformSendMode, // 派单模式
                        isBidding: value.biddingGrabMode, // 竞价抢单模式
                        isBackTracking: value.backTracking, // 返程
                        appointmentTime: value.appointmentTime, // 预约时间
                        appointmentStartTime: value.appointmentStartTime, // 预约开始时间
                        appointmentEndTime: value.appointmentEndTime, // 预约结束时间
                        carNature: value.carNature,
                    });
                }
            });
            this.submit(this.state.isPlatformDispatch, this.state.isBidding, this.state.isBackTracking, '', cityTempArray, '');

            // Storage.save('cityArrayData', cityTempArray);
        }
    }

    // 获取运输中订单详情失败回调
    getOrderTransportDetailFailCallBack() {
    }

    render() {
        const {navigator} = this.props;
        console.log('this.state.isBackTracking', this.state.isBackTracking);
        return (
            <View style={stylesCommon.container}>
                <NavigationBar
                    title={'货源偏好'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                />
                <View style={styles.container}>
                    <SwitchItem
                        defaultValue={this.state.isPlatformDispatch}
                        itemTitle="平台派单模式"
                        onValueChange={(value) => {
                            this.setDispatchModel(value);
                        }}
                    />
                    {
                        this.state.carNature !== '自有车' ?
                            <SwitchItem
                                defaultValue={this.state.isBidding}
                                itemTitle="竞价抢单模式"
                                onValueChange={(value) => {
                                    this.setBiddingModel(value);
                                }}
                            /> : null
                    }
                    <SwitchItem
                        defaultValue={this.state.isBackTracking}
                        itemTitle="返程"
                        onValueChange={(value) => {
                            this.setBackTracking(value);
                        }}
                    />
                    <CommonCellWithArrow
                        itemTitle="出发城市"
                        itemContent={this.state.departureCity}
                        showBottomLine={true}
                        onClick={() => {
                            this.chooseCity();
                        }}
                    />
                    <CommonCellWithArrow
                        itemTitle="预约时间"
                        hideArrowIcon={true}
                        showBottomLine={true}
                        itemContent={''}
                        onClick={() => {
                        }}
                    />
                    <CommonCellWithArrow
                        itemTitle="起始时间"
                        showLeftIcon={true}
                        showBottomLine={true}
                        itemTitleStyle={{color: '#999999'}}
                        itemContent={this.state.appointmentStartTime}
                        onClick={() => {
                            this.chooseDate(1);
                        }}
                    />
                    <CommonCellWithArrow
                        itemTitle="终止时间"
                        showLeftIcon={true}
                        itemTitleStyle={{color: '#999999'}}
                        itemContent={this.state.appointmentEndTime}
                        onClick={() => {
                            this.chooseDate(2);
                        }}
                    />
                </View>
            </View>
        );
    }
}


function mapStateToProps(state) {
    return {
        userInfo: state.user.get('userInfo'),
        userPlateNumber: state.app.get('plateNumber'),
        preferenceResult: state.goods.get('preferenceResult'),
        isResetCityList: state.order.get('isResetCity'),

    };
}

function mapDispatchToProps(dispatch) {
    return {
        setGoodsPreference: (params, setGoodsPreferenceSuccessCallback, setGoodsPreferenceFailCallback) => {
            dispatch(setGoodsPreference({
                url: API.API_SET_GOODSOURCE_PREFERENCE,
                body: {
                    appointmentEndTime: params.appointmentEndTime,
                    appointmentStartTime: params.appointmentStartTime,
                    appointmentTime: params.appointmentTime,
                    departureCity: params.departureCity,
                    departureCityArray: params.departureCityArray,
                    isBackTracking: params.isBackTracking,
                    isBidding: params.isBidding,
                    isPlatformDispatch: params.isPlatformDispatch,
                    phoneNum: params.phoneNum,
                    plateNumber: params.plateNumber,
                    userId: params.userId,
                    userName: params.userName,
                },
                successCallBack: (response) => {
                    setGoodsPreferenceSuccessCallback(response);
                },
                failCallBack: () => {
                    setGoodsPreferenceFailCallback();
                },
            }));
        },
        queryGoodsPreferenceAction: (params, querySuccessCallBack) => {
            dispatch(queryGoodsPreference({
                url: API.API_QUERY_GOODSOURCE_PREFERENCE,
                body: {
                    phoneNum: params.phoneNum,
                    plateNumber: params.plateNumber,
                },
                successCallBack: (response) => {
                    querySuccessCallBack(response.result);
                    dispatch(preferenceSetResult(response.result));
                },
                failCallBack: () => {

                },
            }));
        },
        getOrderTransportDetailAction: (params, getOrderTransportDetailSuccessCallBack, getOrderTransportDetailFailCallBack) => {
            dispatch(getOrderTransportDetailAction({
                url: API.API_NEW_GET_GOODS_SOURCE,
                body: {
                    plateNumber: params.plateNumber,
                    transCodeList: params.transCodeList,
                },
                successCallBack: (response) => {
                    getOrderTransportDetailSuccessCallBack(response.result);
                },
                failCallBack: () => {
                    getOrderTransportDetailFailCallBack();
                },
            }));
        },
        // 刷新城市列表
        resetCityListAction: (data) => {
            dispatch(isReSetCity(data));
        },

        getTransPorting: (params, getTransPortingCallBack, getTransPortingFailCallBack) => {
            dispatch(getTransPortingAction({
                successCallBack: (response) => {
                    getTransPortingCallBack(response.result);
                },
                failCallBack: () => {
                    getTransPortingFailCallBack();
                },
                ...params,
            }));

        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(goodsPreferences);

