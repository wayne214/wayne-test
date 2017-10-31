import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import NavigationBar from '../../common/navigationBar/navigationBar';
import StaticImage from '../../constants/staticImage';
import * as StaticColor from '../../constants/staticColor';

class payPassword extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        const navigator = this.props.navigation;

        return <View style={styles.container}>
            <NavigationBar
                title={'支付密码'}
                navigator={navigator}
                leftButtonHidden={false}
            />

            <View style={{backgroundColor: 'white', marginTop: 10, }}>
                <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={()=>{
                    navigator.navigate('SetPayPassword');
                }}>
                    <Text>修改支付密码</Text>
                    <Image source={StaticImage.rightArrow}/>
                </TouchableOpacity>
                <View style={styles.separateLine}/>
                <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={()=>{
                    navigator.navigate('ForgetPayPasswordCode');
                }}>
                    <Text>忘记支付密码</Text>
                    <Image source={StaticImage.rightArrow}/>
                </TouchableOpacity>
            </View>
        </View>
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    separateLine: {
        height: 0.5,
        backgroundColor: StaticColor.COLOR_SEPARATE_LINE,
        marginLeft: 15,
    },
    TouchableOpacityStyle:{
        padding: 15,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});

function mapStateToProps(state){
    return {};
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(payPassword);

