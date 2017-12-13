import React, {Component, PropTypes} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
    Platform,
    StyleSheet
} from 'react-native';
import StaticImage from '../../../constants/staticImage';
import * as ConstValue from '../../../constants/constValue';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    margintop: {
        ...Platform.select({
            ios: {
                marginTop: ConstValue.NavigationBar_StatusBar_Height,
            },
            android: {
                marginTop: 73,
            },
        }),
        position: 'absolute',
        marginLeft: 5
    },
});

class CharacterChooseCell extends Component {
    static propTypes = {
        carClick: PropTypes.func,
        driverClick: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    render() {

        const {carClick, driverClick} = this.props;
        return (

            <View style={styles.margintop}>
                <Image
                    style={{width: width / 3, height: height / 5}}
                    source={StaticImage.CombinedShape}/>
                <View
                    style={{
                        width: width / 3 - 20,
                        backgroundColor: '#FFFFFF',
                        marginTop: 20,
                        marginLeft: 10,
                        flexDirection: 'column',
                        position: 'absolute',
                        justifyContent: 'center',
                    }}
                >

                        <TouchableOpacity
                            onPress={() => {
                                carClick();
                            }}>
                        <View style={{
                            flexDirection: 'row',
                            height: height / 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{fontFamily: 'iconfont', fontSize: 16, color: '#333333'}}>
                                &#xe674;
                            </Text>
                            <Text style={{marginLeft: 10, fontSize: 16, color: '#333333'}}>
                                车主
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{height: 1, backgroundColor: '#e8e8e8', marginTop: 8}}/>

                    <TouchableOpacity onPress={() => {
                        driverClick();
                    }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text style={{fontFamily: 'iconfont', fontSize: 16, color: '#333333'}}>
                                &#xe675;
                            </Text>
                            <Text style={{marginLeft: 10, fontSize: 16, color: '#333333'}}>
                                司机
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>

        )
    }
}

export default CharacterChooseCell;
