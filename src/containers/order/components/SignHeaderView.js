/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';


const style = StyleSheet.create({
    viewStyle: {
        height: 100,
    },
    textStyle: {
        fontSize: 14,
        marginHorizontal: 10,
        height: 44,
        lineHeight: 44,
    },
});

export default class SignHeaderView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }
    render() {
        const {number} = this.props;

        return (
            <View style={style.viewStyle}>

                <View style={{justifyContent: 'center', flexDirection: 'column', height: 44, paddingLeft: 20}}>
                    <Text style={{fontSize: 15}}>运输单：{number}</Text>
                </View>

                <View style={{backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND, marginLeft: 20, height: 1}}/>

                <View
                    style={{
                        flexDirection: 'row',
                        height: 44,
                        paddingLeft: 20,
                        alignItems: 'center',
                    }}
                >
                    <Text >签收人：</Text>
                    <TextInput
                        style={{flex: 1, fontSize: 15}}
                        onChangeText={(text) => {
                            this.props.callBack(text);
                        }}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        clearButtonMode={'always'}
                    />
                </View>

                <View style={{backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND, height: 10}}/>
            </View>
        );
    }
}
SignHeaderView.propTypes = {
    number: React.PropTypes.string.isRequired,
    callBack: React.PropTypes.func.isRequired,
};
