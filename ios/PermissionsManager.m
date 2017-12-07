//
//  PermissionsManager.m
//  Driver
//
//  Created by Mac on 2017/8/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "PermissionsManager.h"

#import <AVFoundation/AVFoundation.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <CoreLocation/CoreLocation.h>


//iOS调用RN
#import <React/RCTEventDispatcher.h>


@implementation PermissionsManager
@synthesize bridge = _bridge;

//导出模块
RCT_EXPORT_MODULE();    //此处不添加参数即默认为这个OC类的名字


//Promises
//最后两个参数是RCTPromiseResolveBlock（成功block）和RCTPromiseRejectBlock（失败block）




/*
 //正确回调，传递参数
 
 typedef void (^RCTPromiseResolveBlock)(id result);
 
 */


/*
 //错误回调，传三个参数
 
 typedef void (^RCTPromiseRejectBlock)(NSString *code, NSString *message, NSError *error);
 
 */



/**
 相机权限

 */
RCT_EXPORT_METHOD(cameraPermission:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
 
  AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
  
  if (authStatus == AVAuthorizationStatusRestricted || authStatus ==AVAuthorizationStatusDenied)
    
  {
    //无权限
    reject(@"500",@"请在iPhone的“设置-隐私-相机”选项中，允许鲜易通访问你的相机",nil);
   
  }else {
    // 有权限
    
    resolve(@YES);

  }
}


/**
 相册权限
 
 */
RCT_EXPORT_METHOD(photoPermission:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  
  ALAuthorizationStatus author = [ALAssetsLibrary authorizationStatus];
  
  if (author == ALAuthorizationStatusRestricted || author ==ALAuthorizationStatusDenied)
  {
    //无权限
    reject(@"500",@"请在iPhone的“设置-隐私-相册”选项中，允许鲜易通访问你的相册",nil);
    
  }else {
    // 有权限
    
    resolve(@YES);
    
  }
}

/**
 定位权限
 
 */
RCT_EXPORT_METHOD(locationPermission:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  
  if([CLLocationManager locationServicesEnabled] && [CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied) {
    //无权限
    reject(@"500",@"没有访问位置权限，请前往 “设置-隐私-位置” 开启权限",nil);
    
  }else {
    // 有权限
    
    resolve(@YES);
    
  }
}

/**
 麦克风权限
 
 */
RCT_EXPORT_METHOD(microphonePermission:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  
  AVAudioSession *avSession = [AVAudioSession sharedInstance];
  
  if ([avSession respondsToSelector:@selector(requestRecordPermission:)]) {
    
    [avSession requestRecordPermission:^(BOOL available) {
      if (available) {
        resolve(@YES);
      }else {
        reject(@"500",@"没有访问麦克风权限，请前往 “设置-隐私-麦克风“ 开启权限",nil);
      }
    }];
    
  }
}

/**
 通知状态
 
 */
#define IOS8 ([[[UIDevice currentDevice] systemVersion] doubleValue] >=8.0 ? YES : NO)

RCT_EXPORT_METHOD(notificationStatus:(RCTResponseSenderBlock)callback){

  if (IOS8) { //iOS8以上包含iOS8
    if ([[UIApplication sharedApplication] currentUserNotificationSettings].types  == UIUserNotificationTypeNone) {
      callback(@[@NO]);
    }else{
      callback(@[@YES]);
    }
  }else{ // ios7 以下
    if ([[UIApplication sharedApplication] enabledRemoteNotificationTypes]  == UIRemoteNotificationTypeNone) {
      callback(@[@NO]);
    }else{
      callback(@[@YES]);
    }
  }

}




@end
