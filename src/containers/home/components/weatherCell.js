/**
 * Created by xizhixin on 2017/7/10.
 * 首页天气布局
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
} from 'react-native';

import StaticWeatherImage from '../../../constants/weatherClass/staticWeatherImage';
import BaseView from '../../base/baseView';

const styles = StyleSheet.create({
    weatherStyle: {
        height: 20,
        width: 20,
    }
});

class WeatherCell extends BaseView {
    static propTypes = {
        weatherIcon: PropTypes.string
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const {
            weatherIcon
        } = this.props;


        return (
            <View>
                {
                    weatherIcon === '0' || weatherIcon === '晴' ?
                        <Image
                            style={styles.weatherStyle}
                            source={StaticWeatherImage.sunny}/>
                        : weatherIcon === '1' || weatherIcon === '多云' ?
                        <Image
                            style={styles.weatherStyle}
                            source={StaticWeatherImage.cloudy}/>
                        : weatherIcon === '2' || weatherIcon === '阴' ?
                            <Image
                                style={styles.weatherStyle}
                                source={StaticWeatherImage.yin}/>
                            : weatherIcon === '3' || weatherIcon === '阵雨' ?
                                <Image
                                    style={styles.weatherStyle}
                                    source={StaticWeatherImage.shower}/>
                                : weatherIcon === '4' || weatherIcon === '雷阵雨' ?
                                    <Image
                                        style={styles.weatherStyle}
                                        source={StaticWeatherImage.thunderShower}/>
                                    : weatherIcon === '5' || weatherIcon === '雷阵雨伴有冰雹' ?
                                        <Image
                                            style={styles.weatherStyle}
                                            source={StaticWeatherImage.thunderShowerWithHail}/>
                                        : weatherIcon === '6' || weatherIcon === '雨夹雪' ?
                                            <Image
                                                style={styles.weatherStyle}
                                                source={StaticWeatherImage.sleet}/>
                                            : weatherIcon === '7' || weatherIcon === '小雨' ?
                                                <Image
                                                    style={styles.weatherStyle}
                                                    source={StaticWeatherImage.lightRain}/>
                                                : weatherIcon === '8' || weatherIcon === '中雨' ?
                                                    <Image
                                                        style={styles.weatherStyle}
                                                        source={StaticWeatherImage.moderateRain}/>
                                                    : weatherIcon === '9' || weatherIcon === '大雨' ?
                                                        <Image
                                                            style={styles.weatherStyle}
                                                            source={StaticWeatherImage.heavyRain}/>
                                                        : weatherIcon === '10' || weatherIcon === '暴雨' ?
                                                            <Image
                                                                style={styles.weatherStyle}
                                                                source={StaticWeatherImage.heavyRains}/>
                                                            : weatherIcon === '11' || weatherIcon === '大暴雨' ?
                                                                <Image
                                                                    style={styles.weatherStyle}
                                                                    source={StaticWeatherImage.torrentialRain}/>
                                                                : weatherIcon === '12' || weatherIcon === '特大暴雨' ?
                                                                    <Image
                                                                        style={styles.weatherStyle}
                                                                        source={StaticWeatherImage.rainStorm}/>
                                                                    : weatherIcon === '13' || weatherIcon === '阵雪' ?
                                                                        <Image
                                                                            style={styles.weatherStyle}
                                                                            source={StaticWeatherImage.snowShower}/>
                                                                        : weatherIcon === '14' || weatherIcon === '小雪' ?
                                                                            <Image
                                                                                style={styles.weatherStyle}
                                                                                source={StaticWeatherImage.lightSnow}/>
                                                                            : weatherIcon === '15' || weatherIcon === '中雪' ?
                                                                                <Image
                                                                                    style={styles.weatherStyle}
                                                                                    source={StaticWeatherImage.moderateSnow}/>
                                                                                : weatherIcon === '16' || weatherIcon === '大雪' ?
                                                                                    <Image
                                                                                        style={styles.weatherStyle}
                                                                                        source={StaticWeatherImage.heavySnow}/>
                                                                                    : weatherIcon === '17' || weatherIcon === '暴雪' ?
                                                                                        <Image
                                                                                            style={styles.weatherStyle}
                                                                                            source={StaticWeatherImage.heavySnowfall}/>
                                                                                        : weatherIcon === '18' || weatherIcon === '雾' ?
                                                                                            <Image
                                                                                                style={styles.weatherStyle}
                                                                                                source={StaticWeatherImage.fog}/>
                                                                                            : weatherIcon === '19' || weatherIcon === '冻雨' ?
                                                                                                <Image
                                                                                                    style={styles.weatherStyle}
                                                                                                    source={StaticWeatherImage.freezingRain}/>
                                                                                                : weatherIcon === '20' || weatherIcon === '沙尘暴' ?
                                                                                                    <Image
                                                                                                        style={styles.weatherStyle}
                                                                                                        source={StaticWeatherImage.sandStorm}/>
                                                                                                    : weatherIcon === '21' || weatherIcon === '小雨-中雨' ?
                                                                                                        <Image
                                                                                                            style={styles.weatherStyle}
                                                                                                            source={StaticWeatherImage.lightRain_moderateRain}/>
                                                                                                        : weatherIcon === '22' || weatherIcon === '中雨-大雨' ?
                                                                                                            <Image
                                                                                                                style={styles.weatherStyle}
                                                                                                                source={StaticWeatherImage.moderateRain_heavyRain}/>
                                                                                                            : weatherIcon === '23' || weatherIcon === '大雨-暴雨' ?
                                                                                                                <Image
                                                                                                                    style={styles.weatherStyle}
                                                                                                                    source={StaticWeatherImage.heavyRain_heavyRains}/>
                                                                                                                : weatherIcon === '24' || weatherIcon === '暴雨-大暴雨' ?
                                                                                                                    <Image
                                                                                                                        style={styles.weatherStyle}
                                                                                                                        source={StaticWeatherImage.heavyRains_torrentialRain}/>
                                                                                                                    : weatherIcon === '25' || weatherIcon === '大暴雨-特大暴雨' ?
                                                                                                                        <Image
                                                                                                                            style={styles.weatherStyle}
                                                                                                                            source={StaticWeatherImage.torrentialRain_rainStorm}/>
                                                                                                                        : weatherIcon === '26' || weatherIcon === '小雪-中雪' ?
                                                                                                                            <Image
                                                                                                                                style={styles.weatherStyle}
                                                                                                                                source={StaticWeatherImage.lightSnow_moderateSnow}/>
                                                                                                                            : weatherIcon === '27' || weatherIcon === '中雪-大雪' ?
                                                                                                                                <Image
                                                                                                                                    style={styles.weatherStyle}
                                                                                                                                    source={StaticWeatherImage.moderateSnow_heavySnow}/>
                                                                                                                                : weatherIcon === '28' || weatherIcon === '大雪-暴雪' ?
                                                                                                                                    <Image
                                                                                                                                        style={styles.weatherStyle}
                                                                                                                                        source={StaticWeatherImage.heavySnow_heavySnowfall}/>
                                                                                                                                    : weatherIcon === '29' || weatherIcon === '浮尘' ?
                                                                                                                                        <Image
                                                                                                                                            style={styles.weatherStyle}
                                                                                                                                            source={StaticWeatherImage.flyAsh}/>
                                                                                                                                        : weatherIcon === '30' || weatherIcon === '扬沙' ?
                                                                                                                                            <Image
                                                                                                                                                style={styles.weatherStyle}
                                                                                                                                                source={StaticWeatherImage.micrometeorology}/>
                                                                                                                                            : weatherIcon === '31' || weatherIcon === '扬沙尘暴' ?
                                                                                                                                                <Image
                                                                                                                                                    style={styles.weatherStyle}
                                                                                                                                                    source={StaticWeatherImage.yangDustStorms}/>
                                                                                                                                                : weatherIcon === '32' || weatherIcon === '浓雾' ?
                                                                                                                                                    <Image
                                                                                                                                                        style={styles.weatherStyle}
                                                                                                                                                        source={StaticWeatherImage.smog}/>
                                                                                                                                                    : weatherIcon === '49' || weatherIcon === '强浓雾' ?
                                                                                                                                                        <Image
                                                                                                                                                            style={styles.weatherStyle}
                                                                                                                                                            source={StaticWeatherImage.strongFog}/>
                                                                                                                                                        : weatherIcon === '53' || weatherIcon === '霾' ?
                                                                                                                                                            <Image
                                                                                                                                                                style={styles.weatherStyle}
                                                                                                                                                                source={StaticWeatherImage.haze}/>
                                                                                                                                                            : weatherIcon === '54' || weatherIcon === '中毒霾' ?
                                                                                                                                                                <Image
                                                                                                                                                                    style={styles.weatherStyle}
                                                                                                                                                                    source={StaticWeatherImage.poisoingHaze}/>
                                                                                                                                                                : weatherIcon === '55' || weatherIcon === '重度霾' ?
                                                                                                                                                                    <Image
                                                                                                                                                                        style={styles.weatherStyle}
                                                                                                                                                                        source={StaticWeatherImage.heavyHaze}/>
                                                                                                                                                                    : weatherIcon === '56' || weatherIcon === '严重霾' ?
                                                                                                                                                                        <Image
                                                                                                                                                                            style={styles.weatherStyle}
                                                                                                                                                                            source={StaticWeatherImage.severeHaze}/>
                                                                                                                                                                        : weatherIcon === '57' || weatherIcon === '大雾' ?
                                                                                                                                                                            <Image
                                                                                                                                                                                style={styles.weatherStyle}
                                                                                                                                                                                source={StaticWeatherImage.bigFog}/>
                                                                                                                                                                            : weatherIcon === '58' || weatherIcon === '特强浓雾' ?
                                                                                                                                                                                <Image
                                                                                                                                                                                    style={styles.weatherStyle}
                                                                                                                                                                                    source={StaticWeatherImage.superStrongFog}/>
                                                                                                                                                                                : weatherIcon === '301' || weatherIcon === '雨' ?
                                                                                                                                                                                    <Image
                                                                                                                                                                                        style={styles.weatherStyle}
                                                                                                                                                                                        source={StaticWeatherImage.rain}/>
                                                                                                                                                                                    : weatherIcon === '302' || weatherIcon === '雪' ?
                                                                                                                                                                                        <Image
                                                                                                                                                                                            style={styles.weatherStyle}
                                                                                                                                                                                            source={StaticWeatherImage.snow}/>
                                                                                                                                                                                        :
                                                                                                                                                                                        <Image
                                                                                                                                                                                            style={styles.weatherStyle}
                                                                                                                                                                                            source={StaticWeatherImage.sunny}/>

                }
            </View>
        )
            ;
    }
}

export default WeatherCell;
