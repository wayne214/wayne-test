/**
 * 通用button按钮
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ImageBackground,
    Dimensions,
} from 'react-native';

import * as StaticColor from '../constants/staticColor';
import StaticImage from '../constants/staticImage';
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: StaticColor.BLUE_CONTACT_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 40,
    },
    buttonText: {
        fontSize: 18,
        color: StaticColor.WHITE_COLOR,
        fontWeight: 'bold',
    },
    buttonBackground: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 40,
        height: 40,
        backgroundColor: 'transparent',
        alignSelf: 'center'
    },
});

class commonButton extends Component {
    static propTypes = {
        style: PropTypes.object,
    };

    componentDidMount() {

    }

    render() {
        const {onClick, buttonText, buttonStyle, containerStyle, backgroundImg} = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    onClick();
                }}
                activeOpacity={0.6}
            >
                <View style={[styles.button, containerStyle]}>
                    <ImageBackground source={backgroundImg ? backgroundImg : StaticImage.BlueButtonArc} style={[styles.buttonBackground, buttonStyle]} resizeMode='stretch'>
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </ImageBackground>
                </View>
            </TouchableOpacity>
        );
    }
}

export default commonButton;
