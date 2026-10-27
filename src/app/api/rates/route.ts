import { NextResponse } from "next/server";

export const revalidate = 3600; // кэш на 1 час

async function fetchRate(code: "USD" | "EUR") {
  const res = await fetch(`https://api.nbrb.by/exrates/rates/${code}?parammode=2`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`NBRB ${code} error: ${res.status}`);
  const data = await res.json();
  return { rate: data.Cur_OfficialRate as number, scale: data.Cur_Scale as number };
}

export async function GET() {
  try {
    const [usd, eur] = await Promise.all([fetchRate("USD"), fetchRate("EUR")]);
    const usdToByn = usd.rate / usd.scale;
    const eurToByn = eur.rate / eur.scale;
    const eurToUsd = eurToByn / usdToByn;

    return NextResponse.json({
      usdToByn: Number(usdToByn.toFixed(4)),
      eurToByn: Number(eurToByn.toFixed(4)),
      eurToUsd: Number(eurToUsd.toFixed(4)),
      source: "NBRB",
      fetchedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Не удалось получить курсы НБРБ" }, { status: 502 });
  }
}