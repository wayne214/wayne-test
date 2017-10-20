/**
 * Created by wayne on 2017/4/13.
 */
import React, {Component, PropTypes} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing, StyleSheet, Platform, Dimensions, DeviceEventEmitter} from 'react-native';
import StaticImage from '../../../constants/staticImage';
import * as ConstValue from '../../../constants/constValue';
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
    title: {
        flex: 1,
        ...Platform.select({
            ios: {
                height: ConstValue.NavigationBar_StatusBar_Height,
                paddingTop: 15,
            },
            android: {
                height: 50,
            },
        }),
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropDown: {
        position: 'absolute',
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                top: ConstValue.NavigationBar_StatusBar_Height,
            },
            android: {
                top: 50,
            },
        }),
        bottom: 0,
    },
    preferences: {
        ...Platform.select({
            ios: {
                height: ConstValue.NavigationBar_StatusBar_Height,
                paddingTop: 40,
            },
            android: {
                height: 50,
                paddingTop: 14,
            },
        }),
        alignSelf: 'center',
        position: 'absolute',
        right: 20,
    },
});
export default class DropdownMenu extends Component {
    static propTypes = {
        bgColor: PropTypes.string,
        maxHeight: PropTypes.number,
        tintColor: PropTypes.string,
    };

    constructor(props, context) {
        super(props, context);

        const selectIndex = new Array(this.props.data.length);
        for (let i = 0; i < selectIndex.length; i++) {
            selectIndex[i] = 0;
        }
        this.state = {
            activityIndex: -1,
            selectIndex,
            rotationAnims: props.data.map(() => new Animated.Value(0)),
        };

        this.defaultConfig = {
            bgColor: 'grey',
            tintColor: 'white',
            selectItemColor: 'red',
            arrowImg: StaticImage.close,
            checkImage: StaticImage.close,
        };
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('resetGood', () => {
            this.setState({
                selectIndex: [0, 1],
            });
        });
    }
    componentWillUnmount() {
        this.listener.remove();
    }
    openOrClosePanel(index) {
        // var toValue = 0.5;
        if (this.state.activityIndex === index) {
            this.closePanel(index);
            this.setState({
                activityIndex: -1,
            });
            // toValue = 0;
        } else {
            if (this.state.activityIndex > -1) {
                this.closePanel(this.state.activityIndex);
            }
            this.openPanel(index);
            this.setState({
                activityIndex: index,
            });
            // toValue = 0.5;
        }
        // Animated.timing(
        //   this.state.rotationAnims[index],
        //   {
        //     toValue: toValue,
        //     duration: 300,
        //     easing: Easing.linear
        //   }
        // ).start();
    }

    openPanel(index) {
        Animated.timing(
            this.state.rotationAnims[index],
            {
                toValue: 0.5,
                duration: 300,
                easing: Easing.linear,
            },
        ).start();
    }

    closePanel(index) {
        Animated.timing(
            this.state.rotationAnims[index],
            {
                toValue: 0,
                duration: 300,
                easing: Easing.linear,
            },
        ).start();
    }

    itemOnPress(index) {
        if (this.state.activityIndex > -1) {
            const selectIndex = this.state.selectIndex;
            selectIndex[this.state.activityIndex] = index;
            this.setState({
                selectIndex,
            });
            if (this.props.handler) {
                this.props.handler(this.state.activityIndex, index);
            }
        }
        this.openOrClosePanel(this.state.activityIndex);
    }

