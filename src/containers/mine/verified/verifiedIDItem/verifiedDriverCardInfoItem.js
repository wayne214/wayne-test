import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';

import Line from './verifiedLineItem';

import {CachedImage} from "react-native-img-cache";

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
        marginTop: 15,
        marginBottom: 15,
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
        flex: 1,
        textAlign: 'right',
    },
    imageStyle: {
        width: 160,
        height: 160,
        borderWidth: 1,
        borderColor: '#f5f5f5',
        marginTop: 15,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    textStyle: {
        textAlign: 'center',
        marginTop:10,
        marginBottom: 10,
    },

});

class verifiedDriverCardInfoItem extends Component{
    constructor(props) {
        super(props);

        this.state={
            IDName: this.props.IDName,
            IDCard: this.props.IDCard,
        };

        this.nameValueChange = this.nameValueChange.bind(this);
        this.cardValueChange = this.cardValueChange.bind(this);
        this.imageClick = this.imageClick.bind(this);
    }

    /*输入姓名*/
    nameValueChange(text){
        this.props.nameChange(text);
    }
    /*输入身份证号*/
    cardValueChange(text){
        this.props.cardChange(text);
    }

    imageClick(){
        this.props.imageClick();
    }
    render() {

        const {resultInfo} = this.props;

        let firstImageObj;
        if (resultInfo.insuranceThumbnail){
            firstImageObj = {uri: resultInfo.insuranceThumbnail}
        }else if (resultInfo.insurancePic){
            firstImageObj = {uri: resultInfo.insurancePic}
        }else
            firstImageObj = require('../images/VNoImage.png');

        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>

                        有效期至
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.insuranceDate ? resultInfo.insuranceDate.toString().replace(/-/g,'/') : ''}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        图片列表
                    </Text>
                </View>
                <Line />

                <TouchableOpacity onPress={()=>{
                        this.imageClick();
                    }}>
                    <CachedImage style={styles.imageStyle} source={firstImageObj}/>

                    <Text style={styles.textStyle}>交强险</Text>

                </TouchableOpacity>

            </View>
        )
    }
}

export default verifiedDriverCardInfoItem;
