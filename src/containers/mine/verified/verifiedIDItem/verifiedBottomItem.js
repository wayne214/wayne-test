import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#f5f5f5',
    },
    bottomStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginHorizontal: 10,
        backgroundColor: '#1b82d1',
        height: 40,
        borderRadius: 5,
    },
    textStyle:{
        textAlign: 'center',
        color: 'white',
        fontSize: 17,
        marginVertical: 10,
        fontWeight: 'bold',
    }
});

class verifiedBottomItem extends Component{
    constructor(props) {
        super(props);

        this.click = this.click.bind(this);
    }

    click(){
        this.props.clickAction();
    }
    render() {
        return (
            <View style={styles.container}>

                <TouchableOpacity style={styles.bottomStyle} onPress={()=>{
                    this.click();
                }}>
                    <Text style={styles.textStyle}>
                        提交
                    </Text>
                </TouchableOpacity>

            </View>
        )
    }
}

export default verifiedBottomItem;
