//
//  BDSpeech.h
//  Driver
//
//  Created by 尼古拉斯·常·穆罕默德 on 2017/11/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import <React/RCTBridgeModule.h>

#import "BDSSpeechSynthesizer.h"

@interface BDSpeech : NSObject<RCTBridgeModule, BDSSpeechSynthesizerDelegate>

@end
