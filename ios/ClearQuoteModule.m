#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ClearQuoteModule, RCTEventEmitter)

RCT_EXTERN_METHOD(
  initSDK:(NSString *)key
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  startInspection:(NSDictionary *)clientAttrs
  inputDetails:(NSDictionary *)inputDetails
  userFlowParams:(NSDictionary *)userFlowParams
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(logout)

RCT_EXTERN_METHOD(manualOfflineSync)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(getDealerCode)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(getSDKVersion)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isSDKInitialized)

@end
