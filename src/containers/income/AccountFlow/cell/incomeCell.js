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
import StaticImage from '../../../../constants/staticImage';
import * as StaticColor from '../../../../constants/staticColor';

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 44,
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
        marginRight: 20,
    },
    contentText: {
        marginLeft: 15,
        textAlign: 'center',
        fontSize: 16,
        color: '#333333'
    },
    separateLine: {
        height: 0.5,
        backgroundColor: StaticColor.COLOR_SEPARATE_LINE,
        marginLeft: 45,
    },
    iconfont: {
        fontFamily: 'iconfont',
        color: StaticColor.CALENDER_ICON_COLOR,
        paddingTop: 3,
        fontSize: 20,
        marginLeft: 10,
    },
});

class IncomeCell extends Component {
    static propTypes = {
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
            leftIcon, content, clickAction, showBottomLine, iconColor
        } = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    clickAction();
                }} activeOpacity={0.6}
            >
                <View
                    style={{
                        height: 50,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                    }}

                >
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <View style={styles.leftPart}>
                            {iconColor ?
                                <Text style={{
                                    fontFamily: 'iconfont',
                                    color: iconColor,
                                    paddingTop: 3,
                                    fontSize: 20,
                                    marginLeft: 10,
                                }}>{leftIcon}</Text>
                                :
                                <Text style={styles.iconfont}>{leftIcon}</Text>
                            }
                            <Text style={styles.contentText}>{content}</Text>
                        </View>
                        <View style={{
                            justifyContent: 'center'
                        }}>
                        <Image style={styles.rightIcon} source={StaticImage.rightArrow}/>
                        </View>
                    </View>
                    {
                        showBottomLine ? <View style={styles.separateLine}/> : null
                    }
                </View>
            </TouchableOpacity>
        );
    }
}

export default IncomeCell;
