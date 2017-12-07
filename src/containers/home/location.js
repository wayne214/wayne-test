/**
 * Created by xizhixin on 2017/8/4.
 * 城市列表界面
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import AtoZList from 'react-native-atoz-list';

import NavigationBar from '../../common/navigationBar/navigationBar';
import * as StaticColor from '../../constants/staticColor';
import data from '../../../assets/data/city.json';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowData: {
        height: 50,
        borderBottomColor: StaticColor.DEVIDE_LINE_COLOR,
        borderBottomWidth: 0.5,
        justifyContent: 'center',
    },
    rowDataText: {
        color: 'gray',
    },
    dividedLine: {
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
        height: 0.5
    },
    itemHeaderView: {
        height: 35,
        justifyContent: 'center',
        paddingLeft: 15,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND
    },
    itemHeaderText: {
        color: StaticColor.BLUE_CONTACT_COLOR,
        fontWeight: 'bold'
    }

});

export default class Location extends Component {
    constructor(props, context) {
        super(props, context);
        this.renderCell = this.renderCell.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.changeData = this.changeData.bind(this);
    }

    // 回调改变显示的城市
    changeData(cityName) {
        this.props.navigation.state.params.changeCity(cityName);
        this.props.navigation.goBack();
    }

    renderHeader(data) {
        return (
            <View>
                <View style={styles.dividedLine}/>
                <View style={styles.itemHeaderView}>
                    <Text style={styles.itemHeaderText}>
                        {data.sectionId}
                    </Text>
                </View>
                <View style={styles.dividedLine}/>
            </View>
        )
    }


    renderCell(rowData, rowId) {
        return (
            <TouchableOpacity
                key={rowId}
                style={{height: 50, justifyContent: 'center', paddingLeft: 20, paddingRight: 30}}
                onPress={() => {
                    console.log('selectCity', rowData.name);
                    this.changeData(rowData.name);
                }}>
                <View style={styles.rowData}>
                    <Text style={styles.rowDataText}>
                        {rowData.name}
                        {/*{rowData.name.split('').reverse().join('')}*/}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const navigator = this.props.navigation;
        return(
            <View style={styles.container}>
                <NavigationBar
                    title={'选择城市'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <AtoZList
                    sectionHeaderHeight={35}
                    cellHeight={50}
                    data={data}
                    renderCell={this.renderCell}
                    renderSection={this.renderHeader}
                />
        </View>
    );
    }
}

