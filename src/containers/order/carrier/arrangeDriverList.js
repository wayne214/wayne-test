/**
 * 安排司机列表界面
 * Created by xizhixin on 2017/12/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    Alert,
} from 'react-native';
import * as StaticColor from '../../../constants/staticColor';
import NavigatorBar from "../../../common/navigationBar/navigationBar";
import RadioList from '../components/RadioList';
import BottomButton from '../components/bottomButtonComponent';

let data = [{'driverName': '张三', 'phone': '13121210000'},
    {'driverName': '李三', 'phone': '13812345678'},
    {'driverName': '王三', 'phone': '15800112233'}];

let selected = null;

class arrangeDriverList extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            data: data,
            driverOption: params.driverOption,
        };
        this.getDriverList = this.getDriverList.bind(this);
        this.arrangeCar = this.arrangeCar.bind(this);
    }

    componentDidMount() {
        this.getDriverList();
    }

    // 获取司机列表信息
    getDriverList() {

    }
    // 安排车辆
    arrangeCar() {

    }

    renderListEmpty() {
        return(
            <View>

            </View>
        );
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'司机列表'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    rightButtonConfig={{
                        type:'string',
                        title: '添加司机',
                        onClick: () => {
                            navigator.navigate('DriverManagement');
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
                    type={'driver'}
                />
                <BottomButton
                    text={'提交'}
                    onClick={() => {
                        if(selected){
                            this.arrangeCar();
                            const routes = this.props.routes;
                            let key = routes[routes.length - 3].key;
                            this.props.navigation.goBack(key);
                        }else {
                            Alert.alert('提示','请选择承运的司机');
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

export default connect(mapStateToProps, mapDispatchToProps)(arrangeDriverList);

