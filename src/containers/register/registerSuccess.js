/**
 * Created by wangl on 2017/7/25.
 * 注册成功界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Image,
    Text,
    Dimensions,
    StyleSheet,
} from 'react-native';
// import { NavigationActions } from 'react-navigation';

import NavigatorBar from '../../common/navigationBar/navigationBar';
import * as StaticColor from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';


const {width, height} = Dimensions.get('window'); // 获取屏幕宽高尺寸
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND
    },
    content: {
        width,
        height,
        alignItems: 'center'
    },
    textStyle: {
        marginTop: 80
    },
    tip: {
        color: StaticColor.BLUE_CONTACT_COLOR,
        fontSize: 18,
        marginTop: 10
    }
});

class RegisterSuccess extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
        this.popToTop = this.popToTop.bind(this);
    }

    // 返回到根界面
    popToTop() {
        const routes = this.props.routes;
        let key = routes[1].key;
        this.props.navigation.goBack(key);
    }


    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'注册成功'}
                    navigator={navigator}
                    leftButtonHidden={true}
                    rightButtonConfig={{
                        type: 'string',
                        title: '完成',
                        onClick: () => {
                            this.popToTop();
                        },
                    }}
                />
                <View style={styles.content}>
                    <Image style={styles.textStyle} source={StaticImage.finishIcon} />
                    <Text style={styles.tip}>注册成功</Text>
                </View>
            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(RegisterSuccess);
