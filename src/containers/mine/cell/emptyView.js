import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';

import * as StaticColor from '../../../constants/staticColor';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    content: {
        fontSize: 17,
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        marginTop: 10,
    },
    icon: {
        marginTop: 134,
    },
});

class EmptyView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }
    render() {
        const {icon, content} = this.props;
        return (
            <View style={styles.container}>
                <Image source={icon} style={styles.icon} />
                <Text style={styles.content}>{content}</Text>
            </View>
        );
    }
}

EmptyView.propTypes = {
    icon: React.PropTypes.number.isRequired,
    content: React.PropTypes.string.isRequired,
};

export default EmptyView;
