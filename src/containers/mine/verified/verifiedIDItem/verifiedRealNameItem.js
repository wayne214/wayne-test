import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import Line from './verifiedLineItem';
import ImagesItem from './verifiedImagesItem';

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
        flex: 2,
        textAlign: 'right',
    }
});

class verifiedRealNameItem extends Component{
    constructor(props) {
        super(props);

        this.nameValueChange = this.nameValueChange.bind(this);
        this.cardValueChange = this.cardValueChange.bind(this);
        this.imageClick = this.imageClick.bind(this);
    }

    componentDidMount() {
    }

    /*输入姓名*/
    nameValueChange(text){
        this.props.nameChange(text);
    }
    /*输入身份证号*/
    cardValueChange(text){
        this.props.cardChange(text);
    }

    imageClick(index){
        this.props.imageClick(index);
    }
    render() {
        const {resultInfo} = this.props;
        console.log('resultInfo:=',this.props.resultInfo);

        return (
            <View style={styles.container}>

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        真实姓名
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.idCardName}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        身份证号
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.idCard}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>

                        有效期至
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.idCardValidity}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        图片列表
                    </Text>
                </View>
                <Line />

                <ImagesItem firstName ="身份证正面"
                            secondName="身份证反面"
                            thirdName="半身照"
                            firstImagePath={resultInfo.idFaceSideThumbnailAddress ?
                            resultInfo.idFaceSideThumbnailAddress : resultInfo.positiveCard ?
                            resultInfo.positiveCard : ''}
                            secondImagePath={resultInfo.idBackSideThumbnailAddress ?
                            resultInfo.idBackSideThumbnailAddress : resultInfo.oppositeCard ?
                            resultInfo.oppositeCard : ''}
                            thirdImagePath={resultInfo.handleIdThumbnailAddress ?
                            resultInfo.handleIdThumbnailAddress : resultInfo.headPortrait ?
                            resultInfo.headPortrait : ''}
                            imageClick={(index)=>{
                                this.imageClick(index);
                            }}

                />
            </View>
        )
    }
}

export default verifiedRealNameItem;
