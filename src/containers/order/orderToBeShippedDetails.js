// 待发运界面
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Dimensions,
    Platform,
    Keyboard,
    DeviceEventEmitter,
    Text,
} from 'react-native';
import DetailsCell from '../../common/source/detailsCell';
import DetailsUserCell from '../../common/source/detailsUserCell';
import DetailsRedUserCell from '../../common/source/detailsRedUserCell';
import DetailsOrdersCell from '../../common/source/detailsOrdersCell';
import TitlesCell from '../../common/source/titlesCell';
import TotalsItemCell from '../../common/source/totalsItemCell';
import OrderProductInfo from './components/orderProductItemInfo';
import * as StaticColor from '../../constants/staticColor';

const space = 10;
const topSpace = 10;
const topHeight = 40;
const bottomViewHeight = 70;
const screenWidth = Dimensions.get('window').width - space * 2;
const screenHeight = Dimensions.get('window').height;

export default class OrderDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showGoodList: false,
        };
        this.textInputID = null;
        this.receiveAllNumInfo = this.receiveAllNumInfo.bind(this);
    }
    componentWillMount() {

        if(Platform.OS === 'ios') {
            // Keyboard events监听
            this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
        }

    }

    componentWillUnmount() {
        if(Platform.OS === 'ios') {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }

    // 键盘弹起后执行
    keyboardDidShow = (e) => {
        if(Platform.OS === 'ios') {
            this.scrollView.scrollTo({x: 0, y: 350 + this.textInputID * 120, animated: true});
        }
    };

    // 键盘收起后执行
    keyboardDidHide = () => {
        if(Platform.OS === 'ios') {
            this.scrollView.scrollToEnd();
        }
    };


    // 货品信息->选择发运的数量
    receiveAllNumInfo(componentID, number, index) {
        // 更新state，改变组件的数量

        const array = this.props.goodsInfoList;

        const item = array[index];
        array[index] = {
            arNums: item.arNums,
            goodsId: item.goodsId,
            goodsName: item.goodsName,
            goodsSpce: item.goodsSpce,
            goodsUnit: item.goodsUnit,
            // refuseDetailDtoList:item.refuseDetailDtoList,没有可不填
            refuseNum: '0',
            refuseReason: '',
            shipmentNum: number,
            signNum: '0',
        };

        this.setState({
            products: array,
        });


        // 获取 发运 的数据格式
        const goodsInfo = [];
        for (let i = 0; i < array.length; i++) {
            const subitem = array[i];

            goodsInfo.push({
                goodsId: subitem.goodsId,
                shipmentNums: subitem.shipmentNum,
            });
        }
        const transOrderInfo = {
            transCode: this.props.transCode,
            goodsInfo,
        };
        this.props.chooseResult(this.props.index, transOrderInfo);

    }

    showGoodInfoList(value) {
        this.setState({
            showGoodList: value,
        });
    }
    render() {
        const {
            deliveryInfo, goodsInfoList, taskInfo, time,
            transCode, transOrderStatsu, vol, weight, index, chooseResult,
        } = this.props;

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
                        ios:{height: screenHeight - topHeight - 64 - bottomViewHeight},
                        android:{height: screenHeight - topHeight - 73 - bottomViewHeight}
                    }),
                }}
            >

                <ScrollView
                    ref={component => this.scrollView = component}
                    showsVerticalScrollIndicator={false}
                    returnKeyType='done'
                    style={{
                        backgroundColor: 'white',
                        ...Platform.select({
                            ios:{height: screenHeight - topHeight - 64 - bottomViewHeight},
                            android:{height: screenHeight - topHeight - 73 - bottomViewHeight,}
                        }),
                        borderColor: 'white',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}
                >
                    <Text style={{fontSize: 17, marginHorizontal: 20,marginVertical: 10, fontWeight: 'bold'}}>
                        {deliveryInfo.receiveContact}
                    </Text>
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}}/>

                    <DetailsOrdersCell
                        ordersPayment={taskInfo.collectMoney}
                        ordersFreight={taskInfo.carrFee}
                        carrFeePayer={taskInfo.carrFeePayer}
                        paymentWay={taskInfo.paymentWay}
                        ifReceipt={taskInfo.isReceipt}
                        receiptStyle={taskInfo.receiptWay}
                        arrivalTime={taskInfo.committedArrivalTime}
                    />


                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}}/>

                    <TitlesCell title="配送信息"/>
                    <View style={{height: 1, backgroundColor: '#F5F5F5', marginLeft: 20}}/>
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
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}}/>

                    <TitlesCell title="货品信息" showArrowIcon={true} onPress={(value) => { this.showGoodInfoList(value); }}/>
                    {
                        this.state.showGoodList ? goodsInfoList.map((item, indexRow) => {
                            return (
                                <OrderProductInfo
                                    key={indexRow}
                                    componentID={item.goodsId}
                                    title={item.goodsName}
                                    Specifications={item.goodsSpce}
                                    unit={item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.goodsUnit : 'Kg'}
                                    receiveNum={item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.arNums : item.weight }
                                    indexRow={indexRow}
                                    receiveAllNum={(componentID, number, _index) => {
                                        this.receiveAllNumInfo(componentID, number, _index);
                                    }}
                                    itemFocus={()=> {
                                        this.textInputID = indexRow;
                                    }}
                                    itemBlur={()=> {
                                    }}
                                />
                            );
                        }) : null
                    }
                    <View style={{height: 1, backgroundColor: '#f5f5f5'}}/>

                    <TotalsItemCell totalTons={weight} totalSquare={vol}/>
                    <View style={{height: 1, backgroundColor: '#f5f5f5'}}/>

                    <DetailsCell transportNO_={transCode} transportTime={time}/>

                </ScrollView>

            </View>

        );
    }
}
OrderDetails.propTypes = {
    index: React.PropTypes.number,
    deliveryInfo: React.PropTypes.object,
    chooseResult: React.PropTypes.func,
    transCode: React.PropTypes.string,
    vol: React.PropTypes.number,
    weight: React.PropTypes.number,
    taskInfo: React.PropTypes.object,
    time: React.PropTypes.string,
    transOrderStatsu: React.PropTypes.string,
    router: React.PropTypes.object,
    navigator: React.PropTypes.object,
    goodsInfoList: React.PropTypes.array,
    addressMapSelect: React.PropTypes.func,
};

