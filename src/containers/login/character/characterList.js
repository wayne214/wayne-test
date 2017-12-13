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
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Alert
} from 'react-native';
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
import {setCharacterAction} from '../../../action/user';

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

    }

    render() {
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
                                this.props.navigation.goBack();
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

                                    }
                                    },
                                    {
                                        text: '确认', onPress: () => {

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
                                        console.log('character', this.props.character);
                                        console.log('characterSize', this.props.character.driver);
                                    }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                        this.props.setCharacter({driver:'OUTSIDEDRIVER',owner:'Personalowner'});
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
                                        this.props.setCharacter('Enterpriseowner');
                                    }
                                    },
                                ]
                            )
                        }}
                    />


                </View>

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        character: state.user.get('character')
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setCharacter: (data) => {
            dispatch(setCharacterAction(data));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterList);
