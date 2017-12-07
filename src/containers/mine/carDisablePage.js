import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
} from 'react-native';
import CarImage from '../../../assets/car/carInfo.png';
import NavigationBar from '../../common/navigationBar/navigationBar';
import * as StaticColor from '../../constants/staticColor';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    allContainer: {
        flex: 1,
        backgroundColor:StaticColor.COLOR_VIEW_BACKGROUND,
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
            <View style={styles.allContainer}>
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
                            color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
                        }}
                    >
                        绑定车辆已被禁用，请联系运营人员
                    </Text>
                </View>
            </View>
        );
    }
}


