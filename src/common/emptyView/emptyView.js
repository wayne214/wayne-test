import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    Platform,
} from 'react-native';

import * as StaticColor from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        left: 0,
        ...Platform.select({
            ios: {
                top: 64,
            },
            android: {
                top: 50,
            },
        }),
        alignItems: 'center',
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
        position: 'absolute',
    },
    content: {
        fontSize: 17,
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        textAlign: 'center',
        marginTop: 10,
    },
    subViewStyle: {
        marginVertical: 150,
    },
});

class EmptyView extends Component {

    /*声明属性*/
    static propTypes = {
        emptyImage : PropTypes.object,
        content: PropTypes.string,
    };

    /*属性默认值*/
    static defaultProps = {
        emptyImage: StaticImage.EmptyImage,
        content: '暂无数据',
    };

    render() {
        const {emptyImage, content} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.subViewStyle}>
                    <Image source={emptyImage} />
                    <Text style={styles.content}>{content}</Text>
                </View>
            </View>
        );
    }
}

export default EmptyView;
