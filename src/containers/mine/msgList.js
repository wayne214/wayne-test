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
import JPushModule from 'jpush-react-native'
import Storage from '../../utils/storage';
import EmptyView from '../../common/emptyView/emptyView';
import Toast from '@remobile/react-native-toast';
import Swipeout from 'react-native-swipeout';
import * as StaticColor from '../../constants/staticColor';
import * as ConstValue from '../../constants/constValue';

const styles = StyleSheet.create({
    row: {
        paddingTop: 15,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    rowContent: {
        marginLeft: 10,
        paddingRight: 10,
        paddingBottom: 15,
        //设置item分割线
        borderBottomColor: StaticColor.DEVIDE_LINE_COLOR,
        borderBottomWidth: 1,
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 15,
        justifyContent: 'space-between'
    },
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
});

export default class MsgList extends Component {
    constructor(props) {
        super(props);
        this.getMessage = this.getMessage.bind(this);
        // if (Platform.OS === 'android') JPushModule.initPush();
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
            styleeee1 = {fontSize: 14, color: StaticColor.GRAY_TEXT_COLOR, paddingLeft: 6, marginTop: 5};
            styleeee2 = {fontSize: 12, color: StaticColor.GRAY_TEXT_COLOR, paddingLeft: 6, marginTop: 5};

        }else {
            styleeee1 = {fontSize: 14, color: StaticColor.LIGHT_BLACK_TEXT_COLOR, paddingLeft: 6, marginTop: 5};
            styleeee2 = {fontSize: 12, color: StaticColor.LIGHT_BLACK_TEXT_COLOR, paddingLeft: 6, marginTop: 5};

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

                    this.props.navigation.navigate('MsgDetails',
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
        return (
            <View style={styles.container}>
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
                <View>
                {
                    this.state.msgList.length > 0 ?
                        <ListView
                            style={{backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND, marginBottom : ConstValue.Tabbar_marginBottom}}
                            dataSource={this.state.dataSource}
                            renderRow={(rowData, sectionID, rowID) => this.renderRowList(rowData, sectionID, rowID)}
                            enableEmptySections={true}
                        /> : <EmptyView content={'暂时没有消息'} />
                }
                </View>
            </View>
        );
    }
}
