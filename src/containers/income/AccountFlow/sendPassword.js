import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    Animated,
} from 'react-native';
import Password from 'react-native-password-pay'

const window = Dimensions.get('window');
const downViewHeight = 500;
const styles = StyleSheet.create({
    container:{
        flex: 1,
        position: 'absolute',
        width: window.width,
        height: window.height,
    },
});

class ComponentTmpl extends Component{
    constructor(props) {
        super(props);

        this.state = {
            bounceValue: new Animated.Value(window.height),
            isRight: false
        };
    }

    componentDidMount(){
        Animated.timing(                         
            this.state.bounceValue,                
            {
                toValue: window.height - downViewHeight,                        
                friction: 1,     
                duration: 250,                   
            }
        ).start();                
    }

    render() {

        const {monery} = this.props;

        return (
            <View style={styles.container}>

                <View style={{position: 'absolute', width: window.width, height: window.height,backgroundColor: 'black', opacity: 0.3}}/>

                <Animated.View style={{marginTop: this.state.bounceValue, height: downViewHeight, marginHorizontal: 0, backgroundColor: 'white'}}>

                    <View>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity style={{position: 'absolute', left: 10, top: 15}} onPress={()=>{
                                this.props.closePsd();
                            }}>
                                <Text style={{fontFamily: 'iconfont',color:'#999999'}}>&#xe66c;</Text>

                            </TouchableOpacity>
                            <Text style={{textAlign: 'center', fontSize: 17, marginVertical: 15}}>
                                输入支付密码
                            </Text>
                        </View>
                        <View style={{marginHorizontal: 0, height: 1, backgroundColor: '#f5f5f5'}}/>
                    </View>

                    {
                        (()=>{
                            if (!this.state.isRight){
                                return (
                                    <View>
                                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                            <Text style={{textAlign: 'center', fontSize: 14, marginVertical: 15}}>
                                                提现金额{monery}元
                                            </Text>
                                        </View>
                                        <View>
                                            <Password maxLength={6}
                                                      onChange={(value)=> {
                                                          console.log('输入的密码：',value)
                                                          if (value === '123456'){
                                                              this.setState({
                                                                  isRight: true
                                                              })
                                                          }

                                            }}
                                                      style={{width: 45*6, marginLeft:(window.width - 45 * 6) / 2}}
                                            />
                                            <TouchableOpacity onPress={()=>{

                                            }}>
                                                <Text style={{color: '#0071FF', marginHorizontal: 10, marginTop: 10, textAlign:'right'}}>忘记密码?</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }else {
                                // 完成
                                setTimeout(()=>{
                                    this.props.sendPsdSuccess()
                                },1000);

                                return (
                                    <View>
                                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'iconfont',color:'#0071FF', fontSize: 70, alignItems:'center', marginHorizontal: 0, marginTop: 100}}>&#xe661;</Text>
                                        </View>

                                        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                                            <Text style={{alignItems: 'center', color: '#0071FF', fontSize: 17}}>验证成功</Text>
                                        </View>

                                    </View>

                                )
                            }

                        })()

                    }

                </Animated.View>

            </View>
        )
    }
}

export default ComponentTmpl;
