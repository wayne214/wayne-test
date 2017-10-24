/*
 * @author:  wangl
 * @description:  货源详情 运货单界面
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import Communications from 'react-native-communications';
import * as StaticColor from '../../constants/staticColor';

const styles = StyleSheet.create({
    iconFont: {
        fontFamily: 'iconfont',
        color: StaticColor.CALENDER_ICON_COLOR,
        lineHeight: 20,
        fontSize: 18,
        margin: 2,
        paddingLeft: 18,
    },
});

class DetailsUserCell extends Component {
    static propTypes = {
        detailsUser: PropTypes.string,
        detailsPhoneNO_: PropTypes.string,
        detailsADDR: PropTypes.string,
        onSelectAddr: PropTypes.func.isRequired,
    };


    constructor(props) {
        super(props);
        this.state = {
            detailsUser: '',
            detailsPhoneNO_: '',
            detailsADDR: '',
        };
    }

    render() {
        const {deliveryInfo, onSelectAddr, isShowContactAndPhone} = this.props;
        return (
            <View
                style={{backgroundColor: StaticColor.WHITE_COLOR, paddingTop: 5,}}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 3, paddingRight: 20}}>
                        {
                            isShowContactAndPhone ? <View
                                style={{
                                    flexDirection: 'row',
                                    paddingLeft: 40,
                                    marginBottom: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        paddingLeft: 10,
                                        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
                                    }}
                                >
                                    {deliveryInfo.receiveContactName}
                                </Text>
                            </View> : null
                        }
                        <TouchableOpacity
                            onPress={() => {
                                onSelectAddr();
                            }}
                            underlayColor={StaticColor.COLOR_SEPARATE_LINE}
                        >
                            <View
                                style={{flexDirection: 'row', alignItems: 'center', paddingRight: 30}}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 3,
                                        borderWidth: 1,
                                        marginLeft: 20,
                                        width: 19,
                                        height: 19,
                                        borderColor: '#ff7e23',
                                        backgroundColor: '#ff7e23',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    >终</Text>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: StaticColor.ADDRESS_TEXT_COLOR,
                                        marginLeft: 10,
                                        marginTop: 5,
                                        marginBottom: 5,
                                    }}
                                >
                                    {deliveryInfo.receiveAddress}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {
                        isShowContactAndPhone ? <View style={{height: 65, width: 1, backgroundColor: '#f5f5f5'}}/> : null
                    }
                    {
                        isShowContactAndPhone ? <TouchableOpacity
                            onPress={() => {
                                Communications.phonecall(deliveryInfo.receivePhoneNum, true);
                            }}
                        >
                            <View style={{justifyContent: 'center', alignItems: 'center', paddingRight: 20, flex: 2}}>
                                <Text
                                    style={styles.iconFont}
                                >
                                    &#xe666;
                                </Text>
                            </View>
                        </TouchableOpacity> : null
                    }
                </View>
                <View
                    style={{height: 1, backgroundColor: '#fff', marginLeft: 20, marginTop: 5}}
                />
            </View>
        );
    }
}
DetailsUserCell.propTypes = {
    detailsUser: React.PropTypes.object,
    detailsPhoneNO_: React.PropTypes.object,
    detailsADDR: React.PropTypes.object,
    deliveryInfo: React.PropTypes.object,
};
export default DetailsUserCell;