    renderActivityPanel() {
        if (this.state.activityIndex >= 0) {
            const currentTitles = this.props.data[this.state.activityIndex];

            const heightStyle = {};
            if (this.props.maxHeight && this.props.maxHeight < currentTitles.length * 44) {
                heightStyle.height = this.props.maxHeight;
            }

            return (
                <View style={styles.dropDown}>
                    <TouchableOpacity
                        onPress={() => this.openOrClosePanel(this.state.activityIndex)} activeOpacity={1}
                        style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
                    >
                        <View style={{opacity: 0.1, backgroundColor: 'black'}} />
                    </TouchableOpacity>
                    <View style={{backgroundColor: 'white', height: 88, opacity: 1}}/>

                    <ScrollView
                        style={[{
                            // height: height,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'black',
                            opacity: 0.8,
                        }, heightStyle]}
                        scrollEnabled={false}
                    >
                        {
                            currentTitles.map((title, index) =>
                                <TouchableOpacity
                                    key={index} activeOpacity={1} style={{height: 44, backgroundColor: 'white'}}
                                    onPress={this.itemOnPress.bind(this, index)}
                                >
                                    {this.renderCheck(index, title)}
                                    <View style={{backgroundColor: '#d9d9d9', height: 1, marginLeft: 15}} />
                                </TouchableOpacity>,
                            )
                        }

                    </ScrollView>
                    <TouchableOpacity onPress={() => { this.openOrClosePanel(this.state.activityIndex); }}>
                        <View
                            style={{backgroundColor: 'black', height: height - 88, opacity: 0.5}}
                        />
                    </TouchableOpacity>
                </View>
            );
        }
        return (null);
    }

    renderCheck(index, title) {
        const activityIndex = this.state.activityIndex;
        if (this.state.selectIndex[activityIndex] === index) {
            const checkImage = this.props.checkImage ? this.props.checkImage : StaticImage.close;
            return (
                <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 15, flexDirection: 'row', backgroundColor: 'white'}}>
                    <Image source={index === 0 ? StaticImage.waitHandle : StaticImage.reject} />
                    <Text
                        style={{
                            color: this.props.selectItemColor ? this.props.selectItemColor : this.defaultConfig.selectItemColor,
                            flex: 1,
                            marginLeft: 15,
                            fontSize: 16,
                        }}
                    >{title}</Text>
                    <Image source={checkImage} />
                </View>
            );
        }
        if (this.state.selectIndex[activityIndex] !== index) {
            return (
                <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 15, flexDirection: 'row', backgroundColor: 'white'}}>
                    <Image source={index === 0 ? StaticImage.waitHandle : StaticImage.reject} />
                    <Text style={{color: 'black', marginLeft: 15, fontSize: 16, flex: 1}}>{title}</Text>
                </View>
            );
        }
    }

    renderDropDownArrow(index) {
        const icon = this.props.arrowImg ? this.props.arrowImg : StaticImage.close;

        return (
            <Animated.Image
                source={icon}
                style={{
                    marginLeft: 8,
                    transform: [{
                        rotateZ: this.state.rotationAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                        }),
                    }],
                }}
            />
        );
    }

    render() {

        const TextStyle = ConstValue.is_iPhoneX ? {marginTop: 10} : {};
        return (
            <View style={{flexDirection: 'column', flex: 1}}>
                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: this.props.bgColor ? this.props.bgColor : this.defaultConfig.bgColor,
                    }}
                >

                    {
                        this.props.data.map((rows, index) =>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={this.openOrClosePanel.bind(this, index)}
                                key={index}
                                style={styles.title}
                            >
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
                                    <Text
                                        style={{
                                            color: this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor,
                                            fontSize: 18,
                                        }}
                                    >{rows[this.state.selectIndex[index]]}</Text>
                                    {this.renderDropDownArrow(index)}
                                </View>
                            </TouchableOpacity>,
                        )
                    }
                    {/*货源偏好设置入口*/}
                    <TouchableOpacity style={styles.preferences} onPress={() => { this.props.preferences(); }} activeOpacity={1}>
                        <View>
                            <Text style={[{fontSize: 17, color: this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor},]}>货源偏好</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {this.props.children}

                {this.renderActivityPanel()}

            </View>
        );
    }
}

DropdownMenu.propTypes = {
    data: React.PropTypes.array.isRequired,
    handler: React.PropTypes.func.isRequired,
    checkImage: React.PropTypes.number.isRequired,
    selectItemColor: React.PropTypes.string.isRequired,
    arrowImg: React.PropTypes.number.isRequired,
    children: React.PropTypes.object,
};

