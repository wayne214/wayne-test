/**
 * Created by xizhixin on 2017/9/20.
 * 我的界面
 */
import React, {Component, PropTypes} from 'react';
import BaseContainer from '../base/baseContainer';

import {
    View,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
});

class Mine extends BaseContainer{
    constructor(props) {
        super(props);
    }
    componentDidMount(){
    }

    render() {
        return (
            <View style={styles.container}></View>
        )
    }
}

export default Mine;
