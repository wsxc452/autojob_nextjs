-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "firstChar" VARCHAR(10) DEFAULT '',
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "cityCode" VARCHAR(20) NOT NULL,
    "regionCode" VARCHAR(20) NOT NULL,
    "from" VARCHAR(20) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_code_from_key" ON "City"("code", "from");
