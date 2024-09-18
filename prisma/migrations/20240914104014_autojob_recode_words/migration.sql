-- CreateTable
CREATE TABLE "Words" (
    "id" SERIAL NOT NULL,
    "word" VARCHAR(100) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "type" "CardType" NOT NULL DEFAULT 'POINTS',
    "isBindUser" BOOLEAN NOT NULL DEFAULT false,
    "bindUserId" VARCHAR(64) NOT NULL,
    "bindUserEmail" VARCHAR(128),
    "maxCount" INTEGER NOT NULL DEFAULT 0,
    "endTime" TIMESTAMP(3),
    "startTime" TIMESTAMP(3),
    "createUserId" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Words_pkey" PRIMARY KEY ("id")
);
