import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import NavigationBar from '../../../common/navigationBar/navigationBar';

class drawalsDetail extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        const navigator= this.props.navigation;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'提现详情'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    rightButtonConfig={{
                        type: 'string',
                        disableColor: '#0071FF',
                        disable: true,
                        title: '完成',
                        onClick: () => {

                        },
                    }}
                />

                <View style={{marginTop: 20, marginHorizontal: 0, backgroundColor: 'white'}}>
                    <View style={{flexDirection :'row'}}>
                        <Text style={{fontFamily: 'iconfont',color:'#0071FF', marginTop: 20, marginLeft: 10, fontSize: 16}}>&#xe616;</Text>
                        <Text style={{color:'#0071FF', marginTop: 20, marginLeft: 10, fontSize: 16}}>提现申请已提交，等待银行处理</Text>
                    </View>
                    <View style={{flexDirection :'row'}}>
                        <View>
                            <View style={{backgroundColor: '#0071FF', width: 1, height: 50, marginLeft: 17, marginTop: -5}}/>
                            <View style={{backgroundColor: '#cccccc', width: 1, height: 30, marginLeft: 17, marginTop: -5}}/>
                        </View>
                        <View>
                            <Text style={{marginLeft: 15, marginTop: 10, color: '#cccccc'}}>建设银行(1234)</Text>
                            <Text style={{marginLeft: 15, marginTop: 5, color: '#cccccc'}}>50.00元</Text>
                        </View>
                    </View>
                    <View style={{flexDirection :'row', marginBottom: 20}}>
                        <Text style={{fontFamily: 'iconfont',color:'#cccccc', marginLeft: 10, fontSize: 16}}>&#xe65b;</Text>
                        <Text style={{color:'#333333',  marginLeft: 10, fontSize: 16, marginTop: -2}}>预计2日内到账</Text>
                    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(drawalsDetail);

