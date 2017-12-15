/**
 * Created by wangl on 2017/4/10.
 */
import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
const initState = Immutable.fromJS({
    isResetCity: false,
    imageList: Immutable.List(),
    maxNum: 9, // 照片最大张数
});

export default (state = initState, action) => {
    let globalState = state;
    let imageList;
    let maxNum;
    switch (action.type) {

        case ActionTypes.ACTION_RESET_CITY_LIST:
            globalState = globalState.set('isResetCity', action.payload);
            return globalState;

        case ActionTypes.ADD_IMAGE:
            imageList = globalState.get('imageList');
            maxNum = globalState.get('maxNum');
            action.payload.map(i =>{
                imageList = imageList.push(i);
                maxNum -= 1;
            });
            globalState = globalState.set('imageList', imageList);
            globalState = globalState.set('maxNum', maxNum);
            console.log('maxNum=', maxNum);
            return globalState;

        case ActionTypes.DELETE_IMAGE:
            imageList = globalState.get('imageList');
            maxNum = globalState.get('maxNum');
            imageList = imageList.delete(action.payload);
            maxNum += 1;
            globalState = globalState.set('imageList', imageList);
            globalState = globalState.set('maxNum', maxNum);
            console.log('maxNum=', maxNum);
            return globalState;

        case ActionTypes.UPDATE_IMAGES:
            imageList = globalState.get('imageList');
            maxNum = globalState.get('maxNum');
            imageList = imageList.clear();
            maxNum = 9;
            globalState = globalState.set('imageList', imageList);
            globalState = globalState.set('maxNum', maxNum);
            return globalState;

        default:
            return state;
    }
};
