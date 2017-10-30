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
    Dimensions
} from 'react-native';

import DetailsCell from '../../../common/source/detailsCell';
import * as StaticColor from '../../../constants/staticColor';
import * as ConstValue from '../../../constants/constValue';
const {width} = Dimensions.get('window');
class WeChatPayment extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.allContainer}>
                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        <View style={styles.leftContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigator.goBack();
                                }}
                            >
                                <Text style={styles.leftTextStyle}>&#xe662;</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.centerContainer}>
                            <Text style={styles.centerTextStyle}>收款</Text>
                        </View>
                        <View style={styles.rightContainer}>
                        </View>
                    </View>
                </View>
                <View style={styles.paymentView}>

                </View>
                <View style={styles.bottomView}>
                    <View style={styles.titleView}>
                        <View style={styles.flexDirection}>
                            <Text style={styles.titleIcon}>&#xe66d;</Text>
                            <Text style={styles.titleText}>呷哺呷哺</Text>
                        </View>
                    </View>
                    <View style={styles.divideLine} />
                    <View style={styles.titleView}>
                        <Text style={styles.titleText}>收货人：李雷雷</Text>
                    </View>
                    <View style={styles.divideLine} />
                    <View style={styles.orderView}>
                        <Text style={styles.transportTime}>订单编号：{'SO17193000002'}</Text>
                        {'SO17193000002' ? <Text style={styles.transportTime}>客户单号：{'SO17193000002'}</Text> : null}
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
});

function mapStateToProps(state){
    return {};
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(WeChatPayment);

