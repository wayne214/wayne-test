/**
 * Created by mymac on 2017/7/4.
 */
/*创建资质认证-车辆类型数据*/
function createCarTypeDate() {
    const carTypeDataSource= ['保温车','常温车','单温车','两温车','三温车'];

    let data = [];
    for(let i=0;i<carTypeDataSource.length;i++){
        data.push(carTypeDataSource[i]);
    }
    return data;
}
/*创建资质认证-车长数据，关联出载重数据*/
function createCarLengthDate(carWeightDataSource) {

    let data = [];
    for (const key in carWeightDataSource) {
        data.push(key);
    }
    return data;
}
/*创建日期数据,年月*/
function createDateDataYearMouth() {
    let date = [];
    for(let i=2017;i<=2050;i++){
        let month = [];
        for(let j = 1;j<13;j++){
            month.push(prefixInteger(j, 2)+'月');
        }
        let _date = {};
        _date[i+'年'] = month;
        date.push(_date);
    }
    return date;
}
/*创建日期数据,年月日*/
function createDateData() {
    let date = [];
    for(let i=2017;i<=2050;i++){
        let month = [];
        for(let j = 1;j<13;j++){
            let day = [];
            if(j === 2){
                for(let k=1;k<29;k++){
                    day.push(prefixInteger(k, 2)+'日');
                }
                //Leap day for years that are divisible by 4, such as 2000, 2004
                if(i%4 === 0){
                    day.push(29+'日');
                }
            }
            else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                for(let k=1;k<32;k++){
                    day.push(prefixInteger(k, 2)+'日');
                }
            }
            else{
                for(let k=1;k<31;k++){
                    day.push(prefixInteger(k, 2)+'日');
                }
            }
            let _month = {};
            _month[prefixInteger(j, 2)+'月'] = day;
            month.push(_month);
        }
        let _date = {};
        _date[i+'年'] = month;
        date.push(_date);
    }
    return date;
}
// 数字前面自动补0
function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
export default {
    createDateData,
    createDateDataYearMouth,
    createCarTypeDate,
    createCarLengthDate,
};
