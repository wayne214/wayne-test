//
//  BDSpeech.m
//  Driver
//
//  Created by 尼古拉斯·常·穆罕默德 on 2017/11/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "BDSpeech.h"


//iOS调用RN
#import <React/RCTEventDispatcher.h>



@implementation BDSpeech

@synthesize bridge = _bridge;

//导出模块
RCT_EXPORT_MODULE();    //此处不添加参数即默认为这个OC类的名字


//一个参数
RCT_EXPORT_METHOD(speek:(NSString *)string)
{
  
  dispatch_sync(dispatch_get_main_queue(), ^{
    [self configureSDK];

    [self speakSentence:string];

  });
  
}


/**
 文本合成语音

 @param string 文本
 */
- (void)speakSentence: (NSString *)string
{
  [[BDSSpeechSynthesizer sharedInstance] speakSentence: string withError:nil];
}

-(void)configureSDK{
  NSLog(@"TTS version info: %@", [BDSSpeechSynthesizer version]);
  [BDSSpeechSynthesizer setLogLevel:BDS_PUBLIC_LOG_VERBOSE];
  [[BDSSpeechSynthesizer sharedInstance] setSynthesizerDelegate:self];
  [self configureOnlineTTS];
  [self configureOfflineTTS];
}
// 配置在线
-(void)configureOnlineTTS{
  //#error "Set api key and secret key"
  [[BDSSpeechSynthesizer sharedInstance] setApiKey:@"z8gqGaqNniBGcxkoO2XhFG31" withSecretKey:@"ZSVsD7qZfKlA00XcH2aQVGIl3OOjX8xn"];
}
// 配置离线
-(void)configureOfflineTTS{
  NSError *err = nil;
  NSString* offlineEngineSpeechData = [[NSBundle mainBundle] pathForResource:@"Chinese_And_English_Speech_Male" ofType:@"dat"];
  NSString* offlineChineseAndEnglishTextData = [[NSBundle mainBundle] pathForResource:@"Chinese_And_English_Text" ofType:@"dat"];
  err = [[BDSSpeechSynthesizer sharedInstance] loadOfflineEngine:offlineChineseAndEnglishTextData speechDataPath:offlineEngineSpeechData licenseFilePath:nil withAppCode:@"10404578"];
  if(err){
    return;
  }
  
  // 合成参数设置
  
  [[BDSSpeechSynthesizer sharedInstance] setSynthParam:[NSNumber numberWithInt:BDS_SYNTHESIZER_SPEAKER_FEMALE]
                                                forKey:BDS_SYNTHESIZER_PARAM_SPEAKER ];
  [[BDSSpeechSynthesizer sharedInstance] setSynthParam:[NSNumber numberWithInt:5]
                                                forKey:BDS_SYNTHESIZER_PARAM_VOLUME];
  [[BDSSpeechSynthesizer sharedInstance] setSynthParam:[NSNumber numberWithInt:3]
                                                forKey:BDS_SYNTHESIZER_PARAM_SPEED];
  [[BDSSpeechSynthesizer sharedInstance] setSynthParam:[NSNumber numberWithInt:5]
                                                forKey:BDS_SYNTHESIZER_PARAM_PITCH];
  [[BDSSpeechSynthesizer sharedInstance] setSynthParam:[NSNumber numberWithInt: BDS_SYNTHESIZER_AUDIO_ENCODE_MP3_16K]
                                                forKey:BDS_SYNTHESIZER_PARAM_AUDIO_ENCODING ];
  
}
// 播放失败
- (void)synthesizerErrorOccurred:(NSError *)error
                        speaking:(NSInteger)SpeakSentence
                    synthesizing:(NSInteger)SynthesizeSentence{
  
  [[BDSSpeechSynthesizer sharedInstance] cancel];
}



@end
