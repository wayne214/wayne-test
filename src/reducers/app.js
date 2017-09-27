import Immutable from 'immutable';
import React from 'react';
import * as ActionTypes from '../constants/actionType';

const initState = Immutable.fromJS({
    locationData: '定位中'
});


export default (state = initState, action) => {
    let globalState = state;
    switch (action.type) {
        case ActionTypes.CHANGE_TAB:
            globalState = globalState.set('currentTab', action.payload.tab);
            return globalState;
            case ActionTypes.ACTION_GET_LOCATION:
            globalState = globalState.set('locationData', action.payload);
            return globalState;
        default:
            return state;
    }
};
