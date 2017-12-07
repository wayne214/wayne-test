import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textStyle: {
        color: StaticColor.GRAY_TEXT_COLOR,
        fontSize: 14,
        alignSelf:'center',
    },
    numberStyle: {
        color: StaticColor.READ_NUMBER_COLOR,
        fontSize: 14,
        alignSelf:'center',
    },
});

class selectComponent extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        style: PropTypes.object,
    };

    render() {
        const {fontText, num, unit, style} = this.props;
        return (
            <View style={[{flexDirection: 'row'}, style]}>
                <Text style={styles.textStyle}>{fontText}</Text>
                <Text style={styles.numberStyle}>{num}</Text>
                <Text style={styles.textStyle}>{unit}</Text>
            </View>
        );
    }
}

export default selectComponent;
