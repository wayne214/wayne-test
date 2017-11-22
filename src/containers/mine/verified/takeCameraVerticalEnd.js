import React, { Component } from 'react';
import {connect} from 'react-redux';

import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Platform,
    DeviceEventEmitter,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

const TakeBold = require('./images/takeCameraBord.png');
const TakeVBack = require('./images/takeCameraBackV.png');
const TakeVNext = require('./images/takeCameraSureV.png');

const leftSpace = 45;
const topSpace = 80;
const rightSpace = 45;
const bottomSpace = 135;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    takeCameraStyle: {
        alignItems: 'center',
        position: 'absolute',
        width: 65,
        height: 65,
        bottom: 40,
    },
    takeBackStyle: {
        position: 'absolute',
        width: 75,
        height: 75,
        bottom: 35,
        left: 50,
    },
    takeNextStyle: {
        position: 'absolute',
        width: 75,
        height: 75,
        bottom: 35,
        right: 50,
    },

    closeStyle:{
        width: 40,
        height: 40,
        position: 'absolute',
        top: 25,
        right: 25,
    },
    topViewStyle:{
        position: 'absolute',
        width: width,
        height: topSpace,
        backgroundColor: 'black',
        opacity: 0.6,
        top: 0,
    },
    leftViewStyle:{
        position: 'absolute',
        width: leftSpace,
        height: height,
        backgroundColor: 'black',
        opacity: 0.6,
        top: topSpace,
        left: 0,
    },
    rightViewStyle:{
        position: 'absolute',
        width: rightSpace,
        height: height,
        backgroundColor: 'black',
        opacity: 0.6,
        top: topSpace,
        right: 0,
    },
    bottomViewStyle:{
        position: 'absolute',
        width: width - leftSpace - rightSpace,
        height: bottomSpace,
        backgroundColor: 'black',
        opacity: 0.6,
        bottom: 0,
        right: rightSpace,
        left: leftSpace
    },
    topLeftImageStyle: {
        position: 'absolute',
        left: leftSpace,
        top: topSpace,
    },
    topRightImageStyle: {
        position: 'absolute',
        right: rightSpace,
        top: topSpace,
        transform: [{rotateZ: '90deg'}]
    },
    bottomRightImageStyle: {
        position: 'absolute',
        right: rightSpace,
        bottom: bottomSpace,
        transform: [{rotateZ: '180deg'}]
    },
    bottomLeftImageStyle: {
        position: 'absolute',
        left: leftSpace,
        bottom: bottomSpace,
        transform: [{rotateZ: '270deg'}]
    },
    bottomBackStyle:{
        position: 'absolute',
        left: 50,
        bottom: 35,
    },
    bottomNextStyle:{
        position: 'absolute',
        right: 50,
        bottom: 35,
    },
    imageStyle:{
        position: 'absolute',
        width: width,
        height: height,
        left: 0,
        top: 0,
    }


});

class takeCameraVerticalEnd extends Component {

    constructor(props){
        super(props);

        this.close = this.close.bind(this);
        this.next = this.next.bind(this);
    }

    /*关闭*/
    close(){
        this.props.navigation.goBack();
    }

    /*
     * 确定图片
     * */
    next() {


        DeviceEventEmitter.emit('endSureCameraPhotoEnd',this.props.navigation.state.params.imagePath);

        /*
        const resetAction = NavigationActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({ routeName: 'Main'}),
                NavigationActions.navigate({ routeName: 'CertificationPage'}),
            ]
        });
        this.props.navigation.dispatch(resetAction);
        */
        const routes = this.props.routes;
        let routeKey = routes[routes.length - 2].key;
        this.props.navigation.goBack(routeKey);
    }

    render() {
        return (
            <View style={styles.container}>

                <Image
                    style={styles.imageStyle}
                    source={{uri: this.props.navigation.state.params.imagePath}}/>

                <View style={styles.topViewStyle}>

                </View>
                <View style={styles.leftViewStyle}>

                </View>
                <View style={styles.rightViewStyle}>

                </View>
                <View style={styles.bottomViewStyle}>

                </View>


                <Image style={styles.topLeftImageStyle} source={TakeBold}/>
                <Image style={styles.topRightImageStyle} source={TakeBold}/>
                <Image style={styles.bottomRightImageStyle} source={TakeBold}/>
                <Image style={styles.bottomLeftImageStyle} source={TakeBold}/>



                <TouchableOpacity
                    style={styles.bottomBackStyle}
                    onPress={()=>{
                            this.close();
                        }}>
                    <Image source={TakeVBack}/>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.bottomNextStyle}
                    onPress={()=>{
                            this.next();
                        }}>
                    <Image source={TakeVNext}/>
                </TouchableOpacity>


            </View>
        );
    }


}
function mapStateToProps(state){
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(takeCameraVerticalEnd);

