import { getRates } from "../src/utils/api";

describe("getRates API function", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("корректно извлекает курс USD и EUR", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => [
        { cc: "USD", rate: 39.5 },
        { cc: "EUR", rate: 42.2 },
      ],
    });

    const result = await getRates();

    expect(result.usd).toBe(39.5);
    expect(result.eur).toBe(42.2);
  });
});
