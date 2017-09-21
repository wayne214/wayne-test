/**
 * Created by wayne on 2017/6/7.
 * 防止重复点击工具类，目前时间定为5秒
 * 返回true,代表可以点击，false,代表不可以点击
 */
const minClickDelayTime = 5000; // 延迟时间
let lastClickTime = 0; // 最后点击时间

const onMultiClick = () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime > minClickDelayTime) {
        lastClickTime = currentTime;
        return true;
    }
    return false;
};

const resetLastTime = () => {
    lastClickTime = 0;
};

export default {onMultiClick, resetLastTime};
