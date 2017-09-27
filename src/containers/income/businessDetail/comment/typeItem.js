/**
 * Created by mymac on 2017/8/22.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';

import StaticImages from '../../../../constants/staticImage';

const {width, height} = Dimensions.get('window');


const styles = StyleSheet.create({
    viewStyle: {
        position: 'absolute',
    },
    viewStyle1: {
        width: width,
        height: height - 300,
        opacity: 0.3,
        backgroundColor: 'black',
    },
    downViewStyle: {
        width: width,
        height: 300,
        backgroundColor: 'white',
    },
    headViewStyle: {
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 7,
    },
    downSubViewStyle: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
    },
    subViewStyle: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
    },

});

class typeItem extends Component {
    constructor(props) {
        super(props);


        this.state = {
            isChooseWaitPay: false,
            isChooseSurePay: false,
            isChooseWaitCheck: false,
        };

        this.cancel = this.cancel.bind(this);
        this.sure = this.sure.bind(this);
        this.waitPay = this.waitPay.bind(this);
        this.surePay = this.surePay.bind(this);
        this.waitCheck = this.waitCheck.bind(this);
    }
    /*待付款*/
    waitPay(){
        
        if (this.state.isChooseWaitPay){
            // 取消选中
        }else {
            // 选中
        }
        this.setState({
            isChooseWaitPay: !this.state.isChooseWaitPay,
        });
    }

    /*已付款*/
    surePay(){
        
        if (this.state.isChooseSurePay){
            // 取消选中
        }else {
            // 选中
        }
        this.setState({
            isChooseSurePay: !this.state.isChooseSurePay,
        });
    }

    /*待核实发票*/
    waitCheck(){

        if (this.state.isChooseWaitCheck){
            // 取消选中
        }else {
            // 选中
        }
        this.setState({
            isChooseWaitCheck: !this.state.isChooseWaitCheck,
        });
    }

    /*取消*/
    cancel(){
        
        this.props.onCancel();
    }

    /*确定*/
    sure(){
        let data = [];
        if (this.state.isChooseWaitPay) {
            data.push('1');
        }
        if (this.state.isChooseSurePay) {
            data.push('2');
        }
        if (this.state.isChooseWaitCheck) {
            data.push('3');
        }

        this.props.onChoose(data);

    }

    render() {

        const chooseWaitPayImg = this.state.isChooseWaitPay ?
            <Image style={{position: 'absolute',right: 0, bottom: 0}} source={StaticImages.bussniessSureImg}/> : null;

        const chooseSurePayImg = this.state.isChooseSurePay ?
            <Image style={{position: 'absolute',right: 0, bottom: 0}} source={StaticImages.bussniessSureImg}/> : null;

        const chooseWaitCheckImg = this.state.isChooseWaitCheck ?
            <Image style={{position: 'absolute',right: 0, bottom: 0}} source={StaticImages.bussniessSureImg}/> : null;
        return (
            <View style={styles.viewStyle}>
                <View style={styles.viewStyle1}>
                </View>

                <View style={styles.downViewStyle}>
                    <View style={styles.headViewStyle}>

                        <TouchableOpacity onPress={()=>{
                            this.cancel();
                        }}>
                            <Text style={{color: '#999999'}}>取消</Text>
                        </TouchableOpacity>
                        <Text style={{color: '#333333', fontWeight: 'bold', fontSize: 17}}>请选择业务类型</Text>
                        <TouchableOpacity onPress={()=>{
                            this.sure();
                        }}>
                            <Text style={{color: '#309ded'}}>确定</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.downSubViewStyle}>

                        <View>
                            <TouchableOpacity style={[styles.subViewStyle, {borderColor: this.state.isChooseWaitPay ? '#309ded' : '#DCDDDC'}]} onPress={()=>{
                                this.waitPay();
                            }}>
                                <Text>待付款</Text>
                            </TouchableOpacity>
                            {chooseWaitPayImg}
                        </View>

                        <View>
                            <TouchableOpacity style={[styles.subViewStyle, {borderColor: this.state.isChooseSurePay ? '#309ded' : '#DCDDDC'}]} onPress={()=>{
                                this.surePay();
                            }}>
                                <Text>已付款</Text>
                            </TouchableOpacity>
                            {chooseSurePayImg}
                        </View>

                        <View>
                            <TouchableOpacity style={[styles.subViewStyle, {borderColor: this.state.isChooseWaitCheck ? '#309ded' : '#DCDDDC'}]} onPress={()=>{
                                this.waitCheck();
                            }}>
                                <Text>待核实发票</Text>
                            </TouchableOpacity>
                            {chooseWaitCheckImg}
                        </View>

                    </View>

                </View>
            </View >
        )
    }
}

export default typeItem;
