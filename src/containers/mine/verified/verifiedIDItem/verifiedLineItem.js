import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
    },
    titleStyle:{
        height: 1,
        marginLeft: 10,
        marginRight: 0,
        backgroundColor: '#f5f5f5',
        // backgroundColor: 'red',

    }
});

class verifiedLineItem extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleStyle} />
            </View>
        )
    }
}

export default verifiedLineItem;
