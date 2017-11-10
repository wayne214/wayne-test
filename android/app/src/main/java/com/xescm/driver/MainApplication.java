package com.xescm.driver;

import android.app.Application;
import android.content.Context;
import android.util.Log;

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
                    new BaiduMapPackage(getApplicationContext()),
                    new PermissionManagerPackage()
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
        Log.i("appversion",appVersion);
        SophixManager.getInstance().setContext(this)
                .setAesKey(null)
                .setAppVersion(appVersion)
                .setEnableDebug(true)
                .setSecretMetaData("24688107-1", "9571e582cf9cbacd18a089ecf275f6c7", "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCNfXI8oe7lUcr0itfq4pGkQS+/XzIEQdg73NP5ZalBDkw+QCRwKEKTM6ghCjXPU2ElVKfoH/tdOYKZ5URL1X9D1D1oBJdhEvci9ZmPt5hhtiwesXnjjoH0mepTazfkX7H84Q9rlxD63fQVUvL4RgoevXsQkR/OXWl6aXfd+k1FdwkuVVKsKMjKKOaAWRhS8D/aofNVuUdEEw8QXUVgMv+1//iiE62X/b1FRfuNjUtaH45OiODNie6uKEeL8sLSiAG3mzOKheDMqbYLPDh4dCx5UUcCvk+K3onUhDIJibsyRL+fBdL7yOS6JP5OK86AYimkYL2P7w5S0Evee+uixoobAgMBAAECggEAV3gc3jTxnhzhjiojb1bf2J5f6TvtjMoz5lYPSVe6ubggFD/NBvUsqxm9L6fDOkd+f/iE0LCs0aYTAhbFEOiMg5860wo7l0yFMbyJUVqbvpRDVDo9cxsPZeqc/TMEW495Vi7APLAoVB5Qnboo8KlD6lsTMFu3QPlokr+O1dC+YllYHGdcbFoSB+I2fzitGEnmiL1WOitNrKjft+6llBbmvkfrPubZ/vsWcMOGeqY4Wa3aG1AGXN19xz7eWIsGt0AR/g8tR94oZGXpYgSYIsfXTxZo1k5OTBoOE4uvNHBliShQrelbT/Pe9NcGQ8r9Pt12SVOFLCG3MLc08cBitqUxyQKBgQDCHH/sFDRBToQ39GCEeG3zgDi/QoSQLKWlqvLf+nWSokI2GmFRW3LKk3C0PCpZKlcRfRaJZoac4fKXmLmmLkowVktzkrqq5LbYHdsLW/iRetEQDOqG0Jmbzvqc74W8Tvc/+9cPzC9zAy6SLzEIDbhz55OekzatdJQ+i0b4kiYBFQKBgQC6mfWlWil6IcjFgyYqIvCNrxaEjwqvPnXlL53ITG5EYkWDP/xbztGlC7Wz6Lnw8Ui9Dw14+vpHoFdxsJpuF+/wZCdiW13YhO1gnCdNgS1MQgeuPtg8JDY4BZbo999Flw56OI4lt4s/LHU8qA+gYQRMpahC33wLwNGanDkZDwxKbwKBgQCYhJgmwMFGRxEwff2QWKfb2fW8oeFS/yGwiB+JyVu0OXXY2OV6bWZGsY6ur09++/uprCWXFE3U2twoLUJBxsFYNZXXW4T8XfUk3mCMDlnCxUObXuqvvxvTBtB3muPz0AAJ8DFNIlxt/CQNjLLz5wP1XhHpWTZvF9ibRAghq4Pc+QKBgQCDjtpWWsvVVI5VWlKE8J9CdQfeK28wAExkaf7G4cP4KISztV/5ZkX+I9RWZCT8D1DmIf+wpNnht9UOzaEDL5M1m5b8zEfMyGMHcvBuvz0tf3wkyB/xvuIO+znbRC7AxHArkUX+p3nf7zs0qZRi0SOT2lNX2nJ9YtMkOzIyTZ6vtwKBgD0dHLCMITkRbZoAdoAs3QyyGORE4XuBwtXh9EnzeuXDJpPGjFUe8YDr8yVO95Q6m98SQbe2swOV8EZ6wpNpVSlUxCecYo6iy5pcqHO0B+q6a54y2DVx+CRoODp5D94t2O76+YHAUPsaVOtcl6j9ss8ShLhAljylS5BQXioS/AUK")
                .setPatchLoadStatusStub(new PatchLoadStatusListener() {
                    @Override
                    public void onLoad(final int mode, final int code, final String info, final int handlePatchVersion) {
                        Log.i("code","mode = "+mode+"info = "+ info);
                        // 补丁加载回调通知
                        if (code == PatchStatus.CODE_LOAD_SUCCESS) {
                            // 表明补丁加载成功
                            Log.i("code","表明补丁加载成功");
                        } else if (code == PatchStatus.CODE_LOAD_RELAUNCH) {
                            // 表明新补丁生效需要重启. 开发者可提示用户或者强制重启;
                            // 建议: 用户可以监听进入后台事件, 然后调用killProcessSafely自杀，以此加快应用补丁，详见1.3.2.3
                            // 建议调用killProcessSafely，详见1.3.2.3
                            // SophixManager.getInstance().killProcessSafely();
                            Log.i("code","用户可以监听进入后台事件, 然后应用自杀");
                        } else if (code == PatchStatus.CODE_LOAD_FAIL) {
                            // 内部引擎异常，推荐此时清空本地补丁，防止失败补丁重复加载
                            // SophixManager.getInstance().cleanPatches();
                            Log.i("code","内部引擎异常, 推荐此时清空本地补丁, 防止失败补丁重复加载");
                        } else {
                            // 其它错误信息, 查看PatchStatus类说明
                            Log.i("code"," 其它错误信息, 查看PatchStatus类说明");
                        }
                    }
                }).initialize();
    }

    private void initHotFix() {
        SophixManager.getInstance().queryAndLoadNewPatch();
    }

}
