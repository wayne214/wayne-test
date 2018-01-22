/**
 * Created by xizhixin on 2017/9/20.
 * 底部tabBar导航
 */
import React from 'react';
import {
    Image,
    StyleSheet,
    DeviceEventEmitter,
    Text,
} from 'react-native';

import {
    TabBarBottom,
} from 'react-navigation';

import * as ConstValue from '../../constants/constValue';
import * as StaticColor from '../../constants/staticColor';

import Home from '../../containers/home/home';
import Mine from '../../containers/mine/mine';
import GoodsSource from '../../containers/goodSource/goodSource';
import Order from '../../containers/order/order';
import Income from '../../containers/income/AccountFlow/income';


const styles = StyleSheet.create({
    tabIcon: {
        resizeMode: 'cover',
        marginTop: 10
    },
    pressedIcon: {
        fontFamily: 'iconfont',
        fontSize: 23,
        color: StaticColor.BLUE_TAB_BAR_COLOR,
        marginTop: 7
    },
    renderIcon: {
        fontFamily: 'iconfont',
        fontSize: 23,
        color: StaticColor.GRAY_TEXT_COLOR,
        marginTop: 7
    }
});

const TabRouteConfigs = {
    Home: {
        screen: Home,
        navigationOptions: ({navigation, screenProps}) => ({
            tabBarLabel: '首页',
            tabBarIcon: ({focused, tintColor})=>(
                focused ? <Text style={styles.pressedIcon}>&#xe65e;</Text> : <Text style={styles.renderIcon}>&#xe65c;</Text>
            ),
            tabBarOnPress:(scene, jumpToIndex) => {
                DeviceEventEmitter.emit('refreshHome');
                DeviceEventEmitter.emit('refreshMine');
                jumpToIndex(scene.index)
            },
        }),
    },
    GoodsSource: {
        screen: GoodsSource,
        navigationOptions: ({navigation, screenProps}) => ({
            tabBarLabel: '货源',
            tabBarIcon: ({focused,tintColor})=>(
                focused ? <Text style={styles.pressedIcon}>&#xe65a;</Text> : <Text style={styles.renderIcon}>&#xe657;</Text>
            ),
            tabBarOnPress:(scene, jumpToIndex) => {
                if(global.currentStatus == 'driver') {
                    if(global.driverStatus && global.driverStatus == 2) {
                        DeviceEventEmitter.emit('resetGood');
                        jumpToIndex(scene.index)
                    }else {
                        DeviceEventEmitter.emit('certification');
                    }
                }else {
                    if((global.ownerStatus && global.ownerStatus == 12 ) || (global.ownerStatus && global.ownerStatus == 22 )){
                        DeviceEventEmitter.emit('resetGood');
                        if(!global.companyCode){
                            DeviceEventEmitter.emit('getCarrierCode');
                        }
                        jumpToIndex(scene.index)
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }
            }
        }),
    },
    Order: {
        screen: Order,
        navigationOptions: ({navigation, screenProps}) => ({
            tabBarLabel: '订单',
            tabBarIcon: ({focused,tintColor})=>(
                focused ? <Text style={styles.pressedIcon}>&#xe659;</Text> : <Text style={styles.renderIcon}>&#xe658;</Text>
            ),
            tabBarOnPress:(scene, jumpToIndex) => {
                console.log('global.currentStatus=',global.currentStatus);
                console.log('global.driverStatus=',global.driverStatus);
                console.log('global.ownerStatus=',global.ownerStatus);
                if (global.currentStatus == 'driver') { // 司机身份
                    if(global.driverStatus && global.driverStatus == 2) {
                            jumpToIndex(scene.index)
                    }else {
                        DeviceEventEmitter.emit('certification');
                    }
                }else { // 车主身份
                    if ((global.ownerStatus && global.ownerStatus == 12) || (global.ownerStatus && global.ownerStatus == 22)) {
                        jumpToIndex(scene.index)
                    }else {
                        DeviceEventEmitter.emit('certification');
                    }
                }
            },
        }),
    },
    Income: {
        screen: Income,
        navigationOptions: ({navigation, screenProps}) => ({
            tabBarLabel: '收入',
            tabBarIcon: ({focused,tintColor})=>(
                focused ? <Text style={styles.pressedIcon}>&#xe65b;</Text> : <Text style={styles.renderIcon}>&#xe65d;</Text>
            ),
            tabBarOnPress:(scene, jumpToIndex) => {
                if(global.currentStatus == 'driver'){
                    if(global.driverStatus && global.driverStatus == 2) {
                        DeviceEventEmitter.emit('refreshIncome');
                        jumpToIndex(scene.index)
                    }else {
                        DeviceEventEmitter.emit('certification');
                    }
                }else {
                    if ((global.ownerStatus && global.ownerStatus == 12) || (global.ownerStatus && global.ownerStatus == 22)) {
                        jumpToIndex(scene.index)
                    }else {
                        DeviceEventEmitter.emit('certification');
                    }
                }
            },
        }),
    },
    Mine: {
        screen: Mine,
        navigationOptions: ({navigation, screenProps}) => ({
            tabBarLabel: '我的',
            tabBarIcon: ({focused,tintColor})=>(
                focused ? <Text style={styles.pressedIcon}>&#xe65f;</Text> : <Text style={styles.renderIcon}>&#xe655;</Text>
            ),
            tabBarOnPress:(scene, jumpToIndex) => {
                DeviceEventEmitter.emit('getUserCarMine');
                DeviceEventEmitter.emit('refreshMine');
                jumpToIndex(scene.index)
            },
        }),
    }
};
const TabNavigatorConfigs = {
    initialRouteName: 'Home',
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazy: false,
    backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    tabBarOptions: {
        activeTintColor: StaticColor.BLUE_TAB_BAR_COLOR, // 文字和图片选中颜色
        inactiveTintColor: StaticColor.GRAY_TEXT_COLOR, // 文字和图片默认颜色
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        indicatorStyle: {
            height: 0 // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
        },
        style: {
            backgroundColor: '#FFFFFF', // TabBar 背景色
            height:ConstValue.Tabbar_Height,
            paddingBottom: 4,
            //marginBottom: ConstValue.Tabbar_marginBottom,
        },
        labelStyle: {
            fontSize: 10, // 文字大小
            marginBottom: ConstValue.Tabbar_marginBottom,
        },
        iconStyle: {
        }
    },
};

export {
    TabRouteConfigs,
    TabNavigatorConfigs
}
