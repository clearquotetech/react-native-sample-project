export type ClientAttrs = {
    userName?: string;
    dealer?: string;
    dealerIdentifier?: string;
    client_unique_id?: string;
    organisationId?: string;
  };
  
  export type CustomerDetails = {
    name?: string;
    email?: string;
    dialCode?: string;
    phoneNumber?: string;
  };
  
  export type VehicleDetails = {
    regNumber?: string;
    make?: string;
    model?: string;
    bodyStyle?: string;
    fuelType?: string;
    variant?: string;
    vin?: string;
  };
  
  export type QuoteData = {
    inspectionType?: string;
    fleetImageType?: string;
  };
  
  export type InputDetails = {
    customerDetails?: CustomerDetails;
    vehicleDetails?: VehicleDetails;
    quoteData?: QuoteData;
  };
  
  export type UserFlowParams = {
    isOffline?: boolean;
    skipInputPage?: boolean;
  };
  
  export type InspectionCompletionStatus = {
    identifier: string;
    message: string;
    code: number;
    isOffline: boolean;
    serverQuoteId: string | null;
    serverInspectionId: string | null;
  };