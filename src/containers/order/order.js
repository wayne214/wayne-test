/**
 * Created by xizhixin on 2017/9/20.
 */
/**
 * Created by xizhixin on 2017/9/20.
 */
/**
 * Created by xizhixin on 2017/9/20.
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
                <TouchableOpacity style={{marginTop: 30, width: 1000, height: 30}} onPress={()=>{
                    console.log('userName=',global.userName);
                }}>
                    <Text>
                        点击输出global值
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Order;
