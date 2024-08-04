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
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(50) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "isVip" BOOLEAN NOT NULL DEFAULT false,
    "isSuperUser" BOOLEAN NOT NULL DEFAULT false,
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "isDistributor" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "additionalInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "filtered_company_keywords_taskId_keyword_key" ON "filtered_company_keywords"("taskId", "keyword");

-- CreateIndex
CREATE UNIQUE INDEX "search_taskId_md5_key" ON "search"("taskId", "md5");

-- AddForeignKey
ALTER TABLE "filtered_company_keywords" ADD CONSTRAINT "filtered_company_keywords_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search" ADD CONSTRAINT "search_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
