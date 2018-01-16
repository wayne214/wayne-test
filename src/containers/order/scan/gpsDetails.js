/**
 * 查看GPS设备详情
 * Created by xizhixin on 2017/12/20.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    DeviceEventEmitter,
} from 'react-native';
import NavigatorBar from '../../../common/navigationBar/navigationBar';
import BottomButton from '../components/bottomButtonComponent';
import CommonCell from '../../mine/cell/commonCell';
import StaticImage from '../../../constants/staticImage';
import * as StaticColor from '../../../constants/staticColor';
import HTTPRequest from '../../../utils/httpRequest';
import * as API from '../../../constants/api';
import Toast from '@remobile/react-native-toast';

class gpsDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
        this.unbindGPS = this.unbindGPS.bind(this);
        this.getGPSDetails = this.getGPSDetails.bind(this);
    }
    componentDidMount() {
        this.getGPSDetails();
    }
    // 获取GPS设备信息
    getGPSDetails() {
        HTTPRequest({
            url: API.API_GET_GPS_DETAILS,
            params: {
                bindCarNum: global.plateNumber,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                if(responseData.result){
                    this.setState({
                        data: responseData.result,
                    });
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
    // 解除绑定
    unbindGPS() {
        // 传递参数
        HTTPRequest({
            url: API.API_BIND_OR_RELIEVE_GPS,
            params: {
                driverPhone: global.phone,
                userId: global.userId,
                userName: global.userName,
                bindCarNum: global.plateNumber,
                barCode: this.state.data.barCode,
                isBind: 0, // 解除绑定
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                if(responseData.result){
                    Toast.showShortCenter('解除绑定成功');
                    this.props.navigation.goBack();
                    DeviceEventEmitter.emit('refreshShippedDetails');
                }else {
                    Toast.showShortCenter('解除绑定失败');
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
    render() {
        const navigator = this.props.navigation;
        const {data} = this.state;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    leftButtonHidden={false}
                    title={'详情'}
                    navigator={navigator}
                />
                <View style={{flex: 1,}}>
                    <CommonCell itemName="供应商设备:" content={data.deviceSupplier ?data.deviceSupplier : ''} hideBottomLine={true}/>
                    <CommonCell itemName="供应商设备型号:" content={data.deviceVersion ? data.deviceVersion : ''} hideBottomLine={true}/>
                    <CommonCell itemName="供应商设备编号:" content={data.deviceNo ? data.deviceNo : ''} hideBottomLine={true} />
                    <CommonCell itemName="开启/关闭:" content={data.onOff == 0 ? '开启': '关闭'} hideBottomLine={true}/>
                    <CommonCell itemName="当前电量:" content={data.eleValue ? `${data.eleValue}%` : '0%'} hideBottomLine={true}/>
                </View>
                <BottomButton
                    onClick={() => {
                        this.unbindGPS();
                    }}
                    text="解除绑定"
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

export default connect(mapStateToProps, mapDispatchToProps)(gpsDetails);

