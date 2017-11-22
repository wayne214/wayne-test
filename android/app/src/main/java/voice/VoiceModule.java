package voice;

import com.baidu.tts.client.SpeechSynthesizer;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by wayne on 2017/9/25.
 */

public class VoiceModule extends ReactContextBaseJavaModule {
    private VoiceUtils utils;
    private SpeechSynthesizer mSpeechSynthesizer;
    public VoiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public void initialize() {
        super.initialize();
        utils = new VoiceUtils();
        utils.init(getReactApplicationContext(), 0);
        mSpeechSynthesizer = utils.getSyntheszer();
    }

    @Override
    public String getName() {
        return "VoiceModule";
    }
    @ReactMethod
    public void speak(String msg, int speaker) {
//        utils = new VoiceUtils();
//        utils.init(getReactApplicationContext(), speaker);
//        mSpeechSynthesizer = utils.getSyntheszer();
        this.mSpeechSynthesizer.speak(msg);
    }

    @Override
    public void onCatalystInstanceDestroy() {
        this.mSpeechSynthesizer.release();
        super.onCatalystInstanceDestroy();
    }
}
