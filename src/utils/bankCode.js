/**
 * database tools class
 */
import React, {Component, PropTypes} from 'react';
import {
    Image,
    StyleSheet,
} from 'react-native';


class BankCode {

    searchCode(bankName) {
        switch (bankName) {
            case '上海浦东发展银行':
                return '301';
                break;
            case '上海银行':
                return '401';
                break;
            case '东莞银行':
                return '425';
                break;
            case '中信银行':
                return '302';
                break;
            case '中国光大银行':
                return '303';
                break;
            case '光大银行':
                return '303';
                break;
            case '中国农业发展银行':
                return '9015';
                break;
            case '农业发展银行':
                return '9015';
                break;
            case '中国农业银行':
                return '103';
                break;
            case '农业银行':
                return '103';
                break;
            case '中国工商银行':
                return '102';
                break;
            case '工商银行':
                return '102';
                break;
            case '中国建设银行':
                return '105';
                break;
            case '建设银行':
                return '105';
                break;
            case '中国邮政储蓄银行':
                return '100';
                break;
            case '中国银行':
                return '104';
                break;
            case '中金支付':
                return '700';
                break;
            case '临商银行':
                return '431';
                break;
            case '乌鲁木齐商业银行':
                return '427';
                break;
            case '交通银行':
                return '301';
                break;
            case '兴业银行':
                return '309';
                break;
            case '包商银行':
                return '479';
                break;
            case '北京农村商业银行':
                return '9013';
                break;
            case '北京银行':
                return '403';
                break;
            case '华夏银行':
                return '304';
                break;
            case '南京银行':
                return '424';
                break;
            case '南充市商业银行':
                return '9004';
                break;
            case '厦门银行':
                return '402';
                break;
            case '吉林省农村信用社':
                return '1562';
                break;
            case '哈尔滨银行':
                return '442';
                break;
            case '大连银行':
                return '420';
                break;
            case '天津银行':
                return '434';
                break;
            case '宁夏银行':
                return '436';
                break;
            case '宁波慈溪农村商业银行':
                return '9010';
                break;
            case '宁波银行':
                return '408';
                break;
            case '安徽涡阳农村商业银行':
                return '9003';
                break;
            case '平安银行':
                return '307';
                break;
            case '广发银行':
                return '306';
                break;
            case '广州银行':
                return '413';
                break;
            case '廊坊银行':
                return '9006';
                break;
            case '张家口银行':
                return '03131';
                break;
            case '徽商银行':
                return '440';
                break;
            case '恒丰银行':
                return '311';
                break;
            case '成都银行':
                return '429';
                break;
            case '抚顺银行':
                return '430';
                break;
            case '招商银行':
                return '308';
                break;
            case '无锡农村商业银行':
                return '9001';
                break;
            case '杭州银行':
                return '423';
                break;
            case '民生银行':
                return '305';
                break;
            case '汉口银行':
                return '414';
                break;
            case '江苏东台农村商业银行':
                return '9011';
                break;
            case '江苏新沂农村商业银行':
                return '9009';
                break;
            case '江苏江南农村商业银行':
                return '9016';
                break;
            case '江苏银行':
                return '9002';
                break;
            case '沧州银行':
                return '9007';
                break;
            case '河北银行':
                return '422';
                break;
            case '洛阳银行':
                return '418';
                break;
            case '浙商银行':
                return '306';
                break;
            case '浙江民泰商业银行':
                return '9005';
                break;
            case '浙江泰隆商业银行':
                return '9008';
                break;
            case '渤海银行':
                return '317';
                break;
            case '温州银行':
                return '412';
                break;
            case '湖北银行':
                return '432';
                break;
            case '湖州银行':
                return '9017';
                break;
            case '烟台银行':
                return '404';
                break;
            case '焦作市商业银行':
                return '411';
                break;
            case '珠海华润银行':
                return '437';
                break;
            case '盛京银行':
                return '417';
                break;
            case '福建海峡银行':
                return '405';
                break;
            case '绍兴银行':
                return '428';
                break;
            case '苏州银行':
                return '421';
                break;
            case '葫芦岛银行':
                return '433';
                break;
            case '辽阳银行':
                return '419';
                break;
            case '邯郸银行':
                return '9014';
                break;
            case '郑州银行':
                return '435';
                break;
            case '金华银行':
                return '426';
                break;
            case '锦州银行':
                return '439';
                break;
            case '青岛银行':
                return '450';
                break;
            case '齐商银行':
                return '438';
                break;
            case '齐鲁银行':
                return '409';
                break;
            case '张家口农业银行':
                return '031311';
                break;
            default:
                return '00000';
                break;
        }
    }

}

const instance = new BankCode();

export default instance;
