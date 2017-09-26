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
    TextInput,
    Alert,
} from 'react-native';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import Button from 'apsl-react-native-button';
import Toast from '@remobile/react-native-toast';
import BankCode from '../../../utils/bankCode';
import * as API from '../../../constants/api';
import Validator from '../../../utils/validator';
import HTTPRequest from '../../../utils/httpRequest';
import Loading from '../../../utils/loading';

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
    leftTextStyle: {
        fontSize: 16,
        marginLeft: 10,
        width: 70,
    },
    loginButton: {
        backgroundColor: '#1b82d2',
        marginTop: 16,
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
});

export default class AddBankCardPhone extends Component {
    static propTypes = {};

    // 构造
    constructor(props) {
        super(props);

        this.sendVerifyCode = this.sendVerifyCode.bind(this);
        this.sendVerifyCodeCallBack = this.sendVerifyCodeCallBack.bind(this);

        const params = this.props.router.getCurrentRoute().params;
        // 初始状态
        this.state = {
            holdCardName: params.holdCardName,
            IDCardNum: params.IDCardNum,
            bankCardNum: params.bankCardNum,
            bankName: params.bankName,
            cardName: params.cardName,
            phoneNum: '',
            loading: false,

        };
    }

    componentDidMount() {

    }

    sendVerifyCode() {

        HTTPRequest({
            url: API.API_BANKCARD_SENDVERIFYCODE,
            params: {
                abkCard: this.state.bankCardNum,
                abkCode: BankCode.searchCode(this.state.bankName),
                accIdCard: this.state.IDCardNum,
                accName: this.state.holdCardName,
                mobile: this.state.phoneNum,
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (response) => {
                this.sendVerifyCodeCallBack(response.result);
            },
            error: (err) => {
                this.setState({
                    loading: false,
                });
            },
            finish: () => {

            },

        })

        // this.props.sendVerifyCode({
        //     url: API.API_BANKCARD_SENDVERIFYCODE,
        //     body: {
        //         abkCard: this.state.bankCardNum,
        //         abkCode: BankCode.searchCode(this.state.bankName),
        //         accIdCard: this.state.IDCardNum,
        //         accName: this.state.holdCardName,
        //         mobile: this.state.phoneNum,
        //     }
        // }, sendVerifyCodeCallBack, sendVerifyCodeFailCallBack);
    }

    sendVerifyCodeCallBack(result) {
        this.props.navigation.navigate('VerificationCardPhone',
            {
                phoneNum: this.state.phoneNum,
                holdCardName: this.state.holdCardName,
                IDCardNum: this.state.IDCardNum,
                bankCardNum: this.state.bankCardNum,
                bankName: this.state.bankName,
                txSnBinding: result,
                abkCode: BankCode.searchCode(this.state.bankName),
                accName: this.state.holdCardName,
            });
        // this.props.router.redirect(RouteType.VERIFICATION_PHONE_PAGE,
        //     {
        //         phoneNum: this.state.phoneNum,
        //         holdCardName: this.state.holdCardName,
        //         IDCardNum: this.state.IDCardNum,
        //         bankCardNum: this.state.bankCardNum,
        //         bankName: this.state.bankName,
        //         txSnBinding: result,
        //         abkCode: BankCode.searchCode(this.state.bankName),
        //         accName: this.state.holdCardName,
        //     });
    }



    render() {
        const
            navigator
         = this.props.navigation;
        const {phoneNum} = this.state;
        return (

            <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <NavigationBar
                    title={'填写手机号'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />

                <View style={{
                    height: 46,
                    backgroundColor: '#ffffff',
                    marginTop: 16,
                    justifyContent: 'center',

                }}>
                    <Text
                        style={{
                            fontSize: 16,
                            marginLeft: 10,
                        }}>卡类型 {this.state.cardName}</Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    marginTop: 16,
                    alignItems: 'center',
                    height: 46,
                    backgroundColor: '#ffffff'
                }}>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                        <Text style={styles.leftTextStyle}>手机号</Text>
                        <TextInput
                            placeholder="银行预留手机号"
                            placeholderTextColor="gray"
                            underlineColorAndroid={'transparent'}
                            keyboardType="numeric"
                            style={{flex: 1, marginLeft: 10, fontSize: 16}}
                            onChangeText={(phoneNum) => {
                                this.setState({phoneNum});
                            }}
                            value={phoneNum}
                        />
                    </View>
                    <TouchableOpacity onPress={() => {

                        Alert.alert('手机号说明', '银行预留的手机号码是办理该银行卡时所填写的手机号码。没有预留、手机号忘记或者已停用，请联系银行客服更新处理。大陆手机号为11位数字，非大陆手机号为“国家代码-手机号码”形式。',
                            [
                                {
                                    text: '知道了',
                                    onPress: () => {

                                    },
                                },
                            ], {cancelable: false});
                    }}>
                        <Text
                            style={{
                                marginRight: 10,
                                fontFamily: 'iconfont',
                                fontSize: 22,
                                color: '#1b82d2'
                            }}>&#xe626;</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    style={styles.loginButton}
                    textStyle={styles.loginButtonText}
                    onPress={() => {
                        if (Validator.isPhoneNumber(phoneNum)) {
                            this.sendVerifyCode(this.sendVerifyCodeCallBack, this.sendVerifyCodeFailCallBack);
                        } else {
                            Toast.showShortCenter('手机号输入有误，请重新输入');
                        }

                    }}
                >
                    下一步
                </Button>

                <View style={{width, alignItems: 'center', marginTop: 16}}>
                    <Text style={{color: 'gray', fontSize: 13}}>信息已安全加密，仅用于手机验证</Text>
                </View>
                {
                    this.state.loading ? <Loading /> : null
                }
            </View>

        );
    }
}

// function mapStateToProps(state) {
//     return {
//         appLoading: state.app.get('appLoading'),
//     };
// }
//
// function mapDispatchToProps(dispatch) {
//     return {
//         changeAppLoading: (appLoading) => {
//             dispatch(changeAppLoadingAction(appLoading));
//         },
//         sendVerifyCode: (params, sendVerifyCodeCallBack, sendVerifyCodeFailCallBack) => {
//             dispatch(sendVerifyCodeAction({
//                 successCallBack: (response) => {
//                     sendVerifyCodeCallBack(response.result);
//                 },
//                 failCallBack: (err) => {
//                     sendVerifyCodeFailCallBack();
//                 },
//                 ...params,
//             }));
//         },
//     };
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(AddBankCardPhone);
