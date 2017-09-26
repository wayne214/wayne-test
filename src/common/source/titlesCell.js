/*
 * @author:  wangl
 * @description:  货源详情 运货单界面
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    TouchableOpacity,
    Easing,
} from 'react-native';

import * as StaticColor from '../../constants/staticColor';
// import receiveBottomArrow from '../../../assets/img/receive_bottom_arrow.png';
import StaticImage from '../../constants/staticImage';
const styles = StyleSheet.create({
    container: {
        backgroundColor: StaticColor.WHITE_COLOR,
        paddingLeft: 20,
    },
    text: {
        fontSize: 16,
        marginBottom: 15,
        marginTop: 15,
        color: '#333',
    },
    view: {
        height: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
});

class TitlesCell extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        showArrowIcon: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            rotationAnims: new Animated.Value(0),
            isOpen: true,
        };
        this.defaultConfig = {
            showArrowIcon: false,
        };
    }

    openOrClosePanel() {
        if (this.state.isOpen) {
            this.openPanel();
        } else {
            this.closePanel();
        }
    }
    openPanel() {
        Animated.timing(
            this.state.rotationAnims,
            {
                toValue: 0.5,
                duration: 300,
                easing: Easing.linear,
            },
        ).start();
        this.setState({
            isOpen: false,
        });
    }

    closePanel() {
        Animated.timing(
            this.state.rotationAnims,
            {
                toValue: 0,
                duration: 300,
                easing: Easing.linear,
            },
        ).start();
        this.setState({
            isOpen: true,
        });
    }
    renderDropDownArrow() {
        const icon = this.props.arrowImg ? this.props.arrowImg : StaticImage.receiveBottomArrow;

        return (
            <Animated.Image
                source={icon}
                style={{
                    width: 14,
                    height: 7,
                    transform: [{
                        rotateZ: this.state.rotationAnims.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                        }),
                    }],
                }}
            />
        );
    }

    render() {
        const {title, showArrowIcon, onPress} = this.props;
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 10}}>
                    <Text style={styles.text}>{title}</Text>
                    {
                        showArrowIcon ? <TouchableOpacity
                            onPress={() => {
                                this.openOrClosePanel();
                                onPress(this.state.isOpen);
                            }}
                            style={{flex: 1}}
                        >
                            <View style={{padding: 10, alignSelf: 'flex-end'}}>
                                {this.renderDropDownArrow()}
                            </View>
                        </TouchableOpacity> : null
                    }
                </View>
                {
                    !this.state.isOpen ? <View style={styles.view}/> : null
                }
            </View>
        );
    }
}

export default TitlesCell;
