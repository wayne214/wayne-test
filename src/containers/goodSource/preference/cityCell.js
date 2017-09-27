import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import StaticImage from '../../../constants/staticImage';
const styles = StyleSheet.create({
    container: {
        // flex: 1
        borderColor: '#1b82d1',
        backgroundColor: '#f3f8f8',
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
        marginLeft: 10,
    },
    text: {
        fontSize: 14,
        color: '#1b82d1',
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
                    <Image style={styles.imgStyle} source={StaticImage.deleteIcon}/>
                </TouchableOpacity>
            </View>
        );
    }
}

export default cityCell;
