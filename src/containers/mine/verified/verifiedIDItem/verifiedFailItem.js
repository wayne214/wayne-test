import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
    },
    textStyle:{
        color: '#333333',
        fontSize: 15,
        marginTop: 15,
        marginBottom: 50,
        marginHorizontal: 10,
    }

});

class verifiedFailItem extends Component{
    constructor(props) {
        super(props);
    }

    static propTypes = {
        style: PropTypes.object,
    };

    render() {
        const {reason} = this.props;

        return (
            <View style={styles.container}>

            <Text style={styles.textStyle}>
                {reason}
            </Text>

            </View>
        )
    }
}

export default verifiedFailItem;
