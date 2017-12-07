import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import StaticImage from '../../../constants/staticImage';
import * as StaticColor from '../../../constants/staticColor';
const styles = StyleSheet.create({
    container: {
        // flex: 1
        borderColor: '#dddddd',
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderRadius: 90,
        height: 30,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 10,
    },
    imgStyle: {
        // marginLeft: 5,
        fontFamily: 'iconfont',
        fontSize: 22,
        color: '#c5c5c5'
    },
    text: {
        fontSize: 14,
        color: '#333333',
    },
});

class cityCell extends Component {
    static propTypes = {
        style: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        const {content, onClick} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{content}</Text>
                <TouchableOpacity onPress={() => onClick()}>
                    <Text style={styles.imgStyle}>&#xe66c;</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default cityCell;
