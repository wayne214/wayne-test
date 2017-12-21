/**
 * 查看GPS设备详情
 * Created by xizhixin on 2017/12/20.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import NavigatorBar from '../../../common/navigationBar/navigationBar';
import BottomButton from '../components/bottomButtonComponent';
import CommonCell from '../../mine/cell/commonCell';
import StaticImage from '../../../constants/staticImage';
import * as StaticColor from '../../../constants/staticColor';

class gpsDetails extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    leftButtonHidden={false}
                    title={'详情'}
                    navigator={navigator}
                />
                <View style={{flex: 1,}}>
                    <CommonCell itemName="供应商设备:" content={'座头鲸'} hideBottomLine={true}/>
                    <CommonCell itemName="供应商设备型号:" content={'CC_C400_666'} hideBottomLine={true}/>
                    <CommonCell itemName="供应商设备编号:" content={'00000000806AADF4'} hideBottomLine={true} />
                    <CommonCell itemName="开启/关闭:" content={'开启'} hideBottomLine={true}/>
                    <CommonCell itemName="当前电量:" content={'20%'} hideBottomLine={true}/>
                </View>
                <BottomButton
                    onClick={() => {
                        this.props.navigation.goBack();
                    }}
                    text="解除绑定"
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

export default connect(mapStateToProps, mapDispatchToProps)(gpsDetails);

