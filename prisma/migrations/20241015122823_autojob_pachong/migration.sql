-- CreateTable
CREATE TABLE "PTask" (
    "id" SERIAL NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "desc" VARCHAR(50),
    "userId" VARCHAR(64) NOT NULL,
    "autoThreadNo" VARCHAR(32) NOT NULL DEFAULT '',

    CONSTRAINT "PTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaChongData" (
    "id" SERIAL NOT NULL,
    "data" TEXT NOT NULL,
    "ptaskId" INTEGER NOT NULL,
    "pageUrl" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" VARCHAR(50),
    "userId" VARCHAR(64) NOT NULL,

    CONSTRAINT "PaChongData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaChongData" ADD CONSTRAINT "PaChongData_ptaskId_fkey" FOREIGN KEY ("ptaskId") REFERENCES "PTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
