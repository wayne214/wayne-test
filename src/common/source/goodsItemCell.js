/*
 * @author:  wangl
 * @description:  货源详情 运货单界面
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

import * as StaticColor from '../../constants/staticColor';

const styles = StyleSheet.create({

    item: {
        fontSize: 14,
        marginBottom: 10,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,

    },
    item1: {
        fontSize: 14,
        marginBottom: 10,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        flex: 1,
    },
    itemBold: {
        fontSize: 14,
        marginBottom: 10,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        fontWeight: 'bold',
    },
    container: {
        backgroundColor: StaticColor.WHITE_COLOR,
        paddingLeft: 10,
        paddingTop: 10,
    },
});

class GoodsItemCell extends Component {
    static propTypes = {
        goodsName: PropTypes.string,
        goodsWeight: PropTypes.string,
        goodsUnit: PropTypes.string,
        goodsNo: PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.state = {
            goodsName: '',
            goodsWeight: '',
            goodsUnit: '',
            goodsNo: '',
        };
    }

    render() {
        const {goodsName, goodsWeight, goodsUnit, goodsNo} = this.props;
        return (

            <View style={styles.container}>

                <Text style={styles.itemBold}>{goodsName}</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.item1}>规格: {goodsWeight}</Text>
                    <Text style={styles.item1}>单位: {goodsUnit}</Text>
                </View>
                <Text style={styles.item}>发运: {goodsNo}</Text>
                <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />

            </View>

        );
    }
}


export default GoodsItemCell;
