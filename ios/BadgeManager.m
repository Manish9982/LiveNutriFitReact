//
//  BadgeManager.m
//  LiveNutriFit
//
//  Created by UNITED IT SERVICES on 19/03/24.
//

#import "BadgeManager.h"
#import <UIKit/UIKit.h>

@implementation BadgeManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(updateBadgeCount:(NSInteger)count) {
  dispatch_async(dispatch_get_main_queue(), ^{
    UIApplication *application = [UIApplication sharedApplication];
    application.applicationIconBadgeNumber = count;
  });
}

@end
