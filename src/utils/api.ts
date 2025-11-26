export async function getRates() {
  const res = await fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json");
  const data: { cc: string; rate: number }[] = await res.json();

  const usd = data.find((x) => x.cc === "USD")?.rate ?? 40;
  const eur = data.find((x) => x.cc === "EUR")?.rate ?? 42;

  return { usd, eur };
}
