/**
 * 企业车主认证--营业执照
 * */

import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';

import Line from '../../verifiedIDItem/verifiedLineItem';
// import ImagesItem from '../../verifiedIDItem/verifiedImagesItem';
import * as StaticColor from '../../../../../constants/staticColor';
import {CachedImage} from "react-native-img-cache";
import NoImage from '../../../../../../assets/person/noiamgeShow.png';
// const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
    },
    titleStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        fontSize: 15,
        color: StaticColor.GRAY_TEXT_COLOR,
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
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        flex: 1,
        textAlign: 'right',
    },
    imgArea: {
        paddingTop: 10,
        paddingLeft: 10,
        backgroundColor: 'white',
        marginBottom: 15,
    },
    imgAreaSubContainer: {
        borderColor: '#cccccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100 * 267 / 188,
        height: 100,
        padding: 5,
    },
    imgStyle: {
        width: 90 * 267 / 188,
        height: 90,
        borderWidth: 1,
        borderColor: '#f5f5f5',
    },
});

class verifiedBusinessLicenseItem extends Component{
    constructor(props) {
        super(props);

        this.imageClick = this.imageClick.bind(this);
    }

    imageClick(index){
        this.props.imageClick(index);
    }
    render() {
        const {resultInfo} = this.props;
        const businessLicenceImagePath = resultInfo.businessLicenceThumbnail;
        let firstImageObj;
        if (businessLicenceImagePath){
            firstImageObj = {uri: businessLicenceImagePath}
        }else
            firstImageObj = NoImage;
        return (
            <View style={styles.container}>
                <Text style={[styles.titleStyle, {color: StaticColor.LIGHT_BLACK_TEXT_COLOR}]}>
                    营业执照
                </Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        公司名称
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast ? resultInfo.rmcAnalysisAndContrast.manualComName : ''}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        法人名称
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast ? resultInfo.rmcAnalysisAndContrast.manualPerson : ''}
                    </Text>

                </View>
                <Line />

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>

                        公司地址
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast ? resultInfo.rmcAnalysisAndContrast.manualComAddress : ''}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>

                        统一社会信用代码
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast ? resultInfo.rmcAnalysisAndContrast.manualUnifiedSocialCreditCode : ''}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>

                        有效期至
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast ? resultInfo.rmcAnalysisAndContrast.manualBusinessValidity.replace(/-/g,'/') : ''}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        营业执照
                    </Text>
                </View>
                <Line />
                <View style={styles.imgArea}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        this.imageClick(0)
                    }}
                       style={styles.imgAreaSubContainer}
                    >

                        <CachedImage
                            style={styles.imgStyle}
                            resizeMode="cover"
                            source={firstImageObj}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default verifiedBusinessLicenseItem;
