/**
 * Created by wayne on 2017/5/3.
 * 选择列表控件
 */

import React, {Component, PropTypes} from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    ListView,
    StyleSheet,
} from 'react-native';

import StaticImage from '../constants/staticImage';
import * as StaticColor from '../constants/staticColor';

const propTypes = {
    options: React.PropTypes.array.isRequired,
    selectedOptions: React.PropTypes.array,
    maxSelectedOptions: React.PropTypes.number,
    onSelection: React.PropTypes.func,
    renderIndicator: React.PropTypes.func,
    renderSeparator: React.PropTypes.func,
    renderRow: React.PropTypes.func,
    renderText: React.PropTypes.func,
    style: View.propTypes.style,
    optionStyle: View.propTypes.style,
    disabled: PropTypes.bool,
};
const defaultProps = {
    options: [],
    selectedOptions: [],
    onSelection(option) {
    },
    style: {},
    optionStyle: {},
    disabled: false,
};

const styles = StyleSheet.create({
    list: {},
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        height: 44,
        justifyContent: 'center',
    },
    optionLabel: {
        flex: 1,
    },
    optionIndicator: {
        marginRight: 20,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionIndicatorIcon: {
        width: 20,
        height: 20,
    },
    separator: {
        marginLeft: 20,
        height: 1,
        backgroundColor: StaticColor.COLOR_SEPARATE_LINE,
    },
    radio: {
        marginRight: 6,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selected: {
        color: StaticColor.BLUE_SELECTED_COLOR,
    },
    dot: {
        width: 15,
        height: 15,
    },
    itemText: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
});

class CheckboxList extends Component {

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        this.ds = ds;
        this.state = {
            dataSource: ds.cloneWithRows(this.props.options),
            selectedOptions: this.props.selectedOptions || [],
            disabled: this.props.disabled,
        };

        this.updateSelectedOptions = this.updateSelectedOptions.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.renderIndicator = this.renderIndicator.bind(this);
        this.selectOption = this.selectOption.bind(this);
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
            dataSource: this.ds.cloneWithRows(this.props.options),
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

    selectOption(selectedOption) {
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

    renderIndicator(option) {
        if (this.isSelected(option)) {
            if (typeof this.props.renderIndicator === 'function') {
                return this.props.renderIndicator(option);
            }
            if (typeof (option.value) !== 'undefined') {
                return (
                    <View style={[styles.radio, {borderColor: StaticColor.BLUE_SELECTED_COLOR}]}>
                        <Text style={styles.selected}>{option.value}</Text>
                    </View>
                );
            }
            if (!option.hasOwnProperty('carStatus')) {
                return (
                    <View style={[styles.radio]}>
                        <Image style={styles.dot} source={StaticImage.checkboxChecked}/>
                    </View>
                );
            } else {
                return (
                    <View style={[styles.radio]}>
                        <Image style={styles.dot} source={StaticImage.checkActive}/>
                    </View>
                );
            }
        }
        if (typeof (option.value) !== 'undefined') {
            return (<View style={styles.radio}><Text>{option.value}</Text></View>);
        }
        if (!option.hasOwnProperty('carStatus')) {
            return (
                <View style={[styles.radio]}>
                    {/*<Image style={styles.dot} source={checkboxChecked}/>*/}
                </View>
            );
        } else {
            return (
                <View style={[styles.radio]}>
                    <Image style={styles.dot} source={StaticImage.checkNormal}/>
                </View>
            );
        }
    }

    renderSeparator(option) {
        if (typeof this.props.renderSeparator === 'function') {
            return this.props.renderSeparator(option);
        }
        return (<View style={[styles.separator, this.props.separatorStyle]}/>);
    }

    renderText(option) {
        if (typeof this.props.renderText === 'function') {
            return this.props.renderText(option);
        }
        if (typeof (option.label) !== 'undefined') {
            return (<Text>{option.label}</Text>);
        }
        if (this.isSelected(option)) {
            if (!option.hasOwnProperty('carStatus')) {
                return (<Text style={[styles.itemText, {color: StaticColor.BLUE_CONTACT_COLOR}]}>{option.departureCityArrayName}</Text>);
            } else {
                return (<Text style={styles.itemText}>{option.carNum}</Text>);
            }

        }
        if (!option.hasOwnProperty('carStatus')) {
            return (<Text style={[styles.itemText, this.props.itemTextStyle]}>{option.departureCityArrayName}</Text>);
        } else {
            return (<Text style={styles.itemText}>{option.carNum}</Text>);
        }
    }

    renderRow(option, sectionID, rowID) {
        if (typeof this.props.renderRow === 'function') {
            return this.props.renderRow(option);
        }

        const disabled = this.state.disabled;
        return (

            <View style={this.props.optionStyle}>
                <TouchableOpacity
                    activeOpacity={disabled ? 1 : 0.7}
                    onPress={!disabled ? () => {
                        this.selectOption(option);
                    } : null}
                >
                    <View>
                        <View
                            style={styles.row}
                        >
                            <View style={styles.optionLabel}>{this.renderText(option)}
                            </View>
                            <View style={styles.optionIndicator}>{this.renderIndicator(option)}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    rowID < this.props.options.length - 1 ? this.renderSeparator(option) : null
                }
            </View>
        );
    }

    render() {
        return (
            <ListView
                style={[styles.list, this.props.style]}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                enableEmptySections={true}
            />
        );
    }
}

CheckboxList.propTypes = propTypes;
CheckboxList.defaultProps = defaultProps;

module.exports = CheckboxList;
