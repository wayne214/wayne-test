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
import Line from './verifiedLineItem';


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



// 设计图身份证比例  122 * 150
const idItemWidth = (screenWidth - leftSpace - centerSpace - rightSpace - idItemLeftSpace * 2 - idItemRightSpace * 2) / 2;
const idItemHeight = 150 * idItemWidth / 122;

const idTiemViewWidth = idItemWidth + idItemLeftSpace + idItemLeftSpace;
const idTiemViewHeight = idItemHeight + idTiemTopSpace + idTiemTopSpace;
const a8 = require('../images/qiangxian_right.png');


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
    IDTiemStyle:{
        marginTop: idTiemTopSpace,
        marginLeft: idItemLeftSpace,
        width: idItemWidth,
        height: idItemHeight,
        borderRadius: 5,
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

});


class verifiedTravelPaperItem extends Component{
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
        const {showTitle, leftImage, rightImage} = this.props;

        let imagePath;

        if (rightImage.uri === '../images/qiangxian_right.png') {
            imagePath = a8;
        }else
            imagePath = rightImage;

    return (
            <View style={{backgroundColor: 'white'}}>
                <Line/>
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
                                <Image style={styles.IDTiemStyle}
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

export default verifiedTravelPaperItem;
