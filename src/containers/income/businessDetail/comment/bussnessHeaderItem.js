/**
 * Created by mymac on 2017/8/21.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Image,
} from 'react-native';
import Swiper from 'react-native-swiper';
const {width} = Dimensions.get('window');
import StaticImages from '../../../../constants/staticImage';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    wrapper: {
        height:50,
    },
});

class bussnessHeaderItem extends Component{
    constructor(props) {
        super(props);
        this.renderImg = this.renderImg.bind(this);

        this.images = [
            '重要通知：含票运费的账期从平台收到发票并核实无误后开始计算！！',
            '重要通知：不含票运费的账期从操作回单后开始计算！！',
        ];
    }
    renderImg() {
        const imageViews = [];
        for (let i = 0; i < this.images.length; i++) {
            imageViews.push(
                <Text key={i} style={{color: '#309ded', marginTop: 5, lineHeight: 22}}>
                    {this.images[i]}
                </Text>,
            );
        }
        return imageViews;
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={{height: 40, width: 40, borderRightWidth: 0.5, borderRightColor: '#999999',marginVertical: 5, marginHorizontal: 5}}>
                        <Image source={StaticImages.bussness_gg} style={{alignSelf: 'center', marginTop: 2}}/>
                        <Text style={{color: '#309ded', alignSelf: 'center', marginTop: 7}}>公告</Text>
                    </View>
                    <Swiper
                        horizontal={false}
                        height={50}
                        width={width - 50}
                        autoplay={true}
                        showsPagination={false}
                        autoplayTimeout={5}
                    >
                        {this.renderImg()}
                    </Swiper>
                </View>
                <View
                    style={{height: 1, backgroundColor: '#F5F5F5'}}
                />
            </View>
        )
    }
}

export default bussnessHeaderItem;
