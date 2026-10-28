export type AuctionName = "copart" | "iaai";
export type EngineType = "gasoline" | "electric" | "hybrid";
export type VehicleType = "passenger" | "moto" | "truck";
export type Port = "poti" | "klaipeda";
export type AgeCategory = "under3" | "3to5" | "over5";

export interface CalcInput {
  auctionPrice: number;       // USD
  ageCategory: AgeCategory;
  engineVolumeCcm: number;
  customsValueEur: number;    // EUR

  conclusionCostByn?: number; // BYN (только для under3)
  evaluationCostByn?: number; // BYN (только для under3)

  auction: AuctionName;
  locationCode: string;
  port: Port;
  
  deliveryToPortUsd: number;   // Доставка по США до порта
  oceanFreightUsd: number;     // Морская перевозка
  deliveryToMinskUsd: number;  // Доставка от порта до Минска

  vehicleType: VehicleType;
  engineType: EngineType;
  isPrivileged: boolean;
  privilegedFeeUsd?: number;

  docs: { epts: boolean; registration: boolean; deregistration: boolean; svh: boolean};

  rates: { usdToByn: number; eurToByn: number; eurToUsd: number };
}

export interface CalcLineItem {
  label: string;
  amountUsd: number;
  amountOriginal?: number;
  currency: "USD" | "BYN" | "EUR";
}

export interface CalcResult {
  totalUsd: number;
  breakdown: {
    auction: number;
    auctionFees: number;
    deliveryToPort: number;
    oceanFreight: number;
    deliveryToMinsk: number;
    duty: number;
    recyclingFee: number;
    customsFee: number;
    documents: number;
    privilegedFee: number;
    evaluation: number;
  };
  lineItems: CalcLineItem[];
  warnings: string[];
}