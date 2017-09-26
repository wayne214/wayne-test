/**
 * Created by xizhixin on 2017/9/20.
 * 我的界面
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

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

function mapStateToProps(state) {

    console.log('Mine:',state.user.get('userInfo'));

    return {};

}

function mapDispatchToProps(dispatch) {
    return {};

}

export default connect(mapStateToProps, mapDispatchToProps)(Mine);
