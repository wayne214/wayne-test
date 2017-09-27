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
const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        height: 44,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        color: '#666666',
    },
    contentText: {
        fontSize: 16,
        color: '#333333',
    },
    separateLine: {
        height: 1,
        backgroundColor: '#e8e8e8',
        marginLeft: 20,
    },
});
class CommonCell extends Component {
    static propTypes = {
        content: PropTypes.string,
        itemName: PropTypes.string,
        hideBottomLine: PropTypes.bool,
        contentColorStyle: Text.propTypes.style,
    };

    render() {
        const {itemName, content, hideBottomLine, contentColorStyle, titleColorStyle} = this.props;
        return (
            <View>
                <View style={styles.container}>
                    <Text style={[styles.itemName, titleColorStyle]}>{itemName}</Text>
                    <Text style={[styles.contentText, contentColorStyle]}>{content}</Text>
                </View>
                {
                    hideBottomLine ? null : <View style={styles.separateLine} />
                }
            </View>
        );
    }
}

export default CommonCell;
