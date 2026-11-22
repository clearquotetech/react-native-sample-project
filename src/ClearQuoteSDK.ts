import { NativeEventEmitter, NativeModules } from 'react-native';
import type { EmitterSubscription } from 'react-native';
import type {
  ClientAttrs,
  InputDetails,
  InspectionCompletionStatus,
  UserFlowParams,
} from './types/clear_quote_type';

const { ClearQuoteModule } = NativeModules;

export class ClearQuoteSDK {
  private constructor() {}

  private static getEventEmitter(): NativeEventEmitter {
    if (ClearQuoteModule == null) {
      throw new Error('ClearQuoteModule is not available');
    }
    return new NativeEventEmitter(ClearQuoteModule);
  }

  /** Initialize ClearQuote SDK */
  static initSDK(key: string): Promise<any> {
    return ClearQuoteModule.initSDK(key);
  }

  /** Start inspection flow */
  static startInspection(
    clientAttrs?: ClientAttrs,
    inputDetails?: InputDetails,
    userFlowParams?: UserFlowParams,
  ): Promise<any> {
    return ClearQuoteModule.startInspection(
      clientAttrs ?? null,
      inputDetails ?? null,
      userFlowParams ?? null,
    );
  }

  /** Manual offline sync */
  static manualOfflineSync(): void {
    ClearQuoteModule.manualOfflineSync();
  }

  /** Logout SDK */
  static logout(): void {
    ClearQuoteModule.logout();
  }

  /** Get dealer code */
  static getDealerCode(): string | null {
    return ClearQuoteModule.getDealerCode();
  }

  /** Get SDK version */
  static getSDKVersion(): string {
    return ClearQuoteModule.getSDKVersion();
  }

  /** Swift toolchain version stamped into the app at build time. */
  static getSDKSwiftToolchainVersion(): string {
    return ClearQuoteModule.getSDKSwiftToolchainVersion();
  }

  /** Check if SDK is initialized */
  static isSDKInitialized(): boolean {
    return ClearQuoteModule.isSDKInitialized();
  }

  /** Listen for inspection completion updates from the native SDK. */
  static addInspectionCompletionListener(
    listener: (status: InspectionCompletionStatus) => void,
  ): EmitterSubscription {
    return ClearQuoteSDK.getEventEmitter().addListener(
      'inspectionCompletionStatus',
      listener,
    );
  }
}
