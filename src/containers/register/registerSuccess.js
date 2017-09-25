/**
 * Created by wangl on 2017/7/25.
 */
/**
 * Created by lenovo on 2017/3/22.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Image,
    Text,
    Dimensions,
} from 'react-native';
import NavigatorBar from '../common/navigationBar';
import stylesCommon from '../../assets/css/common';
// 获取屏幕宽高尺寸
const {width, height} = Dimensions.get('window');

class RegisterSuccess extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={stylesCommon.container}>
                <NavigatorBar
                    title={'注册成功'}
                    navigator={navigator}
                    leftButtonHidden={true}
                    rightButtonConfig={{
                        type: 'string',
                        title: '完成',
                        onClick: () => {
                            this.props.navigation.goBack('Login');
                        },
                    }}
                />
                <View style={{width, height, alignItems: 'center',}}>
                    <Text
                        style={{
                            fontFamily:'iconfont',
                            color:'#1b82d1',
                            fontSize:60,
                            marginTop:80
                        }}>&#xe616;</Text>
                    <Text
                        style={{
                            color:'#1b82d1',
                            fontSize:18,
                            marginTop:10
                        }}
                    >
                        注册成功
                    </Text>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    console.log('------ state', state);
    return {};
}

function mapDispatchToProps() {
    return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(RegisterSuccess);
