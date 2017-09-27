/*
 * @author:  wangl
 * @description:  货源详情 运货单界面
 */
import React, {Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

import * as StaticColor from '../../constants/staticColor';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between', // 确保水平布局间距一样
        flex: 1,
    },
    title: {
        fontSize: 15,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,

    },
    content: {
        fontSize: 15,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginRight: -20
    },
});

class goodInfoCell extends Component {
    static propTypes={
        style: View.propTypes.style,
    };
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const {title, num, unit} = this.props;
        return (
            <View style={styles.container}>
                <Text style={[styles.title]}>{title}</Text>
                <Text style={[styles.content]}>{num}{unit}</Text>
            </View>
        );
    }
}

export default goodInfoCell;
