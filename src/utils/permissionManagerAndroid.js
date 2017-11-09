/**
 * Created by xizhixin on 2017/8/1.
 */
import { Platform, NativeModules } from 'react-native';

function cameraPermission() {
    return NativeModules.PermissionManager.cameraPermission();
}
function photoPermission() {
    return NativeModules.PermissionManager.photoPermission();
}

function locationPermission() {
    return NativeModules.PermissionManager.locationPermission();
}

function phonePermission() {
    return NativeModules.PermissionManager.phonePermission();
}

function externalPermission() {
    return NativeModules.PermissionManager.externalPermission();
}

export default {
    cameraPermission,
    photoPermission,
    locationPermission,
    phonePermission,
    externalPermission
};
