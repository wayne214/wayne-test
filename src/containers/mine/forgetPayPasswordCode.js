import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import NavigationBar from '../../common/navigationBar/navigationBar';
import CountDownButton from '../../common/timerButton';
import StaticImage from '../../constants/staticImage';
import * as StaticColor from '../../constants/staticColor';
import Button from 'apsl-react-native-button';
import ClickUtil from '../../utils/prventMultiClickUtil';
import * as API from '../../constants/api';
import HTTPRequest from '../../utils/httpRequest';

const {width, height} = Dimensions.get('window');

class forgetPayPasswordCode extends Component {
    constructor(props) {
        super(props);

        this.state = {
            smsCode: ''
        };

        this.requestVCodeForLogin = this.requestVCodeForLogin.bind(this);
    }

    /*获取验证码*/
    requestVCodeForLogin(shouldStartCountting) {
        HTTPRequest({
            url: API.API_GET_LOGIN_WITH_CODE,
            params: {
                deviceId: global.UDID,
                phoneNum: this.state.phoneNumber,
            },
            loading: ()=>{

            },
            success: (responseData)=>{
                /*开启倒计时*/
                shouldStartCountting(true);
                Toast.showShortCenter('验证码已发送');

            },
            error: (errorInfo)=>{
                /*关闭倒计时*/
                shouldStartCountting(false);

            },
            finish: ()=>{

            }
        })
    }



    render() {
        const navigator = this.props.navigation;

        return <View style={styles.container}>
            <NavigationBar
                title={'忘记支付密码'}
                navigator={navigator}
                leftButtonHidden={false}
            />
            <View style={{padding: 10}}>
                <Text style={{color: '#666666', lineHeight: 20}}>
                    本次操作需要短信确认，请输入{global.phone}收到的短信验证码
                </Text>
            </View>
            <View style={styles.cellContainer}>
                <View style={styles.leftText}>
                    <Text style={styles.leftTextString}>
                        验证码
                    </Text>
                </View>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={styles.textInputStyle}
                    value={this.state.smsCode}
                    onChangeText={(smsCode) => {
                        this.setState({smsCode});
                    }}
                    placeholder="请输入验证码"
                    placeholderTextColor="#cccccc"
                    textAlign="left"
                    returnKeyType='done'/>

                <CountDownButton
                    enable={true}
                    style={{width: 140}}
                    textStyle={{color: '#0078ff'}}
                    timerCount={60}
                    onClick={(shouldStartCountting) => {
                        shouldStartCountting(true);

                        //this.requestVCodeForLogin(shouldStartCountting);
                    }}
                />
            </View>
            <Image style={styles.loginBackground} source ={StaticImage.BlueButtonArc}>
                <Button
                    isDisabled={!this.state.smsCode}
                    style={styles.loginButton}
                    textStyle={{color: 'white', fontSize: 18}}
                    onPress={() => {
                        if (ClickUtil.onMultiClick()) {

                            navigator.navigate('ForgetPayPassword');
                        }
                    }}
                >
                    下一步
                </Button>
            </Image>
        </View>
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    textInputStyle: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        paddingRight: 15,
        height: 44,
        marginTop: 2
    },
    clearButton: {
        width: 15,
        height: 15,
        marginRight: 15,
        marginLeft: 10,
        marginTop: 15
    },
    loginBackground: {
        width: width - 20,
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 0,
        height: 44,
        resizeMode: 'stretch',
    },
    loginButton: {
        backgroundColor: '#00000000',
        width: width - 20,
        marginBottom: 0,
        height: 44,
        borderWidth: 0,
        borderColor: '#00000000',
    },
    cellContainer: {
        height: 54,
        flexDirection: 'row',
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
        backgroundColor: 'white',
        padding: 5
    },
    leftText: {
        width: 80,
        paddingLeft: 15,
    },
    leftTextString: {
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 16,
        lineHeight: 44,
        backgroundColor: 'transparent'
    },

});

function mapStateToProps(state){
    return {};
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(forgetPayPasswordCode);

