package com.xescm.driver;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage;
import com.remobile.toast.RCTToastPackage;

import cn.reactnative.modules.update.UpdateContext;
import cn.reactnative.modules.update.UpdatePackage;

import com.zmxv.RNSound.RNSoundPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.beefe.picker.PickerViewPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

import cn.jpush.reactnativejpush.JPushPackage;
import voice.VoiceReactPackage;

import org.lovebing.reactnative.baidumap.BaiduMapPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    private boolean SHUTDOWN_TOAST = false;
    private boolean SHUTDOWN_LOG = false;

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new ReactVideoPackage(),
                    new UpdatePackage(),
                    new RNSoundPackage(),
                    new PickerPackage(),
                    new PickerViewPackage(),
                    new RCTCameraPackage(),
                    new ImagePickerPackage(),
                    new AnExampleReactPackage(),
                    new RNFetchBlobPackage(),
                    new RNFSPackage(),
                    new RNDeviceInfo(),
                    new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
                    new RCTToastPackage(),
                    new BaiduMapPackage(getApplicationContext()),
                    new PermissionManagerPackage(),
                    new VoiceReactPackage()
            );
        }

        @Override
        protected String getJSBundleFile() {
            return UpdateContext.getBundleUrl(MainApplication.this);
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
