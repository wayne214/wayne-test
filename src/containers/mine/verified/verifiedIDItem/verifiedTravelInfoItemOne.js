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
        flex: 2,
        textAlign: 'right',
    }
});

class verifiedTravelInfoItemOne extends Component{
    constructor(props) {
        super(props);


        this.state={
            carNumber: this.props.carNumber,
            owner: this.props.carOwner,
            engineNumber: this.props.carEngineNumber,
        };

        this.carNumberValueChange = this.carNumberValueChange.bind(this);
        this.ownValueChange = this.ownValueChange.bind(this);
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

    /*输入发动机编号*/
    codeValueChange(text){
        this.props.carEngineNumberChange(text);
    }

    /*获得焦点*/
    textOnFocus(value){
        this.props.textOnFocus(value);
    }
    render() {

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
                                   this.textOnFocus(900);
                               }}
                               value={this.state.carNumber}
                               placeholder={'请输入车牌号'}
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
                                   this.textOnFocus(920);
                               }}
                               value={this.state.owner}
                               placeholder={'请输入所有人'}
                               underlineColorAndroid={'transparent'}

                    />
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
                                   this.textOnFocus(940);
                               }}
                               underlineColorAndroid={'transparent'}
                               value={this.state.engineNumber}
                               placeholder={'请输入发动机编号'}
                    />
                </View>
            </View>
        )
    }
}

export default verifiedTravelInfoItemOne;
