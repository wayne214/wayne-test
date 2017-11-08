package com.xescm.driver;

import android.app.Application;
import android.content.Context;

import com.facebook.react.ReactApplication;
import com.remobile.toast.RCTToastPackage;
import com.react.arron.speech.speechModulePackage;
import com.taobao.sophix.PatchStatus;
import com.taobao.sophix.SophixManager;
import com.taobao.sophix.listener.PatchLoadStatusListener;
import com.zmxv.RNSound.RNSoundPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.beefe.picker.PickerViewPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

import cn.jpush.reactnativejpush.JPushPackage;

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
                    new speechModulePackage(),
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
                    new BaiduMapPackage(getApplicationContext())
            );
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
        initHotFix();
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        String appVersion;
        try {
            appVersion = this.getPackageManager().getPackageInfo(this.getPackageName(), 0).versionName;
        } catch (Exception e) {
            appVersion = "1.0.0";
        }

        SophixManager.getInstance().setContext(this)
                .setAesKey(null)
                .setAppVersion(appVersion)
                .setEnableDebug(true)
                .setSecretMetaData("24630650-1", "a5e8905b579f46f42cc70fd8e5ee26e4", "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCFNhCoynOeaGsmt08YxaxCusMUGqJOJNDrq6vb/VoTSQv8YIDykclgbAlcQmoXBKT4C0c/GcLZc4lQk+dxqNiUSex5jfH4ZyOwsseu8gFsmfexNvm4lvaFwpKFaucgOKRBYdEagn4BrzkxeiUMnGv3SjqTqgtgGH1UF6UomPEqFmiXKbeTfgK9ehaPUawqm6PZuHnCFYUsz7iwWy9l6IQEv3/mGgMojqnvdQV7x3zNoM4Moh+TT85jMPdyUiqr/EeExuDqaix+h2ntglE3Ngt//5DzqwTPNPZ56asGHtb2RYsOfkfe5uKx6VZIzgffpYLLY9JyKSD/pMcR5W9h7cJLAgMBAAECggEAV3glvj+ZZaWY3kY1iMWblAGAQL4wXvFrwaPq6DvWnp0zYpeXdC/oNAkcqFjvwoeJL1pwgO2QdSqZOrCzo31EITLdNP/Qp9RJqifqWGSOLNp4uwOnO97cpv4ZKcQFWbH3oPryy95tkPuWqXdTxpEbj7hM+FMKvyG1gbc4+oxaptA1/vqBoiahmEG+hu/e5OhbZtRZy6NFpMt1G53DjPwfzv8f1XyTLEQ0o9eoLYXiJQtI1ENJB+depyxGytqkRK2SNPHvYFNeczUXFtKzSUayMCRzdPcXuzGxqrLA14Jea3TX8B53ZE7Yn4fVcjFZNSo9Ay4zXSq4QdIIrwscPOJEKQKBgQDOYJaM6A20fG1uCQwZa7EO5sgEZAhH5thtBYFO3D/EmqmiENdGKxEsJrttfxD4zNRcARAymyFjdsUXvMcuc1yhej+tDGnYpWJRtq3czcF7G6coTl/OaccG3EDstezzMXvMs1Aq+yrIslsJdL9TEuBrdHmWXEL9K7VWCQ37GYsA/QKBgQClPcm1bitOPiyR0cFafPWJtFQOvJRnNPUZ20s+prQosp12Gp9pn3ieps7zQSSeyqMW3mYv+6KgZq8e5dh4H5p5Rbym2jUXAVIaNSRDzCdtcu8rM+XqgQw5y+1omwZu6kC4PavK7sAx4AADj66HEsrA5KomUPWayQd6Z1Rfvby25wKBgQCCQL3kUvWLa1jZsQYc6TZH1Gp7MvNzBgSk0mupbSMmIANeUUi9daMR/aQf2KnKjeSd6OHjPrvU/fopIDGKZK8bD4Au5P3NCZzDPAwBpy8tVueqbcTUDzjZYJvtimjxmNKtAKNhbUK0hrUkg7XZZbmUuF+hAbwZ88MweOiFCbsMtQKBgQCQiobZ1H+/FnXILBIVRD9H8Fyi82RhDxrjPkcIi6wF+Y/xUoJlUyCgrstST4Zn/FtC0tHSYSw1YP0Iawe6s/Jc6JqH3VIZSId380pAn+FRRPte8CvKwI1gNTj7irfK59ArGY8fmU63kfiRJOsGrnJ63srTb3gXqIeJE7/ja8YauwKBgEV5SHmUbdtcuFYhHDBLSUaRass/l99a3uxZoPWG+qpq487SrZoRaVcXGGAqFBBUL2SnoWCZcvZKslNHq8Lduo348mBN7CMA9/lIEVdVy3OjIA/jvW0T4At6NatKGMSLvMvaCdWfRp0uJ9QRO4gV7xWP+iiA0zDUPUg11JAJp9JB")
                .setPatchLoadStatusStub(new PatchLoadStatusListener() {
                    @Override
                    public void onLoad(final int mode, final int code, final String info, final int handlePatchVersion) {
                        // 补丁加载回调通知
                        if (code == PatchStatus.CODE_LOAD_SUCCESS) {
                            // 表明补丁加载成功
                        } else if (code == PatchStatus.CODE_LOAD_RELAUNCH) {
                            // 表明新补丁生效需要重启. 开发者可提示用户或者强制重启;
                            // 建议: 用户可以监听进入后台事件, 然后调用killProcessSafely自杀，以此加快应用补丁，详见1.3.2.3
                            // 建议调用killProcessSafely，详见1.3.2.3
                            // SophixManager.getInstance().killProcessSafely();
                        } else if (code == PatchStatus.CODE_LOAD_FAIL) {
                            // 内部引擎异常，推荐此时清空本地补丁，防止失败补丁重复加载
                            // SophixManager.getInstance().cleanPatches();
                        } else {
                            // 其它错误信息, 查看PatchStatus类说明
                        }
                    }
                }).initialize();
    }

    private void initHotFix() {
        SophixManager.getInstance().queryAndLoadNewPatch();
    }

}
