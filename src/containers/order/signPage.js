/**
 * Sample React Native App
 * https://github.com/facebook/react-native
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

import HeaderView from './components/SignHeaderView';
import ProductInfoView from './components/SignProductInfoView';
import NavigationBar from '../../common/navigationBar/navigationBar';
import {SignInAction} from '../../action/order';
import * as API from '../../constants/api';
import Loading from '../../utils/loading';
import Storage from '../../utils/storage';
import computationUtil from '../../utils/computationUtil';
import prventDoubleClickUtil from '../../utils/prventMultiClickUtil';
import * as StaticColor from '../../constants/staticColor';
import Toast from '@remobile/react-native-toast';
import HTTPRequest from '../../utils/httpRequest';


let userID = '';
let userName = '';
const {height} = Dimensions.get('window');

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    viewSty: {
        marginLeft: 10,
        marginTop: 15,
        marginRight: 10,
        marginBottom: 10,
        height: 40,
        backgroundColor: StaticColor.COLOR_MAIN,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewSty1: {
        flexDirection: 'row',
        height: 44,
        paddingLeft: 20,
        alignItems: 'center',
    },
});
class signPage extends Component {
    constructor(props) {
        super(props);
        // 得到上一级传过来的值，把值放进state中，this.state.xxx取值
        const params = this.props.navigation.state.params;

        this.state = {
            products: params.goodsInfoList,
            orderID: params.transCode,
            isReceipt: params.taskInfo.isReceipt,
            loading: false,
        };

        this.productInfo = this.productInfo.bind(this);
        this.getSignIn = this.getSignIn.bind(this);
        this.getSignInSuccessCallBack = this.getSignInSuccessCallBack.bind(this);
        this.getSignInFailCallBack = this.getSignInFailCallBack.bind(this);
        this.deleteComponent = this.deleteComponent.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        Storage.get('userInfo').then((userInfo) => {
            userID = userInfo.result.userId;
            userName = userInfo.result.userName;
        });
    }

    componentWillUnmount() {
        this.setState({
            products: null,
            orderID: null,
        });
    }
// 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }
    /*
     * 签收
     * */
    getSignIn(getSignInSuccessCallBack, getSignInFailCallBack) {
        // 传递参数
       // this.changeAppLoading(true);

        const datas = [];
        for (let i = 0; i < this.state.products.length; i++) {
            const obj = this.state.products[i];
            if (obj.refuseNum === null || obj.refuseNum === '0' || !obj.refuseNum || obj.signNum === null || !obj.signNum) {
                datas.push(
                    {
                        goodsId: obj.goodsId,
                        goodsName: obj.goodsName,
                        goodsSpce: obj.goodsSpce,
                        arNums: obj.arNums,
                        signNum: obj.shipmentNum,
                        shipmentNum: obj.shipmentNum,
                        refuseNum: '0',
                        goodsUnit: obj.goodsUnit,
                        refuseReason: '',
                    },
                );
            } else {
                datas.push(
                    {
                        goodsId: obj.goodsId,
                        goodsName: obj.goodsName,
                        goodsSpce: obj.goodsSpce,
                        arNums: obj.arNums,
                        signNum: obj.signNum,
                        shipmentNum: obj.shipmentNum,
                        refuseNum: obj.refuseNum,
                        refuseDetailDtoList: obj.refuseDetailDtoList,
                        goodsUnit: obj.goodsUnit,
                        refuseReason: obj.refuseReason,
                    },
                );
            }
        }
        // 获取签收需要上传的数据格式
        const goodsInfo = [];
        for (let i = 0; i < this.state.products.length; i++) {
            const productInfo = this.state.products[i];
            if (productInfo.refuseDetailDtoList) {
                goodsInfo.push({
                    goodsId: productInfo.goodsId,
                    signNum: productInfo.signNum?productInfo.signNum:productInfo.shipmentNum,
                    refuseNum: productInfo.refuseNum,
                    refuseDetail: productInfo.refuseDetailDtoList,
                });
            } else {
                goodsInfo.push({
                    goodsId: productInfo.goodsId,
                    signNum: productInfo.signNum?productInfo.signNum:productInfo.shipmentNum,
                    refuseNum: productInfo.refuseNum,
                });
            }
        }
        console.log('goodsInfo:'+JSON.stringify(goodsInfo));
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_NEW_SIGN,
            params: {
                userId: userID,
                userName,
                transCode: this.state.orderID,
                goodsInfo,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                this.getSignInSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
                this.getSignInFailCallBack();
            },
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });

    }


    // 获取数据成功回调
    getSignInSuccessCallBack() {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('签收', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '签收页面');
        // Toast.showShortCenter('签收成功!');

        if (this.state.isReceipt === '是'){

            Alert.alert('','是否立即上传回单？', [
                {text: '否',
                    onPress: () => {
                        DeviceEventEmitter.emit('changeStateReceipt');
                        this.props.navigator.popToTop();
                    },
                },
                {text: '是',
                    onPress: () => {
                        this.props.router.redirect(RouteType.UPLOAD_RECEIPT_PAGE, {
                            transCode: this.state.orderID
                        });
                    },
                },
            ], {cancelable: false});
        } else {
            DeviceEventEmitter.emit('changeStateReceipt');
            // this.props.navigator.popToTop();
        }

    }

    // 获取数据失败回调
    getSignInFailCallBack() {
        Toast.showShortCenter('签收失败!');
    }

    deleteComponent(componentID ,index , numbers){
        console.log('number:'+JSON.stringify(numbers));
        this.productInfo(componentID,index,numbers);
    }

    productInfo(proID, index, number) {

        console.log('number:'+JSON.stringify(number));
        let refuseNumber = 0;
        let refuseDetailDtoList = [];
        // 遍历得到拒收的总数  refuseType-拒收类型（1-解冻，2-损坏，3-收货方拒收）


        for (let i = 0; i < number.length; i++) {

            let aaaa = number[i];

            if (number[i].reason === '收货方拒收') {

                if (number[i].num === 0){
                }else {
                    const obj = {detailNum: number[i].num, refuseType: '3'};
                    refuseDetailDtoList.push(obj);
                }
            } else if (number[i].reason === '损坏') {

                if (number[i].num === 0){
                }else {
                    const obj = {detailNum: number[i].num, refuseType: '2'};
                    refuseDetailDtoList.push(obj);
                }
            } else if (number[i].reason === '解冻') {

                if (number[i].num === 0){
                }else {
                    const obj = {detailNum: number[i].num, refuseType: '1'};
                    refuseDetailDtoList.push(obj);
                }
            }
            refuseNumber += parseInt(number[i].num);
        }
        let refuseDetailDtoList1=[];
        let num1=[];
        let num2=[];
        let num3=[];
        for (let i=0;i<refuseDetailDtoList.length;i++){
            const obj=refuseDetailDtoList[i];
            if (obj.refuseType === '1'){
                num1.push(obj.detailNum);
            }
            if (obj.refuseType === '2'){
                num2.push(obj.detailNum);
            }
            if (obj.refuseType === '3'){
                num3.push(obj.detailNum);
            }
        }

        console.log('num1:'+JSON.stringify(num1));
        console.log('num2:'+JSON.stringify(num2));
        console.log('num3:'+JSON.stringify(num3));

        if (num1.length === 0){
        }else {
            let number = 0;
            for (let i=0;i<num1.length;i++) {
                number = number + num1[i];
            }
            const obj = {detailNum: number, refuseType: '1'};
            refuseDetailDtoList1.push(obj);
        }
        if (num2.length === 0){
        }else {
            let number = 0;
            for (let i=0;i<num2.length;i++) {
                number = number + num2[i];
            }
            const obj = {detailNum: number, refuseType: '2'};
            refuseDetailDtoList1.push(obj);
        }
        if (num3.length === 0){
        }else {
            let number = 0;
            for (let i=0;i<num3.length;i++) {
                number = number + num3[i];
            }
            const obj = {detailNum: number, refuseType: '3'};
            refuseDetailDtoList1.push(obj);
        }


        refuseDetailDtoList = refuseDetailDtoList1;

        const array = this.state.products;
        // 取出对应的item
        const item = array[index];
        // 改变签收的值
        //const getnumber = parseFloat(item.shipmentNum) - parseFloat(refuseNumber);
        const a1 = parseFloat(item.shipmentNum);
        const a2 = parseFloat(refuseNumber);
        const getnumber = computationUtil.accSub(a1,a2);

        if (getnumber === 0) {
            array[index] = {
                goodsId: item.goodsId,
                goodsName: item.goodsName,
                goodsSpce: item.goodsSpce,
                arNums: item.arNums,
                signNum: '0',
                shipmentNum: item.shipmentNum,
                refuseNum: item.shipmentNum, // 等于0为全部发运的拒收
                refuseDetailDtoList,
                goodsUnit: item.goodsUnit,
                refuseReason: item.refuseReason,
            };
        }else if (refuseNumber === 0) {
            array[index] = {
                goodsId: item.goodsId,
                goodsName: item.goodsName,
                goodsSpce: item.goodsSpce,
                arNums: item.arNums,
                signNum: item.shipmentNum,
                shipmentNum: item.shipmentNum,
                refuseNum: '0',
                goodsUnit: item.goodsUnit,
                refuseReason: item.refuseReason,
            };
        }
        else if (refuseNumber > item.shipmentNum) {
            return;
        } else {
            array[index] = {
                goodsId: item.goodsId,
                goodsName: item.goodsName,
                goodsSpce: item.goodsSpce,
                arNums: item.arNums,
                signNum: getnumber.toString(),
                shipmentNum: item.shipmentNum,
                refuseNum: refuseNumber.toString(),
                refuseDetailDtoList,
                goodsUnit: item.goodsUnit,
                refuseReason: item.refuseReason,
            };
        }

        // 更新state里面的数据
        this.setState({
            products: array,
        });

    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={{backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}}>
                <NavigationBar
                    title={'签收'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />

                <ScrollView keyboardDismissMode="on-drag" style={{
                    marginBottom: 0,
                     ...Platform.select({
                        ios:{height: height - 64 - 65},
                        android:{height: height - 73 - 65}
                     })

                }}>
                    <View style={{height: 10, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}}/>
                    {
                        this.state.products.map((item, indexRow) => {
                            return (
                                <View>
                                    <ProductInfoView
                                        key={indexRow}
                                        indexRow={indexRow}
                                        productID={item.goodsId}
                                        title={item.goodsName}
                                        Specifications={item.goodsSpce}
                                        arNums={item.arNums} // 应收
                                        shipmentNum={item.shipmentNum} // 发运
                                        getNum={!item.refuseNum || item.refuseNum == 0 ? item.shipmentNum : item.signNum} // 默认等于发运 item.signNum
                                        refuseNum={item.refuseNum ? item.refuseNum : 0} // 拒收
                                        goodsUnit={item.goodsUnit} // 单位
                                        sendValueCallBack={(proID, _index, number) => {
                                            this.productInfo(proID, _index, number);
                                        }}
                                        deleteComponent={(componentID, _index , numbers)=>{
                                            this.deleteComponent(componentID, _index, numbers);
                                        }}
                                    />
                                    <View style={{height: 10, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}}/>
                                </View>
                            );
                        })
                    }
                </ScrollView>
                <View style={{backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}}>
                    <TouchableOpacity
                        onPress={() => {
                            if (prventDoubleClickUtil.onMultiClick()) {
                                this.getSignIn();
                            }
                        }}
                        style={styles.viewSty}
                    >
                        <Text style={{color: StaticColor.WHITE_COLOR, fontSize: 16}}>提交</Text>
                    </TouchableOpacity>
                </View>
                {this.state.loading ? <Loading /> : null}
            </View>
        );
    }

}


function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(signPage);
