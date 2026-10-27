import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calcInputSchema } from "@/lib/validation/calculation.schema";
import { calculateTotal } from "@/lib/calc";

export async function GET() {
  const items = await db.calculation.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const parsed = calcInputSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const result = calculateTotal(parsed.data);
  const saved = await db.calculation.create({
    data: {
      input: parsed.data,
      result,
      auction: parsed.data.auction,
      auctionPrice: parsed.data.auctionPrice,
      totalUsd: result.totalUsd,
    },
  });
  return NextResponse.json(saved, { status: 201 });
}