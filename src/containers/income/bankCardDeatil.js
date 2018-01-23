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
import Toast from '@remobile/react-native-toast';
import BankCode from '../../utils/ZJBankCode';
import Loading from '../../utils/loading';

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
        marginLeft: 10,
        fontSize: 16,
        color: 'black',
        textAlign: 'center'
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
            loading: false,
            bank: params.bank,
            bankType: params.bankType,
            bankAccount: params.bankAccount,
            default: params.default,
            bankCity: '',
            bankSubName: '',
            bankCityName: params.bankCityName,
            bankCityCode: params.bankCityCode,
            selectedProvinceName: params.bankProvinceName,
            selectedProvinceCode: params.bankProvinceCode,
            branchName: params.bankBranchName,
            branchCode: params.bankBranchCode,
            companyCode: params.companyCode
        };

        this.bankCardSetDefault = this.bankCardSetDefault.bind(this);
        this.bankCardSetDefaultCallBack = this.bankCardSetDefaultCallBack.bind(this);
        this.getBranchInfo = this.getBranchInfo.bind(this);
        this.changeInfo = this.changeInfo.bind(this);
    }

    bankCardSetDefault(bankCardSetDefaultCallBack) {

        HTTPRequest({
            url: API.API_BANK_CARD_SETDEFAULT,
            params: {
                bankCardNumber: this.state.bankAccount,
                phoneNum: this.state.companyCode,
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

    /*获取支行信息*/
    getBranchInfo(bankCode, cityCode) {
        HTTPRequest({
            url: API.API_QUERY_BANK_BRANCH,
            params: {
                qshho2: bankCode, //银行代码 313290000017   bankCode
                youzbm: cityCode //城市代码 110100          cityCode
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
            },
            finish: () => {
                this.setState({
                    loading: false,
                });
            },
        })
    }

    /*修改银行卡信息*/
    changeInfo (){

        if (!this.state.selectedProvinceName) {
            Toast.showShortCenter('请选择开户省市');
            return
        }
        if (!this.state.branchName) {
            Toast.showShortCenter('请选择开户支行');
            return
        }


        HTTPRequest({
            url: API.API_CHANGE_BANKCARD_INFO,
            params: {
                accountBank: this.state.bank,
                bankAccount: this.state.bankAccount,
                branchBank: this.state.branchName,
                branchBankCode: this.state.branchCode,
                city: this.state.bankCityName,
                cityCode: this.state.bankCityCode,
                province: this.state.selectedProvinceName,
                provinceCode: this.state.selectedProvinceCode,
                phone:this.state.companyCode,
            },
            loading: () => {
                this.setState({
                    loading: true,
                });
            },
            success: (response) => {
               if (response.result){
                   DeviceEventEmitter.emit('BankCardList');
                   this.props.navigation.goBack();
               }else
                   Toast.showShortCenter('修改失败，请重试')
            },
            error: (err) => {
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
                    <TouchableOpacity style={{width: width - 100, paddingVertical: 10}} onPress={()=>{
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
                        <Text style={{marginLeft: 10, fontSize: 16, color: 'black',}}>
                            {
                                this.state.selectedProvinceName + '  ' + this.state.bankCityName
                            }
                        </Text>

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
                    <TouchableOpacity style={{width: width - 100, paddingVertical: 10}} onPress={()=>{
                            if (!this.state.bankCityName) return Toast.showShortCenter('请选择开户省市');

                            const NumberArr = BankCode.searchCode();
                            for (let i = 0; i < NumberArr.length; i++) {
                                if (NumberArr[i].bankName.indexOf(this.state.bank) > -1) {
                                    const bankObj = NumberArr[i];
                                    this.getBranchInfo(bankObj.bankCode, this.state.bankCityCode);
                                }
                            }
                    }}>

                        <Text style={{marginLeft: 10, fontSize: 16, color: 'black',}}>
                            {
                                this.state.branchName
                            }
                        </Text>


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
                        this.changeInfo();
                    }}
                >
                    保存
                </Button>

                {
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }
}
