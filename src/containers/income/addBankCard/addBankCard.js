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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'


const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
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
        this.getBranchInfo = this.getBranchInfo.bind(this);
        this.bindBankCard = this.bindBankCard.bind(this);
        // 初始状态
        this.state = {
            holdCardName: '',           // 持卡人の姓名
            IDCardNum: '',              // 身份证の号
            bankCardNum: '',            // 银行の卡号
            bankName: '',               // 银行の名称
            bankCode: '',               // 银行の代码
            bankCityName: '',           // 选择市の名称
            bankCityCode: '',           // 选择市の代码
            branchName: '',             // 支行の名称
            branchCode: '',             // 支行の代码
            selectedProvinceName: '',   // 选择省の名称
            selectedProvinceCode: '',   // 选择省の代码
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
                    bankName: result.bankName,
                    cardName: result.cardName,
                });
        }

    }

    getBranchInfo(bankCode, cityCode) {
        HTTPRequest({
            url: API.API_QUERY_BANK_BRANCH,
            params: {
                qshho2: bankCode, //银行代码 313290000017
                youzbm: cityCode //城市代码 110100
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (response) => {
                console.log('-----getBranchInfo0-----', response.result)
                this.props.navigation.navigate('ChooseBranch', {
                        branchList: response.result,
                        BranchBankNameCallback: (data) => {
                            console.log('branchName==', data)
                            this.setState({
                                branchName: data
                            })
                        },
                        BranchBankCodeCallback: (data) => {
                            console.log('branchCode==', data)
                            this.setState({
                                branchCode: data
                            })
                        },
                    }
                );
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

    // 绑定银行卡
    bindBankCard(holdCardName, IDCardNum, bankCardNum, bankName, bankCode,branchName,branchCode,
                 selectedProvinceName,selectedProvinceCode,bankCityName,bankCityCode) {
        HTTPRequest({
            url: API.API_BANK_CARD_BUNDING,
            params: {
                accountName: holdCardName,
                bankCardNumber: bankCardNum,
                bankCode: bankCode,
                bankName: bankName,
                branchBank: branchName,
                branchBankCode: branchCode,
                city: bankCityName,
                cityCode: bankCityCode,
                documentNum: IDCardNum,
                documentType: 'A',
                phoneNum: global.phone,
                province: selectedProvinceName,
                provinceCode: selectedProvinceCode,
                userId: global.userId,
                userName: global.userName,
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (response) => {
                this.props.navigation.navigate('AddBankCardSuccess');

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


    render() {
        const navigator = this.props.navigation;
        const {
            holdCardName, IDCardNum, bankCardNum, bankName, bankCode, selectedProvinceName,selectedProvinceCode,
            bankCityName, bankCityCode, branchName, branchCode
        } = this.state;
        return (

            <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <NavigationBar
                    title={'添加银行卡'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <KeyboardAwareScrollView style={{width: width, height: height}}>

                    <Text
                        style={{
                            margin: 10,
                            lineHeight: 22,
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
                        <Text style={styles.leftTextStyle}>银行卡号</Text>
                        <TextInput
                            placeholder="请填写银行卡号"
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
                    <View style={{height: 1, width, backgroundColor: '#e8e8e8', marginLeft: 10}}/>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                        height: 46,
                    }}>
                        <Text style={styles.leftTextStyle}>开户行</Text>
                        <TouchableOpacity onPress={() => {
                            navigator.navigate('ChooseBankName', {
                                selectedBankNameCallback: (data) => {
                                    this.setState({
                                        bankName: data
                                    })
                                },
                                selectedBankCodeCallback: (data) => {
                                    this.setState({
                                        bankCode: data
                                    })
                                },
                            });
                        }}>
                            {
                                bankName ?
                                    <Text
                                        style={{
                                            color: '#666666', fontSize: 16,
                                            marginLeft: 10,
                                        }}
                                    >{bankName}</Text>
                                    :
                                    <Text
                                        style={{
                                            color: '#CCCCCC', fontSize: 16,
                                            marginLeft: 10,
                                        }}
                                    >请填写开户行</Text>

                            }

                        </TouchableOpacity>
                    </View>
                    <View style={{height: 1, width, backgroundColor: '#e8e8e8', marginLeft: 10}}/>


                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                        height: 46,
                    }}>


                        <Text style={styles.leftTextStyle}>开户省市</Text>

                        <TouchableOpacity onPress={() => {
                            navigator.navigate('ChooseBankCity', {
                                selectedCityCallback: (data) => {
                                    console.log('----data', data[0].departureCityArrayName);
                                    this.setState({
                                        bankCityName: data[0].departureCityArrayName,
                                        bankCityCode: data[0].departureCityArrayCode,
                                    })
                                },
                                selectedProvinceCallback: (data) => {
                                    console.log('--selectedProvinceName--', data)
                                    this.setState({
                                        selectedProvinceName: data,
                                    })
                                },
                                selectedProvinceCodeCallback: (data) => {
                                    console.log('--selectedProvinceCode--', data)
                                    this.setState({
                                        selectedProvinceCode: data,
                                    })
                                }

                            });
                        }}>

                            {bankCityName ?
                                <Text
                                    style={{
                                        color: '#666666', fontSize: 16,
                                        marginLeft: 10,
                                    }}
                                >{selectedProvinceName} {bankCityName}</Text>
                                :
                                <Text
                                    style={{
                                        color: '#CCCCCC', fontSize: 16,
                                        marginLeft: 10,
                                    }}
                                >请选择开户省市</Text>
                            }

                        </TouchableOpacity>
                    </View>

                    <View style={{height: 1, width, backgroundColor: '#e8e8e8', marginLeft: 10}}/>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                        height: 46,
                    }}>

                        <Text style={styles.leftTextStyle}>开户支行</Text>
                        <TouchableOpacity onPress={() => {
                            if (!bankName) return Toast.show('请选择开户行')
                            if (!bankCityName) return Toast.show('请选择开户省市')
                            this.getBranchInfo(this.state.bankCode, this.state.bankCityCode);
                        }}>
                            {
                                branchName ?
                                    <Text
                                        style={{
                                            color: '#666666', fontSize: 16,
                                            marginLeft: 10,
                                        }}
                                    >{branchName}</Text>
                                    :
                                    <Text
                                        style={{
                                            color: '#CCCCCC', fontSize: 16,
                                            marginLeft: 10,
                                        }}
                                    >请选择开户支行</Text>
                            }

                        </TouchableOpacity>
                    </View>

                    <Button
                        style={styles.loginButton}
                        textStyle={styles.loginButtonText}
                        onPress={() => {
                            if (!bankCardNum) return Toast.show('请填写银行卡号');
                            if (!bankName) return Toast.show('请选择银行');
                            if (!bankName) return Toast.show('请选择开户行');
                            if (!bankCityName) return Toast.show('请选择开户省市');
                            this.bindBankCard(holdCardName, IDCardNum, bankCardNum, bankName, bankCode,branchName,branchCode,
                                selectedProvinceName,selectedProvinceCode,bankCityName,bankCityCode);
                        }}
                    >
                        绑定
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
                        this.state.loading ? <Loading/> : null
                    }
                </KeyboardAwareScrollView>

            </View>

        );
    }
}
