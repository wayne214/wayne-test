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
import GoodKindUtil from '../../../utils/goodKindUtil';
import CommonLabelCell from '../../../common/commonLabelCell';


const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
        // marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
        borderBottomColor: '#d9d9d9'
    },
    timeText: {
        fontSize: 15,
        color: StaticColor.GRAY_TEXT_COLOR,
        marginTop: 8,
    },
    transCodeText: {
        fontSize: 15,
        color: StaticColor.GRAY_TEXT_COLOR,
        marginTop: 5,
    },
    arriveAndGoodsText: {
        fontSize: 16,
        color: '#FA5741',
    },
    separateLine: {
        height: 0.5,
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
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
        marginBottom: 15,
        marginTop: 8,
    },
    content: {
        paddingLeft: 10,
        paddingTop: 15,
        paddingBottom: 5,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        padding: 10,
    },
    rightContainer: {
        marginLeft: 20,
        marginRight: 100,
        paddingTop: 20
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
    goodKindStyle: {
        marginTop: -50,
        marginLeft: 10,
    },
    dispatchLineStyle: {
        fontSize: 17,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    arriveTimeStyle: {
        fontSize: 12,
        color: StaticColor.GRAY_TEXT_COLOR,
    }
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
            dispatchLine,
            goodKindsName,
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
                            <View style={styles.goodKindStyle}>
                                {
                                    GoodKindUtil.show('其他')
                                }
                            </View>
                            <View style={styles.rightContainer}>
                                <Text style={styles.dispatchLineStyle}>{dispatchLine ? dispatchLine : '河南鲜易供应链有限公司'}</Text>
                                <Text style={[styles.arriveTimeStyle, {marginTop: 8}]}>到仓时间: {arriveTime}</Text>
                                <View style={{flexDirection: 'row', flexWrap: 'wrap',}}>
                                    <CommonLabelCell content={'其他'}/>
                                    <CommonLabelCell content={'其他'}/>
                                    <CommonLabelCell content={'其他'}/>
                                    <CommonLabelCell content={'其他'}/>
                                    <CommonLabelCell content={'其他'}/>
                                    <CommonLabelCell content={'其他'}/>
                                    <CommonLabelCell content={'订单1单'} containerStyle={{backgroundColor: '#E6F2FF'}} textStyle={{color: '#59ABFD'}}/>
                                    <CommonLabelCell content={`配送点${distributionPoint}`} containerStyle={{backgroundColor: '#E1F5ED'}} textStyle={{color: '#33BE85'}}/>
                                </View>
                                <View style={styles.goodsTotal}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={[styles.arriveAndGoodsText]}>{weight}</Text>
                                        <Text style={[styles.arriveAndGoodsText, {color: '#2A2A2A', fontSize: 14, marginTop: 2}]}>Kg</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                        <Text style={[styles.arriveAndGoodsText, {marginLeft: 10}]}>{vol}</Text>
                                        <Text style={[styles.arriveAndGoodsText, {color: '#2A2A2A', fontSize: 14, marginTop: 2}]}>方</Text>
                                    </View>
                                </View>
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
                        <View style={styles.text}>
                            <Text style={styles.transCodeText}>调度单号：{transCode}</Text>
                            <Text style={styles.timeText}>调度时间：{time}</Text>
                        </View>
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
