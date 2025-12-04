import { calcAll } from "../src/utils/calc";

describe("calcAll function", () => {
  test("Коректно рахує підсумок для бензинового авто", () => {
    const result = calcAll(
      3000,      // price
      "Бензин",  // fuel
      2.0,       // engine
      true,      // insurance
      40         // usdRate
    );

    // Перевірка окремих значень
    expect(result.details.auctionFee).toBe(450);
    expect(result.details.deliveryUS).toBe(350);
    expect(result.details.klaipeda).toBe(1200);
    expect(result.details.insuranceCost).toBe(50);

    // Формула акцизу для бензину: engine * 100
    expect(result.details.excise).toBe(200);

    // Мито: 10% від ціни
    expect(result.details.duty).toBeCloseTo(300);

    // ПДВ: (price + duty + excise) * 0.2
    expect(result.details.nds).toBeCloseTo((3000 + 300 + 200) * 0.2);

    // Перевірка тоталу
    const expectedTotalUSD =
      3000 + 450 + 350 + 1200 + 450 + 600 + 200 + 300 + (3000 + 300 + 200) * 0.2 + 300 + 50;

    expect(result.totalUSD).toBeCloseTo(expectedTotalUSD);
    expect(result.totalUAH).toBeCloseTo(expectedTotalUSD * 40);
  });

  test("Коректно рахує підсумок для дизельного авто без страховки", () => {
    const result = calcAll(
      2500,
      "Дизель",
      3.0,
      false,
      40
    );

    // Комісія аукціону (<3000)
    expect(result.details.auctionFee).toBe(350);

    // Акциз для дизеля: engine * 150
    expect(result.details.excise).toBe(450);

    // Страхування → немає
    expect(result.details.insuranceCost).toBe(0);

    // Мито: 10% від 2500
    expect(result.details.duty).toBeCloseTo(250);

    // Загальна перевірка
    const expectedNds = (2500 + 250 + 450) * 0.2;

    const expectedTotalUSD =
      2500 +
      350 + // auction
      350 + // deliveryUS
      1200 +
      450 +
      600 +
      450 + // excise
      250 + // duty
      expectedNds +
      300 + // commission
      0;

    expect(result.totalUSD).toBeCloseTo(expectedTotalUSD);
  });
});
