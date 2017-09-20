import Immutable from 'immutable';
import React from 'react';
import * as ActionTypes from '../constants/actionType';

const initState = Immutable.fromJS({

});


export default (state = initState, action) => {
    let globalState = state;
    switch (action.type) {
        case ActionTypes.CHANGE_TAB:
            globalState = globalState.set('currentTab', action.payload.tab);
            return globalState;
        default:
            return state;
    }
};
