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
    StyleSheet
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import NavigatorBar from '../../common/navigationBar/navigationBar';
import * as StaticColor from '../../constants/staticColor';

// 图片路径
import StaticImage from '../../constants/staticImage';
// 获取屏幕宽高尺寸
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
});
export default class AboutUs extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }
    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'关于我们'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Image
                        style={{width: width, height: width * 603 / 375}}
                        source={StaticImage.aboutUsImg}
                        // resizeMethod='cover'
                    >
                        <Text style={{color: '#666666', alignSelf: 'center', fontSize: 13, marginTop: width * 140 / 375}}>版本 V{DeviceInfo.getVersion()}</Text>
                    </Image>
                </View>
            </View>
        );
    }
}


