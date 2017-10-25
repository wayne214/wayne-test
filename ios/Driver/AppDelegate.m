/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif
#import <React/RCTBundleURLProvider.h>

#import "Global.h"
#import <React/RCTRootView.h>
#import "RCTBaiduMapViewManager.h"
#import <React/RCTLinkingManager.h>

@interface AppDelegate ()<JPUSHRegisterDelegate>
{
  UIImageView *splashImage;
}
@end


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(closeSplashImage) name:@"Notification_CLOSE_SPLASH_SCREEN" object:nil];
  
  [UIApplication sharedApplication].applicationIconBadgeNumber=0;
  
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
    JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
    entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;
    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
    
#endif
  } else if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
    [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                      UIUserNotificationTypeSound |
                                                      UIUserNotificationTypeAlert)
                                          categories:nil];
  } else {
    [JPUSHService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                      UIRemoteNotificationTypeSound |
                                                      UIRemoteNotificationTypeAlert)
                                          categories:nil];
  }
  
  [JPUSHService setupWithOption:launchOptions appKeyw:appKey
                        channel:nil apsForProduction:isProduction];
  
  [RCTBaiduMapViewManager initSDK:@"YQTDK3RGAXnoGrLfFqyYLyPxcMft4LHn"];
  
  NSURL *jsCodeLocation;
  
  
  [[RCTBundleURLProvider sharedSettings] setDefaults];
#if DEBUG
 // [[RCTBundleURLProvider sharedSettings] setJsLocation:@"192.168.24.104"];
#endif
  
  //模拟器测试


  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  /*
   
   react-native bundle --entry-file index.ios.js --platform ios --dev false --bundle-output ./ios/bundle/index.ios.jsbundle --assets-dest ./ios/bundle
   
   */
  //打包手机测试
  
  //jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"index.ios" withExtension:@"jsbundle"];
  
  
  
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Driver"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [self autoSplashScreen];//写在 return YES 之前，其他代码之后
  return YES;
  
  //$(SRCROOT)/../node_modules/react-native/Libraries
  //$(SRCROOT)/../node_modules/react-native/React
}

#pragma mark- sutoSplashScreen

-(void)autoSplashScreen {
  if (!splashImage) {
    splashImage = [[UIImageView alloc]initWithFrame:[UIScreen mainScreen].bounds];
  }
  if (IPHONESCREEN3p5) {
    [splashImage setImage:[UIImage imageNamed:@"launch4"]];
  }else if (IPHONESCREEN4){
    [splashImage setImage:[UIImage imageNamed:@"launch5"]];
  }else if (IPHONESCREEN4p7){
    [splashImage setImage:[UIImage imageNamed:@"launch6"]];
  }else if (IPHONESCREEN5p5){
    [splashImage setImage:[UIImage imageNamed:@"launch7"]];
  }
  [self.window addSubview:splashImage];
}
-(void)closeSplashImage {
  if (!splashImage) {
    return;
  }
  dispatch_sync(dispatch_get_main_queue(), ^{
    [UIView animateWithDuration:0.5 animations:^{
      splashImage.alpha = 0;
    } completion:^(BOOL finished){
      [splashImage removeFromSuperview];
      splashImage = nil;
    }];
  });
}

-(void)showSplashImage {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self autoSplashScreen];
  });
}
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [JPUSHService registerDeviceToken:deviceToken];
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  NSDictionary * userInfo = notification.request.content.userInfo;
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  }
  completionHandler(UNNotificationPresentationOptionAlert);
}
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  }
  completionHandler();
}
-(BOOL)application:(UIApplication*)application
           openURL:(NSURL*)url
 sourceApplication:(NSString*)sourceApplication
        annotation:(id)annotation{
  return[RCTLinkingManager
         application:application
         openURL:url
         sourceApplication:sourceApplication
         annotation:annotation];}
//
//Only if your app is using [Universal Links]
//(https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html).
-(BOOL)application:(UIApplication*)application
continueUserActivity:(NSUserActivity*)userActivity
restorationHandler:(void(^)(NSArray*
                            _Nullable))restorationHandler{
  return[RCTLinkingManager
         application:application
         continueUserActivity:userActivity
         restorationHandler:restorationHandler];
}
- (void)applicationDidEnterBackground:(UIApplication *)application
{
  __block UIBackgroundTaskIdentifier _bgTask;
  _bgTask = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
    dispatch_async(dispatch_get_main_queue(), ^{
      if (_bgTask != UIBackgroundTaskInvalid)
      {
        _bgTask = UIBackgroundTaskInvalid;
      }
    });
  }];
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    dispatch_async(dispatch_get_main_queue(), ^{
      if (_bgTask != UIBackgroundTaskInvalid)
      {
        _bgTask = UIBackgroundTaskInvalid;
      }
    });
  });
}

@end
