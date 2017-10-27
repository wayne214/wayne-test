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
import * as ConstValue from '../../constants/constValue';


const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        left: 0,
        top: 0,
        // ...Platform.select({
        //     ios: {
        //         top: ConstValue.NavigationBar_StatusBar_Height,
        //     },
        //     android: {
        //         top: 50,
        //     },
        // }),
        alignItems: 'center',
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
        position: 'absolute',
        flex: 1,
    },
    content: {
        fontSize: 17,
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        textAlign: 'center',
        marginTop: 10,
    },
    subViewStyle: {
        marginVertical: height / 4,
    },
});

class EmptyView extends Component {

    /*声明属性*/
    static propTypes = {
        emptyImage : PropTypes.object,
        content: PropTypes.string,
        comment: PropTypes.object,

    };

    /*属性默认值*/
    static defaultProps = {
        emptyImage: StaticImage.EmptyImage,
        content: '暂无数据',
        comment: null,

    };

    render() {
        const {emptyImage, content, comment} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.subViewStyle}>
                    <Image source={emptyImage} />
                    <Text style={styles.content}>{content}</Text>
                    {
                        comment ? <View>{comment}</View> : null

                    }
                </View>
            </View>
        );
    }
}

export default EmptyView;
