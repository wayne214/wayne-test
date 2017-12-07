//
//  Global.h
//  Driver
//
//  Created by YYQ on 2017/3/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#define KEY_WINDOW          [[UIApplication sharedApplication]keyWindow]

#pragma mark - Device
#define IPHONEWIDTH         [UIScreen mainScreen].bounds.size.width
#define IPHONEHEIGHT        [UIScreen mainScreen].bounds.size.height
#define IPHONESCREEN5p5     IPHONEHEIGHT == 736.00
#define IPHONESCREEN4p7     IPHONEHEIGHT == 667.00
#define IPHONESCREEN4       IPHONEHEIGHT == 568.00
#define IPHONESCREEN3p5     IPHONEHEIGHT == 480.00
#define IPHONESCREEN5p8     IPHONEHEIGHT == 813.00

#define IOS8_OR_LATER       ([UIDevice currentDevice].systemVersion.floatValue>=8.0)
#define IOS9_OR_LATER       ([UIDevice currentDevice].systemVersion.floatValue>=9.0)
#define IOS10_OR_LATER       ([UIDevice currentDevice].systemVersion.floatValue>=10.0)

#pragma mark - TOAST
#define TOAST_FONT_SIZE     14.0
#define TOAST_MIN_WIDTH     100.0
#define TOAST_MIN_HEIGHT    44.0
#define TOAST_MAX_WIDTH     0.8 * IPHONEWIDTH
#define TOAST_MAX_HEIGHT    0.4 * IPHONEHEIGHT

#define Notification_CLOSE_SPLASH_SCREEN @"Notification_CLOSE_SPLASH_SCREEN"
#define Notification_SHOW_SPLASH_SCREEN @"Notification_SHOW_SPLASH_SCREEN"

@interface Global : NSObject
@property(nonatomic, strong)NSMutableArray *messageQueue;

+(Global *)sharedInstance;

@end
