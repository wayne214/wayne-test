import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    DeviceEventEmitter,
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';
import CountDownReact from '../../../common/countDownReact';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // 时间文字
    time: {
        paddingHorizontal: 2,
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        lineHeight: 17,
        fontWeight: 'bold',
    },
    // 冒号
    colon: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        lineHeight: 17,
        fontWeight: 'bold',
    },
    tip: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 17,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 17,
        color: 'white',
        marginRight: 5,
        fontWeight: 'bold',
    },
});

class countdownWithText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEnd: this.props.idEnded,
            noReach: this.props.onReachTime,
        };
        console.log('====djfoajfido==',this.state.showReviewTexts);
    }

    componentDidMount() {
    }

    render() {
        const {endTime, onClick, onEnded, style, showReviewText, isDisable} = this.props;
        const countDown = this.state.isEnd ? null :
            <CountDownReact
                date={endTime}
                days={{plural: '天 ', singular: '天 '}}
                hours=":"
                mins=":"
                // segs=":"
                tip="剩余"
                daysStyle={styles.time}
                hoursStyle={styles.time}
                minsStyle={styles.time}
                secsStyle={styles.time}
                firstColonStyle={styles.colon}
                secondColonStyle={styles.colon}
                tipStyle={styles.tip}
                onEnd={() => {
                    this.setState({
                        isEnd: true,
                    });
                    onEnded();
                }}
            />;
        return (
            <View>
                <TouchableOpacity
                    disabled={this.state.isEnd || this.state.noReach || isDisable}
                    onPress={() => {
                        onClick();
                    }}
                >
                    <View
                        style={[{
                            height: 40,
                            backgroundColor: this.state.isEnd || this.state.noReach || isDisable ? '#bbbbbb' : '#ff6600',
                            borderRadius: 5,
                            marginRight: 20,
                            marginLeft: 20,
                            marginTop: 15,
                            // padding: 12,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },style]}
                    >
                        <Text style={styles.text}>{this.state.noReach ? '距起拍' : showReviewText ? '报价审核中' : '报价'}</Text>
                        {countDown}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default countdownWithText;
