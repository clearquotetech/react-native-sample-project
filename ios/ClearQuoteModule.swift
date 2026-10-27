//
//  ClearQuoteModule.swift
//  MyApp
//
//  Created by Abhishek on 08/12/25.
//

import Foundation
import ClearQuoteSDK
import UIKit
import React

@objc(ClearQuoteModule)
class ClearQuoteModule: RCTEventEmitter {
  
  private var hasListeners = false
  
  override func supportedEvents() -> [String]! {
    ["inspectionCompletionStatus"]
  }
  
  override func startObserving() {
    hasListeners = true
  }
  
  override func stopObserving() {
    hasListeners = false
  }
  
  @objc(initSDK:resolver:rejecter:)
  func initSDK(
    _ key: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      guard let rootVC = UIApplication.shared.topMostViewController() else {
        reject("NO_VC", "No ViewController", nil)
        return
      }
      
      ClearQuote.shared.initSDK(
        baseVC: rootVC,
        key: key
      ) { isInitialized, code, message in
        resolve([
          "isInitialized": isInitialized,
          "code": code,
          "message": message
        ])
      }
    }
  }
  
  @objc(startInspection:inputDetails:userFlowParams:resolver:rejecter:)
  func startInspection(
    _ clientAttrs: NSDictionary?,
    inputDetails: NSDictionary?,
    userFlowParams: NSDictionary?,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let attrs = Self.makeClientAttrs(from: clientAttrs)
    let details = Self.makeInputDetails(from: inputDetails)
    let flowParams = Self.makeUserFlowParams(from: userFlowParams)
    
    DispatchQueue.main.async {
      guard let rootVC = UIApplication.shared.topMostViewController() else {
        reject("NO_VC", "No ViewController", nil)
        return
      }
      
      ClearQuote.shared.startInspection(
        baseVC: rootVC,
        clearQuoteSdkDelegate: self,
        clientAttrs: attrs,
        inputDetails: details,
        userFlowParams: flowParams
      ) { started, message, code in
        resolve([
          "started": started,
          "message": message,
          "code": code
        ])
      }
    }
  }
  
  private static func makeClientAttrs(from dictionary: NSDictionary?) -> CQSDKClientAttrs? {
    guard let dictionary else { return nil }
    
    return CQSDKClientAttrs(
      userName: dictionary["userName"] as? String,
      dealer: dictionary["dealer"] as? String,
      dealerIdentifier: dictionary["dealerIdentifier"] as? String,
      client_unique_id: dictionary["client_unique_id"] as? String,
      organisationId: dictionary["organisationId"] as? String
    )
  }
  
  private static func makeInputDetails(from dictionary: NSDictionary?) -> CQSDKInputDetails? {
    guard let dictionary else { return nil }
    
    let customerDict = dictionary["customerDetails"] as? NSDictionary
    let vehicleDict = dictionary["vehicleDetails"] as? NSDictionary
    let quoteDict = dictionary["quoteData"] as? NSDictionary
    
    let customerDetails: CQSDKCustomerDetails? = customerDict.map {
      CQSDKCustomerDetails(
        name: $0["name"] as? String,
        email: $0["email"] as? String,
        dialCode: $0["dialCode"] as? String,
        phoneNumber: $0["phoneNumber"] as? String
      )
    }
    
    let vehicleDetails: CQSDKVehicleDetails? = vehicleDict.map {
      CQSDKVehicleDetails(
        regNumber: $0["regNumber"] as? String,
        make: $0["make"] as? String,
        model: $0["model"] as? String,
        vin: $0["vin"] as? String,
        bodyStyle: $0["bodyStyle"] as? String,
        fuelType: $0["fuelType"] as? String,
        variant: $0["variant"] as? String
      )
    }
    
    let quoteData: CQSDKQuoteData? = quoteDict.map {
      CQSDKQuoteData(
        inspectionType: $0["inspectionType"] as? String,
        fleetImageType: $0["fleetImageType"] as? String
      )
    }
    
    return CQSDKInputDetails(
      customerDetails: customerDetails,
      vehicleDetails: vehicleDetails,
      quoteData: quoteData
    )
  }
  
  private static func makeUserFlowParams(from dictionary: NSDictionary?) -> CQSDKUserFlowParams? {
    guard let dictionary else { return nil }
    
    return CQSDKUserFlowParams(
      isOffline: Self.boolValue(from: dictionary, key: "isOffline"),
      skipInputPage: Self.boolValue(from: dictionary, key: "skipInputPage")
    )
  }
  
  private static func boolValue(from dictionary: NSDictionary, key: String) -> Bool? {
    if let value = dictionary[key] as? Bool {
      return value
    }
    if let number = dictionary[key] as? NSNumber {
      return number.boolValue
    }
    return nil
  }
  
  @objc(logout)
  func logout() {
    ClearQuote.shared.logout()
  }
  
  @objc(manualOfflineSync)
  func manualOfflineSync() {
    ClearQuote.shared.initiateOfflineInspectionsSync()
  }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    true
  }
  
  @objc(getDealerCode)
  func getDealerCode() -> String? {
    performOnMainThread {
      ClearQuote.shared.getCurrentDealerCode()
    }
  }
  
  @objc(getSDKVersion)
  func getSDKVersion() -> String {
    performOnMainThread {
      ClearQuote.shared.getCurrentSDKVersion()
    }
  }
  
  /// Returns `NSNumber` so the ObjC/TurboModule interop layer can retain a real object.
  @objc(isSDKInitialized)
  func isSDKInitialized() -> NSNumber {
    performOnMainThread {
      NSNumber(value: ClearQuote.shared.isCQSDKInitialized())
    }
  }
  
  private func performOnMainThread<T>(_ work: () -> T) -> T {
    if Thread.isMainThread {
      return work()
    }
    return DispatchQueue.main.sync(execute: work)
  }
}

extension ClearQuoteModule: ClearQuoteSDKDelegate {
  func inspectionCompletionStatus(
    identifier: String,
    message: String,
    code: Int,
    isOffline: Bool,
    serverQuoteId: String?,
    serverInspectionId: String?
  ) {
    guard hasListeners else { return }
    
    sendEvent(
      withName: "inspectionCompletionStatus",
      body: [
        "identifier": identifier,
        "message": message,
        "code": code,
        "isOffline": isOffline,
        "serverQuoteId": serverQuoteId ?? NSNull(),
        "serverInspectionId": serverInspectionId ?? NSNull(),
      ]
    )
  }
}

extension UIApplication {
  func topMostViewController(
    base: UIViewController? = {
      if #available(iOS 13.0, *) {
    return UIApplication.shared
      .connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap { $0.windows }
      .first { $0.isKeyWindow }?
      .rootViewController
  } else {
    return UIApplication.shared.keyWindow?.rootViewController
  }
    }()
  ) -> UIViewController? {
    
    if let nav = base as? UINavigationController {
      return topMostViewController(base: nav.visibleViewController)
    }
    
    if let tab = base as? UITabBarController {
      return topMostViewController(base: tab.selectedViewController)
    }
    
    if let presented = base?.presentedViewController {
      return topMostViewController(base: presented)
    }
    
    return base
  }
}
