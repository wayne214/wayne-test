// export const DEBUG = __DEV__;
export const DEBUG = true;

export const IS_FIRST_START_FLAG = 'IS_FIRST_START_FLAG'; // 第一次启动App的标记
export const UDID = 'UDID';
// export const TOKEN = 'da971f8e9e024f579800cf20c146e6df';
export const TOKEN = '';
export const USERINFO = 'userInfo';
export const PHOTOREFNO = 'photoRefNo';

 // const HOST_DEV = 'http://mproxy-beta.xianyiscm.com/';
 const HOST_DEV = 'http://mproxy-test.xianyiscm.com/';
// const HOST_DEV = 'http://mproxy.xianyiscm.com/';

const HOST_PRODUCT = 'http://mproxy.xianyiscm.com/';

export const HOST = DEBUG ? HOST_DEV : HOST_PRODUCT;

