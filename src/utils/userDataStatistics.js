import {AsyncStorage} from 'react-native';

class userDataStatistics {
    // 添加数据
    addData(userName, userId, userPhone, operation, OperationTime, userTime, position) {
        // 用户名字  用户id  用户手机号  操作功能  操作时间  操作耗时  操作位置
        const dataArray = new Array();
        dataArray[0] = 'userName' + global.userName;
        dataArray[1] = 'userId' + global.userId;
        dataArray[2] = 'userPhone' + userPhone;
        dataArray[3] = 'operation' + operation;
        dataArray[4] = 'OperationTime' + OperationTime;
        dataArray[5] = 'userTime' + userTime;
        dataArray[6] = 'position' + position;

        return AsyncStorage.setItem('xebestcn', dataArray);
    }

    getDate(){
        return AsyncStorage.getItem('xebestcn');
    }

    //删除数据
    deleteData() {
        return AsyncStorage.removeItem('xebestcn');
    }
}

const instance = new userDataStatistics();

export default instance;
