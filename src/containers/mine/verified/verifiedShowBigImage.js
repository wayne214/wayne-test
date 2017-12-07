import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
});

class verifiedShowBigImage extends Component{
    constructor(props) {
        super(props);
    }


    render() {

        let uris=[];
        this.props.navigation.state.params.imageUrls.forEach((value,index, array)=>{
            uris.push({url: value ? value : ''});
        });

        console.log('uris: ',uris);
        return (
            <View style={styles.container}>
                <ImageViewer
                    imageUrls={uris}
                    index={this.props.navigation.state.params.selectIndex} // 默认选中第几张图
                    onClick={()=>{
                        // 点击
                        console.log('234');
                        this.props.navigation.goBack();
                    }}
                    saveToLocalByLongPress={false}
                />
            </View>
        )
    }
}

export default verifiedShowBigImage;
