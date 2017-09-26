/**
 * Created by wangl on 2017/5/2.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';

const {width} = Dimensions.get('window');

class ChooseButtonCell extends Component {
    static propTypes = {
        toRefuse: PropTypes.func.isRequired,
        getorders: PropTypes.func.isRequired,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const {toRefuse, getorders} = this.props;
        return (
            <View style={{backgroundColor: StaticColor.WHITE_COLOR}}>
                <View
                    style={{
                        flexDirection: 'row',
                        height: 45,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: width / 2,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            toRefuse();
                        }}
                    >
                        <Text
                            style={{fontSize: 16, color: '#333333'}}
                        >
                            拒绝
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: width / 2,
                            backgroundColor: '#008BCA',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            getorders();
                        }}
                    >
                        <Text
                            style={{fontSize: 16, color: StaticColor.WHITE_COLOR}}
                        >
                            接单
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default ChooseButtonCell;
