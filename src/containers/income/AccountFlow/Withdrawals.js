import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput,
    Alert,
} from 'react-native';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import StaticImage from '../../../constants/staticImage';
import bankIconUtil from '../../../utils/bankIconUtil';
import PassWordPage from './sendPassword';


const window = Dimensions.get('window');
const allMonery = '123.00';

class Withdrawals extends Component {
    constructor(props) {
        super(props);

        this.state={
            monery: '0.00',
            showPsd: false,
            cardInfo: {
                accountBank:'',
                bankAccount:'',
                bankCarType:'',
                bankCode:'',
                isDefault:'',
            },
        };

    }
    componentDidMount() {

    }

    /*确认提现*/
    static outMonery(){
        //没有提现密码
        /*
        Alert.alert(null, '为了保证您的账户安全，请立即设置支付密码',
            [
                {
                    text: '取消',
                    onPress: () => {

                    },
                },
                {
                    text: '设置',
                    onPress: () => {

                    },
                },
            ],
        );
        */
        this.setState({
            showPsd: true
        })
    }
    render() {
        const navigator= this.props.navigation;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'提现'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <View style={{marginTop: 10}}/>

                <TouchableOpacity style={styles.itemStyle} onPress={()=>{
                    navigator.navigate('DrawalsChooseCard',{
                        chooseBankCard:(cardInfo)=>{
                            console.log('chooseBankCard:', cardInfo);
                            this.setState({cardInfo});
                        }
                    });
                }}>

                    {
                        bankIconUtil.show(this.state.cardInfo.accountBank)
                    }

                    <View style={{width: 200, height: 40, marginTop: 15, marginLeft: 10}}>

                        <Text style={{fontSize: 17, color: '#333333'}}>
                            {this.state.cardInfo.accountBank}
                        </Text>
                        <Text style={{marginTop: 5, color: '#999999'}}>
                            尾号{this.state.cardInfo.bankAccount.substring(this.state.cardInfo.bankAccount.length - 4)}  {this.state.cardInfo.bankCarType}
                        </Text>
                    </View>

                    <Image source={StaticImage.rightArrow} style={{right: 10, top: 27, position: 'absolute'}}/>

                </TouchableOpacity>
                <View style={{marginTop: 10}}/>

                <View style={{marginHorizontal: 0, backgroundColor: 'white'}}>
                    <Text style={{marginLeft: 10, fontSize: 15, height: 30, lineHeight: 30}}>
                        提现金额
                    </Text>

                    <View style={{marginHorizontal: 0, height: 40, marginTop: 20, flexDirection: 'row'}}>

                        <Text style={{fontSize: 30, marginLeft: 4,height: 30, lineHeight: 30, marginTop: 10}}>￥</Text>

                        <TextInput style={{fontSize: 50, height: 40 , width: 200}}
                                   placeholderTextColor="#CCCCCC"
                                   underlineColorAndroid={'transparent'}
                                   onChangeText={(monery) => {
                                       if (parseFloat(monery) > parseFloat(allMonery)){
                                           //如果输入的大于全部的
                                           this.setState({monery: allMonery});
                                       }else
                                           this.setState({monery});
                                   }}
                                   value={this.state.monery}
                                   returnKeyType={'done'}
                            >
                        </TextInput>

                        <TouchableOpacity style={styles.XStyle} onPress={()=>{
                            this.setState({monery: ''})
                        }}>
                            <Text style={{fontFamily: 'iconfont',color:'#cccccc'}}>&#xe66a;</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.moneryViewStyle}/>

                    <View style={{marginHorizontal: 0, flexDirection: 'row', marginVertical: 10}}>

                        <Text style={{fontSize: 15, marginLeft: 10, color: '#999999'}}>可用余额：{allMonery}</Text>

                        <TouchableOpacity style={{position: 'absolute', right: 10}} onPress={()=>{
                            this.setState({monery: allMonery})
                        }}>
                            <Text style={{fontSize: 17, color: '#0071FF'}}>全部提现</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <TouchableOpacity style={styles.sureBtnStyle} onPress={Withdrawals.outMonery.bind(this)}>
                    <Text style={{textAlign: 'center', color: 'white', fontSize: 20}}>确认提现</Text>

                </TouchableOpacity>

                {
                    this.state.showPsd ? <PassWordPage closePsd={()=>{
                                                            this.setState({
                                                                showPsd: false
                                                            })
                                                         }}
                                                        sendPsdSuccess={()=>{
                                                            console.log('跳转到详情');
                                                            navigator.navigate('DrawalsDetail');
                                                        }}
                                                        monery="100" /> : null
                }
            </View>
        )
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    itemStyle:{
        marginHorizontal: 0,
        height: 67,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    XStyle:{
        width: 15,
        height: 15,
        right: 10,
        top: 12.5,
        position: 'absolute',
    },
    moneryViewStyle:{
        marginTop: 20,
        marginLeft: 10,
        width: window.width - 10,
        backgroundColor: '#f5f5f5',
        height: 1
    },
    sureBtnStyle:{
        marginHorizontal: 10,
        height: 44,
        backgroundColor: '#0083FF',
        marginTop: 20,
        borderRadius: 5,
        justifyContent: 'center'
    },
});

function mapStateToProps(state){
    return {};
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Withdrawals);

