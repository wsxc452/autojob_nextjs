-- AddForeignKey
ALTER TABLE "WordsRecord" ADD CONSTRAINT "WordsRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
