-- CreateTable
CREATE TABLE "filtered_pass_conpanys" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" VARCHAR(64) NOT NULL,

    CONSTRAINT "filtered_pass_conpanys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "filtered_pass_conpanys_taskId_keyword_key" ON "filtered_pass_conpanys"("taskId", "keyword");

-- AddForeignKey
ALTER TABLE "filtered_pass_conpanys" ADD CONSTRAINT "filtered_pass_conpanys_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
