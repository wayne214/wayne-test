import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    TouchableOpacity,
    Image,
} from 'react-native';
import NavigationBar from '../../../common/navigationBar/navigationBar';
import HTTPRequest from '../../../utils/httpRequest';
import * as API from '../../../constants/api';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import {Geolocation} from 'react-native-baidu-map-xzx';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

class drawalsChooseCard extends Component {
    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            selectIndex: 0,
        };

        this.bankCardList = this.bankCardList.bind(this);
        this.getCurrentPosition = this.getCurrentPosition.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        this.bankCardList();
    }
    bankCardList() {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_BANK_CARD_LIST + global.phone,
            params: {},
            loading: () => {

            },
            success: (response) => {
                this.bankCardBundingCallBack(response.result);
            },
            error: (err) => {

            },
            finish: () => {

            },

        })

    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch(e => {
            console.log(e, 'error');
        });
    }
    bankCardBundingCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取银行卡列表', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '我的银行卡页面');
        console.log('result', result);
        if (result.length == 0) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result),
            })
        } else {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result),
            })
        }
    }
    renderRow(rowData, section, index){
        console.log(rowData);
        console.log(section);
        console.log(index);

        return(
            <View style={{height: 68, backgroundColor: 'white',}}>
                <TouchableOpacity style={styles.itemStyle} onPress={()=>{

                }}>

                    <Image style={{width: 32, height: 34, marginTop: 17, marginLeft: 10, backgroundColor: 'red'}}/>

                    <View style={{width: 200, height: 40, marginTop: 15, marginLeft: 15}}>

                        <Text style={{fontSize: 17, color: '#333333'}}>
                            建设银行
                        </Text>
                        <Text style={{marginTop: 5, color: '#999999'}}>
                            尾号1234   储蓄卡
                        </Text>
                    </View>

                    {
                        ()=>{
                            console.log('123456op index:', index);
                            console.log('123456op this.state.selectIndex:', this.state.selectIndex);

                            if (index == this.state.selectIndex){
                                console.log('123460754323456789');
                                return (
                                    <Text style={{fontFamily: 'iconfont',color:'#0071FF', position: 'absolute', right: 10, top: 25}}>&#xe629;</Text>
                                )
                            }
                        }
                    }


                </TouchableOpacity>

                <View style={{marginLeft: 10, backgroundColor: '#f5f5f5', height: 1}} />

            </View>
        )
    }
    render() {
        const navigator= this.props.navigation;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'选择银行'}
                    navigator={navigator}
                    leftButtonHidden={false}
                    rightIconFont="&#xe632;"
                    rightButtonConfig={{
                        type: 'font',
                        disableColor: '#0071FF',
                        disable: true,
                        onClick: () => {

                        },
                    }}
                />

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />
            </View>
        )
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    itemStyle:{
        marginHorizontal: 0,
        height: 67,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
});

function mapStateToProps(state){
    return {};
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(drawalsChooseCard);

