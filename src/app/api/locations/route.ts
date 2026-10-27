import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const auction = searchParams.get("auction");

  if (!auction) {
    return NextResponse.json({ error: "auction parameter is required" }, { status: 400 });
  }

  const locations = await db.auctionLocation.findMany({
    where: { auction, active: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(locations);
}