/**
 * 添加车辆
 * by：wl
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView,
    Dimensions,
    TextInput,
    FlatList,
    TouchableOpacity,
    Platform
} from 'react-native';
import BaseContainer from '../../base/baseContainer';
import NavigatorBar from '../../../common/navigationBar/navigationBar';
import BankCode from '../../../utils/ZJBankCode'
import * as ConstValue from '../../../constants/constValue';

const {height, width} = Dimensions.get('window');
const NumberArr = BankCode.searchCode();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    icon: {
        height: 22,
        width: 22,
        resizeMode: 'contain'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    textInputStyle: {
        flex: 1,
        marginLeft: 5,
        fontSize: 16,
        color: '#666666',
        ...Platform.select({
            ios: {},
            android: {
                padding: 0,
            },
        }),
    },
});

class AddCarDriver extends BaseContainer {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.onChanegeTextKeyword.bind(this)
        this.state = {
            // NumberArr: params.branchList,
            // branchList:params.branchList,
            NumberArr: '',
            branchList: '',
            text:'',
        }
    }

    //改变搜索的文本
    onChanegeTextKeyword(text) {
        this.timeA(text);
    }

    //利用防抖方式防止数据过大造成卡顿现象
    timeA(text) {
        if (this.time) {
            clearTimeout(this.time)
        }

        this.time = setTimeout(() => {
            if (text === '') {
                this.setState({
                    branchList: this.state.NumberArr,
                });
                return;
            } else {
                this.setState({
                    branchList: [],
                });
                for (var i = 0; i < this.state.NumberArr.length; i++) {
                    if (this.state.NumberArr[i].branchBank.indexOf(text) > -1) {
                        this.setState({
                            branchList: this.state.branchList.concat(this.state.NumberArr[i]),
                        });
                        // return;
                    } else {

                    }
                }
            }
        }, 500);

    }

    //点击城市cell
    cityClicked(item) {
        // alert(item.branchBank + item.branchBankCode);
        if (this.props.navigation.state.params.BranchBankNameCallback) {
            this.props.navigation.state.params.BranchBankNameCallback(item.branchBank);
            this.props.navigation.state.params.BranchBankCodeCallback(item.branchBankCode);
        }
        this.props.navigation.goBack();
    }

    //列表的每一行
    renderItemView({item, index}) {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    backgroundColor: '#E8E8E8',
                    marginLeft: 10,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#E8E8E8'
                }}
                onPress={() => {
                    this.cityClicked(item)
                }}
            >
                <View style={{
                    backgroundColor: '#ffffff',
                    height: 40,
                    justifyContent: 'center',
                    flex: 1,
                }}>
                    <Text
                        style={{color: '#999999', fontSize: 15}}
                    >{item.branchBank}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    //去除警告
    extraUniqueKey(item, index) {
        return index + item;
    }


    render() {
        const navigator = this.props.navigation;
        const {params} = this.props.navigation.state;
        const {text} = this.state;
        console.log('params', params)

        return (
            <View style={styles.container}>

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: ConstValue.StatusBar_Height,
                        marginBottom: 7,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#F4F4F4',
                        marginLeft: 10,
                        flex: 1,
                        height: 30,
                        alignItems: 'center',
                    }}>
                        <Text
                            style={{
                                marginLeft: 10,
                                fontFamily: 'iconfont',
                                fontSize: 16,
                                color: '#999999'
                            }}>&#xe619;
                        </Text>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            maxLength={20}
                            value={text}
                            placeholder={'车牌号/姓名'}
                            onChangeText={(text)=>{
                                this.setState({
                                    text:text
                                })
                                this.onChanegeTextKeyword(text)
                            }}>
                        </TextInput>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                text:''
                            })
                        }}>
                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontFamily: 'iconfont',
                                    fontSize: 16,
                                    marginRight: 10,
                                    color: '#CCCCCC'
                                }}>&#xe66a;
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity onPress={() => {
                        navigator.goBack();
                    }}>
                        <Text
                            style={{color: '#0071FF', fontSize: 16, width: 49, textAlign: 'center'}}
                        >取消
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={{color:'#666666',fontsize:15, margin:10}} >添加车辆</Text>
                {this.state.branchList ?
                    <FlatList
                        style={{backgroundColor: 'white', flex: 1}}
                        data={this.state.branchList}
                        renderItem={this.renderItemView.bind(this)}
                        keyExtractor={this.extraUniqueKey}//去除警告
                    >

                    </FlatList>
                    :
                    <Text style={{marginTop:height/2 -70, marginLeft:width/2-80,color:'#999999',fontSize:16}}>请输入您要添加的车牌</Text>
                }

            </View>

        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCarDriver);


