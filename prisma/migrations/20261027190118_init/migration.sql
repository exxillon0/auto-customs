-- CreateTable
CREATE TABLE "Calculation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "input" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "auction" TEXT NOT NULL,
    "auctionPrice" REAL NOT NULL,
    "totalUsd" REAL NOT NULL,
    "clientName" TEXT,
    "note" TEXT
);

-- CreateTable
CREATE TABLE "CurrencyRate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usdToByn" REAL NOT NULL,
    "eurToByn" REAL NOT NULL,
    "eurToUsd" REAL NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'NBRB'
);

-- CreateTable
CREATE TABLE "AuctionLocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auction" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE INDEX "Calculation_createdAt_idx" ON "Calculation"("createdAt");

-- CreateIndex
CREATE INDEX "CurrencyRate_date_idx" ON "CurrencyRate"("date");

-- CreateIndex
CREATE UNIQUE INDEX "AuctionLocation_auction_code_key" ON "AuctionLocation"("auction", "code");
