import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
} from 'react-native';
import stylesCommon from '../../../assets/css/common';
import CarImage from '../../../assets/car/carInfo.png';
import NavigationBar from '../../common/navigationBar/navigationBar';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
});

export default class ComponentTmpl extends Component {
    static propTypes = {
        style: PropTypes.object,
    };

    componentDidMount() {

    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={stylesCommon.container}>
                <NavigationBar
                    title={'车辆信息'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <View style={styles.container}>
                    <Image
                        style={{
                            marginTop: 130,
                        }}
                        source={CarImage}/>
                    <Text
                        style={{
                            marginTop: 30,
                            fontSize: 16,
                            color: '#333333',
                        }}
                    >
                        绑定车辆已被禁用，请联系运营人员
                    </Text>
                </View>
            </View>
        );
    }
}


