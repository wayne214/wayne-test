import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#f5f5f5',
    },
    titleStyle:{
        height: 10,
    }
});

class verifiedSpaceItem extends Component{
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

export default verifiedSpaceItem;
