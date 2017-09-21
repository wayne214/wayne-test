//
//  Global.m
//  Driver
//
//  Created by YYQ on 2017/3/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "Global.h"

@implementation Global

+(Global *)sharedInstance {
  static Global *global = nil;
  @synchronized(self) {
    if (global == nil) {
      global = [[self alloc] init];
      global.messageQueue = [[NSMutableArray alloc] initWithCapacity:3];
    }
  }
  return global;
}

-(instancetype)init {
  self = [super init];
  if (self) {
    
  }
  return self;
}

@end
