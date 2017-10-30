/**
 * Created by xizhixin on 2017/10/27.
 * 回单成功界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    DeviceEventEmitter,
    Platform,
    Alert
} from 'react-native';
import * as StaticColor from '../../constants/staticColor';
import StaticImage from '../../constants/staticImage';
import NavigationBar from '../../common/navigationBar/navigationBar';
import EmptyView from '../../common/emptyView/emptyView';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    }
});

class receiptSuccess extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const navigator = this.props.navigation;
        return(
            <View style={styles.container}>
                <NavigationBar
                    title={'签收'}
                    navigator={navigator}
                />
                <EmptyView
                    emptyImage={StaticImage.receiptSuccess}
                    content={'签收成功'}
                    comment={<Text>123</Text>}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(receiptSuccess);
