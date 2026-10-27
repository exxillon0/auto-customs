import { AuctionName } from "./types";

const BUYER_FEE_TIERS = [
  { max: 49.99, fee: 25 },
  { max: 99.99, fee: 45 },
  { max: 199.99, fee: 80 },
  { max: 299.99, fee: 130 },
  { max: 399.99, fee: 135 },
  { max: 499.99, fee: 185 },
  { max: 599.99, fee: 205 },
  { max: 699.99, fee: 235 },
  { max: 799.99, fee: 260 },
  { max: 899.99, fee: 285 },
  { max: 999.99, fee: 310 },
  { max: 1199.99, fee: 375 },
  { max: 1399.99, fee: 410 },
  { max: 1599.99, fee: 450 },
  { max: 1799.99, fee: 480 },
  { max: 1999.99, fee: 510 },
  { max: 2399.99, fee: 550 },
  { max: 2499.99, fee: 580 },
  { max: 2999.99, fee: 610 },
  { max: 3499.99, fee: 655 },
  { max: 3999.99, fee: 705 },
  { max: 4499.99, fee: 745 },
  { max: 4999.99, fee: 775 },
  { max: 5499.99, fee: 800 },
  { max: 5999.99, fee: 825 },
  { max: 6499.99, fee: 850 },
  { max: 6999.99, fee: 875 },
  { max: 7499.99, fee: 900 },
  { max: 7999.99, fee: 925 },
  { max: 8499.99, fee: 950 },
  { max: 8999.99, fee: 975 },
  { max: 9999.99, fee: 1000 },
  { max: 10499.99, fee: 1050 },
  { max: 10999.99, fee: 1100 },
  { max: 11499.99, fee: 1150 },
  { max: 11999.99, fee: 1200 },
  { max: 12499.99, fee: 1250 },
  { max: 12999.99, fee: 1300 },
  { max: 13499.99, fee: 1350 },
  { max: 13999.99, fee: 1400 },
  { max: 14499.99, fee: 1450 },
  { max: 14999.99, fee: 1500 },
  { max: Infinity, fee: 0 },
];

export function calcAuctionFees(auctionPrice: number, auction: AuctionName): number {
  let buyerFee = 0;
  if (auctionPrice >= 15000) {
    buyerFee = auctionPrice * 0.075;
  } else {
    const tier = BUYER_FEE_TIERS.find((t) => auctionPrice <= t.max) || BUYER_FEE_TIERS[0];
    buyerFee = tier.fee;
  }

  let fixedFees = 0;
  let internetBidFee = 0;

  if (auctionPrice > 8000) internetBidFee = 160;
  else if (auctionPrice > 4000) internetBidFee = 140;
  else if (auctionPrice > 1000) internetBidFee = 110;
  else internetBidFee = 89;

  if (auction === "copart") {
    fixedFees = 79 + 15; // Gate + Environmental
  } else {
    fixedFees = 105 + 20; // Service + Title Handling
  }

  return buyerFee + fixedFees + internetBidFee;
}