/*
 * @author:  wangl
 * @description:  货源详情 运货单界面
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import * as StaticColor from '../../constants/staticColor';

const styles = StyleSheet.create({
    transportNo: {
        fontSize: 16,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
    },
    transportTime: {
        fontSize: 13,
        marginTop: 5,
        color: StaticColor.GRAY_TEXT_COLOR,
    },
});
class DetailsCell extends Component {

    static propTypes = {
        transportNO_: PropTypes.string,
        transportTime: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            transportNO_: '',
            transportTime: '',
        };
    }

    render() {
        const {transportNO_, transportTime} = this.props;
        return (

            <View
                style={{
                    backgroundColor: StaticColor.WHITE_COLOR,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingBottom: 10,
                    paddingTop: 10,
                }}
            >

                <Text style={styles.transportTime}>订单编号：{transportNO_}</Text>

                <Text style={styles.transportTime}>创建时间：{transportTime}</Text>

            </View>

        );
    }
}

export default DetailsCell;
