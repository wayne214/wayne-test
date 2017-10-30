import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    Alert
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';
import StaticImage from '../../../constants/staticImage';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import RadioGroup from './radioGroup';
import RadioButton from './radioButton';
const {width, height} = Dimensions.get('window');

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
        height: width * 300 / 710,
        marginTop: 10,
        backgroundColor: 'transparent',
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
        this.state = {
            payTypes: '现金'
        }
    }

    componentDidMount() {
        console.log('.......000000',width, height)
    }
    onSelect(index, value){
        this.setState({
            payTypes: value
        });
    }
    submit() {
        if (this.state.payTypes === '现金') {
            Alert.alert('','本次收款方式为:现金收款,确认后无' +
                '法修改，是否确认收款?', [
                {text: '取消',
                    onPress: () => {
                        // DeviceEventEmitter.emit('changeStateReceipt');
                        // this.goBackForward();
                    },
                },
                {text: '确认',
                    onPress: () => {
                        // this.props.navigation.navigate('UploadReceipt', {
                        //     transCode: this.state.orderID
                        // });
                    },
                },
            ], {cancelable: false});
        }
        console.log('支付方式', this.state.payTypes);
    }
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
                            <Text style={styles.moneyStyle}>230.00</Text>
                        </View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, paddingLeft: 20, paddingRight: 20}}>
                            <Text style={styles.codeStyle}>订单号：SO1234567890</Text>
                            <Text style={styles.codeStyle}>客户单号：1234567890</Text>
                        </View>
                    </ImageBackground>
                    <View style={styles.contactContainer}>
                        <Text style={styles.addressIcon}>&#xe66d;</Text>
                        <Text style={[styles.address, {flex: 1, marginLeft: 5}]}>呷哺呷哺(中关村点)</Text>
                        <Text style={styles.address}>李雷雷</Text>
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
                            <RadioButton value={'现金'} imageUrl="&#xe66f;" color={'#36ABFF'}>
                                <Text style={styles.cashAndWeChatStyle}>现金</Text>
                            </RadioButton>

                            <RadioButton value={'微信'} imageUrl="&#xe66e;" color={'#41B035'}>
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

