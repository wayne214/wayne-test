/**
 * 通用button按钮
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';

import * as StaticColor from '../constants/staticColor';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: StaticColor.COLOR_MAIN,
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
});

class commonButton extends Component {
    static propTypes = {
        style: PropTypes.object,
    };

    componentDidMount() {

    }

    render() {
        const {onClick, buttonText} = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    onClick();
                }}
                activeOpacity={0.6}
            >
                <View style={styles.button}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export default commonButton;
