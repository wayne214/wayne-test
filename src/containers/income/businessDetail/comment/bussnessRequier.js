/**
 * Created by mymac on 2017/8/21.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

import RequireItem from './requireItem';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
    },
});

class bussnessRequier extends Component{


    render() {

        const {datas} = this.props;

        const subView = datas.map((item, i) => {
            return (
                <RequireItem title={item}
                             key={i}
                             index={i}
                             onDeleteAction={(index)=>{
                                 this.props.deleteAction(index);
                             }}
                />
            )
        });

        return (
            <View style={styles.container}>
                <View
                    style={{height: 1, backgroundColor: '#F5F5F5'}}
                />
                <View style={{flexDirection: 'row', flex: 1}}>

                    <View style={{flex: 5, flexDirection: 'row'}}>
                        {subView}
                    </View>

                    <TouchableOpacity style={{flex: 1, borderLeftWidth: 1, borderLeftColor: '#DCDDDC'}}
                                      onPress={()=>{
                                          this.props.deleteAllAction();
                                      }}>
                        <Text style={{lineHeight: 55, alignSelf: 'center'}}>
                            清空
                        </Text>
                    </TouchableOpacity>

                </View>

                <View
                    style={{height: 1, backgroundColor: '#F5F5F5'}}
                />

            </View>
        )
    }
}

export default bussnessRequier;
