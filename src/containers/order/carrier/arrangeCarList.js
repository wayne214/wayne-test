/**
 * 安排车辆列表界面
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
import HTTPRequest from '../../../utils/httpRequest';
import * as API from '../../../constants/api';

let selected = null;
let selectedArr = [];

class arrangeCarList extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            data: [],
            dispatchCode: params.dispatchCode,
        };
        this.getCarList = this.getCarList.bind(this);
    }
    componentDidMount() {
        this.getCarList();
    }

    componentWillUnmount() {
        selected = null;
        selectedArr = [];
    }

    getCarList() {
        // 传递参数
        HTTPRequest({
            url: API.API_QUERY_CAR_LIST,
            params: {
                companionPhone: global.phone,
                carStatus: 'enable',
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                this.setState({
                    data: responseData.result,
                });
            },
            error: (errorInfo)=>{},
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
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
                    selectedOptions={selectedArr}
                    onSelection={(option) => {
                        selected = option;
                        selectedArr.push(selected);
                    }}
                />
                <BottomButton
                    text={'下一步'}
                    onClick={() => {
                        if(selected){
                            navigator.navigate('ArrangeDriverList',{
                                driverOption: selected,
                                dispatchCode: this.state.dispatchCode,
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

