-- AlterTable
ALTER TABLE "Greetings" ADD COLUMN     "usersId" INTEGER;

-- AddForeignKey
ALTER TABLE "Greetings" ADD CONSTRAINT "Greetings_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
