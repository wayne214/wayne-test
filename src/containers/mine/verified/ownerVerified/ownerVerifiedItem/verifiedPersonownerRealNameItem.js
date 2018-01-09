import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import Line from './../../verifiedIDItem/verifiedLineItem';
import ImagesItem from './../../verifiedIDItem/verifiedImagesItem';

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

        this.imageClick = this.imageClick.bind(this);
    }

    componentDidMount() {
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
                        姓名
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast ? resultInfo.rmcAnalysisAndContrast.manualIdCardName : ''}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        身份证号
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast ? resultInfo.rmcAnalysisAndContrast.manualIdCard : '' }
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>

                        有效期至
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast? resultInfo.rmcAnalysisAndContrast.manualIdCardValidity.replace(/-/g,'/') : ''}
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
                            // thirdName="半身照"
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
