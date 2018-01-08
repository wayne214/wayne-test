/**
 * 调度单选择弹窗
 * Created by xizhixin on 2018/1/4.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Animated,
    Easing,
    Text,
    TouchableOpacity,
    Dimensions,
    ListView,
    Image,
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: width,
        height: height,
        left: 0,
        top: 0,
    },
    mask: {
        justifyContent: "center",
        backgroundColor: 'rgba(0,0,0,0.3)',
        position: "absolute",
        width: width,
        height: height,
        left: 0,
        top: 0,
    },
    titleView: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        paddingTop: 17,
        paddingBottom: 17,
    },
    titleText: {
        fontSize: 18,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    cancelText: {
        fontSize: 18,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        marginLeft: 10,
        width: width / 2 - 64,
    },
    rightIcon: {
        fontFamily: 'iconfont',
        fontSize: 18,
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        alignSelf: 'center',
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    chooseStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    codeStyle: {
        fontSize: 13,
        color: StaticColor.GRAY_TEXT_COLOR,
        paddingBottom: 15,
        marginLeft: 10,
    },
    lineStyle: {
        fontSize: 17,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginLeft: 10,
        paddingTop: 15,
        paddingBottom: 10,
        width: width - 55,
    },
    detailTip: {
        fontSize: 14,
        color: StaticColor.GRAY_TEXT_COLOR,
        marginLeft: 10,
        marginTop: 10,
    },
    detailContent: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginLeft: 10,
        paddingTop: 7,
        marginBottom: 10,
        width: width - 45,
        lineHeight: 21,
    },
    cancelIcon: {
        fontSize: 28,
        fontFamily: 'iconfont',
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        paddingTop: 12,
        paddingRight: 10,
        paddingLeft: 10,
        alignSelf:'flex-end',
    }
});

class dispatchDialog extends Component{
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            showDetails: false,
            details: null,
            entityList: ds, // 数据源
        };
        this.callback = function () {
        };//回调方法
        this.renderItem = this.renderItem.bind(this);
        this.choose = this.choose.bind(this);
    }

    static propTypes = {
        style: PropTypes.object,
    };

    componentDidMount(){

    }

    //显示动画
    in() {
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    easing: Easing.linear,//一个用于定义曲线的渐变函数
                    duration: 150,//动画持续的时间（单位是毫秒），默认为500。
                    toValue: 0.8,//动画的最终值
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    easing: Easing.linear,
                    duration: 150,
                    toValue: 1,
                }
            )
        ]).start();
    }

    //隐藏动画
    out() {
        Animated.parallel([
            Animated.timing(
                this.state.opacity,
                {
                    easing: Easing.linear,
                    duration: 150,
                    toValue: 0,
                }
            ),
            Animated.timing(
                this.state.offset,
                {
                    easing: Easing.linear,
                    duration: 150,
                    toValue: 0,
                }
            )
        ]).start((finished) => this.setState({hide: true}));
    }

    //选择
    choose(item) {
        if (!this.state.hide) {
            this.out();
            this.chooseTimer = setTimeout(()=>{
                this.callback(item);
            }, 150);
        }
    }


    //取消
    cancel(event) {
        if (!this.state.hide) {
            this.out();
            this.setState({
                showDetails: false,
                details: null,
            })
        }
    }

    /**
     * 弹出控件
     * titile: 标题
     * entityList：选择项数据   数组
     * callback：回调方法
     */
    show(entityList: Array, callback: Object) {
        this.callback = callback;
        if (this.state.hide) {
            if (entityList && entityList.length > 0) {
                this.setState({
                    hide: false,
                    entityList: this.state.entityList.cloneWithRows(entityList),
                }, this.in);
            }
        }
    }

    renderItem(dataRow) {
        return(
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this.choose(dataRow);
                    }}
                >
                    <View style={styles.chooseStyle}>
                        <View>
                            <Text
                                style={styles.lineStyle}
                                numberOfLines={1}
                            >{dataRow.scheduleRoutes}</Text>
                            <Text style={styles.codeStyle}>调度单号：{dataRow.scheduleCode}</Text>
                        </View>
                        <TouchableOpacity
                            style={{alignSelf:'center'}}
                            onPress={() => {
                                console.log('弹出详情');
                                this.setState({
                                    showDetails: true,
                                    details: dataRow,
                                });
                            }}
                        >
                            <Text style={styles.rightIcon}>&#xe686;</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <View style={{height: 1, backgroundColor: StaticColor.DEVIDE_LINE_COLOR, marginLeft: 10}}/>
            </View>
        );
    }

    render() {
        if (this.state.hide) {
            return (<View />)
        } else {
            return (
                <View style={styles.container}>
                    <Animated.View style={styles.mask}>
                    </Animated.View>

                    <Animated.View style={[{
                        width: width,
                        left: 0,
                        ...Platform.select({
                            android: {
                                height: height / 2 + 40,
                            },
                            ios: {
                                height: height / 2 + 20,
                                bottom: - 25,
                            }
                        })
                    }, {
                        transform: [{
                            translateY: this.state.offset.interpolate({
                                inputRange: [0, 1],
                                outputRange: [height, height / 2 - 50]
                            }),
                        }]
                    }]}>
                        <View style={styles.titleView}>
                            <TouchableOpacity
                                onPress={this.cancel.bind(this)}
                            >
                               <Text style={styles.cancelText}>取消</Text>
                            </TouchableOpacity>
                            <Text style={styles.titleText}>请选择调度单</Text>
                        </View>
                        <View
                            style={{
                                ...Platform.select({
                                   ios: {
                                       height: height / 2 - 20,
                                   },
                                    android: {
                                       height: height / 2,
                                    }
                                }),
                                backgroundColor:StaticColor.WHITE_COLOR
                            }}
                        >
                            {
                                this.state.showDetails && this.state.details ?
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    showDetails: false,
                                                    details: null,
                                                })
                                            }}
                                        >
                                            <Text style={styles.cancelIcon}>&#xe66c;</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.detailTip}>线路</Text>
                                        <Text style={styles.detailContent}>{this.state.details.scheduleRoutes}</Text>
                                        <Text style={styles.detailTip}>调度单号</Text>
                                        <Text style={styles.detailContent}>{this.state.details.scheduleCode}</Text>
                                    </View> :
                                    <ListView
                                        dataSource={this.state.entityList}
                                        renderRow={this.renderItem}
                                        initialListSize={5}
                                        pageSize={5}
                                        removeClippedSubviews={false}
                                    />
                            }
                        </View>
                    </Animated.View>
                </View>
            );
        }
    }
}

export default dispatchDialog;
