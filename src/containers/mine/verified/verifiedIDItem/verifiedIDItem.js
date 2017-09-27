/**
 * Created by wangl on 2017/6/30.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
const screenWidth = Dimensions.get('window').width;

const leftSpace = 10;
const rightSpace = 10;
const centerSpace = 25;
const topSpace = 15;
const bottomSpace = 10;

const idItemLeftSpace = 10;
const idItemRightSpace = 10;
const idTiemTopSpace = 10;
const idTiemBottomSpace = 10;



// 设计图身份证比例  148 * 92
const idItemWidth = (screenWidth - leftSpace - centerSpace - rightSpace - idItemLeftSpace * 2 - idItemRightSpace * 2) / 2;
const idItemHeight = 92 * idItemWidth / 148;

const idTiemViewWidth = idItemWidth + idItemLeftSpace + idItemLeftSpace;
const idTiemViewHeight = idItemHeight + idTiemTopSpace + idTiemTopSpace;

const  a1  = require('../images/IdCardAdd.png');
const  a2  = require('../images/IdCardTurnAdd.png');
const  a3 = require('../images/driverAdd.png');
const  a4  = require('../images/driverTrunAdd.png');
const  a5  = require('../images/handPicModel.png');


const a6 = require('../images/travelCardHome_right.png');
const a7 = require('../images/travelCard_right.png');
const a9 = require('../images/carheader_right.png');



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: bottomSpace,
    },
    leftIDItemViewStyle:{
        marginTop: topSpace,
        marginLeft: 0,
        marginBottom: bottomSpace,
        width: idTiemViewWidth,
        height: idTiemViewHeight,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    rightIDItemViewStyle:{
        marginTop: topSpace,
        marginLeft: 0,
        marginBottom: bottomSpace,
        width: idTiemViewWidth,
        height: idTiemViewHeight,
        borderWidth: 1,
        borderColor: '#cccccc'
    },

    TextStyle: {
        textAlign: 'center',
        color: '#666666',
        fontSize: 13,
        width: idTiemViewWidth,
    },
    lineStyle: {
        backgroundColor: '#cccccc',
        marginLeft: 10,
        marginTop: 10,
        marginRight: 0,
        height: 1,
    },
    IDTiemStyle: {
        marginTop: idTiemTopSpace,
        marginLeft: idItemLeftSpace,
        width: idItemWidth,
        height: idItemHeight,
        borderRadius: 5,
    },

});


class verifiedIDItem extends Component{
    constructor(props) {
        super(props);

        this.upLoadClick = this.upLoadClick.bind(this);
    }

    static propTypes = {
    };
    componentDidMount(){

    }

    /*选取图片*/
    upLoadClick(){
        this.props.click();
    }

    render() {
        const {showTitle, leftImage, rightImage, isChooseRight} = this.props;

        console.log('rightImage.uri, ', rightImage.uri);

        let imagePath;

            if (rightImage.uri === '../images/IdCardAdd.png'){
                imagePath = a1;
            }else if (rightImage.uri === '../images/IdCardTurnAdd.png') {
                imagePath = a2;
            }else if (rightImage.uri === '../images/driverAdd.png') {
                imagePath = a3;
            }else if (rightImage.uri === '../images/driverTrunAdd.png') {
                imagePath = a4;
            }else if (rightImage.uri === '../images/handPicModel.png') {
                imagePath = a5;
            }else if (rightImage.uri === '../images/travelCardHome_right.png') {
                imagePath = a6;
            }else if (rightImage.uri === '../images/travelCard_right.png') {
                imagePath = a7;
            }else if (rightImage.uri === '../images/carheader_right.png') {
                imagePath = a9;
            }else {
                imagePath = rightImage;
            }


        let rightImageStyle = isChooseRight ? {
                    width: idItemHeight,
                    height: idItemWidth,
                    borderRadius: 5,
                    transform: [{rotateZ: '-90deg'}],
                    marginTop: -20,
                    marginLeft: 35,

                }:
                {
                    marginTop: idTiemTopSpace,
                    marginLeft: idItemLeftSpace,
                    width: idItemWidth,
                    height: idItemHeight,
                    borderRadius: 5,
                };



        return (
            <View style={{backgroundColor: 'white'}}>

                <View style={styles.container}>
                    <View style={{marginLeft: leftSpace}}>
                        <View style={styles.leftIDItemViewStyle}>

                            <TouchableOpacity>
                                <Image style={styles.IDTiemStyle}
                                       source={leftImage} />
                            </TouchableOpacity>


                        </View>
                        <Text style={styles.TextStyle}>
                            {showTitle}
                        </Text>
                    </View>


                    <View style={{marginLeft: centerSpace}}>
                        <View style={styles.rightIDItemViewStyle}>

                            <TouchableOpacity onPress={()=>{
                                this.upLoadClick();
                            }}>
                            <Image style={rightImageStyle}
                                   source={imagePath} />
                        </TouchableOpacity>



                        </View>
                        <TouchableOpacity onPress={()=>{
                            this.upLoadClick();
                        }}>
                            <Text style={[styles.TextStyle, {color: '#1b82d1'}]}>点此上传</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </View>
        )
    }
}

export default verifiedIDItem;
