import { z } from "zod";

export const calcInputSchema = z.object({
  auctionPrice: z.number().positive(),
  ageCategory: z.enum(["under3", "3to5", "over5"]),
  engineVolumeCcm: z.number().int().positive(),
  customsValueEur: z.number().positive(),

  conclusionCostByn: z.number().nonnegative().optional(),
  evaluationCostByn: z.number().nonnegative().optional(),

  auction: z.enum(["copart", "iaai"]),
  locationCode: z.string().min(1),
  port: z.enum(["poti", "klaipeda"]),
  
  deliveryToPortUsd: z.number().nonnegative(),
  oceanFreightUsd: z.number().nonnegative(),
  deliveryToMinskUsd: z.number().nonnegative(),

  vehicleType: z.enum(["passenger", "moto", "truck"]),
  engineType: z.enum(["gasoline", "electric", "hybrid"]),
  isPrivileged: z.boolean(),
  privilegedFeeUsd: z.number().nonnegative().optional(),

  docs: z.object({
    epts: z.boolean(),
    registration: z.boolean(),
    deregistration: z.boolean(),
    svh: z.boolean(), 
  }),
  rates: z.object({
    usdToByn: z.number().positive(),
    eurToByn: z.number().positive(),
    eurToUsd: z.number().positive(),
  }),
}); 