-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('DAILY', 'MONTHLY', 'YEARLY', 'POINTS');

-- CreateEnum
CREATE TYPE "GreetingsType" AS ENUM ('ACTICE', 'DEACTIVE');

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100),
    "salary" VARCHAR(100),
    "searchText" VARCHAR(100) DEFAULT '',
    "staffnum" VARCHAR(100),
    "isIgnorePassed" BOOLEAN DEFAULT true,
    "oid" VARCHAR(100) DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" VARCHAR(64) NOT NULL,
    "cityCode" VARCHAR(20) NOT NULL DEFAULT '',
    "cityName" VARCHAR(20) NOT NULL DEFAULT '',
    "maxCount" INTEGER DEFAULT 100,
    "bossOnlineCheck" BOOLEAN NOT NULL DEFAULT false,
    "activeCheck" BOOLEAN NOT NULL DEFAULT false,
    "headhunterCheck" BOOLEAN NOT NULL DEFAULT false,
    "experienceValue" VARCHAR(100) DEFAULT '0',
    "degreeValue" VARCHAR(100) DEFAULT '0',
    "salaryValue" VARCHAR(80) DEFAULT '0',
    "scaleValue" VARCHAR(100) DEFAULT '0',

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "filtered_company_keywords" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" VARCHAR(64) NOT NULL,

    CONSTRAINT "filtered_company_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filtered_position_keywords" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" VARCHAR(64) NOT NULL,

    CONSTRAINT "filtered_position_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search" (
    "id" SERIAL NOT NULL,
    "md5" VARCHAR(32) NOT NULL,
    "position" VARCHAR(100) NOT NULL,
    "salary" VARCHAR(50) NOT NULL,
    "company" VARCHAR(100) NOT NULL,
    "scale" VARCHAR(50) NOT NULL,
    "descText" TEXT,
    "whiteInfo" VARCHAR(200),
    "blackInfo" VARCHAR(200),
    "errDesc" VARCHAR(200),
    "isCanPost" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "costPoint" INTEGER DEFAULT 1,
    "taskId" INTEGER NOT NULL,
    "userId" VARCHAR(50) NOT NULL,
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
    "onlyOneTime" BOOLEAN NOT NULL DEFAULT false,
    "redeemedBy" VARCHAR(64),
    "cardTypesId" INTEGER NOT NULL DEFAULT 1,

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
CREATE TABLE "Greetings" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(200) NOT NULL,
    "status" "GreetingsType" NOT NULL,
    "userId" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "greetingGroupId" INTEGER NOT NULL,

    CONSTRAINT "Greetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GreetingGroup" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GreetingGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "firstChar" VARCHAR(10) DEFAULT '',
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "cityCode" VARCHAR(20) NOT NULL,
    "regionCode" VARCHAR(20) NOT NULL,
    "from" VARCHAR(20) NOT NULL,
    "pinyin" VARCHAR(100) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "filtered_pass_conpanys_taskId_keyword_key" ON "filtered_pass_conpanys"("taskId", "keyword");

-- CreateIndex
CREATE UNIQUE INDEX "filtered_company_keywords_taskId_keyword_key" ON "filtered_company_keywords"("taskId", "keyword");

-- CreateIndex
CREATE UNIQUE INDEX "filtered_position_keywords_taskId_keyword_key" ON "filtered_position_keywords"("taskId", "keyword");

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
CREATE UNIQUE INDEX "City_code_from_key" ON "City"("code", "from");

-- AddForeignKey
ALTER TABLE "filtered_pass_conpanys" ADD CONSTRAINT "filtered_pass_conpanys_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filtered_company_keywords" ADD CONSTRAINT "filtered_company_keywords_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filtered_position_keywords" ADD CONSTRAINT "filtered_position_keywords_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search" ADD CONSTRAINT "search_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_cardTypesId_fkey" FOREIGN KEY ("cardTypesId") REFERENCES "CardTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Greetings" ADD CONSTRAINT "Greetings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Greetings" ADD CONSTRAINT "Greetings_greetingGroupId_fkey" FOREIGN KEY ("greetingGroupId") REFERENCES "GreetingGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
