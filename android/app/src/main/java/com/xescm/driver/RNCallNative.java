package com.xescm.driver;

import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import static android.content.Context.ALARM_SERVICE;
import static android.content.Context.BIND_AUTO_CREATE;

/**
 * Created by mymac on 2017/7/19.
 */

public class RNCallNative extends ReactContextBaseJavaModule {

    public RNCallNative(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNCallNative";
    }

    @ReactMethod
    public void RNSendMsgToNative() {
//        Log.i("RNMessage", "receive message from RN:" + msg);


//        Toast.makeText(getReactApplicationContext(),"收到RN向Android传递消息"+msg,Toast.LENGTH_SHORT).show();

        Intent bindIntent = new Intent(getReactApplicationContext(), MyService.class);
        getCurrentActivity().bindService(bindIntent, serviceConnection, BIND_AUTO_CREATE);

        Intent intent = new Intent(getReactApplicationContext(),MyService.class);
//        intent.putExtra("msg",msg);
        getCurrentActivity().startService(intent);

//        MyService myService=new MyService();
//
//        myService.setCallback(new MyService.Callback() {
//            @Override
//            public void onDataChange() {
//                Map map=new HashMap<String,String>();
//                map.put("msg","123");
//
//                Toast.makeText(getReactApplicationContext(),"Android向RN传递消息",Toast.LENGTH_SHORT).show();
//
//
//                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                        .emit("nativeSendMsgToRN", map);
//            }
//        });

    }
    /**
     * 监听Activity与Service关联情况
     */
    private ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            MyService.DownLoadBinder binder =(MyService.DownLoadBinder) service;
            MyService myService = binder.getService();
            //设置进度条更新
            myService.setCallback(new MyService.Callback() {
                @Override
                public void onDataChange() {
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("nativeSendMsgToRN", "123");
                }
            });
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            //不连接

        }
    };

}
