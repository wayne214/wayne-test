import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
} from 'react-native';


const screenWidth = Dimensions.get('window').width;
import {CachedImage} from "react-native-img-cache";

const space = 10;

// 220*150
const viewWidth = (screenWidth - space * 4) / 3;
const viewHeight = viewWidth * 150 / 220;

const itemSpace = 5;
const itemWidth = viewWidth - itemSpace * 2;
const itemHeight = viewHeight - itemSpace * 2;

const noImage = require('../images/noiamgeShow.png');

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection : 'row',
        backgroundColor: 'white',
    },
    subViewStyle: {
        borderWidth: 1,
        borderColor: '#cccccc',
        marginTop: space,
        marginLeft: space,
        width: viewWidth,
        height: viewHeight,
    },
    itemStyle: {
        borderRadius: 3,
        backgroundColor: '#f5f5f5',
        marginLeft: itemSpace-1,
        marginTop: itemSpace-1,
        width: itemWidth,
        height: itemHeight,
    },
    textStyle: {
        textAlign: 'center',
        color: '#666666',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10,
    }

});

class verifiedImagesItem extends Component{
    constructor(props) {
        super(props);

        this.imageClick = this.imageClick.bind(this);
    }

    static propTypes = {
        style: PropTypes.object,
    };

    imageClick(index){
        this.props.imageClick(index);
    }

    render() {
        const {firstName, secondName, thirdName, firstImagePath, secondImagePath, thirdImagePath} = this.props;

        console.log('firstImagePath=', firstImagePath);
        console.log('secondImagePath=', secondImagePath);
        console.log('thirdImagePath=', thirdImagePath);


        let firstImageObj;
        if (firstImagePath){
            firstImageObj = {uri: firstImagePath}
        }else
            firstImageObj = noImage;

        let secondImageObj;
        if (secondImagePath){
            secondImageObj = {uri: secondImagePath}
        }else
            secondImageObj = noImage;

        let thirdImageObj;
        if (thirdImagePath){
            thirdImageObj = {uri: thirdImagePath}
        }else
            thirdImageObj = noImage;

        const thirdView =  thirdName ?
            <View>
                <TouchableOpacity style={styles.subViewStyle} onPress={()=>{
                    this.imageClick(2);
                }}>
                    <CachedImage style={styles.itemStyle} source={thirdImageObj}/>
                </TouchableOpacity>
                <Text style={styles.textStyle}>{thirdName}</Text>
            </View>: null;
        return (

            <View style={styles.container}>

                <View>
                    <TouchableOpacity style={styles.subViewStyle} onPress={()=>{
                        this.imageClick(0);
                    }}>
                        <CachedImage style={styles.itemStyle} source={firstImageObj}/>
                    </TouchableOpacity>
                    <Text style={styles.textStyle}>{firstName}</Text>
                </View>

                <View>
                    <TouchableOpacity style={styles.subViewStyle} onPress={()=>{
                        this.imageClick(1);
                    }}>
                        <CachedImage style={styles.itemStyle} source={secondImageObj}/>
                    </TouchableOpacity>
                    <Text style={styles.textStyle}>{secondName}</Text>
                </View>

                {thirdView}


            </View>
        )
    }
}

export default verifiedImagesItem;
