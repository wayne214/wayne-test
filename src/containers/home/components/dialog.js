/**
 * Created by xizhixin on 2017/7/24.
 * 版本升级弹窗
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';
import BaseView from '../../base/baseView';
import * as StaticColor from '../../../constants/staticColor';
const {width, height} = Dimensions.get('window');
const [aWidth, aHeight] = [270, 150];
const [left, top] = [0, 0];
const [middleLeft, middleTop] = [(width - aWidth) / 2, (height - aHeight) / 2];

/**
 * Dialog组件
 * <Dialog ref="dialog" callback={this.callback.bind(this)}/>
 * 调用show方法，调起组件   this.refs.dialog.show("xxxx?");
 */

export default class Dialog extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            title: '',
            content:'',
            hide: true,
        };
    }

    render() {
        if(this.state.hide){
            return (<View />)
        } else {
            return (
                <View style={styles.container} >
                    <Animated.View style={styles.mask} >
                    </Animated.View>

                    <Animated.View style={[styles.tip , {transform: [{
                        translateY: this.state.offset.interpolate({
                            inputRange: [0, 1,2],
                            outputRange: [0, middleTop, height]
                        }),
                    }]
                    }]}>
                        <View style={styles.titleView}>
                            <Text style={styles.titleText}>{this.state.title}</Text>
                        </View>
                        <View style={styles.tipTitleView}>
                            <Text style={styles.tipTitleText}>{this.state.content}</Text>
                        </View>
                        <View style={styles.btnView}>
                            <TouchableOpacity style={styles.okBtnView} onPress={this.okBtn.bind(this)}>
                                <Text style={styles.okBtnText}>现在升级</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            );
        }
    }


    //显示动画
    in() {
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    easing: Easing.linear,
                    duration: 200,
                    toValue: 0.8,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    easing: Easing.linear,
                    duration: 200,
                    toValue: 1,
                }
            )
        ]).start();
    }

    //隐藏动画
    out(){
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    easing: Easing.linear,
                    duration: 200,
                    toValue: 0,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    easing: Easing.linear,
                    duration: 200,
                    toValue: 2,
                }
            )
        ]).start();

        setTimeout(
            () => {
                this.setState({hide: true});
                //还原到顶部
                Animated.timing(
                    this.state.offset,
                    {
                        easing: Easing.linear,
                        duration: 200,
                        toValue: 0,
                    }
                ).start();
            },
            200
        );
    }

    //选择
    okBtn() {
        if(!this.state.hide){
            setTimeout(
                () => {
                    let {callback} = this.props;
                    callback.apply(null,[]);
                },
                200
            );
        }
    }

    /**
     * 弹出控件
     * titile: 标题
     */
    show(title: string, content: string) {
        if(this.state.hide){
            this.setState({title: title, content: content, hide: false}, this.in);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: width,
        height: height,
        left: left,
        top: top,
    },
    mask: {
        justifyContent: 'center',
        backgroundColor: StaticColor.MODAL_BACKGROUND_COLOR,
        opacity: 0.5,
        position: 'absolute',
        width: width,
        height: height,
        left: left,
        top: top,
    },
    tip: {
        width: aWidth,
        height: aHeight,
        left: middleLeft,
        backgroundColor: StaticColor.WHITE_COLOR,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
    },
    titleView: {
        width: aWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    titleText:{
        color: StaticColor.BLACK_COLOR,
        fontSize: 17,
        marginTop: 20,
        marginBottom: 10,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    tipTitleView: {
        width: aWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#f0f0f0',
    },
    tipTitleText:{
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 13,
        marginTop: 5,
        marginBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'center',
        lineHeight: 18,
    },
    btnView:{
        flexDirection:'row',
        height: 44,
        borderRadius: 5,
    },
    okBtnView:{
        width: aWidth,
        height: 44,
        backgroundColor: StaticColor.WHITE_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    okBtnText: {
        fontSize: 17,
        color: StaticColor.BLUE_BUTTON_COLOR,
        textAlign: "center",
    },

});
