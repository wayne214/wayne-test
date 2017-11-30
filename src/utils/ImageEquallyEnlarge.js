import React, { Component } from 'react';
import {
    Image
} from 'react-native';

export default class ImageEquallyEnlarge extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            //状态机变量是一个style, 它将被用于定义显示图片的样式
            style: {}
        };

    }


    // {...this.props} 是JSX语法, 意思是将ImageEquallyEnlarge组件收到的props透传给Image组件
    render(){
        return(
            <Image {...this.props}
                   style={[this.props.style,this.state.style]}
                   onLayout={this.onImageLayout}
            />
        )
    }
}
//控件属性
// 声明必须要有的图片原始宽度与高度
ImageEquallyEnlarge.prototype = {
    originalWidth: React.PropTypes.number.isRequired,
    originalHeight: React.PropTypes.number.isRequired
};
