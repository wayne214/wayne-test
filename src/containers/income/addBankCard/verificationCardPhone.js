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
    DeviceEventEmitter,
    TextInput,
} from 'react-native';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import Button from 'apsl-react-native-button';
import CountDownButton from '../../../common/countDownButton';
import * as API from '../../../constants/api';
import Toast from '@remobile/react-native-toast';
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
        marginTop: 20,
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

export default class VerificationCardPhone extends Component {
    static propTypes = {};

    // 构造
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        // 初始状态
        this.state = {
            holdCardName: params.holdCardName,
            IDCardNum: params.IDCardNum,
            bankCardNum: params.bankCardNum,
            phoneNum: params.phoneNum,
            bankName: params.bankName,
            txSnBinding: params.txSnBinding,
            abkCode: params.abkCode,
            accName: params.accName,
            SMSCode: '',
            loading: false,
        };
        this.bankCardBunding = this.bankCardBunding.bind(this);
        this.bankCardBundingCallBack = this.bankCardBundingCallBack.bind(this);
        this.bankCardBundingFailCallBack = this.bankCardBundingFailCallBack.bind(this);
        this.checkVerifyCode = this.checkVerifyCode.bind(this);
        this.checkVerifyCodeCallBack = this.checkVerifyCodeCallBack.bind(this);
        this.checkVerifyCodeFailCallBack = this.checkVerifyCodeFailCallBack.bind(this);
        this.sendVerifyCode = this.sendVerifyCode.bind(this);
        this.sendVerifyCodeCallBack = this.sendVerifyCodeCallBack.bind(this);
        this.sendVerifyCodeFailCallBack = this.sendVerifyCodeFailCallBack.bind(this);
        this.changeAppLoading = this.changeAppLoading.bind(this);
    }

    componentDidMount() {
        this.refs.countDown.shouldStartCountting(true);
    }

    checkVerifyCode(checkVerifyCodeCallBack,checkVerifyCodeFailCallBack){


        HTTPRequest({
            url: API.API_BANKCARD_CHECK_VERIFYCODE,
            params: {
                txSnBinding: this.state.txSnBinding,
                verifyCode: this.state.SMSCode,
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (response) => {
                checkVerifyCodeCallBack(response.result);
            },
            error: (err) => {
                checkVerifyCodeFailCallBack();
                this.setState({
                    loading: false,
                });
            },
            finish: () => {

            },

        })

        // this.props.checkVerifyCode({
        //     url: API.API_BANKCARD_CHECK_VERIFYCODE,
        //     body: {
        //         txSnBinding: this.state.txSnBinding,
        //         verifyCode: this.state.SMSCode,
        // }
        // },checkVerifyCodeCallBack,checkVerifyCodeFailCallBack)
    }

    checkVerifyCodeCallBack(result){
        this.bankCardBunding(this.bankCardBundingCallBack,this.bankCardBundingFailCallBack);
    }
    checkVerifyCodeFailCallBack(){
        this.changeAppLoading(false);
    }

    bankCardBunding(bankCardBundingCallBack,bankCardBundingFailCallBack) {

        HTTPRequest({
            url: API.API_BANK_CARD_BUNDING,
            params: {
                accountName: this.state.holdCardName,
                bankCardNumber: this.state.bankCardNum,
                bankName: this.state.bankName,
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
                bankCardBundingCallBack(response.result);
            },
            error: (err) => {
                bankCardBundingFailCallBack();
                this.setState({
                    loading: false,
                });
            },
            finish: () => {

            },

        })

        // this.props.bankCardBunding({
        //     body: {
        //         accountName: this.state.holdCardName,
        //         bankCardNumber: this.state.bankCardNum,
        //         bankName: this.state.bankName,
        //         phoneNum: global.phone,
        //         userId: global.userId,
        //         userName: global.userName,
        //     }
        // },bankCardBundingCallBack,bankCardBundingFailCallBack)
    }
    bankCardBundingCallBack(result){
        console.log(result,'result')
        DeviceEventEmitter.emit('BankCardList');
        this.props.navigation.navigate('MyBankCard');
        // this.props.router.popToRoute(RouteType.MY_BANK_CARD_PAGE);

    }
    bankCardBundingFailCallBack(){

        DeviceEventEmitter.emit('BankCardList');
        this.props.navigation.navigate('MyBankCard');

        // this.props.router.popToRoute(RouteType.MY_BANK_CARD_PAGE);
    }

    sendVerifyCode(sendVerifyCodeCallBack,sendVerifyCodeFailCallBack,shouldStartCountting){

        HTTPRequest({
            url:API.API_BANKCARD_SENDVERIFYCODE,
            params: {
                abkCard: this.state.bankCardNum,
                abkCode: this.state.abkCode,
                accIdCard: this.state.IDCardNum,
                accName: this.state.accName,
                mobile: this.state.phoneNum,
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (response) => {
                sendVerifyCodeCallBack(response.result);
            },
            error: (err) => {
                sendVerifyCodeFailCallBack();
                this.setState({
                    loading: false,
                });
            },
            finish: () => {

            },
        })
        // this.props.sendVerifyCode({
        //     url:API.API_BANKCARD_SENDVERIFYCODE,
        //     body: {
        //         abkCard: this.state.bankCardNum,
        //         abkCode: this.state.abkCode,
        //         accIdCard: this.state.IDCardNum,
        //         accName: this.state.accName,
        //         mobile: this.state.phoneNum,
        //     }
        // }, sendVerifyCodeCallBack,sendVerifyCodeFailCallBack,shouldStartCountting);
    }
    sendVerifyCodeCallBack(result){

        this.setState({
            txSnBinding:result,
        })
    }

    sendVerifyCodeFailCallBack(){

    }



    render() {
        const
            navigator
         = this.props.navigation;
        const {SMSCode} = this.state;
        return (

            <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <NavigationBar
                    title={'验证手机号'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />


                <Text
                    style={{
                        marginLeft: 10,
                        marginTop: 20,
                        lineHeight: 20,
                        color: '#333333',
                        marginBottom:10
                    }}>本次操作需要短信确认，请输入{this.state.phoneNum}收到的短信验证码。</Text>


                <View style={{flexDirection: 'row', marginTop: 10,alignItems: 'center', backgroundColor:'#ffffff'}}>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                        <Text style={styles.leftTextStyle}>验证码</Text>
                        <TextInput
                            placeholder="请输入验证码"
                            placeholderTextColor="#CCCCCC"
                            underlineColorAndroid={'transparent'}
                            keyboardType = "numeric"
                            style={{flex: 1,fontSize:16}}
                            onChangeText={(SMSCode) => {
                                this.setState({SMSCode});
                            }}
                            value={SMSCode}
                        />
                    </View>
                    <View style={{height:43,width:1, backgroundColor:'#e5e5e5'}}/>
                    <CountDownButton
                        enable={true}
                        ref = "countDown"
                        style={{width: 110, marginRight: 10}}
                        textStyle={{color: '#1b82d1'}}
                        timerCount={60}
                        onClick={(shouldStartCountting) => {
                            this.sendVerifyCode(this.sendVerifyCodeCallBack,this.sendVerifyCodeFailCallBack,shouldStartCountting);
                        }}
                    />
                </View>

                <Button
                    style={styles.loginButton}
                    textStyle={styles.loginButtonText}
                    onPress={() => {
                        if(SMSCode == null){
                            Toast.showShortCenter('请输入验证码');
                        }else{
                            this.checkVerifyCode(this.checkVerifyCodeCallBack,this.checkVerifyCodeFailCallBack);
                        }
                    }}
                >
                    确认
                </Button>

                {
                    this.state.loading ? <Loading /> : null
                }

            </View>

        );
    }
}

// function mapStateToProps(state) {
//     return {
//         userInfo: state.user.get('userInfo'),
//         appLoading: state.app.get('appLoading'),
//     };
// }
//
// function mapDispatchToProps(dispatch) {
//     return {
//         changeAppLoading: (appLoading) => {
//             dispatch(changeAppLoadingAction(appLoading));
//         },
//         bankCardBunding: (params, bankCardBundingCallBack,bankCardBundingFailCallBack) => {
//             dispatch(bankCardbundingAction({
//                 url: API.API_BANK_CARD_BUNDING,
//                 successMsg: '绑定成功',
//                 successCallBack: (response) => {
//                     bankCardBundingCallBack(response.result);
//                 },
//                 failCallBack: (err) => {
//                     bankCardBundingFailCallBack();
//                 },
//                 ...params,
//             }));
//         },
//         checkVerifyCode: (params, checkVerifyCodeCallBack,checkVerifyCodeFailCallBack) => {
//             dispatch(checkVerifyCodeAction({
//                 successCallBack: (response) => {
//                     checkVerifyCodeCallBack(response.result);
//                 },
//                 failCallBack: (err) => {
//                     checkVerifyCodeFailCallBack();
//                 },
//                 ...params,
//             }));
//         },
//         sendVerifyCode: (params, sendVerifyCodeCallBack,sendVerifyCodeFailCallBack,shouldStartCountting) => {
//             dispatch(sendVerifyCodeAction({
//                 successCallBack: (response) => {
//                     sendVerifyCodeCallBack(response.result);
//                     shouldStartCountting(true);
//                 },
//                 failCallBack: (err) => {
//                     sendVerifyCodeFailCallBack();
//                     shouldStartCountting(false);
//                 },
//                 ...params,
//             }));
//         },
//     };
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(VerificationCardPhone);
