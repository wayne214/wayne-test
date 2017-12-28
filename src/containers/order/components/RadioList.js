/**
 * 车辆/司机单选列表
 * Created by xizhixin on 2017/12/19.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';


import StaticImage from '../../../constants/staticImage';
import * as StaticColor from '../../../constants/staticColor';

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    list: {},

    checkedIcon: {
        alignSelf:'center',
        marginRight: 10,
    },
    optionIndicator: {
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carText: {
        color: StaticColor.GRAY_TEXT_COLOR,
        fontSize: 13,
        marginLeft: 10,
    },
    plateNumText: {
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 16,
        marginLeft: 10,
    },
    carIcon: {
        marginLeft: 10,
        marginTop: 17,
        marginBottom: 17,
    },
    dividedLineStyle: {
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
        height: 1,
        marginLeft: 10,
    }
});

class RadioList extends Component{

    static propTypes = {
        options: React.PropTypes.array.isRequired,
        selectedOptions: React.PropTypes.array,
        maxSelectedOptions: React.PropTypes.number,
        onSelection: React.PropTypes.func,
        renderIndicator: React.PropTypes.func,
        renderItemSeparator: React.PropTypes.func,
        renderEmpty: React.PropTypes.func,
        renderRow: React.PropTypes.func,
        renderText: React.PropTypes.func,
        style: View.propTypes.style,
        optionStyle: View.propTypes.style,
        disabled: PropTypes.bool,
        type: React.PropTypes.string,
    };

    static defaultProps = {
        options: [],
        selectedOptions: [],
        onSelection(option) {
        },
        style: {},
        optionStyle: {},
        disabled: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.options,
            selectedOptions: this.props.selectedOptions || [],
            disabled: false,
            type: this.props.type,
        };
        this.updateSelectedOptions = this.updateSelectedOptions.bind(this);
        this.isSelected = this.isSelected.bind(this);
        // this.renderIndicator = this.renderIndicator.bind(this);
        this.onItemPress = this.onItemPress.bind(this);
    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps) {
        this.updateSelectedOptions(nextProps.selectedOptions);
        this.setState({
            disabled: nextProps.disabled,
        });
    }

    updateSelectedOptions(selectedOptions) {
        this.setState({
            selectedOptions,
            data: this.props.options,
        });
    }

    validateMaxSelectedOptions() {
        const maxSelectedOptions = this.props.maxSelectedOptions;
        const selectedOptions = this.state.selectedOptions;

        if (maxSelectedOptions && selectedOptions.length > 0 &&
            selectedOptions.length >= maxSelectedOptions) {
            selectedOptions.splice(0, 1);
        }

        this.updateSelectedOptions(selectedOptions);
    }

    onItemPress(selectedOption) {
        const selectedOptions = this.state.selectedOptions;
        let index;
        if (typeof (selectedOption.value) !== 'undefined') {
            index = selectedOptions.indexOf(selectedOption.value);
        } else {
            index = selectedOptions.indexOf(selectedOption);
        }
        if (typeof (selectedOption) === 'object') {
            index = JSON.stringify(this.state.selectedOptions).indexOf(JSON.stringify(selectedOption));
        }
        if (index === -1) {
            this.validateMaxSelectedOptions();
            if (typeof (selectedOption.value) !== 'undefined') {
                selectedOptions.push(selectedOption.value);
            } else {
                selectedOptions.push(selectedOption);
            }
        } else {
            selectedOptions.splice(index, 1);
        }
        this.updateSelectedOptions(selectedOptions);

        // run callback
        if (this.props.isCheckbox) {
            this.props.onSelection(selectedOptions);
        } else {
            this.props.onSelection(selectedOptions[0]);
        }
    }

    isSelected(option) {
        if (typeof (option.value) !== 'undefined') {
            return this.state.selectedOptions.indexOf(option.value) !== -1;
        }
        if (typeof (option) === 'object') {
            return JSON.stringify(this.state.selectedOptions).indexOf(JSON.stringify(option)) > 0;
        }
        return this.state.selectedOptions.indexOf(option) !== -1;
    }

    renderIndicator(item) {
        if(this.isSelected(item)){
            return(
                <Image
                    style={styles.checkedIcon}
                    source={StaticImage.checkboxChecked}
                />
            );
        }else {
            return null;
        }
    }

    renderRow({item, index}) {
        if(this.state.type === 'car') {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.onItemPress(item);
                    }}
                >
                    <View style={{flexDirection: 'row', backgroundColor:StaticColor.WHITE_COLOR}}>
                        <Image
                            style={styles.carIcon}
                            source={StaticImage.CarAvatar}
                        />
                        <View style={{flex: 1,justifyContent: 'center'}}>
                            <Text style={styles.plateNumText}>{item.carNum}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.carText}>{item.carLen}</Text>
                                <Text style={styles.carText}>{item.carryCapacity}吨</Text>
                            </View>
                        </View>
                        <View style={styles.optionIndicator}>
                            {this.renderIndicator(item)}
                        </View>
                    </View>
                </TouchableOpacity>

            );
        }else {
            return(
                <TouchableOpacity
                    onPress={() => {
                        this.onItemPress(item);
                    }}
                >
                    <View style={{flexDirection: 'row', backgroundColor:StaticColor.WHITE_COLOR}}>
                        <Image
                            style={styles.carIcon}
                            source={StaticImage.DriverAvatar}
                        />
                        <View style={{flex: 1,justifyContent: 'center'}}>
                            <Text style={styles.plateNumText}>{item.driverName}</Text>
                        </View>
                        <View style={styles.optionIndicator}>
                            {this.renderIndicator(item)}
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    renderItemSeparator() {
        return(
            <View style={{backgroundColor: StaticColor.WHITE_COLOR}}>
                <View style={styles.dividedLineStyle}/>
            </View>
        );
    }


    render() {
        return (
            <FlatList
                style={[styles.list, this.props.style]}
                data={this.state.data}
                renderItem={this.renderRow.bind(this)}
                ItemSeparatorComponent={this.renderItemSeparator}
                ListEmptyComponent={this.props.renderEmpty}
            />
        );
    }
}

export default RadioList;
