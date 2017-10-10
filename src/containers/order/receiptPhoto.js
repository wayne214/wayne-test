/**
 * Created by xizhixin on 2017/6/30.
 * 回单照片界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';
import NavigatorBar from '../../common/navigationBar/navigationBar';
import CommonCell from '../../containers/mine/cell/commonCell';
import * as API from '../../constants/api';
import Loading from '../../utils/loading';
import HTTPRequest from '../../utils/httpRequest';

import EmptyView from '../../common/emptyView/emptyView';
import * as StaticColor from '../../constants/staticColor';
const {width} = Dimensions.get('window');
const cellWH = (width - 60) / 3;

let userID = '';
let userName = '';

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    listViewStyle: {
        // 主轴方向
        flexDirection: 'row',
        // 一行显示不下,换一行
        flexWrap: 'wrap',
        // 侧轴方向
        alignItems: 'center', // 必须设置,否则换行不起作用
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    innerViewStyle: {
        width: cellWH,
        height: cellWH,
        marginLeft: 10,
        marginTop: 10,
        borderWidth: 1,
        // 文字内容居中对齐
        alignItems:'center',
        borderColor: StaticColor.PHOTO_BORDER_COLOR,
        // backgroundColor:'red'
    },
    iconStyle: {
        width: cellWH,
        height: cellWH,
    },

});

class ReceiptPhoto extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            transOrder: params.transOrder,
            dataSource: ds,
            result: [],
            loading: false,
        };
        this.renderRow = this.renderRow.bind(this);
        this.clickImage = this.clickImage.bind(this);
        this.getOrderPictureList = this.getOrderPictureList.bind(this);
        this.getOrderPictureSuccessCallBack = this.getOrderPictureSuccessCallBack.bind(this);
        this.getOrderPictureFailCallBack = this.getOrderPictureFailCallBack.bind(this);

    }

    componentDidMount() {
        this.getCurrentPosition();
        this.getOrderPictureList();
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

    clickImage(index) {
        if (this.state.result) {
            this.props.router.redirect(
                'ImageShow',
                {
                    image: this.state.result,
                    num: parseInt(index),
                },
            );
        }
    }


    getOrderPictureList() {
        currentTime = new Date().getTime();
        HTTPRequest({
            url: API.API_ORDER_PICTURE_SHOW,
            params: {
                refNo: this.state.transOrder,
            },
            loading: ()=>{
                this.setState({
                    loading: true,
                });
            },
            success: (responseData)=>{
                this.getOrderPictureSuccessCallBack(responseData.result);
            },
            error: (errorInfo)=>{
                this.getOrderPictureFailCallBack();
            },
            finish:()=>{
                this.setState({
                    loading: false,
                });
            }
        });
    }
    getOrderPictureSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取回单照片',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '回单照片页面');
        if (result) {
            if (result.urlList) {
                this.setState({
                    result: result.urlList.map(i => {
                        console.log('received image', i);
                        return {url: i ? i : ''};
                    }),
                    dataSource: this.state.dataSource.cloneWithRows(result.urlList),
                });
            }
        }
    }
    getOrderPictureFailCallBack() {
    }

    renderRow(rowData, sectionID, rowID){
        // console.log('========rowData=========',rowData);
        return(
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={()=>{
                    console.log('rowID',rowID);
                    this.clickImage(rowID);
                }}
            >
                <View style={styles.innerViewStyle}>
                    <Image
                        source={{uri: rowData}}
                        style={styles.iconStyle}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'回单'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                {
                    (this.state.result && this.state.result.length !== 0) ?
                        <View>
                            <View style={{marginTop: 10, marginBottom: 10}}>
                                <CommonCell itemName="回单类型" content={'纸质回单'} hideBottomLine={true}/>
                            </View>
                            <View style={{backgroundColor: StaticColor.WHITE_COLOR,}}>
                                <CommonCell itemName="上传回单" content={''} />
                                <ListView
                                    removeClippedSubviews={false}
                                    dataSource={this.state.dataSource}
                                    renderRow={this.renderRow}
                                    contentContainerStyle={styles.listViewStyle}
                                />
                            </View>
                        </View> : <EmptyView content={'暂时没有照片'} />
                }
                {this.state.loading ? <Loading /> : null}
            </View>
        );
    }
}


function mapStateToProps(state){
    return {
        userInfo: state.user.get('userInfo'),
    };
}

function mapDispatchToProps (dispatch){
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptPhoto);

