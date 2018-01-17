/**
 * 安排司机列表界面
 * Created by xizhixin on 2017/12/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    Alert,
    DeviceEventEmitter,
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';
import NavigatorBar from "../../../common/navigationBar/navigationBar";
import RadioList from '../components/RadioList';
import BottomButton from '../components/bottomButtonComponent';
import HTTPRequest from '../../../utils/httpRequest';
import * as API from '../../../constants/api';
import Toast from '@remobile/react-native-toast';

let selected = null;

class arrangeDriverList extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            data: [],
            driverOption: params.driverOption,
            dispatchCode: params.dispatchCode,
        };
        this.getDriverList = this.getDriverList.bind(this);
        this.arrangeCar = this.arrangeCar.bind(this);
    }

    componentDidMount() {
        this.getDriverList();
    }

    componentWillUnmount() {
        selected = null;
    }

    // 获取司机列表信息
    getDriverList() {
        // 传递参数
        HTTPRequest({
            url: API.API_QUERY_DRIVER_LIST,
            params: {
                carNum: this.state.driverOption.carNum,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                this.setState({
                    data: responseData.result,
                });
            },
            error: (errorInfo)=>{},
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
    }
    // 安排车辆
    arrangeCar(driver) {
        // 传递参数
        HTTPRequest({
            url: API.API_NEW_ARRANGE_CARS,
            params: {
                plateNumber: this.state.driverOption.carNum,
                carModel: this.state.driverOption.carLen,
                driverName: driver.driverName,
                driverUserId: driver.id,
                driverPhoneNum: driver.driverPhone,
                dispatchCode: this.state.dispatchCode,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                if(responseData.result) {
                    DeviceEventEmitter.emit('reloadOrderAllAnShippt');
                    const routes = this.props.routes;
                    let key = routes[routes.length - 3].key;
                    this.props.navigation.goBack(key);
                }else {
                    Toast.showShortCenter('安排车辆失败！');
                }
            },
            error: (errorInfo)=>{},
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
    }

    renderListEmpty() {
        return(
            <View>

            </View>
        );
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'司机列表'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    rightButtonConfig={{
                        type:'string',
                        title: '添加司机',
                        onClick: () => {
                            navigator.navigate('DriverManagement');
                        }
                    }}
                />
                <RadioList
                    options={this.state.data}
                    renderEmpty={this.renderListEmpty}
                    maxSelectedOptions={1}
                    onSelection={(option) => {
                        selected = option;
                    }}
                    type={'driver'}
                />
                <BottomButton
                    text={'提交'}
                    onClick={() => {
                        if(selected){
                            this.arrangeCar(selected);
                        }else {
                            Alert.alert('提示','请选择承运的司机');
                        }
                    }}
                />
            </View>
        );
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
});

function mapStateToProps(state){
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(arrangeDriverList);

