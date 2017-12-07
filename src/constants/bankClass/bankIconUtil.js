/**
 * database tools class
 */
import React, {Component, PropTypes} from 'react';
import {
    Image,
    StyleSheet,
} from 'react-native';

import StaticBankImage from './staticBankImage';

const styles = StyleSheet.create({
    bankIcon: {
        height: 30,
        width: 30,
        margin: 15
    }
});

class BankIconUtil {

    show(bankIcon) {
        switch (bankIcon) {
            case '上海浦东发展银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.Shpufafazhanbank}/>;
                break;
            case '上海银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.Shanghaibank}/>;
                break;
            case '东莞银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.Dongguanbank}/>;
                break;
            case '中信银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ZhongXinBank }/>;
                break;
            case '中国光大银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ChinaGuangDaBank }/>;
                break;
            case '光大银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.GuangDaBank }/>;
                break;
            case '中国农业发展银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ChinaNYFazhanBank }/>;
                break;
            case '农业发展银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.NYFazhanBank }/>;
                break;
            case '中国农业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ChinaNongYeBank }/>;
                break;
            case '农业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.NongYeBank }/>;
                break;
            case '中国工商银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ChinaGongshangbank }/>;
                break;
            case '工商银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.Gongshangbank }/>;
                break;
            case '中国建设银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ChinaJianSheBank }/>;
                break;
            case '建设银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.JianSheBank }/>;
                break;
            case '中国邮政储蓄银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ChinaYouzhengCXBank }/>;
                break;
            case '中国银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.Zhongguobank }/>;
                break;
            case '中金支付':
                return <Image style={styles.bankIcon} source={StaticBankImage.ZhongJinBank }/>;
                break;
            case '临商银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.LinShangBank }/>;
                break;
            case '乌鲁木齐商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.WlmqShangYeBank }/>;
                break;
            case '交通银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.JiaoTongBank }/>;
                break;
            case '兴业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.XingYeBank }/>;
                break;
            case '包商银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.BaoShangBank }/>;
                break;
            case '北京农村商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.BeijingNCSYBank }/>;
                break;
            case '北京银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.BeijingBank }/>;
                break;
            case '华夏银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.HuangxiaBank }/>;
                break;
            case '南京银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.NanjingBank }/>;
                break;
            case '南充市商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.NanchongSSYBank }/>;
                break;
            case '厦门银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.XiamenBank }/>;
                break;
            case '吉林省农村信用社':
                return <Image style={styles.bankIcon} source={StaticBankImage.JilinNCXYSBank }/>;
                break;
            case '哈尔滨银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.HaerbinBank }/>;
                break;
            case '大连银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.DalianBank }/>;
                break;
            case '天津银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.TianjinBank }/>;
                break;
            case '宁夏银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.NingxiaBank }/>;
                break;
            case '宁波慈溪农村商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.NingboCXSYBank }/>;
                break;
            case '宁波银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.NingboBank }/>;
                break;
            case '安徽涡阳农村商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.AnhuiWCSYBank }/>;
                break;
            case '平安银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.PinganBank }/>;
                break;
            case '广发银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.GuangfaBank }/>;
                break;
            case '广州银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.GuangzhouBank }/>;
                break;
            case '廊坊银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.LangfaBank }/>;
                break;
            case '张家口银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ZhangjiakouBank }/>;
                break;
            case '徽商银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.HuishangBank }/>;
                break;
            case '恒丰银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.HengfengBank }/>;
                break;
            case '成都银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ChengduBank }/>;
                break;
            case '抚顺银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.FushunBank }/>;
                break;
            case '招商银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ZhaoshangBank }/>;
                break;
            case '无锡农村商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.WuxiNCSYBank }/>;
                break;
            case '杭州银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.HangzhouBank }/>;
                break;
            case '民生银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.Minshengbank }/>;
                break;
            case '汉口银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.HankouBank }/>;
                break;
            case '江苏东台农村商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.JiangsuDTSYBank }/>;
                break;
            case '江苏新沂农村商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.JiangsuXQSYBank }/>;
                break;
            case '江苏江南农村商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.JiangsuJNSYBank }/>;
                break;
            case '江苏银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.JiangfuBank }/>;
                break;
            case '沧州银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.CangzhouBank }/>;
                break;
            case '河北银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.HebeiBank }/>;
                break;
            case '洛阳银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.LuoyangBank }/>;
                break;
            case '浙商银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ZhangshangBank }/>;
                break;
            case '浙江民泰商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.JiangsuMTSYBank }/>;
                break;
            case '浙江泰隆商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.JiangsuTLSYBank }/>;
                break;
            case '渤海银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.BohaiBank }/>;
                break;
            case '温州银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.WenzhouBank }/>;
                break;
            case '湖北银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.HubeiBank }/>;
                break;
            case '湖州银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.HuzhouBank }/>;
                break;
            case '烟台银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.YantaiBank }/>;
                break;
            case '焦作市商业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.JiaozuoSYBank }/>;
                break;
            case '珠海华润银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ZhuhaiHRBank }/>;
                break;
            case '盛京银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ShengjinBank }/>;
                break;
            case '福建海峡银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.FujianHaiXiaBank }/>;
                break;
            case '绍兴银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ShaoxingBank }/>;
                break;
            case '苏州银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.SuzhouBank }/>;
                break;
            case '葫芦岛银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.HuludaoBank }/>;
                break;
            case '辽阳银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.LiaoyangBank }/>;
                break;
            case '邯郸银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.HandanBank }/>;
                break;
            case '郑州银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ZhengzhouBank }/>;
                break;
            case '金华银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.JinhuaBank }/>;
                break;
            case '锦州银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.JinzhouBank }/>;
                break;
            case '青岛银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.QingdaoBank }/>;
                break;
            case '齐商银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.QishangBank }/>;
                break;
            case '齐鲁银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.QiluBank }/>;
                break;
            case '张家口农业银行':
                return <Image style={styles.bankIcon} source={StaticBankImage.ZhangjiakouNYBank}/>;
                break;
            default:
                return <Image style={styles.bankIcon} source={StaticBankImage.NoneBank }/>;
                break;
        }
    }


}

const instance = new BankIconUtil();

export default instance;
