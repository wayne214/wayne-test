import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from 'react-native';

import StaticImage from '../../../../constants/staticImage';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#f5f5f5',
    },
    bottomStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginHorizontal: 10,
        backgroundColor: 'transparent',
        height: 40,
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
                    <ImageBackground
                        resizeMode='stretch'
                        style={{
                            width: width - 20,
                            height: 40,
                        }}
                        source={StaticImage.BlueButtonArc}>
                        <Text style={styles.textStyle}>
                            提交
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>

            </View>
        )
    }
}

export default verifiedBottomItem;
