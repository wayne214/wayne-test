/**
 * Created by xizhixin on 2017/4/12.
 * 百度地图界面
 */

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Platform,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {
    MapView,
    MapTypes,
    Geolocation,
    GetDistance,
} from 'react-native-baidu-map-xzx';

import NavigatorBar from './navigationBar/navigationBar';
import Toast from '@remobile/react-native-toast';
import * as StaticColor from '../constants/staticColor';
import * as ConstValue from '../constants/constValue';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    map: {
        ...Platform.select({
            ios: {
                height: height - ConstValue.NavigationBar_StatusBar_Height,
            },
            android: {
                height: height - 73,
            },
        }),
        width,
    },
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
});

class BaiduMap extends Component {
    constructor(props) {
        super(props);

        const params = this.props.navigation.state.params;

        this.state = {
            mayType: MapTypes.NORMAL,
            zoom: 15,
            arr: [],
            center: {
                longitude: 116.404269,
                latitude: 39.914935,
            },
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            sendAddr: params.sendAddr,
            receiveAddr: params.receiveAddr,
            clickFlag: params.clickFlag,

        };
        this.getLatAndLot = this.getLatAndLot.bind(this);
        this.setMapZoom = this.setMapZoom.bind(this);
    }

    componentDidMount() {
        if (this.state.sendAddr) {
            this.getLatAndLot('', this.state.sendAddr, 1);
        } else {
            Toast.showShortCenter('未能找到所在位置');
        }
    }


    // 通过详细地址获取经纬度
    getLatAndLot(city, addr, type) {
        console.log(city + addr + type);
        Geolocation.geocode(city, addr).then((data) => {
            console.log(data);
            if (!data.errcode) {
                const marker = {
                    latitude: Number(data.latitude),
                    longitude: Number(data.longitude),
                    title: addr,
                };
                this.state.arr.push(marker);
                if (type === 1) {
                    if (this.state.receiveAddr) {
                        this.getLatAndLot('', this.state.receiveAddr, 2);
                    } else {
                        Toast.showShortCenter('未能找到所在位置');
                    }
                } else {
                    this.setMapZoom(this.state.arr);
                }
            } else {
                Toast.showShortCenter('未能找到所在位置');
            }
        })
            .catch((e) => {
                console.log(e);
                Toast.showShortCenter('未能找到所在位置');
            });
    }

    setMapZoom(markers) {
        GetDistance.getDistance(markers[0].latitude, markers[0].longitude,
            markers[1].latitude, markers[1].longitude)
            .then((data) => {
                const distance = Math.round(data.distance);
                const arr = ['2000000', '1000000', '500000', '200000', '100000', '50000', '25000', '20000', '10000', '5000', '2000', '1000', '500', '200', '100', '50', '20', '10', '5'];
                if (distance === 0) {
                    let point = {
                        latitude: Number(markers[0].latitude),
                        longitude: Number(markers[0].longitude),
                    };
                    if (this.state.clickFlag === 'receiver') {
                        point = {
                            latitude: Number(markers[1].latitude),
                            longitude: Number(markers[1].longitude),
                        };
                    }
                    this.setState({
                        zoom: 17,
                        markers,
                        center: {
                            latitude: point.latitude,
                            longitude: point.longitude,
                        },
                    });
                }
                for (let j = 0; j < arr.length; j++) {
                    if (j + 1 < arr.length) {
                        if (distance < arr[j] && distance > arr[j + 1]) {
                            let point = {
                                latitude: Number(markers[0].latitude),
                                longitude: Number(markers[0].longitude),
                            };
                            if (this.state.clickFlag === 'receiver') {
                                point = {
                                    latitude: Number(markers[1].latitude),
                                    longitude: Number(markers[1].longitude),
                                };
                            }
                            this.setState({
                                zoom: j + 5,
                                markers,
                                center: {
                                    latitude: point.latitude,
                                    longitude: point.longitude,
                                },
                            });
                            break;
                        }
                    }
                }
            })
            .catch((e) => {
                console.warn(e, 'error');
            });
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'所在位置'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <View>
                    <MapView
                        trafficEnabled={this.state.trafficEnabled}
                        baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                        zoom={this.state.zoom}
                        mapType={this.state.mapType}
                        center={this.state.center}
                        marker={this.state.marker}
                        markers={this.state.markers}
                        style={styles.map}
                        onMarkerClick={(e) => {
                            console.log(e);
                        }}
                        onMapClick={(e) => {
                            console.log(e);
                        }}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BaiduMap);


