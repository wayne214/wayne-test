/**
 * Created by wangl on 2017/10/25.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ListView,
    TouchableOpacity,
    Text,
} from 'react-native';
import Toast from '@remobile/react-native-toast';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import CheckboxList from '../../../common/checkBoxList';
import CityCell from '../../goodSource/preference/cityCell';
import SelectComponent from '../../goodSource/preference/selectComponent';
import Storage from '../../../utils/storage';
import ProvinceListJson from '../../goodSource/data/province.json';

let cityList = [];
let tempCiytArray = [];
const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        marginTop: 10,
    },
});

class ChooseBankCity extends Component {
    constructor(props) {
        super(props);
        this.select;
        // const cityArray = this.props.navigation.state.params.cityList;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        // cityList = cityList.concat(cityArray);
        this.state = {
            dataSource: ds,
            checkBoxSource: [],
            disable: false,
            selectedCitys: '',
        };

        this.renderSeparator = this.renderSeparator.bind(this);
        this.selectCityList = this.selectCityList.bind(this);
    }

    static propTypes = {
        style: PropTypes.object,
    };

    componentDidMount() {
        this.bindData();
        console.log('当前选择的城市', this.state.selectedCitys);
        let cityArray = this.state.selectedCitys;
        const provinces = ProvinceListJson.provinces;
        tempCiytArray = [];
        for (let i = 0; i < provinces.length; i++) {
            for (let j = 0; j < provinces[i].citys.length; j++) {
                for (let m = 0; m < cityArray.length; m++) {
                    if (typeof (cityArray[m]) === 'object') {
                        if (cityArray[m].departureCityArrayCode === provinces[i].citys[j].departureCityArrayCode) {
                            this.selectCityList(provinces[i].provincesNumber);
                        }
                    } else {
                        if (cityArray[m] === provinces[i].citys[j].departureCityArrayName) {
                            this.selectCityList(provinces[i].provincesNumber);
                            tempCiytArray.push(provinces[i].citys[j]);
                        }
                        this.setState({
                            selectedCitys: tempCiytArray,
                        });
                    }
                }
            }
        }
    }

    componentWillUnmount() {
        cityList = [];
        tempCiytArray = [];
    }

    // 获取所有省份
    bindData() {
        const provinces = ProvinceListJson.provinces;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(provinces),
        });
    }

    // 点击省份展示市列表
    selectCityList(data) {
        this.setState({
            checkBoxSource: [],
        });
        setTimeout(() => {
            const provinces = ProvinceListJson.provinces;
            for (let i = 0; i < provinces.length; i++) {
                if (data === provinces[i].provincesNumber) {
                    this.setState({
                        checkBoxSource: provinces[i].citys,
                    });
                    break;
                }
            }
        }, 1);
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`{sectionID}-${rowID}`}
                style={{height: 1, backgroundColor: '#e8e8e8'}}
            />
        );
    }

    renderRow(rowData) {
        return (
            <View style={{justifyContent: 'center', height: 44, paddingLeft: 25}}>
                <TouchableOpacity
                    onPress={() => {
                        this.selectCityList(rowData.provincesNumber);
                    }}
                >
                    <Text style={{fontSize: 16, color: '#666666'}}>{rowData.address}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const {checkBoxSource, selectedCitys} = this.state;
        const navigator = this.props.navigation;
        console.log('===selectedCitys', selectedCitys, checkBoxSource);
        return (
            <View style={styles.outContainer}>
                <NavigationBar
                    title={'开户省市'}
                    navigator={navigator}
                    hiddenBackIcon={false}
                    backIconClick={() => {
                        // if (this.props.navigation.state.params.selectedCityCallback) {
                        //     this.props.navigation.state.params.selectedCityCallback(this.state.selectedCitys);
                        // }
                        navigator.goBack();
                    }
                    }
                    rightButtonConfig={{
                        type: 'string',
                        title: '确定',
                        onClick: () => {
                            // Storage.save('cityArray', this.state.selectedCitys);
                            if (this.props.navigation.state.params.selectedCityCallback) {
                                this.props.navigation.state.params.selectedCityCallback(this.state.selectedCitys);
                            }
                            navigator.goBack();
                        },
                    }}
                />

                <View style={styles.container}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, backgroundColor: '#f3f8fb'}}>
                            <ListView
                                dataSource={this.state.dataSource}
                                renderRow={this.renderRow.bind(this)}
                                style={styles.listView}
                                renderSeparator={this.renderSeparator}
                                enableEmptySections={true}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                        <View style={{backgroundColor: '#ffffff', flex: 1}}>
                            {
                                this.state.checkBoxSource.length > 0 ?
                                    <CheckboxList
                                        maxSelectedOptions = {1}
                                        separatorStyle={{marginLeft: 0, backgroundColor: '#e8e8e8'}}
                                        itemTextStyle={{color: '#666666'}}
                                        options={
                                            checkBoxSource
                                        }
                                        selectedOptions={[...this.state.selectedCitys]}
                                        // disabled={this.state.selectedCitys.length >= 1}
                                        disabled={false}
                                        isCheckbox={true}
                                        onSelection={(option) => {
                                            cityList = [];
                                            console.log('选择了', this.state.selectedCitys, option);
                                            this.select = option;
                                            // cityList.splice(0, cityList.length)
                                            cityList = cityList.concat(option);
                                            if (cityList.length >= 1) {
                                                // Toast.showShortCenter('最多只能选择5个城市');
                                            }
                                            this.setState({
                                                selectedCitys: cityList,
                                            });
                                        }}
                                    /> : null
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default ChooseBankCity;
