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
} from 'react-native';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import Button from 'apsl-react-native-button';
import Toast from '@remobile/react-native-toast';
import * as API from '../../../constants/api';
import BankCode from '../../../utils/bankCode';
import Storage from '../../../utils/storage';
import HTTPRequest from '../../../utils/httpRequest';
import Loading from '../../../utils/loading';


const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
    leftTextStyle: {
        fontSize: 16,
        marginLeft: 10,
        width: 65,
        color: '#333333'
    },
    textInputStyle: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16
    },
    loginButton: {
        backgroundColor: '#1b82d2',
        marginTop: 15,
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

export default class AddBankCard extends Component {
    static propTypes = {};

    // 构造
    constructor(props) {
        super(props);
        this.getBankCardInfo = this.getBankCardInfo.bind(this);
        this.getBankCardInfoCallBack = this.getBankCardInfoCallBack.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getPersonInfoSuccessCallback = this.getPersonInfoSuccessCallback.bind(this);

        // 初始状态
        this.state = {
            holdCardName: '李艳兵',
            IDCardNum: '110108198801240414',
            bankCardNum: '6217730707723670',
            loading: false,
        };
    }

    componentDidMount() {
        Storage.get('personInfoResult').then((value) => {
            if (value) {
                this.setState({
                    holdCardName: value.idCardName,
                    IDCardNum: value.idCard,
                });
            } else {
                this.fetchData();
            }
        });
    }

    fetchData() {
            if (global.phone) {
                HTTPRequest({
                    url: API.API_AUTH_REALNAME_DETAIL + global.phone,
                    params: {
                        mobilePhone: global.phone,
                    },
                    loading: () => {
                        this.setState({
                            loading: true,
                        });
                    },
                    success: (response) => {
                        this.getPersonInfoSuccessCallback(response.result);
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
    }

    getPersonInfoSuccessCallback(result) {

        if (result) {
            Storage.save('personInfoResult', result);
            this.setState({
                holdCardName: result.idCardName,
                IDCardNum: result.idCard,
            });
        }
    }


    getBankCardInfo() {

        HTTPRequest({
            url: API.API_BANKCARD_INFO + this.state.bankCardNum,
            params: {},
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (response) => {
                this.getBankCardInfoCallBack(response.result);
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

    getBankCardInfoCallBack(result) {

        if (BankCode.searchCode(result.bankName) == '00000') {
            Toast.showShortCenter("银行卡不适配");
        } else {
            this.props.navigation.navigate('AddBankCardPhone',
                {
                    holdCardName: this.state.holdCardName,
                    IDCardNum: this.state.IDCardNum,
                    bankCardNum: this.state.bankCardNum,
                    bankName:result.bankName,
                    cardName:result.cardName,
                });
        }

    }


    render() {
        const navigator = this.props.navigation;
        const {holdCardName, IDCardNum, bankCardNum} = this.state;
        return (

            <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <NavigationBar
                    title={'添加银行卡'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />

                <Text
                    style={{
                        margin: 10,
                        lineHeight: 20,
                        color: '#666666'
                    }}
                >该银行卡将用于接收您在鲜易供应链的运费。为保证您能顺利收到，请务必填写真实准确的信息。</Text>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                        height: 46,
                    }}>
                        <Text style={styles.leftTextStyle}>持卡人</Text>
                        <TextInput
                            placeholder="持卡人姓名"
                            placeholderTextColor="#CCCCCC"
                            underlineColorAndroid={'transparent'}
                            style={styles.textInputStyle}
                            onChangeText={(holdCardName) => {
                                this.setState({holdCardName});
                            }}
                            value={holdCardName}
                            editable={false}
                        />
                    </View>
                </View>

                <View style={{height: 1, width, backgroundColor: '#e8e8e8', marginLeft: 10}}/>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    height: 46,
                }}>
                    <Text style={styles.leftTextStyle}>身份证</Text>
                    <TextInput
                        placeholder="请填写身份证号"
                        placeholderTextColor="#CCCCCC"
                        underlineColorAndroid={'transparent'}
                        style={styles.textInputStyle}
                        onChangeText={(IDCardNum) => {
                            this.setState({IDCardNum});
                        }}
                        value={IDCardNum}
                        editable={false}
                    />
                </View>

                <View style={{height: 1, width, backgroundColor: '#e8e8e8', marginLeft: 10}}/>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    height: 46,
                }}>
                    <Text style={styles.leftTextStyle}>卡号</Text>
                    <TextInput
                        placeholder="请填写银行卡卡号"
                        placeholderTextColor="#CCCCCC"
                        keyboardType="numeric"
                        underlineColorAndroid={'transparent'}
                        style={styles.textInputStyle}
                        onChangeText={(bankCardNum) => {
                            this.setState({bankCardNum});
                        }}
                        value={bankCardNum}
                    />
                </View>

                <Button
                    style={styles.loginButton}
                    textStyle={styles.loginButtonText}
                    onPress={() => {
                        if (bankCardNum == '') {
                            Toast.showShortCenter('输入框不能为空');
                        } else {
                            this.getBankCardInfo();
                        }
                    }}
                >
                    下一步
                </Button>

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 42,
                    width,
                }}>
                    <Text
                        style={{
                            color: '#999999',
                            fontSize: 13
                        }}>
                        目前只支持储蓄卡绑定
                    </Text>
                </View>

                {
                    this.state.loading ? <Loading /> : null
                }

            </View>

        );
    }
}
