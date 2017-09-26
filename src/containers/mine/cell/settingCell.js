/*
 * @author:  yinyongqian
 * @createTime:  2017-03-22, 11:18:32 GMT+0800
 * @description:  description
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import rightArrow from '../../../../assets/income/rightarrow.png';
import * as StaticColor from '../../../constants/staticColor';

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        width,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    leftPart: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightIcon: {
        marginRight: 10,
    },
    contentText: {
        marginLeft: 15,
        textAlign: 'center',
        fontSize: 16,
    },
    separateLine: {
        height: 0.5,
        backgroundColor: StaticColor.COLOR_SEPARATE_LINE,
        marginLeft: 55,
    },
    iconfont: {
        fontFamily: 'iconfont',
        color: StaticColor.CALENDER_ICON_COLOR,
        paddingTop: 3,
        fontSize: 18,
        marginLeft: 20,
    },
    statusView: {
        marginRight: 20,
        flexDirection: 'row',
    },
});

class SettingCell extends Component {
    static propTypes = {
        style: View.propTypes.style,
        content: PropTypes.string,
        clickAction: PropTypes.func,
        showBottomLine: PropTypes.bool,
        leftIcon: PropTypes.string,
        rightIcon: PropTypes.string,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const {
            style, leftIcon, content, clickAction, showBottomLine, authenticationStatus,
            rightIcon = rightArrow,
        } = this.props;

        const a =
            authenticationStatus == '1200' ?
                <View style={styles.statusView}>
                    <View style={{height: 40, justifyContent: 'center'}}>
                    <Text
                        style={{
                            fontFamily: 'iconfont',
                            color: '#f6bd0e',
                            fontSize: 15,
                            marginTop:3,
                        }}>&#xe630;</Text>
                    </View>
                    <View style={{height: 40, justifyContent: 'center'}}>

                    <Text
                        style={{
                            marginLeft: 5,
                            color: '#999999',
                            fontSize:14
                        }}
                    >未认证</Text>
                    </View>
                </View>
                : authenticationStatus == '1201' ?
                    <View style={styles.statusView}>
                        <Text style={{color: '#1B82D1',fontSize:14}}>认证中</Text>
                    </View>
                : authenticationStatus == '1203' ?
                    <View style={{
                        marginRight: 20,
                        flexDirection: 'row',
                    }}>
                        <Text style={{color:'#ff6666',fontSize:14}}>认证驳回</Text>
                    </View>
                : authenticationStatus == '1202' ?
                    <View style={{
                        marginRight: 20,
                        flexDirection: 'row',
                    }}>
                        <Text style={{color:'#1B82D1',fontSize:14}}>已认证</Text>
                    </View>
                : null;


        return (
            <TouchableOpacity
                onPress={() => {
                    clickAction();
                }} activeOpacity={0.6}
            >
                <View style={{flex: 1}}>
                    <View style={[styles.container, {...style}]}>
                        <View style={styles.leftPart}>
                            <Text style={styles.iconfont}>{leftIcon}</Text>
                            <Text style={styles.contentText}>{content}</Text>
                        </View>
                        {a}
                        <Image style={styles.rightIcon} source={rightIcon}/>

                    </View>
                </View>
                {
                    showBottomLine ? <View style={styles.separateLine}/> : null
                }
            </TouchableOpacity>
        );
    }
}

export default SettingCell;
