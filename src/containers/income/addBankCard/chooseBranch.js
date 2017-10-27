/**
 * Created by wangl on 2017/10/25.
 */

import React, {Component, PropTypes} from 'react';
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
    TouchableOpacity
} from 'react-native';
import BankCode from '../../../utils/ZJBankCode'
import NavigationBar from '../../../common/navigationBar/navigationBar';

const {height, width} = Dimensions.get('window');
const NumberArr = BankCode.searchCode();


export default class ChooseBranch extends Component {


    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.onChanegeTextKeyword.bind(this)
        this.state = {
            // NumberArr: BankCode.searchCode(),
            NumberArr: params.branchList,
            branchList:params.branchList,
            text:'',
        }
        console.log('params.branchList=',params.branchList)
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
                    NumberArr: NumberArr,
                });
                return;
            } else {
                for (var i = 0; i < NumberArr.length; i++) {
                    if (NumberArr[i].bankName.indexOf(text) > -1) {
                        this.setState({
                            NumberArr: [NumberArr[i]],
                        });
                        return;
                    } else {
                        this.setState({
                            NumberArr: [],
                        });
                    }
                }
            }
        }, 500);

    }

    //点击城市cell
    cityClicked(item) {
        alert(item.branchBank + item.branchBankCode);
        if (this.props.navigation.state.params.BranchBankCodeCallback) {
            this.props.navigation.state.params.BranchBankCodeCallback(item.branchBank);
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
                        marginTop: 7,
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
                            style={{flex: 1, marginLeft: 5, fontSize: 16, color: '#666666'}}
                            underlineColorAndroid="transparent"
                            maxLength={20}
                            value={text}
                            placeholder={'输入城市名查询'}
                            onChangeText={(text)=>{
                                this.setState({
                                    text:text
                                })
                                this.onChanegeTextKeyword(text)
                            }}>
                        </TextInput>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                branch:''
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
                <FlatList
                    style={{backgroundColor: 'white', flex: 1}}
                    data={this.state.NumberArr}
                    renderItem={this.renderItemView.bind(this)}
                    keyExtractor={this.extraUniqueKey}//去除警告
                >

                </FlatList>
            </View>

        );
    }
};

const styles = StyleSheet.create({
    icon: {
        height: 22,
        width: 22,
        resizeMode: 'contain'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        marginTop: 20,
    },
});
