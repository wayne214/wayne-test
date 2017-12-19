/**
 * 安排车辆列表界面
 * Created by xizhixin on 2017/12/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';

import * as StaticColor from '../../../constants/staticColor';
import StaticImage from '../../../constants/staticImage';
import NavigatorBar from "../../../common/navigationBar/navigationBar";
import RadioList from '../components/RadioList';
import BottomButton from '../components/bottomButtonComponent';

let data = [{'plateNumber': '京A12345', 'carLength': '4.5米', 'carWeight': '4.0吨'},
    {'plateNumber': '京A12345', 'carLength': '4米', 'carWeight': '3.0吨'},
    {'plateNumber': '京A12345', 'carLength': '4.2米', 'carWeight': '3.5吨'}];
let selected = null;

class arrangeCarList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: data,
        };
        this.getCarList = this.getCarList.bind(this);
    }
    componentDidMount() {
        // this.getCarList();
    }

    getCarList() {
        this.setState({
            data: data,
        });
    }

    renderListEmpty() {
        return(
            <View>

            </View>
        );
    }


    render() {
        const navigator = this.props.navigation;
        return(
            <View style={styles.container}>
                <NavigatorBar
                    title={'车辆列表'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    rightButtonConfig={{
                        type:'string',
                        title: '添加车辆',
                        onClick: () => {
                            navigator.navigate('CarManagement');
                        }
                    }}
                />
                <RadioList
                    options={this.state.data}
                    renderEmpty={this.renderListEmpty}
                    maxSelectedOptions={1}
                    onSelection={(option) => {
                        selected = option;
                    }}
                    type={'car'}
                />
                <BottomButton
                    text={'下一步'}
                    onClick={() => {
                        if(selected){
                            navigator.navigate('ArrangeDriverList',{
                                driverOption: selected,
                            });
                        }else {
                            Alert.alert('提示','请选择承运的车辆');
                        }
                    }}
                />
            </View>
        );
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },

});

function mapStateToProps(state){
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(arrangeCarList);

