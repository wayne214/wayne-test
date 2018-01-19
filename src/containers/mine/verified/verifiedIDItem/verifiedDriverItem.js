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
        flex: 1,
        textAlign: 'right',
    }
});

class verifiedDriverItem extends Component{
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

    imageClick(index){
        this.props.imageClick(index);
    }
    render() {
        const {resultInfo} = this.props;

        return (
            <View style={styles.container}>

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        姓名
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.drivingLicenceName}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        证号
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.driverCard}
                    </Text>

                </View>
                <Line />

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>

                        准驾车型
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.quasiCarType}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>

                        有效期至
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.driverCardExpiry ? resultInfo.driverCardExpiry.toString().replace(/-/g,'/') : ''}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        图片列表
                    </Text>
                </View>
                <Line />

                <ImagesItem firstName ="驾驶证主页"
                            secondName="驾驶证副页"
                            firstImagePath={resultInfo.drivingLicenseHomepageThumbnailAddress ?
                            resultInfo.drivingLicenseHomepageThumbnailAddress : resultInfo.drivingLicenceHomePage ?
                            resultInfo.drivingLicenceHomePage : ''}
                            secondImagePath={resultInfo.drivingLicenseVicePageThumbnailAddress ?
                            resultInfo.drivingLicenseVicePageThumbnailAddress : resultInfo.drivingLicenceSubPage ?
                            resultInfo.drivingLicenceSubPage : ''}
                            imageClick={(index)=>{
                                this.imageClick(index);
                            }}/>
            </View>
        )
    }
}

export default verifiedDriverItem;
