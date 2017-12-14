import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#ffffff',
    },
    titleStyle:{
        marginTop: 20,
        marginBottom: 20,
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
                <Text style={styles.titleStyle}>
                    {title}
                </Text>
            </View>
        )
    }
}

export default verifiedGrayTitleItem;
