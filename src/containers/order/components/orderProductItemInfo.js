/**
 * Created by mymac on 2017/4/6.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput,
    Platform,
} from 'react-native';
import StaticImage from '../../../constants/staticImage';
import computationUtil from '../../../utils/computationUtil';
import {
    LIGHT_BLACK_TEXT_COLOR,
    COLOR_VIEW_BACKGROUND,
    LIGHT_GRAY_TEXT_COLOR,
    COLOR_LIGHT_GRAY_TEXT,
    GRAY_TEXT_COLOR,
} from '../../../constants/staticColor';

const screenWidth = Dimensions.get('window').width;
const style = StyleSheet.create({

    // 分隔线
    SeparationStyle: {
        backgroundColor: LIGHT_GRAY_TEXT_COLOR,
        height: 0.5,
        marginLeft: 10,
    },
    // 名称style
    titleStyle: {
        fontSize: 15,
        color: COLOR_LIGHT_GRAY_TEXT,
        marginTop: 15,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    // 名称style
    subTitleStyle: {
        fontSize: 15,
        color: GRAY_TEXT_COLOR,
    },
    chooseNumStyle: {
        height: 33,
        flexDirection: 'row', // 确保水平布局
        alignItems: 'center',
    },
    sub: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    subViewStyle: {
        flexDirection: 'row', // 确保水平布局
        justifyContent: 'space-between', // 确保水平布局间距一样
        marginBottom: 5,
        marginTop: 7,
    },
});


export default class orderProductItemInfo extends Component {
    static defaultProps = {
        disabled: false,
        edit: true,
    };
    constructor(props) {
        super(props);
        this.state = {
            isCanSelect: false,
            text: this.props.receiveNum,
            length: this.props.receiveNum.length,
        };

        this.checkLast = this.checkLast.bind(this);
        this.checkPrice = this.checkPrice.bind(this);
    }

    // 加
    add() {
        let number = this.state.text;
        number = computationUtil.accAdd(number,1);
        //number++;
        if (number > Number(this.props.receiveNum)) {
            return;
        }
        this.setState({
            text: number.toString(),
            isCanSelect: true,
        });
        this.outNumber(number);
    }

    // 减
    subtract() {
        if (!this.state.text){
            return;
        }
        let number = parseFloat(this.state.text);
        if (number <= 1) {
            return;
        }
        number = computationUtil.accSub(number,1);
        //number--;
        this.setState({
            text: number.toString(),
        });
        if (number === 1) {
            // 改变减号图片
            this.setState({
                isCanSelect: false,
            });
        }
        this.outNumber(number);
    }

    checkPrice(obj) { //方法1
        obj = obj.replace(/[^\d.]/g, "");
        //必须保证第一位为数字而不是.
        obj = obj.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        obj = obj.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上
        obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        return obj;
    }
    checkLast(obj) {
        // 如果出现非法字符就截取掉
        if (obj.substr((obj.length - 1), 1) == '.')
            obj = obj.substr(0, (obj.length - 1));
    }

    // 子组件向父组件传值
    outNumber(number) {
        this.props.receiveAllNum(this.props.componentID, number, this.props.indexRow);
    }

    // 选择number的组件
    chooseNumView() {
        return (
            <View style={{flexDirection: 'row', marginBottom: 10, alignItems:'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15, color: GRAY_TEXT_COLOR}}>发运</Text>
                <View style={style.chooseNumStyle}>
                    <TouchableOpacity
                        disabled={this.props.disabled}
                        style={style.sub}
                        onPress={() => {
                            this.subtract();
                        }}
                    >
                        <Image source={this.state.text == 1 ? StaticImage.receiveDeleteUnselect : StaticImage.receiveDelete} />
                    </TouchableOpacity>
                    <TextInput
                        editable={this.props.edit}
                        style={{
                            width: 58,
                            ...Platform.select({
                                android: {
                                    lineHeight: 20,
                                    paddingBottom: 6,
                                    paddingLeft: (6 - this.state.length) / 2 * 10,
                                },
                                ios: {
                                    textAlign: 'center',
                                },
                            }),
                            fontSize: 15,
                            color: LIGHT_BLACK_TEXT_COLOR,
                        }}
                        underlineColorAndroid={'transparent'}
                        value={this.state.text}
                        onFocus={()=>{
                            if(this.props.edit){
                                this.props.itemFocus();
                            }
                        }}
                        onBlur={()=>{
                            if(this.props.edit) {
                                this.props.itemBlur();
                            }
                        }}
                        onChangeText={(value) =>{
                            value = this.checkPrice(value);
                            // debugger
                            parseFloat(value) < 0 ? this.setState({
                                text: '1',
                                length: 1
                            }) : this.setState({
                                text: value,
                                length: value.length
                            });
                            parseFloat(value) > parseFloat(this.props.receiveNum) ?
                                this.setState({
                                text: this.props.receiveNum,
                                length: this.props.receiveNum.length
                            }) : this.setState({
                                text: value,
                                length: value.length
                            });
                            if(value.endsWith('.')){
                                value = value.replace('.','');
                            }
                            if(parseFloat(value) > parseFloat(this.props.receiveNum)){
                                value = this.props.receiveNum;
                            }
                            this.outNumber(value);
                        }}
                        onEndEditing={(value) => {
                            if (value === 0 || value.length === 0) {
                                alert('发运数量不能为0');
                            }
                        }}
                        keyboardType='numeric'
                    >
                    </TextInput>
                    <TouchableOpacity
                        disabled={this.props.disabled}
                        style={style.sub}
                        onPress={() => {
                            this.add();
                        }}
                    >
                        <Image source={this.state.text == this.props.receiveNum ? StaticImage.receiveAddUnselect : StaticImage.receiveAdd} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // 子组件
    subComponent(title, Specifications, unit, receiveNum) {
        return (
            <View style={{marginHorizontal: 20}}>
                <View style={style.subViewStyle}>
                    <Text style={style.subTitleStyle}>名称</Text>
                    <Text style={{fontSize: 15, color: LIGHT_BLACK_TEXT_COLOR, marginLeft: 20}}>{title}</Text>
                </View>
                <View style={style.subViewStyle}>
                    <Text style={style.subTitleStyle}>规格</Text>
                    <Text style={{fontSize: 15, color: LIGHT_BLACK_TEXT_COLOR, marginLeft: 20}}>{Specifications}</Text>
                </View>
                <View style={style.subViewStyle}>
                    <Text style={style.subTitleStyle}>应收</Text>
                    <Text style={{fontSize: 15, color: LIGHT_BLACK_TEXT_COLOR, marginLeft: 20}}>{receiveNum}{unit}</Text>

                </View>
                {this.chooseNumView()}
            </View>
        );
    }

    render() {
        const {componentID, indexRow, title, Specifications, unit, receiveNum, disabled} = this.props;
        return (
            <View style={{backgroundColor: 'white'}}>
                {this.subComponent(title, Specifications, unit, receiveNum)}
            </View>
        );
    }
}
orderProductItemInfo.propTypes = {
    receiveNum: React.PropTypes.string,
    receiveAllNum: React.PropTypes.func,
    itemFocus: React.PropTypes.func,
    itemBlur: React.PropTypes.func,
    componentID: React.PropTypes.string,
    indexRow: React.PropTypes.number,
    title: React.PropTypes.string,
    Specifications: React.PropTypes.string,
    unit: React.PropTypes.string,
    disabled: React.PropTypes.bool,
};
