import { CalcInput } from "./types";
import { RECYCLING_FEE_BYN } from "./constants";

export function calcRecyclingFee(input: CalcInput): number {
  return input.ageCategory === "under3" ? RECYCLING_FEE_BYN.under3 : RECYCLING_FEE_BYN.over3;
}