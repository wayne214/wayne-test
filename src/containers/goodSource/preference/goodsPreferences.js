import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
} from 'react-native';
import Picker from 'react-native-picker-custom'; // 时间弹窗
import Toast from '@remobile/react-native-toast';
import moment from 'moment'; // 时间格式化工具
import NavigationBar from '../../../common/navigationBar/navigationBar';
import SwitchItem from '../component/switchItem';
import CommonCellWithArrow from '../component/commonCellWithArrow';
import {
    isReSetCity,
} from '../../../action/order';
import * as API from '../../../constants/api';
import StorageKey from '../../../constants/storageKeys';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import ProvinceListJson from '../data/province.json';
import Storage from '../../../utils/storage';
import HTTPRequest from '../../../utils/httpRequest';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

let transCodeList = [];


let transCodeListData = [];
let transCodeListData2 = [];
let transCodeListData3 = [];

const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
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
            loading: false,
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
        this.queryPreferenceFailCallBack = this.queryPreferenceFailCallBack.bind(this);

    }

    componentDidMount() {
        const phoneNum = global.phone;
        const {userPlateNumber} = this.props;
        console.log('是否返程开启', this.props.isResetCityList, this.state.isBackTracking);
        // 查询货源偏好设置
        this.queryGoodSourcePre(phoneNum, userPlateNumber, this.queryPreferenceSuccessCallBack, this.queryPreferenceFailCallBack);
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

                console.log('出发城市', cityArray);
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
            if (prefereceObj.departureCityArray === null || prefereceObj.departureCityArray === [] || prefereceObj.departureCityArray === '') {
                this.getCurrentPosition();
            }
        }
    }
    // 如果调用接口失败，出发城市显示定位城市
    queryPreferenceFailCallBack() {
        this.getCurrentPosition();
    }
    // 查询货源偏好设置
    queryGoodSourcePre(phone, plateNum, queryPreferenceSuccessCallBack, queryPreferenceFailCallBack) {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_QUERY_GOODSOURCE_PREFERENCE,
            params: {
                phoneNum: phone,
                plateNumber: plateNum,
            },
            loading: ()=>{

            },
            success: (responseData)=>{
                console.log('success',responseData);
                queryPreferenceSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
                queryPreferenceFailCallBack();
            },
            finish: ()=>{
            }
        });
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
            this.props.navigation.navigate('ChoiceCityPage', {
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
            this.props.navigation.navigate('ChoiceCityPage', {
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
        this.resetCityAction(false);
    }

    setGoodsPreferenceFailCallback() {
        this.resetCityAction(false);
    }

    // 确认设置
    submit(isPlatformDispatch, isBidding, isBackTracking, departureCity, departureCityArray, appointmentTime) {
        currentTime = new Date();
        const phoneNum = global.phone;
        const userId = global.userId;
        const userName = global.userName;
        const { userPlateNumber} = this.props;
        const {appointmentEndTime, appointmentStartTime} = this.state;
        console.log('===departureCityArray===', departureCityArray);
        HTTPRequest({
            url: API.API_SET_GOODSOURCE_PREFERENCE,
            params: {
                appointmentEndTime: appointmentEndTime,
                appointmentStartTime: appointmentStartTime,
                appointmentTime: appointmentTime,
                departureCity: departureCity,
                departureCityArray: departureCityArray,
                isBackTracking: isBackTracking,
                isBidding: isBidding,
                isPlatformDispatch: isPlatformDispatch,
                phoneNum: phoneNum,
                plateNumber: userPlateNumber,
                userId: userId,
                userName: userName,
            },
            loading: ()=>{

            },
            success: (responseData)=>{
                console.log('success',responseData);
                this.setState({
                    loading: false,
                }, ()=>{
                    lastTime = new Date().getTime();
                    this.setGoodsPreferenceSuccessCallback(responseData.result);
                });

            },
            error: (errorInfo)=>{
                this.setState({
                    loading: false,
                }, () => {
                    this.setGoodsPreferenceFailCallback()
                });
            },
            finish: ()=>{
            }
        });

    }

    render() {
        const navigator = this.props.navigation;
        console.log('this.state.isBackTracking', this.state.isBackTracking);
        return (
            <View style={styles.outContainer}>
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
        userPlateNumber: state.app.get('plateNumber'),
        preferenceResult: state.goods.get('preferenceResult'),
        isResetCityList: state.order.get('isResetCity'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // 刷新城市列表
        resetCityListAction: (data) => {
            dispatch(isReSetCity(data));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(goodsPreferences);

