import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
    const locations = [
    // Copart
    { auction: "copart", code: "CA-LA", name: "ACE - Carson, CA", country: "USA" },
    { auction: "copart", code: "CA-SD", name: "San Diego, CA", country: "USA" },
    { auction: "copart", code: "OR-PO", name: "Portland - Gorham, ME", country: "USA" },
    { auction: "copart", code: "OR-PN", name: "Portland North, OR", country: "USA" },
    { auction: "copart", code: "OR-PS", name: "Portland South, OR", country: "USA" },
    { auction: "copart", code: "WA-TA", name: "Tacoma, WA", country: "USA" },
    { auction: "copart", code: "TX-DA", name: "Dallas, TX", country: "USA" },
    { auction: "copart", code: "NY-NY", name: "New York, NY", country: "USA" },
    { auction: "copart", code: "FL-MI", name: "Miami Central, FL", country: "USA" },
    { auction: "copart", code: "GA-AT", name: "Atlanta, GA", country: "USA" },
    // IAAI
    { auction: "iaai", code: "IAI-NJ", name: "Northern NJ", country: "USA" },
    { auction: "iaai", code: "IAI-CA", name: "Los Angeles South, CA", country: "USA" },
    { auction: "iaai", code: "IAI-GA", name: "Atlanta East, GA", country: "USA" },
    { auction: "iaai", code: "IAI-TX", name: "Houston, TX", country: "USA" },
    { auction: "iaai", code: "IAI-FL", name: "Orlando, FL", country: "USA" },
    { auction: "iaai", code: "IAI-IL", name: "Chicago, IL", country: "USA" },
  ];

  for (const loc of locations) {
    await prisma.auctionLocation.upsert({
      where: { auction_code: { auction: loc.auction, code: loc.code } },
      update: {},
      create: loc,
    })
  }
  console.log('✅ Seed completed')
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect())