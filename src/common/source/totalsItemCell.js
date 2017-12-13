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
    container: {
        backgroundColor: StaticColor.WHITE_COLOR,
        paddingLeft: 20,
        flexDirection: 'row',
        paddingBottom: 15,
        paddingTop: 15,
        flex: 1,
    },
    normalStyle: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        flex: 1,
    },
    redStyle: {
        fontSize: 16,
        color: StaticColor.GOODS_TOTAL_TEXT_COLOR,
        marginRight:20,
    },
});

class TotalsItemCell extends Component {

    static propTypes = {
        totalTons: PropTypes.number,
        totalSquare: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            totalTons: '',
            totalSquare: '',
        };
    }

    render() {
        const {totalTons, totalSquare} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.normalStyle}>总计:</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.redStyle}>
                        {totalTons}Kg
                    </Text>
                    <Text style={[styles.redStyle, {marginLeft: 10}]}>
                        {totalSquare}方
                    </Text>
                </View>
            </View>
        );
    }
}

export default TotalsItemCell;
