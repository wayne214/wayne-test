import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../../../common/navigationBar/navigationBar';

class addBankCardSuccess extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        const navigator = this.props.navigation;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'添加银行卡'}
                    navigator={navigator}
                    leftButtonHidden={true}
                    rightButtonConfig={{
                            type: 'string',
                            title: '完成',
                            onClick: () => {
                                DeviceEventEmitter.emit('BankCardList');
                                navigator.goBack();
                            },
                    }}
                />
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 50}}>
                        <Text
                            style={{
                            fontFamily: 'iconfont',
                            fontSize: 80,
                            color: '#0071FF',
                            margin: 10
                        }}>
                            &#xe616;</Text>
                    </View>
                    <Text style={{textAlign: 'center', fontSize: 17, color: '#333333'}}>
                        添加成功
                    </Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(addBankCardSuccess);

