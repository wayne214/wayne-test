/**
 * Created by wangl on 2017/5/2.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    StyleSheet
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';
import StaticImage from '../../../constants/staticImage';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width / 2,
        height: 45,
        backgroundColor: 'transparent',
        alignSelf: 'center'
    },
});

class ChooseButtonCell extends Component {
    static propTypes = {
        toRefuse: PropTypes.func.isRequired,
        getorders: PropTypes.func.isRequired,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const {toRefuse, getorders, leftContent, rightContent} = this.props;
        return (
            <View style={{backgroundColor: StaticColor.WHITE_COLOR}}>
                <View
                    style={{
                        flexDirection: 'row',
                        height: 45,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: width / 2,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            toRefuse();
                        }}
                    >
                        <Text
                            style={{fontSize: 16, color: '#333333'}}
                        >
                            {leftContent ? leftContent : '拒绝'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            getorders();
                        }}
                    >
                        <ImageBackground source={StaticImage.BlueButtonSmall} style={styles.button} resizeMode='stretch'>
                        <Text
                            style={{fontSize: 16, color: StaticColor.WHITE_COLOR}}
                        >
                            {rightContent ? rightContent : '接单'}
                        </Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default ChooseButtonCell;
