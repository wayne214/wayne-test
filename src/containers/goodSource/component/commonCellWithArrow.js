import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
} from 'react-native';
import StaticImage from '../../../constants/staticImage';

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    leftIcon: {
        marginRight: 10,
    },
    rightIcon: {
        marginLeft: 20,
    },
    cityAndTimeContainer: {
        height: 44,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
    },
    cityOrTimeText: {
        fontSize: 16,
        color: '#333333',
    },
    separateLine: {
        height: 1,
        backgroundColor: '#e8e8e8',
        marginLeft: 20,
    },
});

class commnCellWithArrow extends Component {
    static propTypes = {
        style: PropTypes.object,
        hideArrowIcon: PropTypes.bool,
        showLeftIcon: PropTypes.bool,
        itemTitleStyle: Text.propTypes.style,
    };

    componentDidMount() {
        console.log('屏幕宽度', width);
    }

    render() {
        const {onClick, itemTitle, itemTitleStyle, itemContent, showBottomLine, hideArrowIcon, showLeftIcon} = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    onClick();
                }}
                activeOpacity={0.6}
            >
                <View>
                    <View style={styles.cityAndTimeContainer}>
                        <View style={{flexDirection: 'row'}}>
                            {
                                showLeftIcon ? <Image source={StaticImage.timeIcon} style={styles.leftIcon}/> : null
                            }
                            <Text style={[styles.cityOrTimeText, itemTitleStyle]}>{itemTitle}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#666666', fontSize: 16, width: width - 170, textAlign: 'right'}} numberOfLines={1}>{itemContent}</Text>
                            {
                                hideArrowIcon ? null : <Image source={StaticImage.rightArrowTurn} style={styles.rightIcon}/>
                            }
                        </View>
                    </View>
                    {
                        showBottomLine ? <View style={styles.separateLine} /> : null
                    }
                </View>
            </TouchableOpacity>
        );
    }
}

export default commnCellWithArrow;
