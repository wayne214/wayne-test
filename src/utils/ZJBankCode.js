/**
 * database tools class
 */
import React, {Component, PropTypes} from 'react';
import {
    Image,
    StyleSheet,
} from 'react-native';


class BankCode {

    searchCode() {
        const NumberArr = [
            {name: '1', bankName: '工商银行', bankCode: '102100099996'},
            {name: '2', bankName: '农业银行', bankCode: '103100000026'},
            {name: '3', bankName: '中国银行', bankCode: '104100000004'},
            {name: '4', bankName: '建设银行', bankCode: '105100000017'},
            {name: '5', bankName: '中国农业发展银行', bankCode: '203100000019'},
            {name: '6', bankName: '交通银行', bankCode: '301290000007'},
            {name: '7', bankName: '中信银行', bankCode: '302100011000'},
            {name: '8', bankName: '光大银行', bankCode: '303100000006'},
            {name: '9', bankName: '华夏银行', bankCode: '304100040000'},
            {name: '10', bankName: '民生银行', bankCode: '305100000013'},
            {name: '11', bankName: '广发银行', bankCode: '306581000003'},
            {name: '12', bankName: '平安银行', bankCode: '307584007998'},
            {name: '13', bankName: '招商银行', bankCode: '308584000013'},
            {name: '14', bankName: '兴业银行', bankCode: '309391000011'},
            {name: '15', bankName: '上海浦东发展银行', bankCode: '310290000013'},
            {name: '16', bankName: '北京银行', bankCode: '313100000013'},
            {name: '17', bankName: '天津银行', bankCode: '313110000017'},
            {name: '18', bankName: '河北银行', bankCode: '313121006888'},
            {name: '19', bankName: '廊坊银行', bankCode: '313146000019'},
            {name: '20', bankName: '上海银行', bankCode: '313290000017'},
            {name: '21', bankName: '南京银行', bankCode: '313301008887'},
            {name: '22', bankName: '杭州银行', bankCode: '313331000014'},
            {name: '23', bankName: '宁波银行', bankCode: '313332082914'},
            {name: '24', bankName: '青岛银行', bankCode: '313452060150'},
            {name: '25', bankName: '郑州银行', bankCode: '313491000232'},
            {name: '26', bankName: '长沙银行', bankCode: '313551088886'},
            {name: '27', bankName: '成都银行', bankCode: '313651099999'},
            {name: '28', bankName: '兰州银行', bankCode: '313821001016'},
            {name: '29', bankName: '成都农商银行', bankCode: '314651000000'},
            {name: '30', bankName: '恒丰银行', bankCode: '315456000105'},
            {name: '31', bankName: '浙商银行', bankCode: '316331000018'},
            {name: '32', bankName: '渤海银行', bankCode: '318110000014'},
            {name: '33', bankName: '徽商银行', bankCode: '319361000013'},
            {name: '34', bankName: '北京农村商业', bankCode: '402100000018'},
            {name: '35', bankName: '颍淮农村商业银行', bankCode: '402361018886'},
            {name: '36', bankName: '邮政储蓄银行', bankCode: '403100000004'},

        ];
        return NumberArr;
    }

}

const instance = new BankCode();

export default instance;
