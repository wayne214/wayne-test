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
        flex: 1,
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
    },
    textStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
        flex: 1,
        textAlign: 'right',
    },
    touchStyle:{
        flex: 2,
    },
    textInputStyle1:{
        marginTop: 15,
        marginBottom: 15,
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
        flex: 2,
        textAlign: 'right',
    }
});

class verifiedCarInfoItem extends Component{
    constructor(props) {
        super(props);

        this.state={
            drivingLicenseName: this.props.drivingLicenseName, // 驾驶证姓名
            drivingLicenseNum: this.props.drivingLicenseNum, // 驾驶证号
            motorcycleType: this.props.motorcycleType, // 驾驶证类型
            motorcycleNumber:'',
        };
        this.clickDatePicker = this.clickDatePicker.bind(this);
        this.nameValueChange = this.nameValueChange.bind(this);
        this.cardValueChange = this.cardValueChange.bind(this);
        this.carTypeValueChange = this.carTypeValueChange.bind(this);
        this.textOnFocus = this.textOnFocus.bind(this);

    }

    /*点击日期*/
    clickDatePicker(){
        this.props.clickDataPicker();
    }

    /*输入姓名*/
    nameValueChange(text){
        this.props.nameChange(text);
    }
    /*输入证号*/
    cardValueChange(text){
        this.props.cardChange(text);
    }
    /*输入准驾车型*/
    carTypeValueChange(text){
        this.props.carTypeChange(text);
    }
    /*获得焦点*/
    textOnFocus(){
        this.props.textOnFocus();
    }

    render() {

        const {drivingLicenseValidUntil, drivingLicenseStartDate} = this.props;
        let dataString;

        if (drivingLicenseValidUntil){
            if (drivingLicenseValidUntil.length < 4 && drivingLicenseValidUntil.indexOf('长期') < 0){
                let data = parseInt(drivingLicenseStartDate) + parseInt(drivingLicenseValidUntil) * 10000;

                dataString = data.toString().substr(0,4)+'-'+data.toString().substr(4,2)+'-'+data.toString().substr(6,2)+'';

            }else if (drivingLicenseValidUntil.length === 8){
                dataString = drivingLicenseValidUntil.toString().substr(0,4)+'-'+drivingLicenseValidUntil.toString().substr(4,2)+'-'+drivingLicenseValidUntil.toString().substr(6,2)+'';

            }else
                dataString = drivingLicenseValidUntil;


            dataString=dataString.replace('年','-');

            if (dataString.indexOf('日') > 0){
                dataString=dataString.replace('月','-');
                dataString=dataString.replace('日','');
            }else {
                dataString=dataString.replace('月','');
            }
        }


        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        姓名
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               maxLength={15}
                               underlineColorAndroid='transparent'
                               onChangeText={(text) => {
                                   this.setState({
                                       drivingLicenseName: text,
                                   });
                                   this.nameValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus();
                               }}
                               value={this.state.drivingLicenseName}
                               placeholder={'请输入驾驶证姓名'}

                    />
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        证号
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               maxLength={18}
                               underlineColorAndroid='transparent'
                               onChangeText={(text) => {
                                    this.setState({
                                        drivingLicenseNum: text,
                                    });
                                    this.cardValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus();
                               }}
                               value={this.state.drivingLicenseNum}
                               placeholder={'请输入驾驶证号'}

                    />
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        准驾车型
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               underlineColorAndroid='transparent'
                               onChangeText={(text) => {
                                    this.setState({
                                        motorcycleType: text,
                                    });
                                    this.carTypeValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus();
                               }}
                               value={this.state.motorcycleType}
                               placeholder={'请输入准驾车型'}
                    />
                </View>
                <Line/>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        有效期至
                    </Text>
                    <TouchableOpacity style={styles.touchStyle}
                                      onPress={()=>{
                                          this.clickDatePicker();
                                      }}>
                        <Text style={styles.textInputStyle1}>
                            {dataString}
                        </Text>
                    </TouchableOpacity>
                </View>



            </View>
        )
    }
}

export default verifiedCarInfoItem;
