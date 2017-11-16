/**
 *
 */
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {AppRegistry, Platform, Alert, Linking} from 'react-native';
import configureStore from './store/store';

import App from './containers/app';

import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
} from 'react-native-update';


const store = configureStore();

import _updateConfig from '../update.json';
const {appKey} = _updateConfig[Platform.OS];

class Root extends Component {

    constructor(props) {
        super(props);
        this.netStatus = '';
    }
    componentWillMount() {
        if (Platform.OS === 'android') {
            if (isFirstTime) {
                Alert.alert('温馨提示', '安装更新包成功', [
                    {text: '好', onPress: ()=>{markSuccess();}},
                ]);
            } else if (isRolledBack) {
                // Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
            }
        }
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            this.checkUpdateForNewVersion();
        }
    }
    // 检查更新
    checkUpdateForNewVersion = () => {
        checkUpdate(appKey).then(info => {
            if (info.expired) { // 应用包过期
                Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                    {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
                ]);
            } else if (info.upToDate) { // 应用是最新版本
                // Alert.alert('提示', '您的应用版本已是最新.');
            } else {
                Alert.alert('温馨提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
                    {text: '是', onPress: ()=>{this.doUpdate(info)}},
                    {text: '否',},
                ]);
            }
        }).catch(err => {
            Alert.alert('提示', '检查更新失败.');
        });
    };
    // 下载更新
    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            Alert.alert('温馨提示', '更新包下载完毕,是否重启应用?', [
                {text: '是', onPress: ()=>{switchVersion(hash);}},
                {text: '否',},
                {text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
            ]);
        }).catch(err => {
            Alert.alert('提示', '下载更新失败.');
        });
    };
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}

AppRegistry.registerComponent('Driver', () => Root);
