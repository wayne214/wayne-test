import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import NavigatorBar from '../../common/navigationBar/navigationBar';
import stylesCommon from '../../../assets/css/common'
import JPushModule from 'jpush-react-native'
import Storage from '../../utils/storage';
import EmptyView from '../mine/cell/emptyView';
import noDataIcon from '../../../assets/mine/nodata.png';
import Toast from '@remobile/react-native-toast';
import Swipeout from 'react-native-swipeout';



const styles = StyleSheet.create({
    row: {
        paddingTop: 15,
        backgroundColor: 'white',
    },
    rowContent: {
        marginLeft: 10,
        paddingRight: 10,
        paddingBottom: 15,
        //设置item分割线
        borderBottomColor: '#E8E8E8',
        borderBottomWidth: 1,
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 15,
        justifyContent: 'space-between'
    }
});

export default class MsgList extends Component {
    constructor(props) {
        super(props);
        this.getMessage = this.getMessage.bind(this);
        if (Platform.OS === 'android') JPushModule.initPush();
        // this._renderSeparator = this._renderSeparator.bind(this);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds,
            msgList: [],
            sectionID: null,
            rowID: null,
        }
    }

    componentDidMount() {
        this.getMessage()
    }


    /*获取消息列表*/
    getMessage() {
        Storage.get('acceptMessage').then((value) => {
            if (value) {
                // var searchList = [];
                console.log("-- get value From Storage --", value);
                // searchList = value;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(value),
                    msgList:value,
                })
            } else {
                // let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                console.log("-- get Create New ds  --", "");
                this.setState({
                    dataSource: ""
                })
            }
        })
    }

    /*点击item，刷新状态*/
    reloadListItemStatus(row){
        Storage.get('acceptMessage').then((value) => {

            let obj = value[row];
            obj.isRead = true;
            value.splice(row,1,obj);
            Storage.save('acceptMessage', value);

            this.getMessage();
        });
    }


    /*删除item*/
    deleteItem(row) {
        Storage.get('acceptMessage').then((value) => {

            value.splice(row,1);
            Storage.save('acceptMessage', value);

            this.setState({
                sectionID: null,
                rowID: null,
            });

            this.getMessage();
        });
    }

    renderRowList(rowData, sectionID, rowID) {

        let styleeee1 = {};
        let styleeee2 = {};

        if (rowData.isRead){
            styleeee1 = {fontSize: 14, color: '#999999', paddingLeft: 6, marginTop: 5};
            styleeee2 = {fontSize: 12, color: '#999999', paddingLeft: 6, marginTop: 5};

        }else {
            styleeee1 = {fontSize: 14, color: '#333333', paddingLeft: 6, marginTop: 5};
            styleeee2 = {fontSize: 12, color: '#333333', paddingLeft: 6, marginTop: 5};

        }


        // Buttons
        const swipeoutBtns = [
            {
                text: '删除',
                backgroundColor: 'red',
                onPress: ()=>{
                    this.deleteItem(rowID);
                },

            }
        ];
        return (

            <Swipeout
                close={!(this.state.sectionID === sectionID && this.state.rowID === rowID)}
                right={swipeoutBtns}
                rowID={rowID}
                sectionID={sectionID}
                onOpen={(sectionID, rowID) => {
                    this.setState({
                        sectionID,
                        rowID,
                    });
                }}
                onClose={() => console.log('===close') }
                scroll={event => console.log('scroll event') }
            >
                <TouchableOpacity onPress={() => {

                    this.reloadListItemStatus(rowID);

                    this.props.router.redirect(RouteType.MSG_DETAILS_PAGE,
                         {
                             msgID: rowData.id,
                             msgData: rowData
                         });


                }}>
                    <View style={styles.row}>
                        <View style={styles.rowContent}>
                            <Text
                                style={styleeee1}
                                numberOfLines={2}
                            >
                                {rowData.message}
                            </Text>

                            <Text
                                style={styleeee2}
                            >
                                {rowData.time}
                            </Text>

                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeout>
        )
    }

    /*全部已读*/
    readAllList(){
        Storage.get('acceptMessage').then((value) => {

            if (value){
                for (let i = 0; i < value.length; i++){
                    let obj = value[i];
                    obj.isRead = true;
                    value.splice(i,1,obj);
                }

                Storage.save('acceptMessage', value);

                this.getMessage();

                Toast.showShortCenter('全部已读');
            }

        });
    }
    render() {
        const navigator = this.props.navigation;
        return <View style={stylesCommon.container}>
            <NavigatorBar
                title={ '消息' }
                navigator={ navigator }
                leftButtonHidden={false}
                rightButtonConfig={{
                        type: 'string',
                        title: '一键已读',
                        onClick: () => {
                            this.readAllList();
                        },
                    }}
            />
            {
                this.state.msgList.length > 0 ?
                    <ListView
                        style={{marginTop: 12, backgroundColor: '#F5F5F5'}}
                        dataSource={this.state.dataSource}
                        renderRow={(rowData, sectionID, rowID) => this.renderRowList(rowData, sectionID, rowID)}
                        enableEmptySections={true}
                    /> : <EmptyView icon={noDataIcon} content={'暂时没有消息'} />
            }
        </View>
    }
}
