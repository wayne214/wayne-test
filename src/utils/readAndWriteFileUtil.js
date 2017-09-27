/**
 * Created by wayne on 2017/7/21.
 */
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs'; // 导入
import moment from 'moment';
import Storage from './storage';
import StorageKey from '../constants/storageKeys';

// const currentData = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
const path = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath + '/logger.txt' : RNFS.DocumentDirectoryPath + '/logger.txt'; // 文件路径
const destPath = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath + '/abc/logger.txt' : RNFS.DocumentDirectoryPath + '/abc/logger.txt'; // 文件路径
const platForm = Platform.OS === 'ios' ? 'IOS' : 'Android';
const deviceModels = DeviceInfo.getModel();
const appName = '司机APP';
const version = DeviceInfo.getVersion();

let userID = '';
let userNAME = '';
let userPhone = '';
let plateNumber = '';

class readAndWriteFileUtil {
    // 写内容到文件中
    /**
     * 参数说明：
     * action：动作名称
     * city: 城市，
     * gpsX: 维度
     * gpsY: 经度
     * phoneNum：电话号码
     * prov: 省
     * region：区
     * time：操作时间
     * useTime: 耗时
     * userId: 用户Id
     * userName: 用户名字
     * app: 应用名称
     * platform: 平台
     * deviceModel: 设备型号
     * page: 页面信息
     * */
    writeFile(action, city, gpsX, gpsY, phoneNum, prov, region, useTime, userId, userName, pageName) {
        const currentData = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const cityValue = typeof (city) === 'undefined' ? '' : city; // 市
        const gpsXValue = typeof (gpsX) === 'undefined' ? 0 : gpsX; // 纬度
        const gpsYValue = typeof (gpsY) === 'undefined' ? 0 : gpsY; // 经度
        const provValue = typeof (prov) === 'undefined' ? '' : prov; // 省
        const regionValue = typeof (region) === 'undefined' ? '' : region; // 区
        Storage.get(StorageKey.PlateNumber).then((value) => {
            if(value) {
                plateNumber = value;
            }
        });
        var content={'action':action, 'city': cityValue , 'lat': gpsXValue, 'lng': gpsYValue, 'phoneNum': phoneNum, 'prov': provValue,
            'region': regionValue, 'time': currentData, 'useTime': useTime, 'userId': userId, 'userName': userName,
            'app': appName, 'platform': platForm, 'deviceModel' : deviceModels, 'page' : pageName, 'plateNumber' : plateNumber, 'version' : version};
        var jsonarr = JSON.stringify(content);
        RNFS.writeFile(path, jsonarr + '\n', 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    // 向文件中添加内容
    appendFile(action, city, gpsX, gpsY, prov, region, useTime, pageName) {
        const currentData = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const cityValue = typeof (city) === 'undefined' ? '' : city; // 市
        const gpsXValue = typeof (gpsX) === 'undefined' ? 0 : gpsX; // 纬度
        const gpsYValue = typeof (gpsY) === 'undefined' ? 0 : gpsY; // 经度
        const provValue = typeof (prov) === 'undefined' ? '' : prov; // 省
        const regionValue = typeof (region) === 'undefined' ? '' : region; // 区
        setTimeout(() => {
            Storage.get(StorageKey.USER_INFO).then((value) => {
                if (value) {
                    userID = value.result.userId;
                    userNAME = value.result.userName;
                    userPhone = value.result.phone;
                    Storage.get(StorageKey.PlateNumber).then((plateNum) => {
                        if(plateNum) {
                            plateNumber = plateNum;
                            var content={'action':action, 'city': cityValue , 'lat': gpsXValue, 'lng': gpsYValue, 'phoneNum': userPhone, 'prov': provValue,
                                'region': regionValue, 'time': currentData, 'useTime': useTime, 'userId': userID, 'userName': userNAME,
                                'app': appName, 'platform': platForm, 'deviceModel' : deviceModels, 'page' : pageName, 'plateNumber': plateNumber, 'version': version };
                            var jsonarr = JSON.stringify(content);
                            RNFS.appendFile(path, jsonarr + '\n', 'utf8')
                                .then((success) => {
                                    console.log('FILE APPEND SUCCESS');
                                })
                                .catch((err) => {
                                    console.log(err.message);
                                });
                        }
                    });
                }
            });
        }, 500);
    }
    // 读取文件
    readFile(successCallback, failCallback) {
        RNFS.readFile(destPath, 'utf8')
            .then((result) => {
                successCallback(result);
            })
            .catch((err) => {
                failCallback(err.message);
            });
    }
    // 读取目录
    readDir() {
        RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
                console.log('GOT RESULT', result);
                let index = result.length - 1;
                // stat the first file
                return Promise.all([RNFS.stat(result[index].path), result[index].path]);
            })
            .then((statResult) => {
                console.log('statResult',statResult,statResult[0].isFile());
                if (statResult[0].isFile()) {
                    // if we have a file, read it
                    return RNFS.readFile(statResult[1], 'utf8');
                }

                return 'no file';
            })
            .then((contents) => {
                // log the file contents
                console.log(contents);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }
    // 删除文件
    deleteFile() {
        RNFS.unlink(destPath)
            .then(() => {
                console.log('FILE DELETED SUCCESS');
            })
            .catch((err) => {
                console.log('FILE DELETE FAILED',err.message);
            });
    }
    // 复制文件
    copyFile(successCallback) {
        console.log('yuanpath---', path);
        console.log('destpath---', destPath);
        RNFS.copyFile(path, destPath)
            .then(() => {
                // console.log('COPY FILE SUCCESSED');
                successCallback();
            })
            .catch((err) => {
                console.log('copyFile Failed', err.message);
            });
    }
    // 移动文件
    moveFile() {
        RNFS.moveFile(path, destPath)
            .then(() => {
                console.log('moveFIle Success');
            })
            .catch((err) => {
                console.log('moveFile failed', err);
            });
    }
    // 获取文件路径
    getPath() {
        return 'file://'.concat(destPath);
    }
    // 获取目标路径
    getDestPath() {
        return destPath;
    }
    // 判断文件路径是否存在
    isFilePathExists(successCallback) {
        RNFS.exists(destPath)
            .then((value) => {
                successCallback(value);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    /*创建目录*/
    mkDir() {
        const options = {
            NSURLIsExcludedFromBackupKey: true, // iOS only
        };

        return RNFS.mkdir(destPath, options)
            .then((res) => {
                console.log('MKDIR success');

            }).catch((err) => {
                console.log('err----', err);
            });
    }
}
const instance = new readAndWriteFileUtil();

export default instance;
