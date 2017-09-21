/**
 * Created by xizhixin on 2017/9/20.
 * 货源界面
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

import BaseContainer from '../base/baseContainer';

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
});

class GoodSource extends BaseContainer{
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

export default GoodSource;
