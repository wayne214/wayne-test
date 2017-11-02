/**
 * Created by xizhixin on 2017/9/22.
 * 新手引导界面
 */
import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    Dimensions,
    StyleSheet,
    InteractionManager,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Swiper from 'react-native-swiper';

import StaticImage from '../../constants/staticImage';
import BaseContainer from '../base/baseContainer';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: width,
        height: height,
        resizeMode: 'contain',
    },
});
export default class Guide extends BaseContainer {

    toMain() {
        Storage.save(StorageKey.IS_FIRST_START_FLAG, '1');
        InteractionManager.runAfterInteractions(() => {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'LoginSms'}),
                ]
            });
            this.props.navigation.dispatch(resetAction);
        });
    }

    render() {
        return (
            <Swiper
                style={styles.wrapper} showsButtons={false}
                height={height} loop={false}
                showsPagination={false}
                onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
            >
                <View style={styles.slide}>
                    <Image style={styles.image} source={StaticImage.Img01} resizeMode="stretch" />
                </View>
                <View style={styles.slide}>
                    <Image style={styles.image} source={StaticImage.Img02} resizeMode="stretch">
                        <Text
                            style={{flex: 1, marginTop: height - height / 5}}
                            onPress={this.toMain.bind(this)}
                        />
                    </Image>
                </View>
            </Swiper>
        );
    }
}



