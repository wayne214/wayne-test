/**
 * Created by xizhixin on 2017/4/19.
 * 消息详情界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import NavigatorBar from '../../common/navigationBar/navigationBar';
import {
    WHITE_COLOR,
    LIGHT_BLACK_TEXT_COLOR,
    GRAY_TEXT_COLOR,
    DEVIDE_LINE_COLOR,
    COLOR_LIGHT_GRAY_TEXT,
} from '../../constants/staticColor';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE_COLOR,
    },
    contentContainer: {
        marginLeft: 10,
        marginRight: 10,
    },
    titleView: {
        flexDirection: 'row',
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        color: LIGHT_BLACK_TEXT_COLOR,
        alignSelf: 'center',
    },
    timeView: {
        marginTop: 20,
    },
    time: {
        fontSize: 12,
        color: GRAY_TEXT_COLOR,
        alignSelf: 'center',
    },
    line: {
        marginTop: 10,
        height: 0.5,
        backgroundColor: DEVIDE_LINE_COLOR,
    },
    contentView: {
        marginTop: 10,
    },
    content: {
        fontSize: 14,
        color: COLOR_LIGHT_GRAY_TEXT,
        lineHeight: 22,
    },
});

export default class MsgDetails extends Component {
    constructor(props) {
        super(props);
        const params = this.props.router.getCurrentRoute().params;
        this.state = {
            data: params.msgData,
        };
    }

    componentDidMount() {

    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'消息详情'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <View style={styles.contentContainer}>
                    <View style={styles.titleView}>
                        <Text style={styles.time}>{this.state.data.time}    鲜易供应链</Text>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.contentView}>
                        <Text style={styles.content}>{this.state.data.message}</Text>
                    </View>
                </View>
            </View>
        );
    }
}



