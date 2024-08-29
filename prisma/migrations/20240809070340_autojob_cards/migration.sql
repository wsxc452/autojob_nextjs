-- AlterTable
ALTER TABLE "Cards" ADD COLUMN     "cardTypesId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_cardTypesId_fkey" FOREIGN KEY ("cardTypesId") REFERENCES "CardTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
