/**
 * Created by xizhixin on 2017/9/27.
 */
import * as ActionTypes from '../constants/actionType';
// 是否刷新出发城市更多（状态）
export const isReSetCity = (data) => {
    return {
        type: ActionTypes.ACTION_RESET_CITY_LIST,
        payload: data,
    };
};
// 上传回单-添加照片
export const addImage = (params) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.ADD_IMAGE,
            payload: params,
        });
    };
};
// 上传回单-清空照片
export function updateImages(params) {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.UPDATE_IMAGES,
            payload: params,
        });
    };
}
// 上传回单-删除照片
export function deleteImage(params) {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.DELETE_IMAGE,
            payload: params,
        });
    };
}
