import React, {Component} from 'react';
import {
    DeviceEventEmitter
} from 'react-native';

export default class receiveRestToLogin extends Component {
    static restToLogin(message) {
        DeviceEventEmitter.emit('restToLoginPage',message);
    }
}


