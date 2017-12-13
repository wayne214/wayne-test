/**
 * 角色选择界面
 * by：wl
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

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

class CharacterOwner extends BaseContainer {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex:1,backgroundColor: '#f5f5f5'}}>
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
                        textAbout={'个人车主'}
                        imageAbout={StaticImage.PersonalOwner}
                        onClick={() => {
                            console.log('选择个人车主')
                        }}
                    />

                    <CharacterCell
                        textAbout={'企业车主'}
                        imageAbout={StaticImage.BusinessOwners}
                        onClick={() => {
                            console.log('选择企业车主')
                        }}
                    />

                </View>

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        sendLoginSuccessAction: (result) => {
            dispatch()
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterOwner);
