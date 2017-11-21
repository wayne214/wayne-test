/**
 * Created by chj on 2017/11/20.
 */

import React, { Component } from 'react';
import {
    View,
    NativeModules,
    NativeAppEventEmitter,//导入
} from 'react-native';


//在JavaScript中调用Object-C定义的方法，需要先导入NativeModules
//此处的RNCalliOSAction就是我们在iOS上新建的类名
//如果在iOS中设置了导出了类的名字，此处需要和导出的名字一致
const Speeker = NativeModules.BDSpeech;

const speek = (string) => {
    Speeker.speek(string)
};
export default {
    speek
};
