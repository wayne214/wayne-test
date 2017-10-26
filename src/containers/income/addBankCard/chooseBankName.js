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


export default class ChooseBankName extends Component {


    constructor(props) {
        super(props);
        this.state = {
            NumberArr: BankCode.searchCode()
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
                    NumberArr: NumberArr,
                });
                return;
            } else {
                for (var i = 0; i < NumberArr.length; i++) {
                    debugger
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
        alert(item.bankName + item.bankCode);
    }

    //列表的每一行
    renderItemView({item, index}) {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    height: 60,
                    backgroundColor: 'orange',
                }}
                onPress={() => {
                    this.cityClicked(item)
                }}
            >
                <View style={{
                    backgroundColor: 'skyblue',
                    height: 59,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>{item.bankName}</Text>
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
        console.log('params', params)

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'选择银行'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                    backIconClick={() => {
                        // if (this.props.navigation.state.params.selectedCityCallback) {
                        //     this.props.navigation.state.params.selectedCityCallback(this.state.selectedCitys);
                        // }
                        navigator.goBack();
                    }
                    }
                    rightButtonConfig={{
                        type: 'string',
                        title: '确定',
                        onClick: () => {
                            // Storage.save('cityArray', this.state.selectedCitys);
                            if (this.props.navigation.state.params.selectedCityCallback) {
                                this.props.navigation.state.params.selectedCityCallback(this.state.selectedCitys);
                            }
                            navigator.goBack();
                        },
                    }}
                />
                <TextInput style={{height: 50, borderColor: 'red', borderWidth: 1}}
                           underlineColorAndroid="transparent"
                           maxLength={20}
                           placeholder={'输入城市名查询'}
                           onChangeText={this.onChanegeTextKeyword.bind(this)}>

                </TextInput>
                <FlatList style={{backgroundColor: 'white', flex: 1}}
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
    },
});
