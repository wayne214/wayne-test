import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    Dimensions,
    Platform,
    ImageBackground
} from 'react-native';

import DetailsCell from '../../common/source/detailsCell';
import DetailsUserCell from '../../common/source/detailsUserCell';
import DetailsRedUserCell from '../../common/source/detailsRedUserCell';
import DetailsOrdersCell from '../../common/source/detailsOrdersCell';
import TitlesCell from '../../common/source/titlesCell';
import TotalsItemCell from '../../common/source/totalsItemCell';
import OrderProductInfo from './component/goodsDetailInfo';
import * as ConstValue from '../../constants/constValue';
import StaticImage from '../../constants/staticImage';
const space = 10;
const topSpace = 10;
const topHeight = 40;

const bottomSpace = 45;

const screenWidth = Dimensions.get('window').width - space * 2;
const screenHeight = Dimensions.get('window').height;


export default class GoodsSourceDetails extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
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
        const {deliveryInfo, goodsInfoList, taskInfo, time, transCode, vol, weight, index, isFullScreen} = this.props;

        return (

            <View
                style={{
                    backgroundColor: '#f5f5f5',
                    width: screenWidth,
                    marginLeft: space,
                    marginRight: space,
                    overflow: 'hidden',
                    marginTop: topSpace,
                    ...Platform.select({
                        ios:{height: isFullScreen ? screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height : screenHeight - topHeight - bottomSpace - ConstValue.NavigationBar_StatusBar_Height - 5},
                        android:{height: isFullScreen ? screenHeight - topHeight - 73 : screenHeight - topHeight - bottomSpace - 73 - 5}
                    })
                }}
            >

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        backgroundColor: 'white',
                        ...Platform.select({
                            ios:{height: isFullScreen ? screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height : screenHeight - topHeight - bottomSpace - ConstValue.NavigationBar_StatusBar_Height - 5},
                            android:{height: isFullScreen ? screenHeight - topHeight - 73 : screenHeight - topHeight - bottomSpace - 73 - 5}
                        }),
                        borderColor: 'white',
                        borderWidth: 1,
                        borderRadius: 10,
                    }}
                >
                    {/*<View style={{backgroundColor: '#00A4FF', height: 2.5, width: screenWidth - 26, alignSelf: 'center', borderRadius: 5, marginTop: 10}}/>*/}
                    {/*<View style={{alignSelf: 'center',width: screenWidth - 20, height: 150, borderRadius: 5, backgroundColor: 'white', borderWidth: 1, borderColor: '#d9d9d9'}}>*/}

                    {/*</View>*/}
                    <ImageBackground source={StaticImage.TaskBackground} style={{marginTop: 10, alignSelf: 'center',height: 150, width: screenWidth - 20}} resizeMode='stretch'>
                        <View style={{flexDirection: 'row', paddingTop: 15, paddingBottom: 15, paddingLeft: 10}}>
                            <Text style={{fontFamily: 'iconfont', color: '#B2B2B2', fontSize: 15}}>&#xe66d;</Text>
                            <Text style={{fontSize: 17, fontWeight: 'bold', marginLeft: 10,}}>
                                {deliveryInfo.receiveContactName}
                            </Text>
                        </View>
                        <View style={{height: 1, backgroundColor: '#F5F5F5', marginLeft: 10, marginRight: 10}}/>
                        <DetailsOrdersCell
                            ifReceipt={taskInfo.isReceipt}
                            receiptStyle={taskInfo.receiptWay}
                            arrivalTime={taskInfo.committedArrivalTime}
                        />
                    </ImageBackground>
                    {/*<Text style={{fontSize: 17, marginHorizontal: 20,marginVertical: 10, fontWeight: 'bold'}}>*/}
                        {/*{deliveryInfo.receiveContactName}*/}
                    {/*</Text>*/}

                    {/*<View style={{height: 1, backgroundColor: '#F5F5F5'}}/>*/}

                    {/*<DetailsOrdersCell*/}
                        {/*ordersPayment={taskInfo.collectMoney}*/}
                        {/*ordersFreight={taskInfo.carrFee}*/}
                        {/*carrFeePayer={taskInfo.carrFeePayer}*/}
                        {/*paymentWay={taskInfo.paymentWay}*/}
                        {/*ifReceipt={taskInfo.isReceipt}*/}
                        {/*receiptStyle={taskInfo.receiptWay}*/}
                        {/*arrivalTime={taskInfo.committedArrivalTime}*/}
                    {/*/>*/}


                    {/*<View style={{height: 1, backgroundColor: '#F5F5F5'}}/>*/}

                    <TitlesCell title="配送信息" />
                    <View style={{height: 1, backgroundColor: '#F5F5F5', marginLeft: 20}}/>
                    <DetailsUserCell
                        deliveryInfo={deliveryInfo}
                        onSelectAddr={() => {
                            this.props.addressMapSelect(index, 'departure');
                        }}
                    />


                    <DetailsRedUserCell
                        deliveryInfo={deliveryInfo}
                        onSelectAddr={() => {
                            this.props.addressMapSelect(index, 'receive');
                        }}
                    />

                    <View style={{height: 1, backgroundColor: '#F5F5F5'}}/>

                    <TitlesCell
                        title="货品信息"
                        showArrowIcon={true}
                        onPress={(value) => {
                            this.showGoodInfoList(value);
                        }}
                    />

                    {
                        this.state.showGoodList ? goodsInfoList.map((item, index) => {
                            return (
                                <OrderProductInfo
                                    key={index}
                                    orderInfo={item}
                                    isLast={index === goodsInfoList.length - 1}
                                />
                            );
                        }) : null
                    }

                    <View style={{height: 1, backgroundColor: '#F5F5F5'}}/>
                    <TotalsItemCell totalTons={weight} totalSquare={vol}/>
                    <View style={{height: 1, backgroundColor: '#F5F5F5'}}/>
                    <DetailsCell transportNO_={transCode} transportTime={time}/>

                </ScrollView>


            </View>


        );
    }
}
GoodsSourceDetails.propTypes = {
    deliveryInfo: React.PropTypes.object,
    goodsInfoList: React.PropTypes.array,
    taskInfo: React.PropTypes.object,
    time: React.PropTypes.string,
    transCode: React.PropTypes.string,
    vol: React.PropTypes.number,
    weight: React.PropTypes.number,
    index: React.PropTypes.number,
    addressMapSelect: React.PropTypes.func,
};
