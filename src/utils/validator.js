/**
 * Created by xizhixin on 2017/9/21.
 * 正则表达式
 */
const isPhoneNumber = (phoneNumber) => {
    const reg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    return reg.test(phoneNumber);
};

// 数字、字母两者组合6-12位
const isPassword = (password) => {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
    return reg.test(password);
};

const isNewPassword = (password) => {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,14}$/;
    return reg.test(password);
};
// 是否包含特殊字符
const isConSpecialchar = (char) => {
    const reg = /^.*[~!@#\$%\^&\*\(\)_+\-=\[\]\{\}\\\|\'\";:,\<\.\>\/\?\s+].*$/;
    return reg.test(char);
};
// 是否全是数字
const isInteger = (char) => {
    const reg = /^\+?[1-9][0-9]*$/;
    return reg.test(char);
};

// 是否含有数字和小数点
const isFloat = (char) => {
    const reg = /^\d+(\.\d+)?$/;
    return reg.test(char);
};

// 前方补0方法
const leadingZeros = (num, length = null) => {

    let length_ = length;
    let num_ = num;
    if (length_ === null) {
        length_ = 2;
    }
    num_ = String(num_);
    while (num_.length < length_) {
        num_ = '0' + num_;
    }
    return num_;
};
/**
 * 截取手机号
 * @param  {[type]} phone [description]
 * @return {[type]}       [description]
 */
const newPhone = (phone)=>{
    if(phone && phone.length === 11){
        let temp = phone;
        return phone.substr(0,3)+'****'+temp.substr(7,11);
    }
    return '';
};
/*处理事件格式*/
const timeTrunToDateString = (time)=>{
    let dataString;
    //20121212 or 201212  转化为 2012年12月12日  or  2012年12月
    if (time.length === 8){
        // 年月日
        dataString = time.toString().substr(0, 4) + '年' + time.toString().substr(4, 2) + '月' + time.toString().substr(6, 2) + '日';
    }else if (time.length === 6) {
        dataString = time.toString().substr(0, 4) + '年' + time.toString().substr(4, 2) + '月';
    }

    return dataString;
};

export default {
    isPhoneNumber,
    isPassword,
    isNewPassword,
    isConSpecialchar,
    isInteger,
    isFloat,
    leadingZeros,
    newPhone,
    timeTrunToDateString
};
