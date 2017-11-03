/**
 * Created by mymac on 2017/4/13.
 */
import React, {Component} from 'react';

import {
    View,
    ScrollView,
    Dimensions,
    Platform,
    Text,
    ImageBackground,
    StyleSheet
} from 'react-native';

import DetailsCell from '../../common/source/detailsCell';
import DetailsUserCell from '../../common/source/detailsUserCell';
import DetailsRedUserCell from '../../common/source/detailsRedUserCell';
import DetailsOrdersCell from '../../common/source/detailsOrdersCell';
import TitlesCell from '../../common/source/titlesCell';
import TotalsItemCell from '../../common/source/totalsItemCell';
import ProductShowItem from '../../common/source/OrderDetailProShowItemCell';
import * as StaticColor from '../../constants/staticColor';
import * as ConstValue from '../../constants/constValue';
import StaticImage from '../../constants/staticImage';

const space = 10;
const topSpace = 10;
const topHeight = 40;
const bottomSpace = 13;
const screenWidth = Dimensions.get('window').width - space * 2;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    imageBackground: {
        marginTop: 10,
        alignSelf: 'center',
        height: 130,
        width: screenWidth - 20
    },
    constantStyle: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 10,
        paddingLeft: 10
    },
    constantIcon: {
        fontFamily: 'iconfont',
        color: StaticColor.COLOR_CONTACT_ICON_COLOR,
        fontSize: 19
    },
    separateLine: {
        height: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
        marginLeft: 10,
        marginRight: 10
    },
    divideLine: {
        height: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
});

export default class orderToBeSureDetail extends Component {

    constructor(props) {
        super(props);
        console.log('log', '');
        this.state = {
            showGoodList: false,
        };
    }
    showGoodInfoList(value) {
        this.setState({
            showGoodList: value,
        });
    }

    render() {
        const {
            deliveryInfo,
            goodsInfoList,
            taskInfo,
            time,
            transCode,
            vol,
            weight,
            signer,
            index,
            transOrderType,
            transOrderStatus,
        } = this.props;
        return (
            <View
                style={{
                    backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
                    width: screenWidth,
                    marginLeft: space,
                    marginRight: space,
                    overflow: 'hidden',
                    marginTop: topSpace,
                    ...Platform.select({
                        ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height - bottomSpace},
                        android:{height: screenHeight - topHeight - 73 - bottomSpace}
                    }),
                }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        backgroundColor: StaticColor.WHITE_COLOR,
                        ...Platform.select({
                            ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height - bottomSpace},
                            android:{height: screenHeight - topHeight - 73 - bottomSpace}
                        }),
                        borderColor: StaticColor.WHITE_COLOR,
                        borderWidth: 1,
                        borderRadius: 5,
                    }}
                >
                    {
                        taskInfo ?
                            <ImageBackground source={StaticImage.TaskBackground} style={styles.imageBackground} resizeMode='stretch'>
                                <View style={styles.constantStyle}>
                                    <Text style={styles.constantIcon}>&#xe66d;</Text>
                                    <Text style={{fontSize: 17, fontWeight: 'bold', marginLeft: 10,}}>
                                        {deliveryInfo.receiveContact}
                                    </Text>
                                </View>
                                <View style={styles.separateLine}/>
                                <View style={{marginHorizontal: 10}}>
                                    <DetailsOrdersCell
                                        ifReceipt={taskInfo.isReceipt}
                                        receiptStyle={taskInfo.receiptWay}
                                        arrivalTime={taskInfo.committedArrivalTime.replace(/-/g, '/')}
                                    />
                                </View>
                            </ImageBackground> :
                            <View>
                                <View style={[styles.constantStyle, {marginLeft: 5}]}>
                                    <Text style={styles.constantIcon}>&#xe66d;</Text>
                                    <Text style={{fontSize: 17, fontWeight: 'bold', marginLeft: 10}}>
                                        {deliveryInfo.receiveContactName}
                                    </Text>
                                </View>
                                <View style={styles.divideLine}/>
                            </View>
                        }
                    <TitlesCell title="配送信息" />
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND, marginLeft: 20}}/>
                    <DetailsUserCell
                        deliveryInfo={deliveryInfo}
                        onSelectAddr={() => {
                            this.props.addressMapSelect(index, 'departure');
                        }}
                        isShowContactAndPhone={true}
                    />
                    <DetailsRedUserCell
                        deliveryInfo={deliveryInfo}
                        onSelectAddr={() => {
                            this.props.addressMapSelect(index, 'receive');
                        }}
                        isShowContactAndPhone={true}
                    />
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />

                    <TitlesCell title="货品信息" showArrowIcon={true} onPress={(value) => { this.showGoodInfoList(value); }}/>
                    {
                        this.state.showGoodList ? goodsInfoList.map((item, indexRow) => {
                            return (
                                <ProductShowItem
                                    key={indexRow}
                                    orderInfo={item}
                                    isLast={indexRow === goodsInfoList.length - 1}
                                />
                            );
                        }) : null
                    }
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />
                    <TotalsItemCell totalTons={weight} totalSquare={vol} />
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />
                    <DetailsCell
                        transportNO_={transCode}
                        transportTime={time}
                        customerCode={'SO171025000012'}
                        transOrderType={transOrderType}
                        transOrderStatus={transOrderStatus}
                        dispatchTime={'2017-10-25 18:37'}
                        dispatchTimeAgain={'2017-10-25 18:37:20'}
                        shipmentTime={'2017-10-25 18:38'}
                        shipmentTimeAgain={'2017-10-25 18:39:00'}
                        signTime={'2017-10-26 10:39:00'}
                        receiveTime={'2017-10-26 10:50:00'}
                    />
                </ScrollView>
            </View>
        );
    }
}
