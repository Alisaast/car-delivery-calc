// src/utils/calc.ts

export type FuelType = "Бензин" | "Дизель";

export interface CalcResult {
  totalUSD: number;
  totalUAH: number;
  details: {
    auctionFee: number;
    deliveryUS: number;
    klaipeda: number;
    broker: number;
    evacuator: number;
    excise: number;
    duty: number;
    nds: number;
    commission: number;
    insuranceCost: number;
  };
}

export function calcAll(
  price: number,
  fuel: FuelType,
  engine: number,
  insurance: boolean,
  usdRate: number
): CalcResult {
  const auctionFee = price < 3000 ? 350 : 450;
  const deliveryUS = 350;
  const klaipeda = 1200;
  const broker = 450;
  const evacuator = 600;

  // ✔️ Исправлено: строки совпадают с UI (Бензин/Дизель)
  const excise = fuel === "Бензин" ? engine * 100 : engine * 150;

  const duty = price * 0.1;
  const nds = (price + duty + excise) * 0.2;
  const commission = 300;
  const insuranceCost = insurance ? 50 : 0;

  const totalUSD =
    price +
    auctionFee +
    deliveryUS +
    klaipeda +
    broker +
    evacuator +
    excise +
    duty +
    nds +
    commission +
    insuranceCost;

  const totalUAH = totalUSD * usdRate;

  return {
    totalUSD,
    totalUAH,
    details: {
      auctionFee,
      deliveryUS,
      klaipeda,
      broker,
      evacuator,
      excise,
      duty,
      nds,
      commission,
      insuranceCost,
    },
  };
}
