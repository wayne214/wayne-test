import React from 'react';
import {Provider} from 'react-redux';
import {AppRegistry} from 'react-native';
import configureStore from './store/store';

import App from './containers/app';

const store = configureStore();

class Driver extends React.Component {

    constructor(props) {
        super(props);
        this.netStatus = '';
    }

    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}

AppRegistry.registerComponent('Driver', () => Driver);
