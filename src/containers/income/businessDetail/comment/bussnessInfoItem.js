/**
 * Created by mymac on 2017/8/21.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

class bussnessInfoItem extends Component{

    render() {
        const {rowData} = this.props;
        return (
            <View style={styles.container}>

                <View style={{marginLeft: 10}}>
                    <Text style={{marginTop: 17, color: '#666666'}}>
                        {rowData.scheduleCode}
                    </Text>
                    <Text style={{marginTop: 10, color: '#999999'}}>
                        {rowData.time}
                    </Text>
                </View>

                <View style={{alignSelf: 'center'}}>
                    <Text>

                        {rowData.scheduleStatus === 1 ? '已付款' : rowData.scheduleStatus === 2 ? '待付款' : '待核实发票'}
                    </Text>

                </View>

                <View style={{marginRight: 10, marginBottom: 17}}>
                    <Text style={{marginTop: 15, fontSize: 20, color: '#ff6600'}}>
                        {rowData.freightPrice}元
                    </Text>
                    <Text style={{marginTop: 10, color: '#999999'}}>
                        {rowData.isHasInvoice === 1 ? '（含发票）' : '（不含发票）'}
                    </Text>
                </View>

            </View>
        )
    }
}

export default bussnessInfoItem;
