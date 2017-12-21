/**
 * 手动输入GPS编码绑定界面
 * Created by xizhixin on 2017/12/20.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    Image
} from 'react-native';
import NavigatorBar from '../../../common/navigationBar/navigationBar';
import BottomButton from '../components/bottomButtonComponent';

import StaticImage from '../../../constants/staticImage';
import * as StaticColor from '../../../constants/staticColor';

const {width, height} = Dimensions.get('window');


class bindGPS extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.bindGPS = this.bindGPS.bind(this);
    }
    componentDidMount() {

    }
    // 绑定GPS设备
    bindGPS() {

    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'绑定GPS设备'}
                    leftButtonHidden={false}
                    navigator={navigator}
                />
                <View style={{flex: 1}}>
                    <Image
                        style={styles.icon}
                        source={StaticImage.gps}
                    />
                    <Image
                        style={styles.inputView}
                        source={StaticImage.Rectangle}
                    >
                        <TextInput
                            style={{
                                backgroundColor: StaticColor.WHITE_COLOR,
                                marginLeft: 5,
                                marginRight: 5,
                                marginTop: 5,
                                marginBottom: 5,
                                height: 40,
                                textAlign: 'center',
                                color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
                                fontSize: 16,
                            }}
                            placeholder={'请确认您输入了正确的GPS设备编号'}
                            placeholderTextColor={StaticColor.LIGHT_GRAY_TEXT_COLOR}
                            underlineColorAndroid={'transparent'}
                        />
                    </Image>
                    <Text style={styles.tip}>请注意区分字母大小写</Text>
                </View>
                <BottomButton
                    onClick={() => {
                        this.bindGPS();
                        const routes = this.props.routes;
                        let key = routes[routes.length - 2].key;
                        this.props.navigation.goBack(key);
                    }}
                    text="确认"
                />
            </View>
        );
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    icon: {
        alignSelf: 'center',
        marginTop: 40,
    },
    inputView: {
        marginTop: 65,
        alignSelf: 'center'
    },
    tip: {
        color: StaticColor.GRAY_TEXT_COLOR,
        fontSize: 12,
        marginTop: 15,
        textAlign: 'center'
    }

});

function mapStateToProps(state){
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(bindGPS);

