/**
 * Created by mymac on 2017/7/19.
 */

import React, { Component } from 'react';
import {
    View,
    NativeModules,
    NativeAppEventEmitter,//导入
} from 'react-native';

import {upLoadImageManager} from './upLoadImageRequest';
import ReadAndWriteFileUtil from '../utils/readAndWriteFileUtil';
import * as API from '../constants/api';

//在JavaScript中调用Object-C定义的方法，需要先导入NativeModules
//此处的RNCalliOSAction就是我们在iOS上新建的类名
//如果在iOS中设置了导出了类的名字，此处需要和导出的名字一致
const RNCallNative = NativeModules.RNCallNative;

/*向原生发送消息*/
const sendMsgToNative = () => {
    RNCallNative.RNSendMsgToNative();
};
/*接收从原生传过来的数据*/
const receiveMsgFromNative = (data)=> {
    console.log('接收到数据，即将进行存储本地操作');
};

const upLoadLogger = () => {
    //console.log('10秒钟调用一次');
    ReadAndWriteFileUtil.mkDir();
    ReadAndWriteFileUtil.deleteFile(); // 如果目录存在就删除
    ReadAndWriteFileUtil.copyFile(() => {
        console.log('COPY FILE SUCCESSED');
        ReadAndWriteFileUtil.writeFile(); // 清空原文件
        let formData = new FormData();
        let file = {uri: ReadAndWriteFileUtil.getPath(), type: 'multipart/form-data', name: 'logger.txt'};
        formData.append('logFile', file);
        const url = API.API_COLLECT_LOG;
        // ReadAndWriteFileUtil.readFile((result) => {
        //     console.log('fileContent',result, result.length);
        // }, (err) => { console.log('文件不存在', err); });
        // ReadAndWriteFileUtil.isFilePathExists((value) => {
        //     console.log('destPathFile IS exists', value);
        // });
        upLoadImageManager(url,
            formData,
            () => {
                console.log('开始请求数据');
            },
            (response) => {
                console.log('responseData', response);
                if (response.code === 200) {
                    console.log('上传成功');
                }
                ReadAndWriteFileUtil.deleteFile(); // 上传成功后删除目的文件
            },
            (error) => {
                console.log('服务器连接失败', error);
                ReadAndWriteFileUtil.deleteFile(); // 上传成功后删除目的文件
            });
    }); // 拷贝文件

};
/* 上传本地的数据到服务器*/
const uploadDataFromLocalMsg = (data)=>{
    console.log('接收到数据，即将进行上传操作');
    upLoadLogger();
};

export default {
    sendMsgToNative,
    receiveMsgFromNative,
    uploadDataFromLocalMsg,
};
