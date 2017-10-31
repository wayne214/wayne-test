import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import NavigationBar from '../../common/navigationBar/navigationBar';
import Password from 'react-native-password-pay';
import Store from '../../utils/storage';
import * as StoreKey from '../../constants/storageKeys';
import Toast from '@remobile/react-native-toast';

const window = Dimensions.get('window');

class setPayPassword extends Component {
    constructor(props) {
        super(props);

        // 1=请输入原支付密码
        // 2=请设置新的支付密码
        // 3=请再次设置新的支付密码
        this.state = {
            type: '1',
            firstPsd: '',
            secondPsd: '',
        }

    }
    componentDidMount() {

    }
    render() {
        const navigator = this.props.navigation;

        return <View style={styles.container}>
            <NavigationBar
                title={'修改支付密码'}
                navigator={navigator}
                leftButtonHidden={false}
            />

            <View style={{justifyContent: 'center', marginTop: 70}}>
                <Text style={{
                    textAlign: 'center',
                    color: '#333333',
                    marginVertical: 20,
                    fontSize: 16
                }}>
                    {
                        this.state.type === '1' ? '请输入原支付密码' :
                            this.state.type === '2' ? '请设置新的支付密码' :
                                '请再次设置新的支付密码'
                    }
                </Text>
                <Password maxLength={6}
                          onChange={(value)=> {
                              console.log('输入的密码：',value);

                              if (value.length === 6){
                                  if (value === '123456'){
                                      // 输入原密码成功

                                      // 校验密码是否正确

                                      this.setState({
                                          type: '2'
                                      })
                                  }else {
                                      // 原密码输入错误
                                      Toast.showShortCenter('原密码输入错误， 请重新输入');
                                  }
                              }

                              if (this.state.type === '2'){
                                  // 第一次输入新的密码
                                    if (value.length === 6){
                                        this.setState({
                                            firstPsd: value,
                                            type: '3'
                                        })
                                    }
                              }
                              if (this.state.type === '3'){
                                  // 第一次输入新的密码
                                    if (value.length === 6){
                                        this.setState({
                                            secondPsd: value,
                                        },()=>{
                                            if (this.state.firstPsd === this.state.secondPsd){
                                                // 两次新密码一样
                                                Toast.showShortCenter('新密码设置成功');

                                                // 设置新的支付密码
                                                navigator.goBack();

                                            }else {
                                                // 两次新密码不一样
                                                Toast.showShortCenter('两次新密码不一样， 请重新输入');

                                            }
                                        });
                                    }
                              }

                          }}
                          style={{width: 45*6, marginLeft:(window.width - 45 * 6) / 2}}
                          isLoadValue={true}
                />
            </View>
        </View>
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    }
});

function mapStateToProps(state){
    return {};
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(setPayPassword);

