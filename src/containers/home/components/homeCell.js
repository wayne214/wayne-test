/**
 * Created by xizhixin on 2017/3/28.
 * 首页grid网格布局
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';

import BaseView from '../../base/baseView';
import rightArrow from '../images/rightarrow.png';
import {
    WHITE_COLOR,
    RED_TEXT_COLOR,
    COLOR_LIGHT_GRAY_TEXT,
    BLACK_COLOR,
    LIGHT_BLACK_TEXT_COLOR,
} from '../../../constants/staticColor';

const styles = StyleSheet.create({
    badgeIcon: {
        backgroundColor: RED_TEXT_COLOR,
        width: 18,
        height: 18,
        alignSelf: 'center',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeNull: {
        width: 18,
        height: 18,
        alignSelf: 'center',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        paddingTop: 19,
        paddingBottom: 19,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 17,
        color: LIGHT_BLACK_TEXT_COLOR,
        backgroundColor: 'transparent',
    },
    rightIcon: {
        marginRight: 5,
        alignSelf: 'center',
        marginLeft: 10
    },
});
export default class HomeCell extends BaseView{

    // 定义相关属性类型
    static propTypes = {
        imageStyle: View.propTypes.style,
        backgroundColor: View.propTypes.style,
        title: PropTypes.string.isRequired,
        describe: PropTypes.string,
        padding: PropTypes.number,
        renderImage: PropTypes.func,
        clickAction: PropTypes.func,
        badgeText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    };

    // render外部传递的组件
    renderImage(props) {
        if (this.props.renderImage) {
            // 这里将引用外部renderImage方法
            return React.cloneElement(this.props.renderImage(), props);
        }
        return null;
    }

    render() {
        const {title, renderImage, padding, badgeText, clickAction, describe} = this.props;
        return (
            <TouchableOpacity onPress={() => {
                clickAction();
            }} activeOpacity={0.6}
            >
                <View style={[styles.container, this.props.backgroundColor]}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={[{alignSelf: 'center',}, this.props.imageStyle]}>
                            {this.renderImage(this.props)}
                        </View>
                        <View style={{alignSelf: 'center'}}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={{
                                fontSize: 12,
                                ...Platform.select({
                                    ios: {
                                        marginTop: padding,
                                    },
                                    android:{
                                       marginTop: padding - 4,
                                    }
                                }),
                                color: COLOR_LIGHT_GRAY_TEXT
                            }}>{describe}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        {
                            badgeText ?
                                <View style={styles.badgeIcon}>
                                    <Text
                                        style={{
                                            color: WHITE_COLOR,
                                            fontSize: 11,
                                            backgroundColor: 'transparent',
                                        }}
                                    >{badgeText}</Text></View>
                                : <View style={styles.badgeNull}/>
                        }
                        <Image style={styles.rightIcon} source={rightArrow}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

