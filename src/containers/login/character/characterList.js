/**
 * 角色选择界面
 * by：wl
 * OUTSIDEDRIVER  外部司机
 * Personalowner  个人车主
 * Enterpriseowner  企业车主
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    Text,
    View,
    BackAndroid,
    StyleSheet,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import BaseContainer from '../../base/baseContainer';
import {loginSuccessAction, setUserNameAction} from '../../../action/user';
import StaticImage from '../../../constants/staticImage';
import * as API from '../../../constants/api';
import HTTPRequest from '../../../utils/httpRequest';
import Storage from '../../../utils/storage';
import StorageKey from '../../../constants/storageKeys';
import NavigatorBar from '../../../common/navigationBar/navigationBar';
import CharacterCell from '../components/characterCell';
import CharacterChooseCell from '../components/characterChooseCell';
import {
    clearUser,
    setDriverCharacterAction,
    setOwnerCharacterAction,
} from '../../../action/user';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

class CharacterList extends BaseContainer {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    onBackAndroid = () => {
        return true;
    };

    render() {
        const navigator = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                    <NavigatorBar
                        title={'选择身份'}
                        navigator={navigator}
                        leftButtonHidden={true}
                        rightButtonConfig={{
                            type: 'string',
                            title: '退出',
                            onClick: () => {
                                this.props.removeUserInfoAction();
                                const resetAction = NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({ routeName: 'LoginSms'}),
                                    ]
                                });
                                this.props.navigation.dispatch(resetAction);
                            },
                        }}
                    />

                    <CharacterCell
                        textAbout={'司机'}
                        imageAbout={StaticImage.Drivericon}
                        onClick={() => {
                            Alert.alert(
                                '司机',
                                '\n司机可在鲜易通接物流订单，同时接收与其有挂靠关系的个人车主或企业车主分配的运输订单，请确认您的选择无误！',
                                [
                                    {
                                        text: '再看看', onPress: () => {
                                        //this.props.navigation.navigate('Main');
                                    }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                        //this.props.setDriverCharacterAction('1');
                                        // this.props.navigation.navigate('Main');
                                        Storage.get(StorageKey.changePersonInfoResult).then((value) => {
                                            if (value) {
                                                navigator.navigate('VerifiedPage', {
                                                    resultInfo: value,
                                                });
                                            } else {
                                                navigator.navigate('VerifiedPage');
                                            }
                                        });
                                    }
                                    },
                                ]
                            )
                        }}
                    />

                    <CharacterCell
                        textAbout={'个人车主'}
                        imageAbout={StaticImage.PersonalOwner}
                        onClick={() => {
                            Alert.alert(
                                '个人车主',
                                '\n个人车主可在鲜易通接物流订单，同时转发给司机运输，但必须车辆所有人为注册本人，请确认您的选择误！',
                                [
                                    {
                                        text: '再看看', onPress: () => {

                                    }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                        //this.props.setOwnerCharacterAction('11');

                                        Storage.get(StorageKey.personownerInfoResult).then((value) => {
                                            if (value) {
                                                navigator.navigate('PersonCarOwnerAuth', {
                                                    resultInfo: value,
                                                });
                                            } else {
                                                navigator.navigate('PersonCarOwnerAuth');
                                            }
                                        });
                                    }
                                    },
                                ]
                            )
                        }}
                    />

                    <CharacterCell
                        textAbout={'企业车主'}
                        imageAbout={StaticImage.BusinessOwners}
                        onClick={() => {
                            Alert.alert(
                                '企业车主',
                                '\n企业车主可在鲜易通接物流订单，同时转发给司机运输，但必须具有企业资质，请确认您的选择无误！',
                                [
                                    {
                                        text: '再看看', onPress: () => {

                                        }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                        //this.props.setOwnerCharacterAction('21');

                                        Storage.get(StorageKey.enterpriseownerInfoResult).then((value) => {
                                            if (value) {
                                                navigator.navigate('CompanyCarOwnerAuth', {
                                                    resultInfo: value,
                                                });
                                            } else {
                                                navigator.navigate('CompanyCarOwnerAuth');
                                            }
                                        });
                                    }
                                    },
                                ]
                            )
                        }}
                    />


                </View>


                {/*<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>*/}


                {/*<TouchableOpacity style={{marginVertical: 10, marginLeft: 20, backgroundColor: 'red'}} onPress={()=>{*/}
                {/*navigator.navigate('VerifiedStatePage', {*/}
                {/*qualifications: 1201,*/}
                {/*});*/}
                {/*}}>*/}
                {/*<Text style={{textAlign: 'center'}}>司机认证详情</Text>*/}
                {/*</TouchableOpacity>*/}

                {/*<TouchableOpacity style={{marginVertical: 10, marginLeft: 20, backgroundColor: 'red'}} onPress={()=>{*/}
                {/*Storage.get(StorageKey.changeCarInfoResult).then((value) => {*/}
                {/*if (value){*/}
                {/*navigator.navigate('CertificationPage', {*/}
                {/*resultInfo: value,*/}
                {/*});*/}
                {/*}else {*/}
                {/*navigator.navigate('CertificationPage');*/}
                {/*}*/}

                {/*});*/}
                {/*}}>*/}
                {/*<Text style={{textAlign: 'center'}}>司机增加车辆</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity style={{marginVertical: 10, marginLeft: 20, backgroundColor: 'red'}} onPress={()=>{*/}
                {/*this.props.navigation.navigate('CerifiedStatePage', {*/}
                {/*qualifications: 1202,*/}
                {/*});*/}
                {/*}}>*/}
                {/*<Text style={{textAlign: 'center'}}>司机增加车辆详情</Text>*/}
                {/*</TouchableOpacity>*/}


                {/*<TouchableOpacity style={{marginVertical: 10, marginLeft: 20}} onPress={()=>{*/}

                {/*}}>*/}
                {/*<Text style={{textAlign: 'center'}}>个人车主认证详情</Text>*/}
                {/*</TouchableOpacity>*/}

                {/*<TouchableOpacity style={{marginVertical: 10, marginLeft: 20}} onPress={()=>{*/}

                {/*}}>*/}
                {/*<Text style={{textAlign: 'center'}}>企业车主认证详情</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity style={{marginVertical: 10, marginLeft: 20, backgroundColor: 'red'}} onPress={()=>{*/}
                {/*Storage.get(StorageKey.carOwnerAddDriverInfo).then((value) => {*/}
                {/*if (value){*/}
                {/*navigator.navigate('CarOwnerAddDriver', {*/}
                {/*resultInfo: value,*/}
                {/*});*/}
                {/*}else {*/}
                {/*navigator.navigate('CarOwnerAddDriver');*/}
                {/*}*/}
                {/*});*/}
                {/*}}>*/}
                {/*<Text style={{textAlign: 'center'}}>车主增加司机</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity style={{marginVertical: 10, marginLeft: 20, backgroundColor: 'red'}} onPress={()=>{*/}
                {/*navigator.navigate('CarOwnerAddDriverDetail', {*/}
                {/*qualifications: 1201,*/}
                {/*});*/}
                {/*}}>*/}
                {/*<Text style={{textAlign: 'center'}}>车主增加司机详情</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity style={{marginVertical: 10, marginLeft: 20, backgroundColor: 'red'}} onPress={()=>{*/}
                {/*Storage.get(StorageKey.carOwnerAddCarInfo).then((value) => {*/}
                {/*if (value){*/}
                {/*navigator.navigate('CarOwnerAddCar', {*/}
                {/*resultInfo: value,*/}
                {/*});*/}
                {/*}else {*/}
                {/*navigator.navigate('CarOwnerAddCar');*/}
                {/*}*/}

                {/*});*/}
                {/*}}>*/}
                {/*<Text style={{textAlign: 'center'}}>车主增加车辆</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity style={{marginVertical: 10, marginLeft: 20, backgroundColor: 'red'}} onPress={()=>{*/}

                {/*this.props.navigation.navigate('CarOwnerAddCarDetail', {*/}
                {/*qualifications: 1202,*/}
                {/*});*/}
                {/*}}>*/}
                {/*<Text style={{textAlign: 'center'}}>车主增加车辆详情</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*</View>*/}

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        // driver: state.user.get('driver'),
        // owner: state.user.get('owner'),
        driverStatus: state.user.get('driverStatus'),
        ownerStatus: state.user.get('ownerStatus'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeUserInfoAction:()=>{
            dispatch(clearUser());
        },
        setCharacter: (data) => {
            dispatch(setCharacterAction(data));
        },
        setDriverCharacterAction: (result) => {
            dispatch(setDriverCharacterAction(result));
        },
        setOwnerCharacterAction: (result) => {
            dispatch(setOwnerCharacterAction(result));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterList);
