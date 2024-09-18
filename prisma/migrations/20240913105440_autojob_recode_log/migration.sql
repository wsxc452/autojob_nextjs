-- AddForeignKey
ALTER TABLE "UsersAccoutLog" ADD CONSTRAINT "UsersAccoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
