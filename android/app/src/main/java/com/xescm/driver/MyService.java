package com.xescm.driver;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;


public class MyService extends Service {

    private Timer mTimer;
    private Callback callback;

    @Override
    public IBinder onBind(Intent intent) {
        // TODO Auto-generated method stub
        System.out.println("=====onBind=====");
        return new DownLoadBinder();
    }
    /**
     * 内部类继承Binder
     * @author lenovo
     *
     */
    public class DownLoadBinder extends Binder {
        /**
         * 声明方法返回值是MyService本身
         * @return
         */
        public MyService getService() {
            return MyService.this;
        }
    }

    class RequestTimerTask extends TimerTask {
        public void run() {
            Message message = new Message();
            message.what = 1;
            handler.sendMessage(message);
//            mTimer.cancel();
        }
    }

    final Handler handler = new Handler() {
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 1:
                    Log.e("Timer", "Timer");

//                    Log.e("callback", callback);

                    if (callback != null) {
                        callback.onDataChange();
                    }

                    break;
            }
            super.handleMessage(msg);
        }
    };

    public MyService() {
    }

    public void setCallback(Callback callback) {
        this.callback = callback;
    }

    public static interface Callback {
        void onDataChange();
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        mTimer = new Timer();
        mTimer.schedule(new RequestTimerTask(), 1000, 60000);
        return super.onStartCommand(intent, flags, startId);

    }

    @Override
    public void onDestroy() {
        if (mTimer != null) {
            mTimer.cancel();
            mTimer = null;
        }
        super.onDestroy();

    }
}
