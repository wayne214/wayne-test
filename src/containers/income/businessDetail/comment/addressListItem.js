/**
 * Created by mymac on 2017/8/21.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
} from 'react-native';

import StaticImages from '../../../../constants/staticImage';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
    },
});

class addressListItem extends Component{

    render() {

        const {cities} = this.props;
        const lines = cities.map((item, i)=>{

            const space = item.length === 2 ? 10 :
                              item.length === 3 ? 9 :
                                  item.length === 4 ? 8 :
                                      item.length === 5 ? 7.5 : 6.5;

            const fontSize = item.length === 2 ? {fontSize: 15} :
                item.length === 3 ? {fontSize: 15} :
                    item.length === 4 ? {fontSize: 14} :
                        item.length === 5 ? {fontSize: 13} : {fontSize: 12};

            if (i === 0){
                // 绿色图片
                return(
                    <View key={i}>
                        <View style={{flexDirection: 'row'}}>
                            <Image source={StaticImages.bussniessGreenImg}/>
                            <Image source={StaticImages.bussniessLineImg} style={{marginLeft: 10, marginRight: 10, marginTop: 2}}/>
                        </View>
                        <Text style={[{marginTop:5, marginLeft: (item.length - 1) * (-space)}, fontSize]}>{item}</Text>
                    </View>
                )
            }
            if (i === cities.length-1){
                // 红色图片
                return(
                    <View key={i}>
                        <View style={{flexDirection: 'row'}}>
                            <Image source={StaticImages.bussniessRedImg}/>
                        </View>
                        <Text style={[{marginTop:5, marginLeft: (item.length - 1) * (-space)}, fontSize]}>{item}</Text>
                    </View>
                )
            }
            // 灰色图片
            return(
                <View key={i}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={StaticImages.bussniessGrayImg}/>
                        <Image source={StaticImages.bussniessLineImg} style={{marginLeft: 10, marginRight: 10, marginTop: 2}}/>
                    </View>
                    <Text style={[{marginTop:5, marginLeft: (item.length - 1) * (-space)}, fontSize]}>{item}</Text>
                </View>

            )


        });

        return (
            <View style={styles.container}>

                <View style={{flexDirection: 'row', marginLeft: 25, marginTop: 17}}>
                    {lines}
                </View>


                <View
                    style={{marginLeft: 10, marginTop: 15, height: 1, backgroundColor: '#F5F5F5'}}
                />
            </View>
        )
    }
}

export default addressListItem;
