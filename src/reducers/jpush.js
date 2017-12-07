/**
 * Created by wangl on 2017/6/5.
 */
import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';

const initState = Immutable.fromJS({
    jpushIcon: {},
    verifiedState:{},
    certificationState:{},
    carNumState:{},
});

export default (state = initState, action) => {
    let globalState = state;
    switch (action.type) {
        case ActionTypes.ACTION_SET_MESSAGE_LIST_ICON:
            globalState = globalState.set('jpushIcon', action.payload);
            return globalState;
        case ActionTypes.ACTION_SET_VERIFIED_STATE:
            globalState = globalState.set('verifiedState', action.payload);
            return globalState;
        case ActionTypes.ACTION_SET_CERTIFICATION_STATE:
            globalState = globalState.set('certificationState', action.payload);
            return globalState;
        case ActionTypes.ACTION_SET_CAR_NUM:
            globalState = globalState.set('carNumState', action.payload);
            return globalState;
        default:
            return state;
    }
};
