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

class BankIconUtil {

    show(bankIcon) {
        switch (bankIcon) {
            case '上海浦东发展银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/shpufafazhanbank.png')}/>;
                break;
            case '上海银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/shanghaibank.png')}/>;
                break;
            case '东莞银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/dongguanbank.png')}/>;
                break;
            case '中信银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/zhongXinBank.png')}/>;
                break;
            case '中国光大银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/chinaGuangDaBank.png')}/>;
                break;
            case '光大银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/chinaGuangDaBank.png')}/>;
                break;
            case '中国农业发展银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/chinaNYFazhanBank.png')}/>;
                break;
            case '农业发展银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/chinaNYFazhanBank.png')}/>;
                break;
            case '中国农业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/chinaNongYeBank.png')}/>;
                break;
            case '农业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/chinaNongYeBank.png')}/>;
                break;
            case '中国工商银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/gongshangbank.png')}/>;
                break;
            case '工商银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/gongshangbank.png')}/>;
                break;
            case '中国建设银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/chinaJianSheBank.png')}/>;
                break;
            case '建设银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/chinaJianSheBank.png')}/>;
                break;
            case '中国邮政储蓄银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/chinaYouzhengCXBank.png')}/>;
                break;
            case '中国银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/zhongguobank.png')}/>;
                break;
            case '中金支付':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/zhongJinBank.png')}/>;
                break;
            case '临商银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/linShangBank.png')}/>;
                break;
            case '乌鲁木齐商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/wlmqShangYeBank.png')}/>;
                break;
            case '交通银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/jiaoTongBank.png')}/>;
                break;
            case '兴业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/xingYeBank.png')}/>;
                break;
            case '包商银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/baoShangBank.png')}/>;
                break;
            case '北京农村商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/beijingNCSYBank.png')}/>;
                break;
            case '北京银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/beijingBank.png')}/>;
                break;
            case '华夏银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/huangxiaBank.png')}/>;
                break;
            case '南京银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/nanjingBank.png')}/>;
                break;
            case '南充市商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/nanchongSSYBank.png')}/>;
                break;
            case '厦门银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/xiamenBank.png')}/>;
                break;
            case '吉林省农村信用社':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/jilinNCXYSBank.png')}/>;
                break;
            case '哈尔滨银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/haerbinBank.png')}/>;
                break;
            case '大连银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/dalianBank.png')}/>;
                break;
            case '天津银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/tianjinBank.png')}/>;
                break;
            case '宁夏银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/ningxiaBank.png')}/>;
                break;
            case '宁波慈溪农村商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/ningboCXSYBank.png')}/>;
                break;
            case '宁波银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/ningboBank.png')}/>;
                break;
            case '安徽涡阳农村商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/anhuiWCSYBank.png')}/>;
                break;
            case '平安银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/pinganBank.png')}/>;
                break;
            case '广发银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/guangfaBank.png')}/>;
                break;
            case '广州银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/guangzhouBank.png')}/>;
                break;
            case '廊坊银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/langfaBank.png')}/>;
                break;
            case '张家口银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/zhangjiakouBank.png')}/>;
                break;
            case '徽商银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/huishangBank.png')}/>;
                break;
            case '恒丰银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/hengfengBank.png')}/>;
                break;
            case '成都银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/chengduBank.png')}/>;
                break;
            case '抚顺银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/fushunBank.png')}/>;
                break;
            case '招商银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/zhaoshangBank.png')}/>;
                break;
            case '无锡农村商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/wuxiNCSYBank.png')}/>;
                break;
            case '杭州银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/hangzhouBank.png')}/>;
                break;
            case '民生银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/minshengbank.png')}/>;
                break;
            case '汉口银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/hankouBank.png')}/>;
                break;
            case '江苏东台农村商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/jiangsuDTSYBank.png')}/>;
                break;
            case '江苏新沂农村商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/jiangsuXQSYBank.png')}/>;
                break;
            case '江苏江南农村商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/jiangsuJNSYBank.png')}/>;
                break;
            case '江苏银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/jiangfuBank.png')}/>;
                break;
            case '沧州银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/cangzhouBank.png')}/>;
                break;
            case '河北银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/hebeiBank.png')}/>;
                break;
            case '洛阳银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/luoyangBank.png')}/>;
                break;
            case '浙商银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/zhangshangBank.png')}/>;
                break;
            case '浙江民泰商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/jiangsuMTSYBank.png')}/>;
                break;
            case '浙江泰隆商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/jiangsuTLSYBank.png')}/>;
                break;
            case '渤海银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/bohaiBank.png')}/>;
                break;
            case '温州银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/wenzhouBank.png')}/>;
                break;
            case '湖北银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/hubeiBank.png')}/>;
                break;
            case '湖州银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/huzhouBank.png')}/>;
                break;
            case '烟台银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/yantaiBank.png')}/>;
                break;
            case '焦作市商业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/jiaozuoSYBank.png')}/>;
                break;
            case '珠海华润银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/zhuhaiHRBank.png')}/>;
                break;
            case '盛京银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/shengjinBank.png')}/>;
                break;
            case '福建海峡银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/fujianHaiXiaBank.png')}/>;
                break;
            case '绍兴银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/shaoxingBank.png')}/>;
                break;
            case '苏州银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/suzhouBank.png')}/>;
                break;
            case '葫芦岛银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/huludaoBank.png')}/>;
                break;
            case '辽阳银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/liaoyangBank.png')}/>;
                break;
            case '邯郸银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/handanBank.png')}/>;
                break;
            case '郑州银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/zhengzhouBank.png')}/>;
                break;
            case '金华银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/jinhuaBank.png')}/>;
                break;
            case '锦州银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/jinzhouBank.png')}/>;
                break;
            case '青岛银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/qingdaoBank.png')}/>;
                break;
            case '齐商银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/qishangBank.png')}/>;
                break;
            case '齐鲁银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/qiluBank.png')}/>;
                break;
            case '张家口农业银行':
                return <Image style={styles.bankIcon} source={require('../../assets/bank/chinaNongYeBank.png')}/>;
                break;
            default:
                return <Image style={styles.bankIcon} source={require('../../assets/bank/none.png')}/>;
                break;
        }
    }


}

const instance = new BankIconUtil();

export default instance;
