/**
 * Created by xizhixin on 2017/9/20.
 * 基类，编写组件继承该类
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
});

class BaseView extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){
    }

    render() {
        return (
            <View></View>
        )
    }
}

export default BaseView;
