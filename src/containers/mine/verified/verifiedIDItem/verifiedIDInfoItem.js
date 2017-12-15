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

class verifiedIDInfoItem extends Component{
    constructor(props) {
        super(props);

        this.state={
            IDName: this.props.IDName,
            IDCard: this.props.IDCard,
        };

        this.nameValueChange = this.nameValueChange.bind(this);
        this.cardValueChange = this.cardValueChange.bind(this);
        this.textOnFocus = this.textOnFocus.bind(this);
    }


    /*输入姓名*/
    nameValueChange(text){
        this.props.nameChange(text);
    }
    /*输入身份证号*/
    cardValueChange(text){
        this.props.cardChange(text);
    }

    /*获得焦点*/
    textOnFocus(){
        this.props.textOnFocus();
    }
    render() {

        return (
            <View style={styles.container}>

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        姓名
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               maxLength={15}
                               underlineColorAndroid={'transparent'}
                               onChangeText={(text) => {
                                   this.setState({
                                       IDName: text,
                                   });
                                   this.nameValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus();
                               }}
                               value={this.state.IDName}
                               placeholder={'请输入姓名'}

                    />
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        身份证号
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               maxLength={18}
                               underlineColorAndroid={'transparent'}
                               onChangeText={(text) => {
                                    this.setState({
                                        IDCard: text,
                                    });
                                    this.cardValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus();
                               }}
                               value={this.state.IDCard}
                               placeholder={'请输入身份证号'}

                    />

                </View>
                <Line />

            </View>
        )
    }
}

export default verifiedIDInfoItem;
