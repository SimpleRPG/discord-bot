/*
  Warnings:

  - Made the column `value` on table `entity_attributes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "entity_attributes" ALTER COLUMN "value" SET NOT NULL;
