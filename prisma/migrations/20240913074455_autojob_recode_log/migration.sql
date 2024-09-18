-- CreateTable
CREATE TABLE "UsersAccoutLog" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(64) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "money" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "byUserId" VARCHAR(64),
    "byResaon" VARCHAR(200),

    CONSTRAINT "UsersAccoutLog_pkey" PRIMARY KEY ("id")
);
