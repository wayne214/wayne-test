/**
 * Created by wangl on 2017/4/10.
 */
import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
const initState = Immutable.fromJS({
    isResetCity: false,
});

export default (state = initState, action) => {
    let globalState = state;
    switch (action.type) {
        case ActionTypes.ACTION_RESET_CITY_LIST:
            globalState = globalState.set('isResetCity', action.payload);
            return globalState;
        default:
            return state;
    }
};
