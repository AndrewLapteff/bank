/*
  Warnings:

  - A unique constraint covering the columns `[cardNumber]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `commission` on table `Transactions` required. This step will fail if there are existing NULL values in that column.

*/

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "cardNumber" BIGINT NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Users_cardNumber_key" ON "Users"("cardNumber");
