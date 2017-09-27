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
    touchStyle:{
        flex: 2,
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

class verifiedTravelInfoItem extends Component{
    constructor(props) {
        super(props);

        this.state={
            carNumber: this.props.carNumber,
            owner: this.props.carOwner,
            engineNumber: this.props.carEngineNumber,
        };

        this.carNumberValueChange = this.carNumberValueChange.bind(this);
        this.ownValueChange = this.ownValueChange.bind(this);
        this.clickCarType = this.clickCarType.bind(this);
        this.clickCarLength = this.clickCarLength.bind(this);
        this.textOnFocus = this.textOnFocus.bind(this);

    }

    /*输入车牌号*/
    carNumberValueChange(text){
        this.props.carNumberChange(text);
    }

    /*输入所有人*/
    ownValueChange(text){
        this.props.carOwnerChange(text);
    }

    /*选择车辆类型*/
    clickCarType(){
        this.props.carTypeClick();
    }

    /*选择车长*/
    clickCarLength(){
        this.props.carLengthClick();
    }

    /*输入发动机编号*/
    codeValueChange(text){
        this.props.carEngineNumberChange(text);
    }

    /*获得焦点*/
    textOnFocus(value){
        this.props.textOnFocus(value);
    }
    render() {

        const {carType, carWeight, carLength} = this.props;

        return (
            <View style={styles.container}>

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车牌号
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               maxLength={7}
                               onChangeText={(text) => {
                                   this.setState({
                                       carNumber: text,
                                   });
                                   this.carNumberValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus(300);
                               }}
                               value={this.state.carNumber}
                               placeholder={'请手动输入车牌号'}
                               underlineColorAndroid={'transparent'}

                    />
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        所有人
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               onChangeText={(text) => {
                                    this.setState({
                                        owner: text,
                                    });
                                    this.ownValueChange(text);

                               }}
                               onFocus={()=>{
                                   this.textOnFocus(300);
                               }}
                               value={this.state.owner}
                               placeholder={'请手动输入所有人'}
                               underlineColorAndroid={'transparent'}

                    />
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车辆类型
                    </Text>
                    <TouchableOpacity style={styles.touchStyle}
                                      onPress={()=>{
                                          this.clickCarType();
                                      }}>
                        <TextInput style={styles.textInputStyle}
                                   editable={false}
                                   placeholder={'请手动选择车辆类型'}
                                   value={carType}
                                   underlineColorAndroid={'transparent'}

                        />

                    </TouchableOpacity>
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车长
                    </Text>
                    <TouchableOpacity style={styles.touchStyle}
                                      onPress={()=>{
                                          this.clickCarLength();
                                      }}>

                        <TextInput style={styles.textInputStyle}
                                   editable={false}
                                   placeholder={'请手动选择车辆长度'}
                                   value={carLength}
                                   underlineColorAndroid={'transparent'}

                        />
                    </TouchableOpacity>
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        载重
                    </Text>
                    <TouchableOpacity style={styles.touchStyle}
                                      onPress={()=>{
                                      }}>

                        <TextInput style={styles.textInputStyle}
                                   editable={false}
                                   underlineColorAndroid={'transparent'}
                                   placeholder={'请手动选择车辆长度'}
                                   value={carWeight ? carWeight + '吨' : ''}
                        />
                    </TouchableOpacity>
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        发动机号码
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               onChangeText={(text) => {
                                    this.setState({
                                        engineNumber: text,
                                    });
                                    this.codeValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus(450);
                               }}
                               underlineColorAndroid={'transparent'}
                               value={this.state.engineNumber}
                               placeholder={'请手动输入发动机编号'}
                    />
                </View>
            </View>
        )
    }
}

export default verifiedTravelInfoItem;
