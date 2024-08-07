-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('DAILY', 'MONTHLY', 'YEARLY', 'POINTS');

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100),
    "salary" VARCHAR(100),
    "position" VARCHAR(100),
    "staffnum" VARCHAR(100),
    "isIgnorePassed" BOOLEAN DEFAULT true,
    "oid" VARCHAR(100) NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filtered_company_keywords" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filtered_company_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search" (
    "id" SERIAL NOT NULL,
    "md5" VARCHAR(32) NOT NULL,
    "position" VARCHAR(100) NOT NULL,
    "salary" VARCHAR(50) NOT NULL,
    "company" VARCHAR(100) NOT NULL,
    "scale" VARCHAR(50) NOT NULL,
    "whiteInfo" VARCHAR(50),
    "blackInfo" VARCHAR(50),
    "errDesc" VARCHAR(50),
    "isCanPost" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taskId" INTEGER NOT NULL,
    "oid" TEXT NOT NULL DEFAULT '',
    "autoThreadNo" VARCHAR(32) NOT NULL DEFAULT '',

    CONSTRAINT "search_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(50) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "dId" VARCHAR(50),
    "userName" VARCHAR(128),
    "firstName" VARCHAR(128),
    "lastName" VARCHAR(128),
    "fullName" VARCHAR(128),
    "avatar" VARCHAR(256),
    "passwordHash" VARCHAR(128),
    "additionalInfo" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "isVip" BOOLEAN NOT NULL DEFAULT false,
    "isSuperUser" BOOLEAN NOT NULL DEFAULT false,
    "roleId" INTEGER NOT NULL DEFAULT 1,
    "isDistributor" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAbnormal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cards" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "type" "CardType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "value" INTEGER NOT NULL,
    "createdBy" VARCHAR(64) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRedeemed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "redeemedAt" TIMESTAMP(3),
    "distributorId" INTEGER,

    CONSTRAINT "Cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardTypes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "type" "CardType" NOT NULL DEFAULT 'POINTS',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cValue" INTEGER NOT NULL DEFAULT 0,
    "desc" VARCHAR(100),
    "rebate" DOUBLE PRECISION DEFAULT 0,
    "onlyOneTime" BOOLEAN NOT NULL DEFAULT false,
    "isCanDistributor" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCards" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(50) NOT NULL,
    "cardCode" VARCHAR(50) NOT NULL,
    "redeemed" BOOLEAN NOT NULL DEFAULT false,
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cardsId" INTEGER,

    CONSTRAINT "UserCards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "filtered_company_keywords_taskId_keyword_key" ON "filtered_company_keywords"("taskId", "keyword");

-- CreateIndex
CREATE UNIQUE INDEX "search_taskId_md5_key" ON "search"("taskId", "md5");

-- CreateIndex
CREATE UNIQUE INDEX "Users_userId_key" ON "Users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_dId_key" ON "Users"("dId");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_userId_idx" ON "Users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Cards_code_key" ON "Cards"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserCards_cardCode_key" ON "UserCards"("cardCode");

-- AddForeignKey
ALTER TABLE "filtered_company_keywords" ADD CONSTRAINT "filtered_company_keywords_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search" ADD CONSTRAINT "search_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCards" ADD CONSTRAINT "UserCards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCards" ADD CONSTRAINT "UserCards_cardsId_fkey" FOREIGN KEY ("cardsId") REFERENCES "Cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
