import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import VerifiedSpaceItem from './verifiedSpaceItem';
import Line from './verifiedLineItem';

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
    },
    titleStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        fontSize: 16,
        color: '#333333',
    }
});

class verifiedGrayTitleItem extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {title} = this.props;
        return (
            <View style={styles.container}>
                <VerifiedSpaceItem/>

                <Text style={styles.titleStyle}>
                    {title}
                </Text>
                <Line />
            </View>
        )
    }
}

export default verifiedGrayTitleItem;
