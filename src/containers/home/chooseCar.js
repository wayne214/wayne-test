/**
 * 切换车辆页面
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    Alert,
    Dimensions,
    DeviceEventEmitter,
    BackHandler
} from 'react-native';
import {Geolocation} from 'react-native-baidu-map-xzx';
import {NavigationActions} from 'react-navigation';

import {
    setUserCarAction
} from '../../action/user';

import NavigationBar from '../../common/navigationBar/navigationBar';
import CommonButton from '../../common/commonButton';
import CheckBoxList from '../../common/checkBoxList';
import * as ConstValue from '../../constants/constValue';
import * as StaticColor from '../../constants/staticColor';
import * as API from '../../constants/api';

import HTTPRequest from '../../utils/httpRequest';
import Storage from '../../utils/storage';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import StorageKeys from '../../constants/storageKeys';

const screenHeight = Dimensions.get('window').height;

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND
    },
    content: {
        marginTop: 10,
        backgroundColor: 'white',
        height: screenHeight - ConstValue.NavigationBar_StatusBar_Height - ConstValue.Tabbar_Height - 10 - 44,
    },
    // 按钮
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 17,
        color: StaticColor.BLUE_TEXT_COLOR,
        textAlign: 'center',
    },
});
class chooseCar extends Component {
    constructor(props) {
        super(props);
        const carList = this.props.navigation.state.params.carList;
        const flag = this.props.navigation.state.params.flag;
        const currentCar = this.props.navigation.state.params.currentCar;
        let seletCarObj = {};
        for (let i = 0; i < carList.length; i++) {
            if (currentCar === carList[i].carNum) {
                seletCarObj = carList[i];
                break;
            } else {
                seletCarObj = carList[0];
            }
        }
        this.select = seletCarObj;
        this.state = {
            dataSource: carList,
            plateNumber: '',
            flag: flag,
            currentCar: currentCar,
            plateNumberObj: {},
        };
        this.setUserCar = this.setUserCar.bind(this);
        this.saveUserCarInfo = this.saveUserCarInfo.bind(this);
        this.setUserCarSuccessCallBack = this.setUserCarSuccessCallBack.bind(this);
    }
    componentDidMount() {
        this.getCurrentPosition();
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }

    handleBack = () => {
        // const current = this.props.navigation.state;
        // if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
        //     if (current.key === RouteType.CHOOSE_CAR_PAGE) {
        //         return true;
        //     }
        // }
        // return false;
    };

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }

    // 跳转界面并重置路由栈
    resetTo(index = 0, routeName) {
        const resetAction = NavigationActions.reset({
            index: index,
            actions: [
                NavigationActions.navigate({ routeName: routeName}),
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    // 选中车辆
    onSelect(data) {
        console.log('selectedCar= ', data);
        this.setUserCar(data, this.setUserCarSuccessCallBack);
    }

    // 保存设置车辆
    setUserCar(plateNumber) {
        currentTime = new Date().getTime();
        Storage.get(StorageKeys.USER_INFO).then((value) => {
            console.log('va----',value);
            if(value) {
                HTTPRequest({
                    url: API.API_SET_USER_CAR,
                    params: {
                        plateNumber: plateNumber,
                        phoneNum: value.phone,
                    },
                    loading: ()=>{},
                    success: (responseData)=>{
                        this.setUserCarSuccessCallBack(responseData.result);
                    },
                    error: (errorInfo)=>{
                        console.log('eerronfFinf',errorInfo);
                    },
                    finish:()=>{}
                });
            }
        });
    }
    setUserCarSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('绑定车辆', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '设置车辆页面');
        const {userInfo} = this.props;
        console.log('设置车辆成功了', this.state.plateNumber, userInfo.phone, this.state.plateNumberObj);
        Storage.save('setCarSuccessFlag', '3');
        this.saveUserCarInfo(this.state.plateNumberObj);
        Storage.remove('carInfoResult');
        if (this.state.flag){
            this.resetTo(0, 'Main');
        } else {
            this.props.navigation.goBack();
            DeviceEventEmitter.emit('updateOrderList');
            DeviceEventEmitter.emit('resetGood');
        }
    }
    // 保存车牌号对象
    saveUserCarInfo(plateNumberObj) {
        this.props.saveUserSetCarSuccess(plateNumberObj);
    }

    render() {
        const navigator = this.props.navigation;
        const {dataSource} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'选择车辆'}
                    navigator={navigator}
                    leftButtonHidden={this.state.flag}
                />
                <View style={styles.content}>
                    <CheckBoxList
                        options={
                            dataSource
                        }
                        selectedOptions={[JSON.stringify(this.select) == '{}' ? dataSource[0] : this.select]}
                        maxSelectedOptions={1}
                        onSelection={(option) => {
                            this.select = option;
                        }}
                    />
                </View>
                <View style={{flex: 1}} />
                <View style={{paddingBottom: 20}}>
                    <CommonButton
                        onClick={() => {
                            console.log('this.select',this.select);
                            if (JSON.stringify(this.select) == '{}') {
                                Alert.alert('提示', '请选择车辆');
                                return;
                            }
                            this.setState({
                                plateNumber: JSON.stringify(this.select) == '{}' ? dataSource[0].carNum : this.select.carNum,
                                plateNumberObj: JSON.stringify(this.select) == '{}' ? dataSource[0] : this.select,
                            });
                            this.onSelect(JSON.stringify(this.select) == '{}' ? dataSource[0].carNum : this.select.carNum);
                        }}
                        buttonText="确认"
                    />
                </View>

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userInfo: state.user.get('userInfo'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveUserSetCarSuccess: (plateNumberObj) => {
            dispatch(setUserCarAction(plateNumberObj));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(chooseCar);

