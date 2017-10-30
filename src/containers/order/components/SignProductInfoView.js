/**
 * Created by mymac on 2017/4/7.
 */


import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';

import ChooseComponent from './SignChooseView';
import GoodInfoCell from '../../../common/source/goodInfoCell';

import {
    WHITE_COLOR,
    LIGHT_GRAY_TEXT_COLOR,
    LIGHT_BLACK_TEXT_COLOR,
    COLOR_LIGHT_GRAY_TEXT,
} from '../../../constants/staticColor';

const style = StyleSheet.create({
    // 分隔线
    SeparationStyle: {
        backgroundColor: LIGHT_GRAY_TEXT_COLOR,
        height: 0.5,
        marginLeft: 20,
    },
    // 分类名称style
    subTitleStyle: {
        fontSize: 16,
        color: LIGHT_BLACK_TEXT_COLOR,
    },
    // 中间规格、单位、应收ViewStyle
    subViewStyle: {
        flexDirection: 'row', // 确保水平布局
        marginTop: 10,
        alignItems: 'center'
    },
    subContentStyle: {
        fontSize: 14,
        color: COLOR_LIGHT_GRAY_TEXT,
    },

});

const screenWidth = Dimensions.get('window').width;

export default class SignProductInfoView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numbers: [{
                ID: 'component1',
                num: 0,
                reason: '',
            }],
            componentNum: '2',
            isShowDropList: false,
        };
        this.deleteSubComponent = this.deleteSubComponent.bind(this);
        this.addSubComponent = this.addSubComponent.bind(this);
        this.subComponent = this.subComponent.bind(this);
        this.addNum = this.addNum.bind(this);
        this.updataStateNumbers = this.updataStateNumbers.bind(this);

        this.multilineView = this.multilineView.bind(this);
        this.singleView = this.singleView.bind(this);

    }

    multilineView(Specifications, arNums, goodsUnit, shipmentNum) {
        return (
            <View>
                <Text style={style.subTitleStyle}>规格：{Specifications}</Text>
                <View style={style.subViewStyle}>
                    <Text style={style.subTitleStyle}>应收：{arNums}{goodsUnit}</Text>
                    <Text style={style.subTitleStyle}>发运：{shipmentNum}{goodsUnit}</Text>
                    <Text style={style.subTitleStyle}/>
                </View>
            </View>
        );
    }

    singleView(Specifications, arNums, goodsUnit, shipmentNum) {

        return (
            <View style={style.subViewStyle}>
                <Text style={style.subTitleStyle}>规格：{Specifications}</Text>
                <Text style={style.subTitleStyle}>应收：{arNums}{goodsUnit}</Text>
                <Text style={style.subTitleStyle}>发运：{shipmentNum}{goodsUnit}</Text>

            </View>
        );
    }

    // 子组件
    subComponent(title, Specifications, getNum, arNums, shipmentNum, refuseNum, goodsUnit) {
        const sunViews = (Specifications.length * 10 > (screenWidth - 20 - 40) / 3) ?
            this.multilineView(Specifications, arNums, goodsUnit, shipmentNum)
            :
            this.singleView(Specifications, arNums, goodsUnit, shipmentNum);

        return (
            <View>
                <View style={{marginHorizontal: 20, marginBottom: 3}}>
                    <View style={style.subViewStyle}>
                        <Text style={style.subTitleStyle}>名称</Text>
                        <Text style={[style.subTitleStyle, {marginLeft: 20}]}>{title}</Text>
                    </View>
                    <View style={style.subViewStyle}>
                        <Text style={style.subContentStyle}>规格</Text>
                        <Text style={[style.subContentStyle, {marginLeft: 20}]}>{Specifications}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={[style.subViewStyle, {flex: 1}]}>
                            <Text style={style.subContentStyle}>应收</Text>
                            <Text style={[style.subContentStyle, {marginLeft: 20}]}>{arNums}</Text>
                            <Text style={style.subContentStyle}>{goodsUnit}</Text>
                        </View>
                        <View style={[style.subViewStyle, {flex: 1}]}>
                            <Text style={style.subContentStyle}>发运</Text>
                            <Text style={[style.subContentStyle, {marginLeft: 20}]}>{shipmentNum}</Text>
                            <Text style={style.subContentStyle}>{goodsUnit}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={[style.subViewStyle, {flex: 1}]}>
                            <Text style={style.subContentStyle}>签收</Text>
                            <Text style={[style.subContentStyle, {marginLeft: 20}]}>{getNum}</Text>
                            <Text style={style.subContentStyle}>{goodsUnit}</Text>
                        </View>
                        <View style={[style.subViewStyle, {flex: 1}]}>
                            <Text style={style.subContentStyle}>拒收</Text>
                            <Text style={[style.subContentStyle, {marginLeft: 20}]}>{refuseNum ? refuseNum : 0}</Text>
                            <Text style={style.subContentStyle}>{goodsUnit}</Text>
                        </View>
                    </View>
                </View>
            </View>

        );
    }

    // 点击+添加子组件
    addSubComponent() {
        const array = this.state.numbers;
        let number = this.state.componentNum;

        if (array.length === 3) {
            return;
        }

        const componentID = `component${number.toString()}`;

        // 添加组件，在数组中添加组件的ID，组件内部的值，改变state进而改变组件
        // array.unshift({ID: componentID, num: 0, reason: ''});
        array.push({ID: componentID, num: 0, reason: ''});

        number++;
        this.setState({
            numbers: array,
            componentNum: number,
        });
        this.componentNum++;
    }

    // 点击-删除子组件
    deleteSubComponent(componentID) {

        let array = this.state.numbers;
        // 删除组件，遍历数组，找到要删除的组件ID，删除后重新更新state，进而改变组件

        array = array.filter((item, index) => {
            return item.ID !== componentID;
        });
        this.setState({
            numbers: array,
        });


        let numbers = this.state.numbers;


        for (let i = 0; i < numbers.length; i++) {
            let obj = numbers[i];
            if (obj.ID === componentID) {
                numbers.splice(i, 1);
            }
        }

        this.props.deleteComponent(componentID, this.props.indexRow, numbers);

    }

    // 子组件点击+号操作
    addNum(ID, index, num, selectReason) {
        // 如果拒收的等于应收的，直接return
        const data = this.state.numbers;
        let refuseNumber = 0;

        // 遍历得到拒收的总数
        for (let i = 0; i < data.length; i++) {
            refuseNumber += data[i].num;
        }
        // 如果拒单的数量大于发运的数量
        if (refuseNumber >= this.props.shipmentNum) {
            return;
        }
        this.updataStateNumbers(ID, index, num, selectReason);
    }

    // 子组件点击-号操作
    subtractNum(ID, index, num, selectReason) {
        this.updataStateNumbers(ID, index, num, selectReason);
    }

    // 子组件点击选择拒收原因操作
    chooseReason(ID, index, num, selectReason) {
        this.updataStateNumbers(ID, index, num, selectReason);
    }

    updataStateNumbers(ID, index, num, selectReason) {
        // 改变数组中对应的组件ID 对应的值，更新state。改变组件内部的值

        const data = this.state.numbers;


        data[index] = {ID: ID, num: num, reason: selectReason};
        this.setState({
            numbers: data,
        });
        // 向上一级传递信息
        this.props.sendValueCallBack(this.props.productID, this.props.indexRow, this.state.numbers);
    }


    render() {
        const {productID, indexRow, title, Specifications, getNum, arNums, shipmentNum, refuseNum, goodsUnit} = this.props;

        return (
            <View style={{paddingBottom: 10,backgroundColor: WHITE_COLOR}}>
                {this.subComponent(title, Specifications, getNum, arNums, shipmentNum, refuseNum, goodsUnit)}
                {
                    this.state.numbers.map((item, index) => {
                        return (
                            <ChooseComponent
                                componentID={item.ID}
                                key={index}
                                indexRow={index}
                                maxNum={shipmentNum}
                                num={item.num}
                                refuseNum={refuseNum}
                                reason={item.reason}
                                componentType={item.ID === 'component1'}
                                addComponenet={this.addSubComponent}
                                itemSignFocus={() => {
                                    console.log('22222')
                                }}
                                itemSignBlur={() => {
                                    console.log('2222')
                                }}
                                addNumCallback={(ID, index, num, selectReason) => {
                                    this.addNum(ID, index, num, selectReason);
                                }}
                                subtractNumCallback={(ID, index, num, selectReason) => {
                                    this.subtractNum(ID, index, num, selectReason);
                                }}
                                chooseReasonCallbackFun={(ID, index, num, selectReason) => {
                                    this.chooseReason(ID, index, num, selectReason);
                                }}
                                deleteComponenet={(componentID) => {
                                    this.deleteSubComponent(componentID);
                                }}
                            />
                        );
                    })
                }
            </View>
        );
    }
}

SignProductInfoView.propTypes = {
    sendValueCallBack: React.PropTypes.func.isRequired,
    productID: React.PropTypes.string.isRequired,
    arNums: React.PropTypes.string.isRequired,
    indexRow: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired,
    Specifications: React.PropTypes.string.isRequired,
    getNum: React.PropTypes.string.isRequired,
    shipmentNum: React.PropTypes.string.isRequired,
    refuseNum: React.PropTypes.string,
};
