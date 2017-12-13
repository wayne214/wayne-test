//
//  RNCalliOSAction.m
//  Driver
//
//  Created by Mac on 2017/7/19.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RNCallNative.h"


//iOS调用RN
#import <React/RCTEventDispatcher.h>

@implementation RNCallNative

@synthesize bridge = _bridge;

//导出模块
RCT_EXPORT_MODULE();    //此处不添加参数即默认为这个OC类的名字


//一个参数
RCT_EXPORT_METHOD(RNSendMsgToNative)
{

  dispatch_sync(dispatch_get_main_queue(), ^{

    [NSTimer scheduledTimerWithTimeInterval:600000 target:self selector:@selector(sendParamsToRN) userInfo:nil repeats:YES];
  });


}

- (void)sendParamsToRN{

  [self.bridge.eventDispatcher sendAppEventWithName:@"nativeSendMsgToRN" body:@{@"msg":@"123"}];
  
}

//RCT_EXPORT_METHOD(RNSendMsgToServerSuccess)
//{
//  
//  NSLog(@"10秒钟上传日志成功");
//  
//  
//}


@end
