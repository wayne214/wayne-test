/**
 * database tools class
 */
import React, {Component, PropTypes} from 'react';
import {
    Image,
    StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
    bankIcon: {
        height: 30,
        width: 30,
        margin: 10
    }
});

class ZJBankColor {

    color(accountBank) {
        switch (accountBank) {
            case '工商银行':
                return 'red';
                break;
            case '农业银行':
                return 'green';
                break;
            case '中国银行':
                return 'red';
                break;
            case '建设银行':
                return 'blue'
                break;
            case '中国农业发展银行':
                return 'green';
                break;
            case '交通银行':
                return 'blue';
                break;
            case '中信银行':
                return 'red';
                break;
            case '光大银行':
                return 'yellow';
                break;
            case '华夏银行':
                return 'red';
                break;
            case '民生银行':
                return 'green';
                break;
            case '广发银行':
                return 'red';
                break;
            case '平安银行':
                return 'yellow';
                break;
            case '招商银行':
                return 'red';
                break;
            case '兴业银行':
                return 'blue';
                break;
            case '上海浦东发展银行':
                return 'blue';
                break;
            case '北京银行':
                return 'red';
                break;
            case '天津银行':
                return 'blue';
                break;
            case '河北银行':
                return 'blue';
                break;
            case '廊坊银行':
                return 'blue';
                break;
            case '上海银行':
                return 'yellow';
                break;
            case '南京银行':
                return 'red';
                break;
            case '杭州银行':
                return 'blue';
                break;
            case '宁波银行':
                return 'yellow';
                break;
            case '青岛银行':
                return 'red';
                break;
            case '郑州银行':
                return 'yellow';
                break;
            case '长沙银行':
                return 'red';
                break;
            case '成都银行':
                return 'red';
                break;
            case '兰州银行':
                return 'blue';
                break;
            case '成都农商银行':
                return 'green';
                break;
            case '恒丰银行':
                return 'blue';
                break;
            case '浙商银行':
                return 'yellow';
                break;
            case '渤海银行':
                return 'blue';
                break;
            case '徽商银行':
                return 'red';
                break;
            case '北京农村商业':
                return 'yellow';
                break;
            case '颍淮农村商业银行':
                return 'blue';
                break;
            case '邮政储蓄银行':
                return 'green';
                break;
            default:
                return'green';
                break;
        }
    }


}

const instance = new ZJBankColor();

export default instance;
