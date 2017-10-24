import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import ItemCell from '../../../containers/mine/cell/commonCell';


class incomeListDetail extends Component {
    constructor(props) {
        super(props);
        this.state={
            isSuccess: true
        }
    }
    componentDidMount() {

    }
    render() {
        const navigator= this.props.navigation;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'收支详情'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />

                <View style={{marginTop: 10, backgroundColor: 'white'}}>

                    <ItemCell itemName="流水号"
                              content="12347890"
                    />
                    <ItemCell itemName="类型"
                              content="收入"
                    />
                    <ItemCell itemName="金额"
                              content="23.00元"
                              contentColorStyle={{color: '#FF6600'}}
                    />
                    <ItemCell itemName="状态"
                              content="交易成功"
                    />

                    {
                        navigator.state.params.type === '支出' ? <View>
                                <ItemCell itemName="银行"
                                          content="建设银行"
                                />
                                <ItemCell itemName="银行卡号"
                                          content="1234567890"
                                />
                            </View> : null
                    }



                    <ItemCell itemName="创建时间"
                              content="2017/02/23 09:21:23"
                    />
                    <ItemCell itemName="完成时间"
                              content="2017/02/23 09:21:23"
                    />
                    <ItemCell itemName="余额"
                              content="123.00"
                    />


                    {
                        (navigator.state.params.type === '支出' && !this.state.isSuccess) ?
                            <ItemCell itemName="失败原因"
                                      content="银行下班了"
                            /> : null
                    }

                </View>

            </View>
        )
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
});

function mapStateToProps(state){
    return {};
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(incomeListDetail);

