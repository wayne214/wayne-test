import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    Platform
} from 'react-native';
import {Geolocation} from 'react-native-baidu-map-xzx';
import * as StaticColor from '../../../constants/staticColor';
import StaticImage from '../../../constants/staticImage';
import * as API from '../../../constants/api';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import HTTPRequest from '../../../utils/httpRequest';
import Toast from '@remobile/react-native-toast';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import RadioGroup from './radioGroup';
import RadioButton from './radioButton';
const {width, height} = Dimensions.get('window');

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    subContainer: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    backgroundImg: {
        width: width,
        marginTop: 10,
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
                height: width * 300 / 710,
            },
            android : {
                height: width * 300 / 650,

            }
        })
    },
    contactContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    addressIcon: {
        fontFamily: 'iconfont',
        color: StaticColor.COLOR_CONTACT_ICON_COLOR,
        fontSize: 19
    },
    address: {
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 15
    },
    separateLine: {
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
        height: 10,
        width: width
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    amountLine: {
        backgroundColor: StaticColor.WHITE_COLOR,
        height: 1,
        width: 33,
        opacity: 0.5
    },
    amountTitle: {
        fontSize: 13,
        color: StaticColor.WHITE_COLOR,
        marginLeft: 10,
        marginRight: 10
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 40,
        height: 40,
        backgroundColor: 'transparent',
        alignSelf: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: StaticColor.WHITE_COLOR,
    },
    moneyStyle: {
        fontSize: 40,
        color: StaticColor.WHITE_COLOR
    },
    codeStyle: {
        fontSize: 12,
        color: StaticColor.WHITE_COLOR,
        opacity: 0.8
    },
    cashAndWeChatStyle: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR
    }
});

class payTypes extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            payTypes: '现金',
            orderCode: params.orderCode,
            amount: '0',
            deliveryInfo: params.deliveryInfo,
            customCode: params.customCode,
        };
        this.confirmPayment = this.confirmPayment.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        this.getSettleAmount();
        console.log('.......orderCode',this.state.orderCode);
    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }
    getSettleAmount() {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_AC_GET_SETTLE_AMOUNT + this.state.orderCode,
            loading: ()=>{
            },
            success: (responseData)=>{
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('付款方式', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '付款方式选择页面');
                this.setState({
                    amount: responseData.result,
                });
            },
            error: (errorInfo)=>{
            },
            finish:()=>{
            }
        });
    }

    onSelect(index, value){
        this.setState({
            payTypes: value
        });
    }
    confirmPayment() {
        console.log('---信息----', this.state.amount, this.state.orderCode, global.userId);
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_AC_COMFIRM_PAYMENT,
            params: {
                amount: this.state.amount,
                transCode: this.state.orderCode,
                userId: global.userId,
            },
            loading: ()=>{
            },
            success: (responseData)=>{
                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('现金确认支付', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '付款方式选择页面');
                Toast.showShortCenter('收款成功');
                DeviceEventEmitter.emit('refreshDetails');
                this.props.navigation.goBack();
            },
            error: (errorInfo)=>{
            },
            finish:()=>{
            }
        });
    }
    submit() {
        if (this.state.payTypes === '现金') {
            Alert.alert('','本次收款方式为:现金收款,确认后无' +
                '法修改，是否确认收款?', [
                {text: '取消',
                    onPress: () => {
                    },
                },
                {text: '确认',
                    onPress: () => {
                        this.confirmPayment();
                    },
                },
            ], {cancelable: false});
        } else {
            this.props.navigation.navigate('WeChatPayment', {
                transCode: this.state.orderCode,
                deliveryInfo: this.state.deliveryInfo,
                customCode: this.state.customCode,
                accountMoney: this.state.amount,
            });
        }
    }
    //this.state.amount  Math.floor(parseFloat(this.state.amount) * 100) / 100
    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'收款'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <View style={styles.subContainer}>
                    <ImageBackground source={StaticImage.PayBackground} style={styles.backgroundImg} resizeMode='stretch'>
                        <View style={styles.amountContainer}>
                            <View style={styles.amountLine}/>
                            <Text style={styles.amountTitle}>收款金额</Text>
                            <View style={styles.amountLine}/>
                        </View>
                        <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 20}}>
                            <Text style={styles.moneyStyle}>+</Text>
                            <Text style={styles.moneyStyle}>{parseFloat(this.state.amount).toFixed(2)}</Text>
                        </View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, paddingLeft: 20, paddingRight: 20}}>
                            <Text style={styles.codeStyle}>订单号：{this.state.orderCode}</Text>
                            {
                                this.state.customCode ? <Text style={styles.codeStyle}>客户单号：{this.state.customCode}</Text> : null
                            }
                        </View>
                    </ImageBackground>
                    <View style={styles.contactContainer}>
                        <Text style={styles.addressIcon}>&#xe66d;</Text>
                        <Text style={[styles.address, {flex: 1, marginLeft: 5}]}>{this.state.deliveryInfo.receiveContact}</Text>
                        <Text style={styles.address}>{this.state.deliveryInfo.receiveContactName}</Text>
                    </View>
                    <View style={styles.separateLine} />
                    <View>
                        <Text style={[styles.address, {fontSize: 16, marginBottom: 15, marginTop: 15, marginLeft: 10}]}>选择收款方式</Text>
                        <View style={[styles.separateLine, {height: 1}]} />
                        <RadioGroup
                            onSelect = {(index, value) => this.onSelect(index, value)}
                            selectedIndex={0}
                            thickness={2}
                            style={{paddingLeft: 10}}
                        >
                            <RadioButton value={'现金'} imageUrl="&#xe670;" color={'#36ABFF'}>
                                <Text style={styles.cashAndWeChatStyle}>现金</Text>
                            </RadioButton>

                            <RadioButton value={'微信'} imageUrl="&#xe66f;" color={'#41B035'}>
                                <Text style={styles.cashAndWeChatStyle}>微信</Text>
                            </RadioButton>
                        </RadioGroup>
                        <View style={styles.separateLine} />
                    </View>
                    <View style={{marginTop: 10}}>
                        <TouchableOpacity
                            onPress={() => {
                                this.submit();
                            }}
                        >
                            <ImageBackground source={StaticImage.BlueButtonArc} style={styles.button} resizeMode='stretch'>
                                <Text style={styles.buttonText}>确认支付</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(payTypes);

