//
//  SplashScreen.m
//  ColdChain
//
//  Created by YYQ on 2017/1/12.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "SplashScreen.h"
#import "Global.h"
@implementation SplashScreen

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(close){
  [[NSNotificationCenter defaultCenter] postNotificationName:Notification_CLOSE_SPLASH_SCREEN object:nil];
}
RCT_EXPORT_METHOD(show){
  [[NSNotificationCenter defaultCenter] postNotificationName:Notification_SHOW_SPLASH_SCREEN object:nil];
}
@end
