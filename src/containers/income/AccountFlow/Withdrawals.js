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
} from 'react-native';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import StaticImage from '../../../constants/staticImage';

const window = Dimensions.get('window');

class Withdrawals extends Component {
    constructor(props) {
        super(props);

        this.state={
            monery: '0.00',
        }
    }
    componentDidMount() {

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
                    navigator.navigate('DrawalsChooseCard');
                }}>

                    <Image style={{width: 32, height: 34, marginTop: 17, marginLeft: 10, backgroundColor: 'red'}}/>

                    <View style={{width: 200, height: 40, marginTop: 15, marginLeft: 15}}>

                        <Text style={{fontSize: 17, color: '#333333'}}>
                            建设银行
                        </Text>
                        <Text style={{marginTop: 5, color: '#999999'}}>
                            尾号1234   储蓄卡
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
                                       this.setState({monery});
                                   }}
                                   value={this.state.monery}
                                   returnKeyType={'done'}
                            >
                        </TextInput>

                        <TouchableOpacity style={styles.XStyle}>
                            <Text style={{fontFamily: 'iconfont',color:'#cccccc'}}>&#xe61e;</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.moneryViewStyle}/>

                    <View style={{marginHorizontal: 0, flexDirection: 'row', marginVertical: 10}}>

                        <Text style={{fontSize: 15, marginLeft: 10, color: '#999999'}}>可用余额：123.00</Text>

                        <TouchableOpacity style={{position: 'absolute', right: 10}}>
                            <Text style={{fontSize: 17, color: '#0071FF'}}>全部提现</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <TouchableOpacity style={styles.sureBtnStyle}>
                    <Text style={{textAlign: 'center', color: 'white', fontSize: 20}}>确认提现</Text>

                </TouchableOpacity>
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

