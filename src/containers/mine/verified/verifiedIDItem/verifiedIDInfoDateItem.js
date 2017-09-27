import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform
} from 'react-native';

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
        ...Platform.select({
            ios: {
                marginTop: 15,
                marginBottom: 15,
            }
        }),
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
        textAlign: 'right',
    }

});

class verifiedIDInfoDateItem extends Component{
    constructor(props) {
        super(props);


        this.click = this.click.bind(this);
    }

    click(){
        this.props.clickDataPick();
    }

    render() {
        const {IDDate} = this.props;

        let date='请手动选择有效期';
        let color = {color: '#666666'};

        if (IDDate && IDDate !== '请选择有效期') {
            color = {color: 'black'};

            date = IDDate.length === 8 && IDDate.indexOf('-') < 0 ?
                IDDate.substr(0, 4) + '-' + IDDate.substr(4, 2) + '-' + IDDate.substr(6, 2) + ''
                : IDDate;

            date = date.replace('年', '-');

            if (date.indexOf('日') > 0) {
                date = date.replace('月', '-');
                date = date.replace('日', '');
            } else {
                date = date.replace('月', '');
            }
        }else
            color = {color: '#666666'};

        return (
            <View style={styles.container}>

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        有效期至
                    </Text>
                    <TouchableOpacity style={styles.touchStyle}
                                      onPress={()=>{
                                          this.click();
                                      }}>

                        <Text style={[styles.textInputStyle, color]}>
                            {date}
                        </Text>

                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

export default verifiedIDInfoDateItem;
