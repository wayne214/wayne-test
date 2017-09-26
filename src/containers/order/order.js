/**
 * Created by xizhixin on 2017/9/20.
 * 订单界面
 */
import React, {Component, PropTypes} from 'react';
import BaseContainer from '../base/baseContainer';

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
});

class Order extends BaseContainer{
    constructor(props) {
        super(props);
    }
    componentDidMount(){
    }

    render() {
        return (
            <View style={styles.container}>

            </View>
        )
    }
}

export default Order;
