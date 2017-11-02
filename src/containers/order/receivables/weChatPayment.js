/**
 * Created by xizhixin on 2017/10/30.
 * 微信支付界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Dimensions,
    Image,
    WebView
} from 'react-native';

import * as StaticColor from '../../../constants/staticColor';
import * as ConstValue from '../../../constants/constValue';
import qrCode from '../../../../assets/order/qrcode.png';
import StaticImage from '../../../constants/staticImage';
import HTTPRequest from '../../../utils/httpRequest';
import * as API from '../../../constants/api';


class WeChatPayment extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            orderCode: params.transCode,
            deliveryInfo: params.deliveryInfo,
            customCode: params.customCode,
            url: ''
        };
        this.getWeChatQrCode = this.getWeChatQrCode.bind(this);
    }
    componentDidMount() {
        this.getWeChatQrCode();
        // this.qrCodePayment();
    }
    // 获取微信二维码
    getWeChatQrCode() {
        HTTPRequest({
            url: API.API_AC_GET_WECHAT_QRCODE,
            params: {
                transCode: this.state.orderCode,
                userId: global.userId
            },
            loading: ()=>{
            },
            success: (responseData)=>{
                console.log('url',responseData.result);
                this.setState({
                    url: responseData.result
                })
            },
            error: (errorInfo)=>{
            },
            finish:()=>{
            }
        });
    }
    // qrCodePayment() {
    //     var ws = new WebSocket(API.API_AC_QRCODE_PAYMENT + this.state.orderCode);
    //
    //     ws.onopen = () => {
    //
    //     };
    //
    //     ws.onmessage = (e) => {
    //         // 接收到了一个消息
    //         console.log('===============',e.data);
    //     };
    //
    //     ws.onerror = (e) => {
    //         // 发生了一个错误
    //         console.log(e.message);
    //     };
    //
    //     ws.onclose = (e) => {
    //         // 连接被关闭了
    //         console.log(e.code, e.reason);
    //     };
    // }
    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.allContainer}>
                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        <View style={styles.leftContainer}>
                            {
                                1 === 1 ?
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                navigator.goBack();
                                            }}
                                        >
                                            <Text style={styles.leftTextStyle}>&#xe662;</Text>
                                        </TouchableOpacity>
                                    </View> : null
                            }
                        </View>
                        <View style={styles.centerContainer}>
                            <Text style={styles.centerTextStyle}>收款</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            {
                                1 === 1 ? null :
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                console.log('完成按钮点击事件');
                                            }}
                                        >
                                            <Text style={styles.buttonText}>完成</Text>
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>
                    </View>
                </View>
                <View style={styles.paymentView}>
                    <View style={styles.paymentTitleView}>
                       <View style={styles.flexDirection}>
                           <Text style={styles.paymentIcon}>&#xe671;</Text>
                           <Text style={styles.paymentText}>微信支付</Text>
                       </View>
                    </View>
                        {
                            1 === 1 ?
                            <View>
                                <Text style={styles.amountText}>￥230.00</Text>
                                <Text style={styles.tip}>二维码有效期是10分钟</Text>
                                <View style={styles.imageView}>
                                    <WebView
                                        style={{
                                            height: 150,
                                            width: 150,
                                            alignItems: 'center'
                                        }}
                                        source={{uri: this.state.url}}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                        scalesPageToFit={true}
                                    />
                                </View>
                                <View style={{alignItems:'center'}}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.getWeChatQrCode();
                                        }}
                                    >
                                        <View style={styles.flexDirection}>
                                            <Text style={styles.tipIcon}>&#xe66b;</Text>
                                            <Text style={styles.tipText}>手动刷新二维码</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View> :
                            <View style={styles.content}>
                                <Image source={StaticImage.finishIcon} />
                                <Text style={styles.success}>支付成功</Text>
                            </View>
                        }
                </View>
                <View style={styles.bottomView}>
                    <View style={styles.titleView}>
                        <View style={styles.flexDirection}>
                            <Text style={styles.titleIcon}>&#xe66d;</Text>
                            <Text style={styles.titleText}>{this.state.deliveryInfo.receiveContact}</Text>
                        </View>
                    </View>
                    <View style={styles.divideLine} />
                    <View style={styles.titleView}>
                        <Text style={styles.titleText}>收货人：{this.state.deliveryInfo.receiveContactName}</Text>
                    </View>
                    <View style={styles.divideLine} />
                    <View style={styles.orderView}>
                        <Text style={styles.transportTime}>订单编号：{this.state.orderCode}</Text>
                        {this.state.customCode ? <Text style={styles.transportTime}>客户单号：{this.state.customCode}</Text> : null}
                    </View>
                </View>
            </View>
        );
    }
}

const styles =StyleSheet.create({
    allContainer: {
        flex: 1,
        backgroundColor: StaticColor.BLUE_BACKGROUND_COLOR,
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
        backgroundColor: StaticColor.BLUE_BACKGROUND_COLOR,
    },
    contentContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: 15,
            },
            android: {
                paddingTop: 0,
            },
        }),
        flexDirection: 'row',
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'center',

    },
    centerContainer: {
        flex: 2,
        justifyContent: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    centerTextStyle: {
        textAlign: 'center',
        color: StaticColor.WHITE_COLOR,
        fontSize: 18,
        marginTop: 10,
        fontWeight: '500'
    },
    leftTextStyle: {
        fontFamily: 'iconfont',
        fontSize: 18,
        color: StaticColor.WHITE_COLOR,
        marginLeft: 10,
        marginTop: 10
    },
    paymentView:{
        backgroundColor: StaticColor.WHITE_COLOR,
        marginLeft: 25,
        marginRight: 25,
        flex: 2,
        marginTop: 30,
        borderRadius: 5,
    },
    bottomView: {
        backgroundColor: StaticColor.WHITE_COLOR,
        marginTop: 15,
        marginLeft: 25,
        marginRight: 25,
        borderRadius: 5,
        marginBottom: 53,
        height: 148,
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10,
        paddingTop: 11,
        paddingBottom: 11,
    },
    orderView: {
        marginLeft: 15,
        paddingTop: 11,
    },
    paymentIcon:{
        fontFamily: 'iconfont',
        color: StaticColor.BLUE_BACKGROUND_COLOR,
        fontSize: 18,
        alignSelf: 'center',
    },
    tipIcon:{
        fontFamily: 'iconfont',
        color: '#A0A0A0',
        fontSize: 15,
        alignSelf: 'center',
    },
    titleIcon:{
        fontFamily: 'iconfont',
        color: '#A0A0A0',
        fontSize: 18,
        alignSelf: 'center',
    },
    titleText: {
        fontSize: 18,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginLeft: 8,
    },
    paymentText: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginLeft: 5,
    },
    flexDirection: {
        flexDirection: 'row',
    },
    divideLine: {
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
        height: 1,
        marginLeft: 10,
    },
    transportTime: {
        fontSize: 13,
        color: StaticColor.GRAY_TEXT_COLOR,
        paddingBottom: 5,
    },
    paymentTitleView: {
        paddingTop: 14,
        paddingBottom: 14,
        backgroundColor: StaticColor.TITLE_BACKGROUND_COLOR,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 15,
    },
    amountText: {
        fontSize: 25,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        alignSelf: 'center',
        padding: 20,
    },
    tipText: {
        fontSize: 14,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        marginLeft: 10,
    },
    tip: {
        fontSize: 14,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        alignSelf: 'center',
    },
    imageView: {
        marginTop: 15,
        marginBottom: 15,
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'blue'
    },
    success: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginTop: 15,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginBottom: 10
    },
    buttonText: {
        fontSize: 16,
        color: StaticColor.WHITE_COLOR,
        textAlign: 'center',
        marginRight: 10,
        marginTop: 10,
    }
});

function mapStateToProps(state){
    return {};
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(WeChatPayment);

