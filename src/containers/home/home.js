/**
 * Created by xizhixin on 2017/9/20.
 * 首页界面
 */
import React, {Component, PropTypes} from 'react';
import BaseContainer from '../base/baseContainer';
import Toast from '@remobile/react-native-toast';

import {
    View,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
});

class Home extends BaseContainer{
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        Toast.showShortCenter('hello world');
    }

    render() {
        return (
            <View style={styles.container}></View>
        )
    }
}

export default Home;
