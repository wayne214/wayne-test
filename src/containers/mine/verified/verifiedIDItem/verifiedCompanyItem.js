import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native';

import Line from './verifiedLineItem';

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
    },
    titleStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        fontSize: 15,
        color: '#666666',
        flex: 2,
    },
    touchStyle:{
        flex: 3,
    },
    textInputStyle:{
        ...Platform.select({
            ios: {
                marginTop: 15,
                marginBottom: 15,
            }
        }),
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
        flex: 2,
        textAlign: 'right',
    }
});

class verifiedCompanyItem extends Component{
    constructor(props) {
        super(props);

        this.state={
            companyName: this.props.companyName,
            companyOwnerName: this.props.companyOwnerName,
            companyAddress: this.props.companyAddress,
            companyCode: this.props.companyCode,
        };

        this.companyNameValueChange = this.companyNameValueChange.bind(this);
        this.companyOwnerNameValueChange = this.companyOwnerNameValueChange.bind(this);
        this.textOnFocus = this.textOnFocus.bind(this);
        this.companyAddressValueChange = this.companyAddressValueChange.bind(this);
        this.companyCodeValueChange = this.companyCodeValueChange.bind(this);
    }


    /*输入公司名称*/
    companyNameValueChange(text){
        this.props.companyNameChange(text);
    }
    /*输入企业法人姓名*/
    companyOwnerNameValueChange(text){
        this.props.companyOwnerNameChange(text);
    }
    /*输入企业公司地址*/
    companyAddressValueChange(text){
        this.props.companyAddressValueChange(text);
    }
    /*统一社会信用代码*/
    companyCodeValueChange(text){
        this.props.companyAddressValueChange(text);
    }
    /*获得焦点*/
    textOnFocus(y){
        this.props.textOnFocus(y);
    }

    render() {

        return (
            <View style={styles.container}>

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        公司名称
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               maxLength={15}
                               underlineColorAndroid={'transparent'}
                               onChangeText={(text) => {
                                   this.setState({
                                       companyName: text,
                                   });
                                   this.companyNameValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus(200);
                               }}
                               value={this.state.companyName}
                               placeholder={'请输入公司名称'}

                    />
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        法人姓名
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               maxLength={18}
                               underlineColorAndroid={'transparent'}
                               onChangeText={(text) => {
                                    this.setState({
                                        companyOwnerName: text,
                                    });
                                    this.companyOwnerNameValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus(210);
                               }}
                               value={this.state.companyOwnerName}
                               placeholder={'请输入法人姓名'}

                    />

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        公司地址
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               maxLength={18}
                               underlineColorAndroid={'transparent'}
                               onChangeText={(text) => {
                                    this.setState({
                                        companyAddress: text,
                                    });
                                    this.companyAddressValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus(220);
                               }}
                               value={this.state.companyAddress}
                               placeholder={'请输入公司地址'}

                    />

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        统一社会信用代码
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               maxLength={18}
                               underlineColorAndroid={'transparent'}
                               onChangeText={(text) => {
                                    this.setState({
                                        companyCode: text,
                                    });
                                    this.companyCodeValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus(230);
                               }}
                               value={this.state.companyCode}
                               placeholder={'请输入信用代码'}

                    />

                </View>
                <Line />
            </View>
        )
    }
}

export default verifiedCompanyItem;
