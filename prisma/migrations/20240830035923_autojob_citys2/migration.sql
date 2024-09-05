-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_greetingGroupId_fkey" FOREIGN KEY ("greetingGroupId") REFERENCES "GreetingGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
