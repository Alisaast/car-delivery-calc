import { useState } from "react";

export default function App() {
  // ---------- TYPES ----------
  type AuctionType = "Copart" | "IAAI";
  type FuelType = "Бензин" | "Дизель" | "Гібрид" | "Електро";
  type PortType = "Клайпеда" | "Одеса";

  // ---------- STATE ----------
  const [auction, setAuction] = useState<AuctionType>("Copart");
  const [price, setPrice] = useState<number | "">("");
  const [fuel, setFuel] = useState<FuelType>("Бензин");
  const [engine, setEngine] = useState<number | "">("");
  const [year, setYear] = useState<number | "">("");
  const [port, setPort] = useState<PortType>("Клайпеда");
  const [insurance, setInsurance] = useState<boolean>(true);

  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState("");

  // ---------- CALCULATIONS ----------

  // Аукціонний збір
  const calcAuctionFee = () => {
    if (price === "") return 0;

    if (auction === "Copart") return price * 0.12 + 59;
    if (auction === "IAAI") return price * 0.1 + 49;

    return 0;
  };

  // Доставка морем
  const calcOceanDelivery = () => {
    return port === "Клайпеда" ? 1550 : 1800;
  };

  // Страхування — фіксовано 100$
  const calcInsurance = () => {
    return insurance ? 100 : 0;
  };

  // Митні платежі
  const calcCustoms = () => {
    if (price === "" || engine === "" || year === "") return 0;

    const duty = price * 0.1; // 10%
    const vat = (price + duty) * 0.2; // 20%

    const age = 2026 - year > 0 ? 2026 - year : 1;

    let exciseRate = 0;

    switch (fuel) {
      case "Бензин":
        exciseRate = 50;
        break;
      case "Дизель":
        exciseRate = 75;
        break;
      case "Гібрид":
        exciseRate = 25;
        break;
      case "Електро":
        exciseRate = 0;
        break;
    }

    const excise = exciseRate * Number(engine) * age;

    return duty + vat + excise;
  };

  const total =
    (price || 0) +
    calcAuctionFee() +
    calcOceanDelivery() +
    calcInsurance() +
    calcCustoms() +
    650 + // брокер
    700 + // автовоз
    400 + // доставка по Україні
    300; // DailyCars

  // ---------- VALIDATION ----------
  const handleCalculate = () => {
    if (price === "" || engine === "" || year === "") {
      setError("Заповніть усі поля");
      setShowResult(false);
      return;
    }

    setError("");
    setShowResult(true);
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-[#171a24] text-white p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-10 tracking-wide">
          КАЛЬКУЛЯТОР ДОСТАВКИ АВТО З США
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT BLOCK */}
          <div className="space-y-6">

            {/* LOT */}
            <div className="bg-[#1f2330] p-6 rounded-xl shadow-xl border border-[#2a2f3f]">
              <h2 className="text-xl font-semibold mb-4">Розрахунок лоту</h2>

              <label className="block mb-2">Аукціон</label>
              <select
                className="w-full p-3 rounded bg-[#2a2f3f]"
                value={auction}
                onChange={(e) => setAuction(e.target.value as AuctionType)}
              >
                <option>Copart</option>
                <option>IAAI</option>
              </select>

              <label className="block mt-4 mb-2">Ціна лоту (USD)</label>
              <input
                className="w-full p-3 rounded bg-[#2a2f3f]"
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>

            {/* CAR PARAMS */}
            <div className="bg-[#1f2330] p-6 rounded-xl shadow-xl border border-[#2a2f3f]">
              <h2 className="text-xl font-semibold mb-4">Параметри авто</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Тип палива</label>
                  <select
                    className="w-full p-3 rounded bg-[#2a2f3f]"
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value as FuelType)}
                  >
                    <option>Бензин</option>
                    <option>Дизель</option>
                    <option>Гібрид</option>
                    <option>Електро</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Обʼєм двигуна (л)</label>
                  <input
                    className="w-full p-3 rounded bg-[#2a2f3f]"
                    type="number"
                    value={engine}
                    onChange={(e) =>
                      setEngine(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <label className="block mt-4 mb-2">Рік випуску</label>
              <input
                className="w-full p-3 rounded bg-[#2a2f3f]"
                type="number"
                value={year}
                onChange={(e) =>
                  setYear(e.target.value === "" ? "" : Number(e.target.value))
                }
              />

              <div className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  checked={insurance}
                  onChange={(e) => setInsurance(e.target.checked)}
                />
                <span>Страхування (100$)</span>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-900/40 text-red-300 rounded">
                  {error}
                </div>
              )}

              <button
                onClick={handleCalculate}
                className="mt-5 w-full bg-blue-500 hover:bg-blue-600 transition p-3 rounded-lg font-semibold text-lg"
              >
                Розрахувати ціну
              </button>
            </div>
          </div>

          {/* RIGHT BLOCK — ONLY WHEN READY */}
          {showResult && (
            <div
              className="bg-[#1f2330] p-6 rounded-xl shadow-xl border border-[#2a2f3f] animate-fade-in"
            >
              <h2 className="text-xl font-semibold mb-6">Результат розрахунку</h2>

              <div className="space-y-3 text-lg">

                <div className="flex justify-between">
                  <span>Ціна на аукціоні</span>
                  <span>{price}$</span>
                </div>

                <div className="flex justify-between">
                  <span>Аукціонний збір</span>
                  <span>{calcAuctionFee().toFixed(2)}$</span>
                </div>

                <div className="flex justify-between">
                  <span>Доставка до порту</span>
                  <span>{calcOceanDelivery().toFixed(2)}$</span>
                </div>

                <div className="flex justify-between">
                  <span>Страхування</span>
                  <span>{calcInsurance().toFixed(2)}$</span>
                </div>

                <div className="flex justify-between">
                  <span>Митні платежі</span>
                  <span>{calcCustoms().toFixed(2)}$</span>
                </div>

                <div className="flex justify-between">
                  <span>Брокер + експедитор</span>
                  <span>650$</span>
                </div>

                <div className="flex justify-between">
                  <span>Автовоз до Львова</span>
                  <span>700$</span>
                </div>

                <div className="flex justify-between">
                  <span>Доставка по Україні</span>
                  <span>400$</span>
                </div>

                <div className="flex justify-between">
                  <span>Послуги DailyCars</span>
                  <span>300$</span>
                </div>

                <div className="flex justify-between text-xl font-bold mt-4">
                  <span className="text-orange-400">Ціна без ремонту</span>
                  <span className="text-orange-400">{total.toFixed(2)}$</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
