-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "degreeValue" VARCHAR(100) DEFAULT '0',
ADD COLUMN     "experienceValue" VARCHAR(100) DEFAULT '0',
ADD COLUMN     "salaryValue" VARCHAR(80) DEFAULT '0',
ADD COLUMN     "scaleValue" VARCHAR(100) DEFAULT '0';
