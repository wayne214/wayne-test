import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Image,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import finish from '../../../../assets/income/finish.png'

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
                        <Image style={{marginBottom:15}} source={finish}/>
                    </View>
                    <Text style={{textAlign: 'center', fontSize: 17, color: '#333333'}}>
                        添加成功
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
});

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(addBankCardSuccess);

