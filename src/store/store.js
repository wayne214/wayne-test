import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';

const middelwares = [];

middelwares.push(thunkMiddleware);

if (process.env.NODE_ENV === 'development') {
    const loggerMiddleware = createLogger();
    middelwares.push(loggerMiddleware);
}

const createStoreWithMiddleware = applyMiddleware(...middelwares)(createStore);

export default function configureStore(initialState) {
    const store = createStoreWithMiddleware(rootReducer, initialState);
    return store;
}
