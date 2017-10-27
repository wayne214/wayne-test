/**
 * Created by wangl on 2017/7/5.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
    DeviceEventEmitter,
    TextInput
} from 'react-native';
import NavigationBar from '../../common/navigationBar/navigationBar';
import Button from 'apsl-react-native-button';
import * as API from '../../constants/api';
import bankIconUtil from '../../utils/bankIconUtil'
import HTTPRequest from '../../utils/httpRequest';
import BankCardCell from '../../containers/income/AccountFlow/cell/bankCardCell'
import StaticImage from '../../constants/staticImage';

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: '#0083FF',
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 0,
        height: 40,
        borderRadius: 5,
        marginBottom: 0,
    },
    loginButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    leftTextStyle: {
        fontSize: 16,
        marginLeft: 10,
        width: 70,
        color: '#333333'
    },
    textInputStyle: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16
    },
});

export default class BankCardDeatil extends Component {
    static propTypes = {
        content: PropTypes.string,
        clickAction: PropTypes.func,
        showBottomLine: PropTypes.bool,
        leftIcon: PropTypes.string,
        rightIcon: PropTypes.string,
    };

    // 构造
    constructor(props) {
        super(props);

        const params = this.props.navigation.state.params;
        // 初始状态
        this.state = {
            bank: params.bank,
            bankType: params.bankType,
            bankAccount: params.bankAccount,
            default: params.default,
            bankCity: '',
            bankSubName: ''
        };
        this.unBankCardBunding = this.unBankCardBunding.bind(this);
        this.bankCardSetDefault = this.bankCardSetDefault.bind(this);
        this.unBankCardBundingCallBack = this.unBankCardBundingCallBack.bind(this);
        this.bankCardSetDefaultCallBack = this.bankCardSetDefaultCallBack.bind(this);
    }

    unBankCardBunding(unBankCardBundingCallBack) {

        HTTPRequest({
            url: API.API_BANK_CARD_UNBUNDING,
            params: {
                bankCardNumber: this.state.bankAccount,
                phoneNum: global.phone,
                userId: global.userId,
                userName: global.userName,
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (response) => {
                unBankCardBundingCallBack(response.result);
            },
            error: (err) => {
                this.setState({
                    loading: false,
                });
            },
            finish: () => {
                this.setState({
                    loading: false,
                });
            },
        })
    }

    unBankCardBundingCallBack(result) {
        console.log('result', result);
        DeviceEventEmitter.emit('BankCardList');
        this.props.navigation.goBack();
    }

    bankCardSetDefault(bankCardSetDefaultCallBack) {

        HTTPRequest({
            url: API.API_BANK_CARD_SETDEFAULT,
            params: {
                bankCardNumber: this.state.bankAccount,
                phoneNum: global.phone,
                userId: global.userId,
                userName: global.userName,
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (response) => {
                bankCardSetDefaultCallBack(response.result);
            },
            error: (err) => {
                this.setState({
                    loading: false,
                });
            },
            finish: () => {
                this.setState({
                    loading: false,
                });
            },
        })
    }

    bankCardSetDefaultCallBack(result) {
        console.log('result', result);
        DeviceEventEmitter.emit('BankCardList');
        this.setState({
            default: 1
        })
    }

    render() {
        const navigator = this.props.navigation;
        const {bank, bankType, bankAccount} = this.state;
        return (

            <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <NavigationBar
                    title={'银行卡详情'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />

                <BankCardCell
                    accountBank={bank}
                    bankCarType={bankType}
                    bankAccount={bankAccount}
                    clickAction={()=>{}}
                />

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    height: 46,
                    marginTop: 10
                }}>
                    <Text style={styles.leftTextStyle}>开户省市</Text>
                    <TouchableOpacity onPress={()=>{

                    }}>
                        <TextInput
                            placeholder="请选择开户省市"
                            placeholderTextColor="#CCCCCC"
                            underlineColorAndroid={'transparent'}
                            style={styles.textInputStyle}
                            value={this.state.bankCityName}
                            editable={false}
                        />
                    </TouchableOpacity>
                    <Image source={StaticImage.rightArrow} style={{right: 10, position: 'absolute'}}/>

                </View>


                <View style={{height: 1, width, backgroundColor: '#e8e8e8', marginLeft: 10}}/>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    height: 46,
                }}>
                    <Text style={styles.leftTextStyle}>开户支行</Text>
                    <TouchableOpacity onPress={()=>{
                        console.log('123');
                    }}>
                        <TextInput
                            placeholder="请选择开户支行"
                            placeholderTextColor="#CCCCCC"
                            underlineColorAndroid={'transparent'}
                            style={styles.textInputStyle}
                            value={this.state.bankSubName}
                            editable={false}
                        />
                    </TouchableOpacity>
                    <Image source={StaticImage.rightArrow} style={{right: 10, position: 'absolute'}}/>

                </View>
                <TouchableOpacity
                    onPress={() => {
                        console.log('this.state.default', this.state.default)
                        this.state.default == 2 ?
                            this.bankCardSetDefault(this.bankCardSetDefaultCallBack)
                            : null
                        // this.setState({
                        //     default: 1
                        // })
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                            marginBottom: 5,
                        }}>

                        {
                            this.state.default == '1' ?
                                <Text
                                    style={{
                                        fontFamily: 'iconfont',
                                        fontSize: 18,
                                        margin: 10,
                                        color: '#0083FF'
                                    }}>
                                    &#xe616;</Text>
                                :
                                <Text
                                    style={{
                                        fontFamily: 'iconfont',
                                        fontSize: 18,
                                        color: '#989998',
                                        margin: 10
                                    }}>
                                    &#xe616;</Text>
                        }


                        <Text
                            style={{
                                fontSize: 16,
                                color: '#989998',
                                marginRight: 10
                            }}>设为默认</Text>

                    </View>
                </TouchableOpacity>

                <Button
                    style={styles.loginButton}
                    textStyle={styles.loginButtonText}
                    onPress={() => {
                        this.unBankCardBunding(this.unBankCardBundingCallBack);
                    }}
                >
                    保存
                </Button>

            </View>
        );
    }
}

// function mapStateToProps(state) {
//     return {};
// }
//
// function mapDispatchToProps(dispatch) {
//     return {
//         unBankCardBunding: (params, unBankCardBundingCallBack) => {
//             dispatch(unBankCardbundingAction({
//                 url: API.API_BANK_CARD_UNBUNDING,
//                 successMsg: '解除绑定成功',
//                 successCallBack: (response) => {
//                     unBankCardBundingCallBack(response.result);
//                 },
//                 failCallBack: (err) => {
//
//                 },
//                 ...params,
//             }));
//         },
//         bankCardSetDefault: (params, bankCardSetDefaultCallBack) => {
//             dispatch(bankCardSetDefaultAction({
//                 url: API.API_BANK_CARD_SETDEFAULT,
//                 successMsg: '设置默认成功',
//                 successCallBack: (response) => {
//                     bankCardSetDefaultCallBack(response.result);
//                 },
//                 failCallBack: (err) => {
//
//                 },
//                 ...params,
//             }));
//         },
//     };
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(BankCardDeatil);
