/**
 * Created by xizhixin on 2017/9/20.
 * 首页界面
 */
import React, {Component, PropTypes} from 'react';
import BaseContainer from '../base/baseContainer';
import NavigationBar from '../../common/navigationBar/navigationBar';

import EmptyView from '../../common/emptyView/emptyView';
import Toast from '@remobile/react-native-toast';

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

class Home extends BaseContainer{
    constructor(props) {
        super(props);
    }
    componentDidMount(){
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'首页'}
                    navigator={this.props.navigation}
                    leftButtonHidden={true}
                />

                <EmptyView />

            </View>
        )
    }
}

export default Home;
