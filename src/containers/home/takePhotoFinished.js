/**
 * 拍照完成预览界面
 * Created by xizhixin on 2017/12/15.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import StaticImage from '../../constants/staticImage';
import * as StaticColor from '../../constants/staticColor';
import {
    addImage,
} from '../../action/order';
const {width, height} = Dimensions.get('window');

class takePhotoFinished extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            imagePath: params.imagePath,
            mediaType: params.mediaType,
        };
        this.next = this.next.bind(this);
        this.close = this.close.bind(this);

    }
    componentDidMount() {

    }
    // 返回
    close() {
        this.props.navigation.goBack();
    }
    // 完成
    next() {
        console.log('-----imagePath-------',this.state.imagePath);
        let data = [{uri: this.state.imagePath, id: new Date().getTime(), mediaType: this.state.mediaType}];
        this.props.dispatch(addImage(data));

        const routes = this.props.routes;
        let routeKey = routes[routes.length - 2].key;
        this.props.navigation.goBack(routeKey);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={{flex: 1}}
                    source={{uri: this.state.imagePath}}
                />
                <View style={styles.bottomView}>
                <View style={styles.bottomInnerStyle}>
                    <TouchableOpacity
                        style={styles.bottomBackStyle}
                        onPress={()=>{
                            this.close();
                        }}>
                        <Image source={StaticImage.takeBack}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.bottomNextStyle}
                        onPress={()=>{
                            this.next();
                        }}>
                        <Image source={StaticImage.takeNext}/>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        );
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.BLACK_COLOR,
    },
    bottomView: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        marginBottom: 40,
        width: width,
    },
    bottomInnerStyle:{
        flexDirection: 'row',
        marginLeft: 56,
        marginRight: 56,
        justifyContent: 'space-between',
    }
});

function mapStateToProps(state){
    return {
        imageList: state.order.get('imageList'),
        maxNum: state.order.get('maxNum'),
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(takePhotoFinished);
