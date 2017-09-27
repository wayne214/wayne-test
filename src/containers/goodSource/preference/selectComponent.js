import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textStyle: {
        color: '#999999',
        fontSize: 13,
    },
    numberStyle: {
        color: '#ff3333',
        fontSize: 13,
    },
});

class selectComponent extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        style: PropTypes.object,
    };

    componentDidMount() {

    }

    render() {
        const {selected, total, style} = this.props;
        return (
            <View style={[{flexDirection: 'row'}, style]}>
                <Text style={styles.textStyle}>已选(</Text>
                <Text style={styles.numberStyle}>{selected}</Text>
                <Text style={styles.textStyle}>/</Text>
                <Text style={styles.numberStyle}>{total}</Text>
                <Text style={[styles.textStyle, {marginRight: 20}]}>)</Text>
            </View>
        );
    }
}

export default selectComponent;
