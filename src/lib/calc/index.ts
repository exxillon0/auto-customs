import { CalcInput, CalcResult, CalcLineItem } from "./types";
import { calcCustomsDuty } from "./customs-duty";
import { calcRecyclingFee } from "./recycling-fee";
import { calcAuctionFees } from "./auction-fees";
import { toUsd } from "./currency";
import { DOC_PRICES_BYN, CUSTOMS_FEE_BYN, FIXED_BUTTON_FEE_USD } from "./constants"; // <-- Импортируем

export function calculateTotal(input: CalcInput): CalcResult {
  const warnings: string[] = [];

  const auctionFeesUsd = calcAuctionFees(input.auctionPrice, input.auction);
  const dutyEur = calcCustomsDuty(input, warnings);
  const dutyUsd = toUsd(dutyEur, "EUR", input.rates);

  const recyclingByn = calcRecyclingFee(input);
  const recyclingUsd = toUsd(recyclingByn, "BYN", input.rates);
  const customsFeeUsd = toUsd(CUSTOMS_FEE_BYN, "BYN", input.rates);

  const documentsByn = (Object.keys(input.docs) as (keyof typeof input.docs)[])
    .filter((k) => input.docs[k])
    .reduce((sum, k) => sum + DOC_PRICES_BYN[k], 0);
  const documentsUsd = toUsd(documentsByn, "BYN", input.rates);

  const privilegedUsd = input.isPrivileged ? (input.privilegedFeeUsd ?? 500) : 0;

  const evaluationByn = input.ageCategory === "under3" 
    ? (input.conclusionCostByn || 0) + (input.evaluationCostByn || 0) 
    : 0;
  const evaluationUsd = toUsd(evaluationByn, "BYN", input.rates);

  const breakdown = {
    auction: input.auctionPrice,
    auctionFees: auctionFeesUsd,
    deliveryToPort: input.deliveryToPortUsd,
    oceanFreight: input.oceanFreightUsd,
    deliveryToMinsk: input.deliveryToMinskUsd,
    duty: dutyUsd,
    recyclingFee: recyclingUsd,
    customsFee: customsFeeUsd,
    documents: documentsUsd,
    privilegedFee: privilegedUsd,
    evaluation: evaluationUsd,
    buttonFee: FIXED_BUTTON_FEE_USD, // <-- Добавлено в разбивку
  };

  const totalUsd = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const lineItems: CalcLineItem[] = [
    { label: "Ставка аукциона", amountUsd: input.auctionPrice, currency: "USD" },
    { label: "Сборы аукциона", amountUsd: auctionFeesUsd, currency: "USD" },
    { label: "Доставка по США", amountUsd: input.deliveryToPortUsd, currency: "USD" },
    { label: "Морской фрахт", amountUsd: input.oceanFreightUsd, currency: "USD" },
    { label: "Доставка до Минска", amountUsd: input.deliveryToMinskUsd, currency: "USD" },
    { label: "Пошлина", amountUsd: dutyUsd, amountOriginal: dutyEur, currency: "EUR" },
    { label: "Утильсбор", amountUsd: recyclingUsd, amountOriginal: recyclingByn, currency: "BYN" },
    { label: "Таможенный сбор", amountUsd: customsFeeUsd, amountOriginal: CUSTOMS_FEE_BYN, currency: "BYN" },
    { label: "Документы", amountUsd: documentsUsd, amountOriginal: documentsByn, currency: "BYN" },
    { label: "Услуга «Кнопка»", amountUsd: FIXED_BUTTON_FEE_USD, currency: "USD" }, // <-- Добавлено в список
  ];

  if (evaluationUsd > 0) {
    lineItems.push({ label: "Оценка авто", amountUsd: evaluationUsd, amountOriginal: evaluationByn, currency: "BYN" });
  }

  if (privilegedUsd > 0) {
    lineItems.push({ label: "Вознаграждение льготника", amountUsd: privilegedUsd, currency: "USD" });
  }

  return { totalUsd, breakdown, lineItems, warnings };
}