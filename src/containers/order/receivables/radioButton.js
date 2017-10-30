import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';

const {width} = Dimensions.get('window');

export default class RadioButton extends Component {
    constructor(props, context) {
        super(props, context)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selectedIndex: nextProps.selectedIndex
        })
    }

    getRadioStyle() {
        return {
            height: this.context.size,
            width: this.context.size,
            borderRadius: this.context.size / 2,
            borderWidth: this.context.thickness,
            borderColor: this.props.isSelected && this.props.activeColor ? this.props.activeColor : this.context.color,
        }
    }

    getRadioDotStyle() {
        return {
            height: this.context.size / 2,
            width: this.context.size / 2,
            borderRadius: this.context.size / 4,
            backgroundColor: this.props.color || this.props.activeColor,
        }
    }

    isSelected() {
        if (this.props.isSelected) {
            // return <View style={this.getRadioDotStyle()}/>
            return <Text style={{fontSize: 15, fontFamily: 'iconfont', color: StaticColor.COLOR_MAIN, marginRight: 20}}>&#xe616;</Text>
        } else {
            return <View />
        }
    }

    render() {
        const {children, imageUrl, color} = this.props;
        return (
            <View style={{opacity: this.props.disabled ? 0.4 : 1}}>
                <TouchableWithoutFeedback
                    disabled={this.props.disabled}
                    onPress={() => this.context.onSelect(this.props.index, this.props.value)}
                >
                    <View
                        style={[styles.container, this.props.style, this.props.isSelected ? {backgroundColor: this.context.highlightColor} : null]}>
                        {/*<Image source={imageUrl} style={{width: 20, height: 20}}/>*/}
                        <Text style={{fontSize: 16, fontFamily: 'iconfont', color: color}}>{imageUrl}</Text>
                        <View style={styles.item}>
                            {children}
                        </View>
                        {/*<View style={[styles.radio, this.getRadioStyle()]}>*/}
                            {/*{this.isSelected()}*/}
                        {/*</View>*/}
                        <View style={styles.radio}>
                            {this.isSelected()}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{backgroundColor: '#f5f5f5', height: 1, width: width}}/>
            </View>
        )
    }
}

RadioButton.contextTypes = {
    onSelect: PropTypes.func.isRequired,
    size: PropTypes.number.isRequired,
    thickness: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    highlightColor: PropTypes.string
}

let styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // padding: 10,
        height: 44,
        justifyContent: 'space-between',
        alignItems: 'center',
        width,
    },
    radio: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        marginLeft: 5,
        justifyContent: 'center',
        flex: 1,
    }
})
