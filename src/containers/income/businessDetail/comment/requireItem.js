/**
 * Created by mymac on 2017/8/21.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
} from 'react-native';

import StaticImages from '../../../../constants/staticImage';

const styles = StyleSheet.create({

    viewStyle:{
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#DCDDDC',
        borderRadius: 15,
        height: 30,
        marginLeft: 8,
        marginRight: 0,
        marginTop: 11,
        justifyContent: 'space-between',
    }
});

class requireItem extends Component{

    constructor(props){
        super(props);
        this.delete = this.delete.bind(this);
    }

    delete(){
        this.props.onDeleteAction(this.props.index);
    }

    render() {
        const {title, index} = this.props;

        return (

            <View style={[styles.viewStyle]}>
                <Text style={{lineHeight: 24, marginLeft: 10, marginRight: 5, fontSize: 12}}>
                    {title}
                </Text>
                <TouchableOpacity onPress={()=>{
                    this.delete();
                }}>
                    <Image style={{margin:7, marginLeft: 2}} source={StaticImages.bussniessDeteleImg}/>
                </TouchableOpacity>
            </View>

        )
    }
}

export default requireItem;
