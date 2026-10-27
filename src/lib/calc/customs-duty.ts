import { CalcInput } from "./types";
import { DUTY_RATES_UNDER3, DUTY_RATES_3_TO_5, DUTY_RATES_OVER5 } from "./constants";

export function calcCustomsDuty(input: CalcInput, warnings: string[]): number {
  const { ageCategory, engineVolumeCcm, engineType, isPrivileged, customsValueEur } = input;
  let duty = 0;

  if (engineType === "electric") {
    duty = customsValueEur * 0.15;
    if (ageCategory === "over5") {
      const vat = (customsValueEur + duty) * 0.20;
      duty += vat;
      warnings.push("Для электромобиля старше 5 лет добавлен НДС 20%.");
    }
  } else if (ageCategory === "under3") {
    const rate = DUTY_RATES_UNDER3.find((r) => customsValueEur <= r.maxCost) || DUTY_RATES_UNDER3[DUTY_RATES_UNDER3.length - 1];
    const byPercent = (customsValueEur * rate.percent) / 100;
    const byCcm = engineVolumeCcm * rate.minEurPerCcm;
    duty = Math.max(byPercent, byCcm);
  } else if (ageCategory === "3to5") {
    const rate = DUTY_RATES_3_TO_5.find((r) => engineVolumeCcm <= r.maxCcm) || DUTY_RATES_3_TO_5[DUTY_RATES_3_TO_5.length - 1];
    duty = engineVolumeCcm * rate.eurPerCcm;
  } else {
    const rate = DUTY_RATES_OVER5.find((r) => engineVolumeCcm <= r.maxCcm) || DUTY_RATES_OVER5[DUTY_RATES_OVER5.length - 1];
    duty = engineVolumeCcm * rate.eurPerCcm;
  }

  if (isPrivileged) {
    if (engineType === "hybrid") {
      warnings.push("Льготная растаможка не применяется для гибридов.");
    } else {
      duty = duty * 0.5;
    }
  }

  return duty;
}