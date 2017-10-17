/**
 * Created by xizhixin on 2017/9/20.
 * 底部tabBar导航
 */
import React from 'react';
import {
    Image,
    StyleSheet,
    DeviceEventEmitter,
} from 'react-native';

import {
    TabBarBottom,
} from 'react-navigation';

import HomeRenderIcon from '../../../assets/tabBar/bar_home_nomarl.png';
import HomePressedIcon from '../../../assets/tabBar/bar_home_pressed.png';
import CenterRenderIcon from '../../../assets/tabBar/bar_center_normal.png';
import CenterPressedIcon from '../../../assets/tabBar/bar_center_pressed.png';
import NearRenderIcon from '../../../assets/tabBar/bar_map_normal.png';
import NearPressedIcon from '../../../assets/tabBar/bar_map_pressed.png';
import OrderRenderIcon from '../../../assets/tabBar/bar_order_normal.png';
import OrderPressedIcon from '../../../assets/tabBar/bar_order_pressed.png';
import IncomeRenderIcon from '../../../assets/tabBar/bar_income_normal.png';
import IncomePressedIcon from '../../../assets/tabBar/bar_income_pressed.png';
import * as ConstValue from '../../constants/constValue';

import Home from '../../containers/home/home';
import Mine from '../../containers/mine/mine';
import GoodsSource from '../../containers/goodSource/goodSource';
import Order from '../../containers/order/order';
import Income from '../../containers/income/AccountFlow/income';


const styles = StyleSheet.create({
    tabIcon: {
        resizeMode: 'cover',
        marginTop: 10
    }
});

const TabRouteConfigs = {
    Home: {
        screen: Home,
        navigationOptions: ({navigation, screenProps}) => ({
            title: '首页',
            tabBarIcon: ({focused, tintColor})=>(
                <Image
                    source={focused ? HomePressedIcon : HomeRenderIcon}
                    style={styles.tabIcon}
                />
            ),
            tabBarOnPress:(scene, jumpToIndex) => {
                DeviceEventEmitter.emit('refreshHome');
                jumpToIndex(scene.index)
            },
        }),
    },
    GoodsSource: {
        screen: GoodsSource,
        navigationOptions: ({navigation, screenProps}) => ({
            title: '货源',
            tabBarIcon: ({focused,tintColor})=>(
                <Image
                    source={focused ? NearPressedIcon : NearRenderIcon}
                    style={styles.tabIcon}
                />
            ),
            tabBarOnPress:(scene, jumpToIndex) => {
                if (global.plateNumber && global.plateNumber !== '') {
                    if (!(global.plateNumberObj.carStatus && global.plateNumberObj.carStatus === 20)) {
                        DeviceEventEmitter.emit('notifyCarStatus');
                    }
                } else {
                    DeviceEventEmitter.emit('getUserCar');
                }
                jumpToIndex(scene.index)
            }
        }),
    },
    Order: {
        screen: Order,
        navigationOptions: ({navigation, screenProps}) => ({
            title: '订单',
            tabBarIcon: ({focused,tintColor})=>(
                <Image
                    source={focused ? OrderPressedIcon : OrderRenderIcon}
                    style={styles.tabIcon}
                />
            ),
            tabBarOnPress:(scene, jumpToIndex) => {
                if (global.plateNumber && global.plateNumber !== '') {
                    if (!(global.plateNumberObj.carStatus && global.plateNumberObj.carStatus === 20)) {
                        DeviceEventEmitter.emit('notifyCarStatus');
                    }
                } else {
                    DeviceEventEmitter.emit('getUserCar');
                }
                jumpToIndex(scene.index)
            },
        }),
    },
    Income: {
        screen: Income,
        navigationOptions: ({navigation, screenProps}) => ({
            title: '收入',
            tabBarIcon: ({focused,tintColor})=>(
                <Image
                    source={focused? IncomePressedIcon : IncomeRenderIcon}
                    style={styles.tabIcon}
                />
            ),
            tabBarOnPress:(scene, jumpToIndex) => {
                DeviceEventEmitter.emit('refreshIncome');
                jumpToIndex(scene.index)
            },
        }),
    },
    Mine: {
        screen: Mine,
        navigationOptions: ({navigation, screenProps}) => ({
            title: '我的',
            tabBarIcon: ({focused,tintColor})=>(
                <Image
                    source={focused? CenterPressedIcon : CenterRenderIcon}
                    style={styles.tabIcon}
                />
            ),
            tabBarOnPress:(scene, jumpToIndex) => {
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
    lazy: true,
    backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    tabBarOptions: {
        activeTintColor: '#2562b4', // 文字和图片选中颜色
        // inactiveTintColor: '#999999', // 文字和图片默认颜色
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        indicatorStyle: {
            height: 0 // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
        },
        style: {
            backgroundColor: '#FFFFFF', // TabBar 背景色
            marginBottom: ConstValue.Tabbar_marginBottom
        },
        labelStyle: {
            fontSize: 10, // 文字大小
        },
        iconStyle: {
        }

    },
};

export {
    TabRouteConfigs,
    TabNavigatorConfigs
}
