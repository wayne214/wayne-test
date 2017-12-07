
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
} from 'react-native';

import {
    COLOR_LIGHT_GRAY_TEXT,
    LIGHT_GRAY_TEXT_COLOR,
    LIGHT_BLACK_TEXT_COLOR,
    COLOR_VIEW_BACKGROUND,
} from '../../../constants/staticColor';

// import Validator from '../../utils/validator';
import GoodInfoCell from '../../../common/source/goodInfoCell';

const style = StyleSheet.create({
    // 名称style
    subTitleStyle: {
        fontSize: 15,
        color: COLOR_LIGHT_GRAY_TEXT,
    },
    subViewStyle: {
        flexDirection: 'row', // 确保水平布局
        justifyContent: 'space-between', // 确保水平布局间距一样
        marginBottom: 10,
        marginTop: 15,
    },
    // 分隔线
    SeparationStyle: {
        backgroundColor: COLOR_VIEW_BACKGROUND,
        height: 0.5,
        marginLeft: 20,
    },

});
class goodsDetailInfo extends Component {
    constructor(props) {
        super(props);

        this.Separationline = this.Separationline.bind(this);
        this.subComponent = this.subComponent.bind(this);

    }

    // 创建分隔线
    Separationline() {
        return (
            <View style={style.SeparationStyle} />
        );
    }

    // 子组件
    subComponent(orderInfo, isLast) {


        return (
            <View style={{marginRight: 20}}>
                <View style={{marginHorizontal: 20}}>
                    <View style={style.subViewStyle}>
                        <Text style={[style.subTitleStyle]}>名称</Text>
                        <Text style={{fontSize: 15, color: LIGHT_BLACK_TEXT_COLOR, marginRight: -20}}>
                            {orderInfo.goodsName}
                        </Text>
                    </View>
                    <View style={style.subViewStyle}>
                        <Text style={[style.subTitleStyle]}>规格</Text>
                        <Text style={{ fontSize: 15, color: LIGHT_BLACK_TEXT_COLOR, marginRight: -20}}>
                            {orderInfo.goodsSpce ? orderInfo.goodsSpce : '/'}
                        </Text>
                    </View>
                    <View style={style.subViewStyle}>
                        {
                            orderInfo.arNums && orderInfo.arNums !== '' &&  orderInfo.arNums !== '0'?
                                <GoodInfoCell title="应收" num={orderInfo.arNums} unit={orderInfo.goodsUnit} /> :
                                <GoodInfoCell title="应收" num={orderInfo.weight} unit={'Kg'} />
                        }
                    </View>
                </View>
                {isLast ? null : this.Separationline()}
            </View>
        );
    }

    render() {
        const {orderInfo, isLast} = this.props;
        return (
            <View>
                {this.subComponent(orderInfo, isLast)}
            </View>
        );
    }
}
goodsDetailInfo.propTypes = {
    orderInfo: React.PropTypes.object.isRequired,
};

export default goodsDetailInfo;
