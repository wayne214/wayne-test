import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';

import StaticImage from '../../../constants/staticImage';


const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
        // marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
    },
    timeText: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    transCodeText: {
        fontSize: 13,
        color: StaticColor.GRAY_TEXT_COLOR,
        marginTop: 5,
    },
    arriveAndGoodsText: {
        fontSize: 15,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    separateLine: {
        height: 0.5,
        backgroundColor: StaticColor.COLOR_SEPARATE_LINE,
        marginLeft: 10,
    },
    cellStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rejectImg: {
        position: 'absolute',
        marginTop: 10,
        marginLeft: width - 100,
        alignItems: 'flex-end',
    },
    icon: {
        fontFamily: 'iconfont',
        fontSize: 16,
        color: StaticColor.CALENDER_ICON_COLOR,
    },
    rightArrow: {
        height: 15,
        width: 8,
        marginRight: 20,
    },
    goodsTotal: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingBottom: 15,
    },
    content: {
        paddingLeft: 10,
        paddingTop: 15,
        paddingBottom: 5,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        paddingTop: 15,
        paddingLeft: 10,
        paddingBottom: 15,
        paddingRight: 10,
    },
    itemFlag: {
        position: 'absolute',
        top: 0,
        right: 10,
    },
    itemFlagText: {
        position: 'absolute',
        color: '#ffffff',
        backgroundColor: 'transparent',
        top: 14,
        right: 2,
        fontSize: 16,
        fontWeight: 'bold',
        transform: [{rotateZ: '45deg'}],
    },
});

class commonListItem extends Component {
    static propTypes = {
        style: PropTypes.object,
        showRejectIcon: PropTypes.bool,
        onSelect: PropTypes.func,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }
    render() {
        const {
            time,
            onSelect,
            transCode,
            distributionPoint,
            arriveTime,
            weight,
            vol,
            showRejectIcon,
            allocationModel,
        } = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        onSelect();
                    }}
                    underlayColor={StaticColor.COLOR_SEPARATE_LINE}
                >
                    <View>
                        <View style={styles.title}>
                            <View style={styles.text}>
                                <Text style={styles.timeText}>{time}</Text>
                                <Text style={styles.transCodeText}>{transCode}</Text>
                            </View>
                            {
                                showRejectIcon ? null : allocationModel === '10' || allocationModel === '' || allocationModel === null ? <View style={styles.itemFlag}>
                                    <Image
                                        style={{height: 30, width: 51}}
                                        source={StaticImage.DispatchIcon}
                                    />
                                </View> : <View style={styles.itemFlag}>
                                    <Image
                                        style={{height: 30, width: 51}}
                                        source={StaticImage.BiddingIcon}
                                    />
                                </View>
                            }
                        </View>
                        <View style={styles.separateLine} />
                        <View style={styles.content}>
                            <Text style={styles.arriveAndGoodsText}>配送点: {distributionPoint}</Text>
                            <Text style={[styles.arriveAndGoodsText, {marginTop: 5}]}>到仓时间: {arriveTime}</Text>
                        </View>
                        <View style={styles.goodsTotal}>
                            <Text style={styles.arriveAndGoodsText}>货品总计:</Text>
                            <Text style={[styles.arriveAndGoodsText, {marginLeft: 10}]}>{weight}</Text>
                            <Text style={[styles.arriveAndGoodsText, {marginLeft: 10}]}>{vol}</Text>
                        </View>
                        {/*{*/}
                            {/*showRejectIcon ?*/}
                                {/*<View style={styles.rejectImg}>*/}
                                    {/*<Image*/}
                                        {/*style={{width: 70, height: 70}}*/}
                                        {/*source={StaticImage.RejectIcon}*/}
                                    {/*/>*/}
                                {/*</View> : null*/}
                        {/*}*/}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
commonListItem.propTypes = {
    time: React.PropTypes.string,
    transCode: React.PropTypes.string,
    distributionPoint: React.PropTypes.string,
    arriveTime: React.PropTypes.string,
    weight: React.PropTypes.string,
    vol: React.PropTypes.string,
};

export default commonListItem;
