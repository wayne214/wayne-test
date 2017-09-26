/*
 * @author:  yinyongqian
 * @createTime:  2017-03-22, 11:18:32 GMT+0800
 * @description:  description
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 15,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
    },
    contentText: {
        fontSize: 15,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
});
class taskInfoCell extends Component {
    static propTypes = {
        content: PropTypes.string,
        itemName: PropTypes.string,
        hideBottomLine: PropTypes.bool,
        contentColorStyle: Text.propTypes.style,
    };

    render() {
        const {itemName, content, contentColorStyle} = this.props;
        return (
            <View>
                <View style={styles.container}>
                    <Text style={styles.itemName}>{itemName}</Text>
                    <Text style={[styles.contentText, contentColorStyle]}>{content}</Text>
                </View>
            </View>
        );
    }
}

export default taskInfoCell;
