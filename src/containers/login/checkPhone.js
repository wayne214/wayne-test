/**
 * 手机号码验证第一步
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import Toast from '@remobile/react-native-toast';
import {Geolocation} from 'react-native-baidu-map-xzx';

import NavigationBar from '../../common/navigationBar/navigationBar';
import CountDownButton from '../../common/timerButton';
import Loading from '../../utils/loading';
import  HTTPRequest from '../../utils/httpRequest';

import {
    LIGHT_GRAY_TEXT_COLOR,
    WHITE_COLOR,
    COLOR_VIEW_BACKGROUND,
    COLOR_MAIN,
} from '../../constants/staticColor';
import * as API from '../../constants/api';

import Validator from '../../utils/validator';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import StaticImage from '../../constants/staticImage';
const {width, height} = Dimensions.get('window');

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: COLOR_VIEW_BACKGROUND,
    },

});

export default class CheckPhone extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.state = {
            loading: false,

        };
        this.phoneNo = this.props.navigation.state.params.loginPhone;
        this.nextStep = this.nextStep.bind(this);
    }

    componentDidMount() {
         this.getCurrentPosition();
    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }

   
    // 下一步按钮
    nextStep() {
        if (this.phoneNo !== '' ) {
            //验证手机号
             this.props.navigation.navigate('CheckPhoneStepTwo', {
                loginPhone: this.phoneNo
            });
        } else {
            Toast.showShortCenter('手机号不能为空');
        }
    }


    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'手机号码验证'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                />

                <View
                    style={{
                        marginTop: 10,
                    }}
                >
                	<View  style={{marginTop: 80,justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={StaticImage.CheckPhoneLogo} />
                  </View>
                  <View style={{ marginTop: 15, marginLeft:30, marginRight:30, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 18, color: '#666666', textAlign: 'center'}}>由于您在新设备上登录，需要验证您的手机号({Validator.newPhone(this.phoneNo)})</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => this.nextStep()}>
                    <Image
                        style={{
                            backgroundColor: '#0083ff',
                            borderRadius: 5,
                            height: 44,
                            margin: 10,
                            marginTop: 70,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        source={StaticImage.BlueButtonArc}
                    >

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: WHITE_COLOR,
                            }}
                        >
                            立即验证
                        </Text>

                    </Image>
                </TouchableOpacity>

                {
                    this.state.loading ? <Loading /> : null
                }
            </View>


        );
    }
}
