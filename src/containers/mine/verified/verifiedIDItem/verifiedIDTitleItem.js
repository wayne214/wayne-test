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
        marginTop: 15,
        marginLeft: 10,
        fontSize: 17,
        color: '#333333',

    }
});

class verifiedIDTitleItem extends Component{
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

export default verifiedIDTitleItem;
