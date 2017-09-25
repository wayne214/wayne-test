/**
 * Created by xizhixin on 2017/9/25.
 * 验证码倒计时按钮
 */
import React, {PropTypes} from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';

export default class TimerButton extends React.Component {

    static propTypes = {
        style: View.propTypes.style,
        textStyle: Text.propTypes.style,
        onClick: PropTypes.func,
        disableColor: PropTypes.string,
        timerTitle: PropTypes.string,
        enable: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.number]),
        timerCount: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            timerCount: this.props.timerCount || 90,
            timerTitle: this.props.timerTitle || '获取验证码',
            counting: false,
            selfEnable: true,
        };
        this.shouldStartCountting = this.shouldStartCountting.bind(this);
        this.countDownAction = this.countDownAction.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    shouldStartCountting(shouldStart) {
        if (this.state.counting) {
            return;
        }
        if (shouldStart) {
            this.countDownAction();
            this.setState({counting: true, selfEnable: false});
        } else {
            this.setState({selfEnable: true});
        }
    }

    countDownAction() {
        const codeTime = this.state.timerCount;
        this.interval = setInterval(() => {
            const timer = this.state.timerCount - 1;
            if (timer === 0) {
                this.interval && clearInterval(this.interval);
                this.setState({
                    timerCount: codeTime,
                    timerTitle: this.props.timerTitle || '获取验证码',
                    counting: false,
                    selfEnable: true,
                });
            } else {
                console.log('---- timer ', timer);
                this.setState({
                    timerCount: timer,
                    timerTitle: `重新获取(${timer}s)`,
                });
            }
        }, 1000);
    }

    render() {
        const {onClick, style, textStyle, enable, disableColor} = this.props;
        const {counting, timerTitle, selfEnable} = this.state;
        return (
            <TouchableOpacity
                activeOpacity={counting ? 1 : 0.8} onPress={() => {
                if (!counting && enable && selfEnable) {
                    this.setState({selfEnable: false});
                    this.props.onClick(this.shouldStartCountting);
                }
            }}
            >
                <View style={[{width: 100, height: 44, justifyContent: 'center', alignItems: 'center'}, style]}>
                    <Text
                        style={[{fontSize: 16}, textStyle, {color: ((!counting && enable && selfEnable) ? textStyle.color : disableColor || 'gray')}]}
                    >{timerTitle}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
